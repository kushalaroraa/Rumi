import mongoose from 'mongoose';

/**
 * User report (fake profile, harassment, spam).
 */
const reportSchema = new mongoose.Schema(
  {
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reportedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: {
      type: String,
      enum: ['fake_profile', 'harassment', 'spam'],
      required: true,
    },
    description: { type: String, default: '' },
    status: { type: String, enum: ['open', 'resolved', 'dismissed'], default: 'open' },
  },
  { timestamps: true }
);

reportSchema.index({ reportedUserId: 1 });
reportSchema.index({ reporterId: 1, reportedUserId: 1 });

export const Report = mongoose.model('Report', reportSchema);
