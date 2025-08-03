// import Stripe from 'stripe';
// import { TryCatch } from '../middlewares/error.js';
// import { ErrorHandler } from '../utils/utility.js';
// import { Order } from '../models/orders.js';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export const createCheckoutSession = TryCatch(async (req, res, next) => {
//     const userId = req.user._id;
//     const { gigId, gig } = req.body;

//     if (!gigId || !gig) return next(new ErrorHandler('Missing gig data', 400));

//     const session = await stripe.checkout.sessions.create({
//         payment_method_types: ['card'],
//         line_items: [
//             {
//                 price_data: {
//                     currency: 'inr',
//                     product_data: {
//                         name: gig.title,
//                         description: gig.description,
//                     },
//                     unit_amount: gig.price * 100,
//                 },
//                 quantity: 1,
//             },
//         ],
//         mode: 'payment',
//         success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
//         cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
//         metadata: {
//             clientId: userId.toString(),
//             gigId,
//             freelancerId: gig.creator._id.toString(),
//         },
//     });

//     res.status(200).json({ success: true, id: session.id, url: session.url });
// });

// export const stripeWebhook = TryCatch(async (req, res, next) => {
//     const sig = req.headers['stripe-signature'];
//     let event;

//     try {
//         event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
//     } catch (err) {
//         return next(new ErrorHandler(`Webhook Error: ${err.message}`, 400));
//     }

//     if (event.type === 'checkout.session.completed') {
//         const session = event.data.object;

//         const clientId = session.metadata.clientId;
//         const freelancerId = session.metadata.freelancerId;
//         const gigId = session.metadata.gigId;

//         const orderID = session.id.slice(0, 12);

//         await Order.create({
//             orderID,
//             gig: gigId,
//             client: clientId,
//             freelancer: freelancerId,
//             price: session.amount_total / 100,
//         });

//         console.log(`🎉 Order created for session ${session.id}`);
//     }

//     res.status(200).json({ received: true });
// });
