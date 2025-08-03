// import express from 'express';
// import { createCheckoutSession, stripeWebhook } from '../controllers/payment.js';
// import { isAuthorized } from '../middlewares/auth.js';

// const router = express.Router();

// router.post('/create-checkout-session', isAuthorized(['client']), createCheckoutSession);

// // Stripe webhook needs raw body, so will be handled in app.js with special middleware
// router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// export default router;
