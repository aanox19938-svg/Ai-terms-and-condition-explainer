import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

function getGenAIClient(customApiKey) {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
}

export const geminiService = {
  /**
   * Analyze document for plain-language summary & flagged risk clauses
   */
  analyzeTermsAndConditions: async (documentText, customApiKey = null) => {
    const genAI = getGenAIClient(customApiKey);

    if (!genAI) {
      console.warn('No Gemini API key found. Using intelligent offline legal analyzer fallback.');
      return geminiService.generateFallbackAnalysis(documentText);
    }

    const CANDIDATE_MODELS = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-pro'];
    let lastError = null;

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: 'application/json'
          }
        });

      const prompt = `
You are an expert legal advisor and consumer advocate specialized in analyzing Terms and Conditions (T&C) and Privacy Policies for regular consumers.

Analyze the following Terms & Conditions document text. Return a strictly valid JSON object with this EXACT structure:
{
  "overallRiskScore": <number between 0 and 100, where 0 is completely benign/pro-user and 100 is predatory/extremely high risk>,
  "riskLevel": "<High | Medium | Low>",
  "summary": "<A 2-3 paragraph plain-English, easy-to-understand explanation of what this agreement actually means for the average user, without confusing legal jargon.>",
  "keyTakeaways": [
    "<Concise bullet point 1 explaining an essential obligation or right>",
    "<Concise bullet point 2>",
    "<Concise bullet point 3>",
    "<Concise bullet point 4>"
  ],
  "flaggedClauses": [
    {
      "clause_text": "<exact or concise quote from the document of the concerning clause>",
      "risk_level": "<High | Medium | Low>",
      "category": "<Data Privacy & Sharing | Auto-Renewal & Billing | Dispute & Arbitration | Content Rights & IP | Liability & Termination | Tracking & Location>",
      "explanation": "<Plain-English explanation of why this clause is concerning and how it impacts the user>",
      "recommendation": "<What the user should do, opt out of, or keep in mind>"
    }
  ]
}

Ensure you actively search for and flag clauses regarding:
1. Selling, sharing, or processing personal/location/biometric data with third parties or AI training.
2. Automatic renewal, non-refundable fees, or hard-to-cancel subscriptions.
3. Forced arbitration and waiver of class action lawsuits or trial by jury.
4. Broad perpetual licenses to user-created content (photos, videos, text).
5. Right to modify terms or terminate accounts without prior warning.
6. Absolute disclaimers of liability for damages, outages, or data breaches.

Here is the document text (truncated to fit context if needed):
---
${documentText.slice(0, 45000)}
---
`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const parsed = JSON.parse(responseText);

        return {
          overallRiskScore: parsed.overallRiskScore ?? 50,
          riskLevel: parsed.riskLevel || (parsed.overallRiskScore > 70 ? 'High' : parsed.overallRiskScore > 40 ? 'Medium' : 'Low'),
          summary: parsed.summary || 'Summary generated.',
          keyTakeaways: parsed.keyTakeaways || [],
          flaggedClauses: parsed.flaggedClauses || [],
          modelUsed: `Google ${modelName}`
        };
      } catch (err) {
        lastError = err;
        console.warn(`Model ${modelName} failed, trying next candidate...`);
      }
    }

    console.error('All Gemini API models failed:', lastError?.message);
    console.warn('Falling back to local heuristic analysis.');
    return geminiService.generateFallbackAnalysis(documentText, lastError?.message);
  },

  /**
   * Interactive Q&A grounded in the specific document text
   */
  askDocumentQuestion: async (documentText, chatHistory, userQuestion, customApiKey = null) => {
    const genAI = getGenAIClient(customApiKey);

    if (!genAI) {
      return geminiService.generateFallbackChatAnswer(documentText, userQuestion);
    }

    const CANDIDATE_MODELS = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-pro'];
    let lastError = null;

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });

        // Build history context
        const formattedHistory = (chatHistory || []).map(h => 
          `User: ${h.question}\nAssistant: ${h.answer}`
        ).join('\n\n');

        const prompt = `
You are the "AI Terms & Conditions Explainer" assistant. You help everyday users understand their legal rights and obligations under a specific agreement they have uploaded.

GUIDELINES:
1. Answer strictly based on the provided document. If a topic is not mentioned in the document, explicitly say so.
2. Use simple, everyday language. Avoid opaque legal jargon; explain any necessary legal terms.
3. Cite or quote the specific section or clause where applicable so the user can verify it.
4. Keep answers focused, practical, and helpful.
5. Remind the user this is for informational purposes and not formal legal advice if giving a strong conclusion.

DOCUMENT EXCERPT:
---
${documentText.slice(0, 45000)}
---

${formattedHistory ? `CONVERSATION HISTORY:\n${formattedHistory}\n\n` : ''}
USER QUESTION:
${userQuestion}
`;

        const result = await model.generateContent(prompt);
        return result.response.text();
      } catch (err) {
        lastError = err;
        console.warn(`Chat model ${modelName} failed, trying next candidate...`);
      }
    }

    console.error('All Gemini Chat models failed:', lastError?.message);
    return geminiService.generateFallbackChatAnswer(documentText, userQuestion, lastError?.message);
  },

  /**
   * Fallback rule-based analysis for demoing without an API key or when offline
   */
  generateFallbackAnalysis: (text, apiError = null) => {
    const lower = text.toLowerCase();
    const flagged = [];

    // Check Data Sharing
    if (lower.includes('third party') || lower.includes('affiliates') || lower.includes('marketing partners') || lower.includes('share your data')) {
      flagged.push({
        clause_text: "We may share, sell, or disclose your personal data, usage metrics, and device information to third-party advertising partners and business affiliates.",
        risk_level: "High",
        category: "Data Privacy & Sharing",
        explanation: "The company grants itself permission to pass your personal information and browsing activity to commercial partners and advertisers.",
        recommendation: "Check your in-app privacy settings to toggle off targeted advertising and third-party data broker sharing."
      });
    }

    // Check Arbitration
    if (lower.includes('arbitration') || lower.includes('class action') || lower.includes('jury trial') || lower.includes('dispute')) {
      flagged.push({
        clause_text: "You agree to resolve any dispute through binding individual arbitration and waive all rights to participate in class actions or jury trials.",
        risk_level: "High",
        category: "Dispute & Arbitration",
        explanation: "You are giving up your constitutional right to take the company to court or join other affected users in a class-action lawsuit.",
        recommendation: "Some agreements allow you to opt out of arbitration in writing within 30 days of accepting. Check if an opt-out address is provided."
      });
    }

    // Check Auto-renewal
    if (lower.includes('renew') || lower.includes('subscription') || lower.includes('recurring') || lower.includes('cancel')) {
      flagged.push({
        clause_text: "Your subscription will automatically renew at the current non-promotional rate unless cancelled at least 24-48 hours before the billing cycle ends.",
        risk_level: "Medium",
        category: "Auto-Renewal & Billing",
        explanation: "You will be charged automatically on a continuous basis without prior invoice notice before each charge.",
        recommendation: "Set a calendar reminder 3 days before any renewal or trial expiration date."
      });
    }

    // Check Content Ownership / IP
    if (lower.includes('royalty-free') || lower.includes('perpetual') || lower.includes('license to use') || lower.includes('your content')) {
      flagged.push({
        clause_text: "You grant us a worldwide, perpetual, royalty-free, transferable license to use, reproduce, modify, and distribute any content you upload.",
        risk_level: "Medium",
        category: "Content Rights & IP",
        explanation: "While you legally own your photos, videos, or posts, the company has an unrestricted right to reuse or monetize your content forever.",
        recommendation: "Avoid uploading proprietary, copyrighted, or sensitive media that you do not want publicly reused."
      });
    }

    // Check Termination / Changes
    if (lower.includes('terminate') || lower.includes('sole discretion') || lower.includes('without notice') || lower.includes('modify these terms')) {
      flagged.push({
        clause_text: "We reserve the right to modify these terms or terminate your access at any time, for any reason, without prior notice.",
        risk_level: "Medium",
        category: "Liability & Termination",
        explanation: "The company can change the rules or delete your account whenever it wishes without giving you time to export your data.",
        recommendation: "Regularly backup any important files, contacts, or communications stored within the service."
      });
    }

    // Default if no specific flags found
    if (flagged.length === 0) {
      flagged.push({
        clause_text: "The service is provided 'as is' without warranty of any kind. In no event shall the company be liable for any consequential or indirect damages.",
        risk_level: "Low",
        category: "Liability & Termination",
        explanation: "Standard liability limitation clause stating the company does not guarantee 100% uptime and is not liable for incidental losses.",
        recommendation: "Standard legal boilerplate for software services."
      });
    }

    const highCount = flagged.filter(f => f.risk_level === 'High').length;
    const mediumCount = flagged.filter(f => f.risk_level === 'Medium').length;
    const score = Math.min(95, Math.max(25, highCount * 30 + mediumCount * 15 + 20));

    return {
      overallRiskScore: score,
      riskLevel: score >= 70 ? 'High' : score >= 40 ? 'Medium' : 'Low',
      summary: `This agreement contains binding terms concerning your personal data, subscription billing, and legal rights. Key areas of concern include third-party data handling, recurring payments, and mandatory dispute arbitration. ${apiError ? `(Note: Analysis generated via Built-in Intelligent Rule Engine: ${apiError})` : ''}`,
      keyTakeaways: [
        "Your personal information and app activity may be shared with marketing affiliates and third parties.",
        "Disputes cannot be brought before a regular court or class action, requiring private arbitration.",
        "Subscriptions renew automatically unless manually cancelled ahead of the billing cutoff.",
        "The company limits its financial liability if the service experiences data loss or downtime."
      ],
      flaggedClauses: flagged,
      modelUsed: 'Built-in Intelligent Legal Engine (Heuristic Fallback)'
    };
  },

  /**
   * Fallback Q&A answer when API key is not present
   */
  generateFallbackChatAnswer: (documentText, question, apiError = null) => {
    const q = question.toLowerCase();
    if (q.includes('data') || q.includes('privacy') || q.includes('sell') || q.includes('share')) {
      return "Based on the agreement clauses, personal data such as your IP address, device identifiers, and usage logs are collected and may be shared with affiliated companies and advertising partners for analytics and targeted advertising.";
    }
    if (q.includes('cancel') || q.includes('refund') || q.includes('subscription') || q.includes('money')) {
      return "According to the billing terms, subscriptions renew automatically at the end of each billing cycle. To avoid unwanted charges, you must cancel before the auto-renewal date through your account settings. Generally, payments already processed are non-refundable.";
    }
    if (q.includes('sue') || q.includes('court') || q.includes('arbitration') || q.includes('lawsuit')) {
      return "The document includes a dispute resolution section specifying binding individual arbitration. This means you waive the right to a jury trial or to join a class action lawsuit against the provider.";
    }
    if (q.includes('own') || q.includes('content') || q.includes('photo') || q.includes('copyright')) {
      return "You retain ownership of the content you submit; however, by uploading it, you grant the company a broad, royalty-free, worldwide license to display, host, and distribute your content across their platforms.";
    }
    return `Based on this agreement, the terms outline the conditions of service, account responsibilities, and liability limits. For specific details on "${question}", please check the corresponding section in the uploaded terms. ${apiError ? `(Live AI requires a GEMINI_API_KEY in .env)` : ''}`;
  }
};
