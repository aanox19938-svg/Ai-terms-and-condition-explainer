import { db } from '../config/db.js';
import { geminiService } from '../services/geminiService.js';

export const chatController = {
  /**
   * POST /api/chat/:documentId
   */
  askQuestion: async (req, res) => {
    try {
      const { documentId } = req.params;
      const { question } = req.body;

      if (!question || question.trim() === '') {
        return res.status(400).json({ error: 'Please enter a question.' });
      }

      const doc = db.getDocumentById(documentId);
      if (!doc) {
        return res.status(404).json({ error: 'Document not found.' });
      }

      const history = db.getChatHistoryByDocId(documentId);
      const customApiKey = req.headers['x-gemini-api-key'] || req.body.api_key || null;

      // Ask AI
      const answer = await geminiService.askDocumentQuestion(
        doc.raw_text,
        history,
        question,
        customApiKey
      );

      const chatRecord = {
        query_id: 'chat_' + Date.now(),
        doc_id: documentId,
        user_id: req.user?.user_id || 'guest-user',
        question: question.trim(),
        answer: answer,
        timestamp: new Date().toISOString()
      };

      db.saveChatQuery(chatRecord);

      return res.status(201).json({
        query_id: chatRecord.query_id,
        question: chatRecord.question,
        answer: chatRecord.answer,
        timestamp: chatRecord.timestamp
      });
    } catch (err) {
      console.error('Chat error:', err);
      return res.status(500).json({ error: 'Chat query failed: ' + err.message });
    }
  },

  /**
   * GET /api/chat/:documentId/history
   */
  getHistory: (req, res) => {
    try {
      const { documentId } = req.params;
      const history = db.getChatHistoryByDocId(documentId);
      return res.json({ history });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};
