import mongoose from 'mongoose';

/**
 * Connection request between two users (flatmate connect).
 * Status: pending | accepted | rejected
 */
const requestSchema = new mongoose.Schema(
  {
    fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Optional room-scoped request. When omitted/null, the request is treated as a
    // legacy user-to-user "explore matching" request.
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', default: null },

    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    respondedAt: { type: Date },
  },
  { timestamps: true }
);

// One pending request per (from -> to, room) tuple.
// When `roomId` is null, this maintains legacy uniqueness for explore matching.
requestSchema.index({ fromUserId: 1, toUserId: 1, roomId: 1 }, { unique: true });
requestSchema.index({ toUserId: 1, roomId: 1, status: 1 });
requestSchema.index({ fromUserId: 1, roomId: 1, status: 1 });

export const Request = mongoose.model('Request', requestSchema);
