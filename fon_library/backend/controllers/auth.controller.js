import bcryptjs from 'bcryptjs';
import crypto from 'crypto';

import User from '../model/User.model.js';
import {
  generateTokenAndSetCookie,
  generateVerificationToken,
} from '../utils/tokens.js';
import {
  sendForgotPasswordMail,
  sendResetSuccessEmail,
  sendVerificationMail,
  sendWelcomeEmail,
} from '../utils/emails.js';

/**
 * @route     POST /api/auth/register
 * @access    Public
 * @summary   Register a new user
 * @param     {string} req.body.name
 * @param     {string} req.body.email
 * @param     {string} req.body.password
 */
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = generateVerificationToken();

    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // expires in 24h
    });
    await user.save();

    generateTokenAndSetCookie(res, user._id);
    await sendVerificationMail(user.name, user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Register error' });
  }
};

/**
 * @route     POST /api/auth/verify-email
 * @access    Public
 * @summary   Verify user email
 * @param     {string} req.body.email
 * @param     {string} req.body.code
 */
export const verifyEmail = async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({
      email,
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code',
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();
    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: 'Account verified successfully',
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Verify email error' });
  }
};

/**
 * @route     POST /api/auth/login
 * @access    Public
 * @summary   Login user
 * @param     {string} req.body.email
 * @param     {string} req.body.password
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Wrong credentials',
      });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Wrong credentials',
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Your account hasn't been verified! Check your email",
      });
    }

    generateTokenAndSetCookie(res, user._id);

    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login error' });
  }
};

/**
 * @route     POST /api/auth/logout
 * @access    Public
 * @summary   Logout user
 */
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie('token');
    res.status(200).json({
      success: true,
      message: 'User logged out successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Logout error' });
  }
};

/**
 * @route     POST /api/auth/forgot-password
 * @access    Public
 * @summary   Forgot password
 * @param     {string} req.body.email
 */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    await sendForgotPasswordMail(
      user.email,
      user.name,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}/${email}`
    );

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email',
    });
  } catch (error) {
    res.status(500).json({ message: 'Forgot password error' });
  }
};

/**
 * @route     POST /api/auth/reset-password/:token
 * @access    Public
 * @summary   Reset password
 * @param     {string} req.params.token
 * @param     {string} req.body.email
 * @param     {string} req.body.password
 */
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password, email } = req.body;

  try {
    const user = await User.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset password session',
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    sendResetSuccessEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: 'Password reset successfull',
    });
  } catch (error) {
    res.status(500).json({ message: 'Reset password error' });
  }
};

/**
 * @route     GET /api/auth/check-auth
 * @access    Public
 * @summary   Check user authentication
 */
export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User authenticated',
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
