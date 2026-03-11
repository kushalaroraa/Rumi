import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import * as chatController from '../controllers/chatController.js';

const router = express.Router();

router.get('/history', authenticate, chatController.getHistory);

export default router;
