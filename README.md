# AI Terms & Conditions Explainer — Mini Project-I

> An intelligent, automated web application that ingests dense legal contracts, Terms of Service, and Privacy Policies (in PDF, DOCX, or text format), generates plain-language summaries, calculates an objective risk severity score, highlights risky clauses, and provides a grounded AI Q&A chatbot for follow-up questions.

---

## 🌟 Key Features

1. **Multi-Format Ingestion**:
   - Upload `.pdf` or `.docx` documents.
   - Paste raw text directly.
   - Pre-packaged demo presets (Streaming Terms, Social Media Terms) for instant evaluation.
2. **AI Plain-Language Summarization**:
   - Translates complex legal language into plain, everyday English.
   - Highlights key user commitments and rights in concise bullet points.
3. **Automated Risk Clause Detection & Scoring**:
   - Computes an overall Risk Score (0–100) and severity rating (**High**, **Medium**, **Low**).
   - Categorizes clauses into:
     - *Data Privacy & Sharing*
     - *Auto-Renewal & Billing*
     - *Dispute & Forced Arbitration*
     - *Content Rights & Copyright Transfer*
     - *Unilateral Termination & Liability Disclaimers*
   - Provides concrete consumer recommendations for each flagged clause.
4. **Context-Grounded Follow-Up Chatbot**:
   - Interactive chat assistant answering queries strictly based on the uploaded contract text.
5. **PDF Report Export**:
   - One-click downloadable "Terms & Conditions Risk Analysis Report" formatted with audit scores and clause breakdowns.
6. **User Authentication & Saved History**:
   - JWT-based authentication with register and login endpoints.
   - Saved history drawer to reload previous audits.
7. **Fail-Safe Presentation Mode**:
   - Includes a built-in intelligent rule engine so the application continues to run even if API quota or internet drops during live college presentations.

---

## 🏗️ System Architecture

- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide Icons, Axios
- **Backend**: Node.js, Express.js (REST API)
- **AI Engine**: Google Gemini API (`gemini-1.5-flash` / `@google/generative-ai`)
- **Document Parsers**: `pdf-parse` (PDF) and `mammoth` (DOCX)
- **Report Generation**: `pdfkit`
- **Database**: File-persisted relational database (`backend/data/db.json`)

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18 or newer recommended, tested on Node v24)
- npm (v9+)

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
The backend server runs on `http://localhost:5001`.

*(Optional)* To use your Google Gemini API key:
- Add `GEMINI_API_KEY=your_key_here` into `backend/.env`, **or**
- Enter it directly inside the web UI via the **Settings (Gear Icon)** modal.
- You can get a free key anytime from [Google AI Studio](https://aistudio.google.com/).

### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Open your browser at: **`http://localhost:5173`**

---

## 📡 REST API Endpoints (Section 4.4)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Registers a new user account |
| `POST` | `/api/auth/login` | Authenticates user & returns JWT token |
| `POST` | `/api/documents/upload` | Accepts PDF/DOCX upload or raw text & performs AI audit |
| `GET` | `/api/documents` | Lists all analyzed documents for current user |
| `GET` | `/api/documents/:id` | Returns document analysis, summary, and flagged clauses |
| `GET` | `/api/documents/:id/summary` | Returns plain-language summary |
| `GET` | `/api/documents/:id/clauses` | Returns list of flagged risk clauses |
| `POST` | `/api/chat/:documentId` | Answers follow-up questions grounded on document text |
| `GET` | `/api/reports/:documentId` | Generates and downloads PDF Risk Audit Report |

---

## 🎓 Viva / Presentation Q&A Cheat Sheet

1. **Why use an LLM instead of simple keyword searching?**
   * *Answer*: Legal contracts use varied synonyms and passive legalese (e.g. "perpetual, irrevocable, royalty-free assignment" instead of "we own your photos"). LLMs understand semantic intent, passive voice, and context rather than just keyword matching.
2. **How does the chatbot prevent hallucinations?**
   * *Answer*: The chatbot prompt uses strict grounding instructions and passes the exact uploaded contract text into the context window, instructing the model to answer solely based on the provided document and cite relevant sections.
3. **What is the purpose of the economic feasibility table in Chapter 1?**
   * *Answer*: It proves the system can run at negligible or zero development cost using open-source tools (React, Node.js) and free-tier cloud APIs (Gemini, Vercel/Render).
