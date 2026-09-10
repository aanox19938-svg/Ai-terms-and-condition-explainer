import express from 'express';
import { chatController } from '../controllers/chatController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:documentId', authMiddleware, chatController.askQuestion);
router.get('/:documentId/history', authMiddleware, chatController.getHistory);

export default router;
