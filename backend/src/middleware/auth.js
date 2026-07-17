import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  const bearerToken = req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.split(' ')[1];
  const token = bearerToken || req.cookies?.token;
  if (!token) return res.status(401).json({ success: false, message: 'Please log in to continue' });
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  if (!req.user) return res.status(401).json({ success: false, message: 'User no longer exists' });
  next();
});

export const allowRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return res.status(403).json({ success: false, message: 'You do not have permission for this action' });
  next();
};
