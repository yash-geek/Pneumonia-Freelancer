// middlewares/auth.js

import jwt from 'jsonwebtoken';
import { ErrorHandler } from '../utils/utility.js';
import { TryCatch } from './error.js';

const rolesToTokens = {
  client: 'pneumonia-client-token',
  worker: 'pneumonia-worker-token',
  admin: 'pneumonia-admin-token', // futureproofing
};

const isAuthorized = (allowedRoles = []) =>
  TryCatch((req, res, next) => {

    let foundRole = null;
    let decodedData = null;
    // console.log("🍪 req.cookies:", req.cookies);
    for (const role of allowedRoles) {
      const tokenName = rolesToTokens[role];
      const token = req.cookies[tokenName];

      if (token) {
        try {
          decodedData = jwt.verify(token, process.env.JWT_SECRET);
          foundRole = role;
          break;
        } catch (err) {
          console.log(`Invalid token for role ${role}:`, err.message);
          // continue checking other roles
        }
      }
    }

    if (!foundRole || !decodedData) {
      console.log('unauthorized')
      return next(new ErrorHandler('Unauthorized. Please login properly.', 401));
    }


    req.user = { _id: decodedData._id, role: foundRole };
    next();
  });

const detectAnyRole = TryCatch((req, res, next) => {
  for (const [role, cookieName] of Object.entries(rolesToTokens)) {
    const token = req.cookies[cookieName];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { _id: decoded._id, role };
      return next();
    }
  }
  return next(new ErrorHandler('Unauthorized. No valid token found.', 401));
});

export { isAuthorized, detectAnyRole };
