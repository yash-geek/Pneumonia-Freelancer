import { compare } from 'bcrypt';
import { TryCatch } from '../middlewares/error.js';
import { cookieOptions, sendToken } from '../utils/features.js';
import { ErrorHandler } from '../utils/utility.js';
import { Client } from '../models/clients.js';
import { Gig } from '../models/gigs.js'
import { Profile } from '../models/workerProfile.js';
import { Order } from '../models/orders.js';
import { v4 as uuidv4 } from 'uuid';

const newClient = TryCatch(
    async (req, res, next) => {

        console.log(req.body)
        const { name, password, email, role } = req.body;
        const user = await Client.create({
            name,
            password,
            email,
            role,
        });
        sendToken(res, user, 201, "User Created", 'client')
    }
)
const loginClient = TryCatch(async (req, res, next) => {
    const { password, email } = req.body;
    const user = await Client.findOne({ email }).select("+password");
    if (!user) return next(new ErrorHandler('User not found', 404));
    const isMatch = await compare(password, user.password);
    if (!isMatch) return next(new ErrorHandler('Invalid Username or Password', 404));
    sendToken(res, user, 200, `Welcome back, ${user.name}`, 'client');
});
const logoutClient = TryCatch(async (req, res) => {
    return res.status(200).cookie("pneumonia-client-token", "", {
        ...cookieOptions,
        maxAge: 0,
    }).json({
        success: true,
        message: "Logged out successfully",
    });
})


const getClient = TryCatch(async (req, res, next) => {
    const userId = req.user._id;
    console.log(userId)
    const role = req.user.role
    if (!userId) return next(new ErrorHandler('User not found', 404));
    const user = await Client.findOne({ _id: userId })
    if (!user) return next(new ErrorHandler('User not found', 404));
    return res.status(200).json({
        success: true,
        user,
        role,
    });
})

const getGigs = TryCatch(async (req, res, next) => {

    const { category = "", minPrice = 0, maxPrice = Infinity } = req.query;
    const gigs = await Gig.find({
        $and: [
            {
                $or: [
                    { tags: { $regex: category, $options: "i" } },
                    { category: { $regex: category, $options: "i" } },
                    { subCategory: { $regex: category, $options: "i" } },
                ],
            },
            {
                price: { $gte: minPrice, $lte: maxPrice },
            },
        ],
    }).populate('creator', 'name picture email');
    return res.status(200).json({
        success: true,
        gigs,
    });
})
const getGigInfo = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const gig = await Gig.findById(id);
    if (!gig) return next(new ErrorHandler('Gig not found', 404));
    return res.status(200).json({
        success: true,
        gig,
    });
})
const askQuestion = TryCatch(async (req, res, next) => {

    const { id } = req.params;
    const gig = await Gig.findById(id);
    if (!gig) return next(new ErrorHandler('Gig not found', 404));
    const { question } = req.body;
    if (!question) return next(new ErrorHandler('Please provide a question', 400));
    gig.faq.push({
        question,
        answer: "",
        askedBy: req.user.id,
        createdAt: new Date(),
    });
    await gig.save();
    return res.status(200).json({
        success: true,
        gig,
    });
})

const getWorkerProfile = TryCatch(async (req, res, next) => {
    const { workerId } = req.params;
    console.log(workerId)
    if (!workerId) return next(new ErrorHandler('Please provide worker', 400));
    const worker = await Profile.findOne({ _id: workerId })
    if (!worker) return next(new ErrorHandler('Worker not found', 404));
    return res.status(200).json({
        success: true,
        worker,
    });
})

const getOrders = TryCatch(
    async (req, res, next) => {
        const userId = req.user._id;
        const orders = await Order.find({ client: userId }).populate('gig', 'title price').populate('freelancer', 'name picture email').sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            orders,
        })
    }
)
const getOrderDetails = TryCatch(
    async (req, res, next) => {
        const orderId = req.params.orderId;
        if (!orderId) return next(new ErrorHandler('Please provide order ID', 400))
        const order = await Order.findById(orderId).populate('gig', 'title price').populate('freelancer', 'name picture email');
        if (!order) return next(new ErrorHandler('Order not found', 404));
        if (order.client.toString() !== req.user._id.toString()) {
            return next(new ErrorHandler('You are not authorized to view this order', 403));
        }
        res.status(200).json({
            success: true,
            order,
        })
    }
)

const createNewOrder = TryCatch(
    async (req, res, next) => {
        const userId = req.user._id;
        //console.log(req)
        const { gigId } = req.body;
        if (!gigId) return next(new ErrorHandler('Please provide gig info', 403));
        const gigInfo = await Gig.findOne({ _id: gigId });

        if (!gigInfo) return next(new ErrorHandler('gig not found', 404));
        if (!userId) return next(new ErrorHandler('action denied', 401));
        const orderID = uuidv4().replace(/-/g, '').slice(0, 12);
        const order = await Order.create({
            orderID,
            gig: gigInfo._id,
            client: userId,
            freelancer: gigInfo.creator,
            price: gigInfo.price,
        });
        return res.status(200).json({
            message: 'Order created successfully',
            success: true,
            order,
        });
    }
)

const cancelOrder = TryCatch(
    async (req, res, next) => {
        const { orderId } = req.body;
        const order = await Order.findOne({ _id: orderId });
        if (!order)
            return next(new ErrorHandler('Order Not Found', 404));
        if (order.status === 'in progress') {
            return next(new ErrorHandler('Cannot cancel order in progress', 400))
        }
        order.status = 'cancelled';
        await order.save();
        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
        })
    }
)
const rateOrders = TryCatch(
    async (req, res, next) => {
        const { orderId, rating, gigId, freelancerId } = req.body;
        if (!orderId || !rating || !gigId || !freelancerId) {
            return next(new ErrorHandler('Something went wrong, fields not found', 400));
        }
        if (rating < 0 || rating > 5) {
            return next(new ErrorHandler('Rating must be between 0 and 5', 400));
        }
        //updating ggig ratings
        const gig = await Gig.findById(gigId);
        if (gig) {
            const newCount = gig.ratings.count + 1;
            const newAverage = ((gig.ratings.average * gig.ratings.count) + rating) / newCount;

            gig.ratings.count = newCount;
            gig.ratings.average = Math.round(newAverage * 100) / 100;
        }
        //updating order    
        const rateOrder = await Order.findOne({ _id: orderId });
        if (!rateOrder) {
            return next(new ErrorHandler('Order not found', 404));
        }
        if (rateOrder.status === 'in progress' || rateOrder.status === 'pending') {
            return next(new ErrorHandler('Order is not in progress', 400));
        }
        rateOrder.giveRating = rating;
        rateOrder.status = 'completed';
        //updating freelancer profile
        const freelancer = await Profile.findById(freelancerId);
        if (!freelancer) {
            return next(new ErrorHandler('Freelancer not found', 404));
        }
        const newRating = ((freelancer.rating.average * freelancer.rating.count) + rating) / (freelancer.rating.count + 1);
        freelancer.rating.average = Math.round(newRating * 100) / 100; 
        freelancer.rating.count += 1;
        await freelancer.save();
        await gig.save();
        await rateOrder.save();
        return res.status(200).json({
            success: true,
            message: 'Order rated successfully',
            gig,
            order: rateOrder,
            freelancer,
        });
    }
)





export {
    logoutClient,
    newClient,
    loginClient,
    getClient,
    getGigs,
    getWorkerProfile,
    createNewOrder,
    getOrders,
    cancelOrder,
    getGigInfo,
    askQuestion,
    rateOrders,
    getOrderDetails,
}