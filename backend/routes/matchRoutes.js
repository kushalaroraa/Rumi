import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import * as matchController from '../controllers/matchController.js';

const router = express.Router();

router.get('/', authenticate, matchController.getMatches);
router.get('/explain', authenticate, matchController.getMatchExplain);

export default router;
