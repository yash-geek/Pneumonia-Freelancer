// middlewares/auth.js

import jwt from 'jsonwebtoken';
import { ErrorHandler } from '../utils/utility.js';
import { TryCatch } from './error.js';
import { Client } from '../models/clients.js';
import { Freelancer } from '../models/freelancers.js';

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

const socketAuthenticator = async (err, socket, next) => {
  try {
    if (err) return next(err);

    const token =
      socket.request.cookies['pneumonia-client-token'] ||
      socket.request.cookies['pneumonia-worker-token'];

    if (!token) return next(new ErrorHandler('Unauthorized. Please login.', 401));

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    let user = await Client.findById(decodedData._id);
    let role = 'Client'; // 💡 Use schema-expected string

    if (!user) {
      user = await Freelancer.findById(decodedData._id);
      role = 'Freelancer'; 
    }

    if (!user) return next(new ErrorHandler('User not found', 404));

    socket.user = user;
    socket.userRole = role; // ✔ Now this aligns with schema + rest of backend

    return next();
  } catch (error) {
    console.error(error);
    return next(new ErrorHandler('Invalid token. Please login again.', 401));
  }
};


export { isAuthorized, detectAnyRole, socketAuthenticator };
