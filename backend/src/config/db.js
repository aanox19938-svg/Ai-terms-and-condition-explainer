import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, '../../data/db.json');

// Initialize database file if it does not exist
function initDB() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    const initialData = {
      users: [],
      documents: [],
      summaries: [],
      clauses: [],
      chat_queries: [],
      reports: []
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

initDB();

function readDB() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB:', err);
    return {
      users: [],
      documents: [],
      summaries: [],
      clauses: [],
      chat_queries: [],
      reports: []
    };
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing DB:', err);
  }
}

export const db = {
  // Users
  createUser: (user) => {
    const data = readDB();
    data.users.push(user);
    writeDB(data);
    return user;
  },
  findUserByEmail: (email) => {
    const data = readDB();
    return data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },
  findUserById: (userId) => {
    const data = readDB();
    return data.users.find(u => u.user_id === userId);
  },

  // Documents
  createDocument: (doc) => {
    const data = readDB();
    data.documents.unshift(doc);
    writeDB(data);
    return doc;
  },
  getDocumentById: (docId) => {
    const data = readDB();
    return data.documents.find(d => d.doc_id === docId);
  },
  getDocumentsByUser: (userId) => {
    const data = readDB();
    return data.documents.filter(d => !userId || d.user_id === userId);
  },
  deleteDocument: (docId) => {
    const data = readDB();
    data.documents = data.documents.filter(d => d.doc_id !== docId);
    data.summaries = data.summaries.filter(s => s.doc_id !== docId);
    data.clauses = data.clauses.filter(c => c.doc_id !== docId);
    data.chat_queries = data.chat_queries.filter(q => q.doc_id !== docId);
    data.reports = data.reports.filter(r => r.doc_id !== docId);
    writeDB(data);
    return true;
  },

  // Summaries
  saveSummary: (summary) => {
    const data = readDB();
    data.summaries = data.summaries.filter(s => s.doc_id !== summary.doc_id);
    data.summaries.push(summary);
    writeDB(data);
    return summary;
  },
  getSummaryByDocId: (docId) => {
    const data = readDB();
    return data.summaries.find(s => s.doc_id === docId);
  },

  // Clauses
  saveClauses: (docId, clausesList) => {
    const data = readDB();
    data.clauses = data.clauses.filter(c => c.doc_id !== docId);
    clausesList.forEach(c => data.clauses.push({ ...c, doc_id: docId }));
    writeDB(data);
    return clausesList;
  },
  getClausesByDocId: (docId) => {
    const data = readDB();
    return data.clauses.filter(c => c.doc_id === docId);
  },

  // Chat Queries
  saveChatQuery: (query) => {
    const data = readDB();
    data.chat_queries.push(query);
    writeDB(data);
    return query;
  },
  getChatHistoryByDocId: (docId) => {
    const data = readDB();
    return data.chat_queries.filter(q => q.doc_id === docId);
  },

  // Reports
  saveReport: (report) => {
    const data = readDB();
    data.reports.push(report);
    writeDB(data);
    return report;
  },
  getReportsByDocId: (docId) => {
    const data = readDB();
    return data.reports.filter(r => r.doc_id === docId);
  }
};
