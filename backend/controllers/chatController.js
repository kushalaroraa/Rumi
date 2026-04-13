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
    const roomId = req.query?.roomId ? String(req.query.roomId) : null;
    if (!otherUserId) {
      return res.status(400).json({ success: false, message: 'userId query required.' });
    }

    const acceptedQuery = {
      $or: [
        { fromUserId: currentUserId, toUserId: otherUserId },
        { fromUserId: otherUserId, toUserId: currentUserId },
      ],
      status: 'accepted',
    };
    if (roomId) {
      acceptedQuery.roomId = roomId;
    } else {
      acceptedQuery.$and = [{ $or: [{ roomId: null }, { roomId: { $exists: false } }] }];
    }

    const accepted = await Request.findOne(acceptedQuery);
    if (!accepted) {
      return res.status(403).json({ success: false, message: 'Not connected. Accept the request first.' });
    }

    const messageQuery = {
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId },
      ],
    };
    if (roomId) messageQuery.roomId = roomId;
    else messageQuery.$and = [{ $or: [{ roomId: null }, { roomId: { $exists: false } }] }];

    const messages = await Message.find(messageQuery)
      .sort({ timestamp: 1 })
      .populate('senderId', 'name photo profilePicture')
      .lean();

    // Mark messages as read for the receiver side.
    await Message.updateMany(
      {
        ...((roomId
          ? { roomId }
          : { $or: [{ roomId: null }, { roomId: { $exists: false } }] })),
        receiverId: currentUserId,
        read: false,
        senderId: otherUserId,
      },
      { $set: { read: true } }
    );

    return res.json({
      success: true,
      messages: messages.map((m) => ({
        ...m,
        isOwn: m.senderId._id.toString() === currentUserId.toString(),
        roomId: m.roomId ?? undefined,
      })),
    });
  } catch (err) {
    console.error('getHistory error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
}

/**
 * GET /chat/threads?roomId=...
 * Returns accepted chat threads for the given room:
 * - last message preview
 * - unread count for current user
 */
export async function getThreads(req, res) {
  try {
    const currentUserId = req.userId;
    const roomId = req.query?.roomId ? String(req.query.roomId) : null;
    if (!roomId) {
      return res.status(400).json({ success: false, message: 'roomId query required.' });
    }

    const accepted = await Request.find({
      roomId,
      status: 'accepted',
      $or: [{ fromUserId: currentUserId }, { toUserId: currentUserId }],
    })
      .populate('fromUserId', 'name age bio photo profilePicture')
      .populate('toUserId', 'name age bio photo profilePicture')
      .lean();

    const otherById = new Map();
    for (const r of accepted) {
      const isFromCurrent = r.fromUserId?._id?.toString?.() === currentUserId.toString();
      const other = isFromCurrent ? r.toUserId : r.fromUserId;
      if (!other?._id) continue;
      otherById.set(other._id.toString(), other);
    }

    const otherIds = Array.from(otherById.keys());

    const threads = await Promise.all(
      otherIds.map(async (otherId) => {
        const other = otherById.get(otherId);

        const [lastMessage, unreadCount] = await Promise.all([
          Message.findOne({
            roomId,
            $or: [
              { senderId: currentUserId, receiverId: otherId },
              { senderId: otherId, receiverId: currentUserId },
            ],
          })
            .sort({ timestamp: -1 })
            .lean(),
          Message.countDocuments({
            roomId,
            receiverId: currentUserId,
            senderId: otherId,
            read: false,
          }),
        ]);

        return {
          otherUserId: otherId,
          name: other?.name || '',
          age: other?.age ?? '',
          bio: other?.bio || '',
          image: other?.photo || other?.profilePicture || '',
          lastMessagePreview: lastMessage?.message || '',
          lastMessageTimestamp: lastMessage?.timestamp || null,
          unreadCount,
          lastMessageId: lastMessage?._id || null,
        };
      })
    );

    // Most recent conversations first.
    threads.sort((a, b) => {
      const aTs = a.lastMessageTimestamp ? new Date(a.lastMessageTimestamp).getTime() : 0;
      const bTs = b.lastMessageTimestamp ? new Date(b.lastMessageTimestamp).getTime() : 0;
      return bTs - aTs;
    });

    return res.json({ success: true, threads });
  } catch (err) {
    console.error('getThreads error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
}
