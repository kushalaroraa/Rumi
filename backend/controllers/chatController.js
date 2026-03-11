import { Message } from '../models/Message.js';
import { Request } from '../models/Request.js';

/**
 * GET /chat/history?userId=...
 * Returns message history between current user and userId. Only allowed if they are accepted connections.
 */
export async function getHistory(req, res) {
  try {
    const currentUserId = req.userId;
    const otherUserId = req.query.userId;
    if (!otherUserId) {
      return res.status(400).json({ success: false, message: 'userId query required.' });
    }

    const accepted = await Request.findOne({
      $or: [
        { fromUserId: currentUserId, toUserId: otherUserId },
        { fromUserId: otherUserId, toUserId: currentUserId },
      ],
      status: 'accepted',
    });
    if (!accepted) {
      return res.status(403).json({ success: false, message: 'Not connected. Accept the request first.' });
    }

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId },
      ],
    })
      .sort({ timestamp: 1 })
      .populate('senderId', 'name photo profilePicture')
      .lean();

    return res.json({
      success: true,
      messages: messages.map((m) => ({
        ...m,
        isOwn: m.senderId._id.toString() === currentUserId.toString(),
      })),
    });
  } catch (err) {
    console.error('getHistory error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
}
