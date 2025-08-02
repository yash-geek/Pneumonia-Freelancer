import express from 'express';
import { detectAnyRole } from '../middlewares/auth.js';
import { getUserRole } from '../controllers/common.js';

const app = express.Router();

// Generic route to fetch role from any token
app.get('/role', detectAnyRole, getUserRole);

export default app;
