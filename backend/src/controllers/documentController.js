import { db } from '../config/db.js';
import { parserService } from '../services/parserService.js';
import { geminiService } from '../services/geminiService.js';
import { reportService } from '../services/reportService.js';

export const documentController = {
  /**
   * Upload PDF/DOCX or submit raw text for instant analysis
   */
  uploadDocument: async (req, res) => {
    try {
      let rawText = '';
      let fileName = req.body.file_name || 'Terms & Conditions Document';
      let fileType = 'text';

      if (req.file) {
        fileName = req.file.originalname;
        fileType = req.file.originalname.split('.').pop().toLowerCase();
        rawText = await parserService.extractFromFile(req.file);
      } else if (req.body.raw_text) {
        rawText = parserService.cleanText(req.body.raw_text);
        fileType = 'raw_text';
      } else {
        return res.status(400).json({ error: 'Please upload a PDF/DOCX file or paste document text.' });
      }

      if (!rawText || rawText.trim().length < 30) {
        return res.status(400).json({ error: 'The document text is too short or empty to analyze. Please provide a valid Terms & Conditions document.' });
      }

      // Check if custom API key is passed from frontend settings
      const customApiKey = req.headers['x-gemini-api-key'] || req.body.api_key || null;

      // Run AI / LLM Analysis
      const analysis = await geminiService.analyzeTermsAndConditions(rawText, customApiKey);

      const docId = 'doc_' + Date.now();
      const userId = req.user?.user_id || 'guest-user';

      // 1. Create Document record
      const newDoc = {
        doc_id: docId,
        user_id: userId,
        file_name: fileName,
        file_type: fileType,
        upload_date: new Date().toISOString(),
        raw_text: rawText,
        status: 'Analyzed',
        risk_score: analysis.overallRiskScore,
        risk_level: analysis.riskLevel
      };
      db.createDocument(newDoc);

      // 2. Create Summary record
      const newSummary = {
        summary_id: 'sum_' + Date.now(),
        doc_id: docId,
        summary_text: analysis.summary,
        key_takeaways: analysis.keyTakeaways,
        generated_date: new Date().toISOString()
      };
      db.saveSummary(newSummary);

      // 3. Create Clauses records
      const formattedClauses = analysis.flaggedClauses.map((c, i) => ({
        clause_id: `cls_${Date.now()}_${i}`,
        doc_id: docId,
        clause_text: c.clause_text,
        risk_level: c.risk_level,
        category: c.category,
        explanation: c.explanation,
        recommendation: c.recommendation || ''
      }));
      db.saveClauses(docId, formattedClauses);

      return res.status(201).json({
        message: 'Document successfully analyzed',
        document: newDoc,
        summary: newSummary,
        clauses: formattedClauses,
        modelUsed: analysis.modelUsed
      });
    } catch (err) {
      console.error('Upload & Analysis error:', err);
      return res.status(500).json({ error: 'Analysis failed: ' + err.message });
    }
  },

  /**
   * List all documents for user
   */
  getDocuments: (req, res) => {
    try {
      const userId = req.user?.user_id;
      const docs = db.getDocumentsByUser(userId);
      // Return metadata without giant raw_text string
      const formatted = docs.map(d => ({
        doc_id: d.doc_id,
        file_name: d.file_name,
        file_type: d.file_type,
        upload_date: d.upload_date,
        risk_score: d.risk_score,
        risk_level: d.risk_level,
        status: d.status
      }));
      return res.json({ documents: formatted });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  /**
   * Get single document with summary & clauses
   */
  getDocumentDetails: (req, res) => {
    try {
      const { id } = req.params;
      const doc = db.getDocumentById(id);
      if (!doc) {
        return res.status(404).json({ error: 'Document not found' });
      }

      const summary = db.getSummaryByDocId(id);
      const clauses = db.getClausesByDocId(id);

      return res.json({
        document: doc,
        summary: summary || null,
        clauses: clauses || []
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  /**
   * GET /api/documents/:id/summary
   */
  getDocumentSummary: (req, res) => {
    try {
      const { id } = req.params;
      const summary = db.getSummaryByDocId(id);
      if (!summary) {
        return res.status(404).json({ error: 'Summary not found for this document' });
      }
      return res.json(summary);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  /**
   * GET /api/documents/:id/clauses
   */
  getDocumentClauses: (req, res) => {
    try {
      const { id } = req.params;
      const clauses = db.getClausesByDocId(id);
      return res.json({ clauses: clauses || [] });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  /**
   * DELETE /api/documents/:id
   */
  deleteDocument: (req, res) => {
    try {
      const { id } = req.params;
      db.deleteDocument(id);
      return res.json({ message: 'Document deleted successfully' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  /**
   * GET /api/reports/:documentId
   */
  downloadReport: async (req, res) => {
    try {
      const { documentId } = req.params;
      const doc = db.getDocumentById(documentId);
      if (!doc) {
        return res.status(404).json({ error: 'Document not found' });
      }

      const summary = db.getSummaryByDocId(documentId);
      const clauses = db.getClausesByDocId(documentId) || [];

      const pdfBuffer = await reportService.generatePdfReport(doc, summary, clauses);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="TC_Audit_Report_${doc.doc_id}.pdf"`);
      return res.send(pdfBuffer);
    } catch (err) {
      console.error('Report generation error:', err);
      return res.status(500).json({ error: 'Could not generate report: ' + err.message });
    }
  }
};
