export const generateVerificationToken = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = async (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.cookie('token', token, {
    httpOnly: true, // XSS attacks prevention
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', // CSRF attacks prevention
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};
