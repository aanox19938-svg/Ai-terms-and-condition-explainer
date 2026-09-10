import express from 'express';
import { documentController } from '../controllers/documentController.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/upload', authMiddleware, upload.single('file'), documentController.uploadDocument);
router.get('/', authMiddleware, documentController.getDocuments);
router.get('/:id', authMiddleware, documentController.getDocumentDetails);
router.get('/:id/summary', authMiddleware, documentController.getDocumentSummary);
router.get('/:id/clauses', authMiddleware, documentController.getDocumentClauses);
router.delete('/:id', authMiddleware, documentController.deleteDocument);
router.get('/:documentId/report', authMiddleware, documentController.downloadReport);

export default router;
