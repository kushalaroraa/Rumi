import { Report } from '../models/Report.js';
import { User } from '../models/User.js';

const REPORT_REASONS = ['fake_profile', 'harassment', 'spam'];

/**
 * POST /report
 * Body: { reportedUserId, reason, description? }
 */
export async function createReport(req, res) {
  try {
    const reporterId = req.userId;
    const { reportedUserId, reason, description } = req.body || {};
    if (!reportedUserId) {
      return res.status(400).json({ success: false, message: 'reportedUserId required.' });
    }
    if (!REPORT_REASONS.includes(reason)) {
      return res.status(400).json({
        success: false,
        message: `reason must be one of: ${REPORT_REASONS.join(', ')}.`,
      });
    }
    if (reporterId.toString() === reportedUserId.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot report yourself.' });
    }

    const reported = await User.findById(reportedUserId);
    if (!reported) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const report = await Report.create({
      reporterId,
      reportedUserId,
      reason,
      description: description?.trim() || '',
    });

    return res.status(201).json({
      success: true,
      message: 'Report submitted.',
      report: report.toObject(),
    });
  } catch (err) {
    console.error('createReport error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
}
