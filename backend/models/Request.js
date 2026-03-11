import mongoose from 'mongoose';

/**
 * Connection request between two users (flatmate connect).
 * Status: pending | accepted | rejected
 */
const requestSchema = new mongoose.Schema(
  {
    fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    respondedAt: { type: Date },
  },
  { timestamps: true }
);

// One pending request per pair (from -> to)
requestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });
requestSchema.index({ toUserId: 1, status: 1 });
requestSchema.index({ fromUserId: 1, status: 1 });

export const Request = mongoose.model('Request', requestSchema);
