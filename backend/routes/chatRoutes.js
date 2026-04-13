import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import * as chatController from '../controllers/chatController.js';

const router = express.Router();

router.get('/history', authenticate, chatController.getHistory);
router.get('/threads', authenticate, chatController.getThreads);

export default router;
