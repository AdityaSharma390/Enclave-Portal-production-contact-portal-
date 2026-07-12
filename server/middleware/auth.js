import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/apiError.js';
import logger from '../config/winston.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'Not authorized, token missing');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtsecretkeychangeinproduction123!');
      
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        throw new ApiError(401, 'User not found or account deleted');
      }

      req.user = user;
      next();
    } catch (jwtError) {
      logger.warn(`JWT verification failed: ${jwtError.message}`);
      throw new ApiError(401, 'Not authorized, token invalid or expired');
    }
  } catch (error) {
    next(error);
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    next(new ApiError(403, 'Forbidden, Admin access required'));
  }
};
