import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
import { signToken } from '../middleware/authMiddleware.js';

const SALT_ROUNDS = 10;
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 min

/**
 * POST /auth/register
 * Body: { email, password, name?, phone? }
 */
export async function register(req, res) {
  try {
    const { email, password, name, phone } = req.body || {};
    if (!email?.trim()) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
      email: email.trim().toLowerCase(),
      passwordHash,
      name: name?.trim() || '',
      phone: phone?.trim() || '',
    });

    const token = signToken(user._id);
    const safe = user.toObject();
    delete safe.passwordHash;
    delete safe.otpCode;
    delete safe.otpExpiresAt;
    return res.status(201).json({
      success: true,
      message: 'Registered successfully.',
      token,
      user: safe,
    });
  } catch (err) {
    console.error('register error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
}

/**
 * POST /auth/login
 * Body: { email, password }
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email?.trim() || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required.' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    if (!user.passwordHash) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = signToken(user._id);
    const safe = user.toObject();
    delete safe.passwordHash;
    delete safe.otpCode;
    delete safe.otpExpiresAt;
    return res.json({
      success: true,
      token,
      user: safe,
    });
  } catch (err) {
    console.error('login error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
}

/**
 * POST /auth/otp/send
 * Body: { email } — simulate sending OTP (store in DB for demo).
 */
export async function sendOtp(req, res) {
  try {
    const { email } = req.body || {};
    if (!email?.trim()) {
      return res.status(400).json({ success: false, message: 'Email required.' });
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const user = await User.findOneAndUpdate(
      { email: email.trim().toLowerCase() },
      { otpCode: code, otpExpiresAt: new Date(Date.now() + OTP_EXPIRY_MS) },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // In production: send code via SMS/email. For demo we don't send.
    return res.json({
      success: true,
      message: 'OTP sent. (Simulated: use /auth/otp/verify with the code from server logs in dev.)',
      expiresIn: OTP_EXPIRY_MS / 1000,
    });
  } catch (err) {
    console.error('sendOtp error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
}

/**
 * POST /auth/otp/verify
 * Body: { email, code }
 */
export async function verifyOtp(req, res) {
  try {
    const { email, code } = req.body || {};
    if (!email?.trim() || !code?.trim()) {
      return res.status(400).json({ success: false, message: 'Email and OTP code required.' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    if (user.otpCode !== code.trim()) {
      return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }
    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP expired.' });
    }

    await User.updateOne(
      { _id: user._id },
      { $unset: { otpCode: 1, otpExpiresAt: 1 }, $set: { 'verificationStatus.phoneVerified': true } }
    );
    const token = signToken(user._id);
    const updated = await User.findById(user._id).select('-passwordHash -otpCode -otpExpiresAt');
    return res.json({
      success: true,
      message: 'Phone verified.',
      token,
      user: updated?.toObject(),
    });
  } catch (err) {
    console.error('verifyOtp error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
}
