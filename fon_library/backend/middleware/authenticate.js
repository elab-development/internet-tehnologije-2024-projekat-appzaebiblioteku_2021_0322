import jwt from 'jsonwebtoken';
import User from '../model/User.model.js';

export const authenticateUser = async (req, res, next) => {
  const token = req.cookies.token;

  try {
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - no token provided',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - invalid token',
      });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
    });
  }
};

export const authenticateAdmin = async (req, res, next) => {
  const token = req.cookies.token;

  try {
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - no token provided',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - invalid token',
      });
    }

    const user = await User.findById(decoded.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden - admin access required',
      });
    }

    req.userId = user._id;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
    });
  }
};
