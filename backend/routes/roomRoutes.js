import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import * as roomController from '../controllers/roomController.js';
import { uploadRoomMedia } from '../middleware/uploadRoomMedia.js';

const router = express.Router();

router.post('/', authenticate, uploadRoomMedia, roomController.createRoom);
router.get('/mine', authenticate, roomController.getMyRooms);
router.get('/recommended', authenticate, roomController.getRecommendedRooms);

router.patch('/:roomId/status', authenticate, roomController.updateRoomStatus);
router.put('/:roomId', authenticate, uploadRoomMedia, roomController.updateRoom);
router.delete('/:roomId', authenticate, roomController.deleteRoom);
router.post('/:roomId/view', authenticate, roomController.incrementRoomView);
router.get('/:roomId/suggestions', authenticate, roomController.getRoomSuggestions);

export default router;

