import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import * as reportController from '../controllers/reportController.js';

const router = express.Router();

router.post('/', authenticate, reportController.createReport);

export default router;
