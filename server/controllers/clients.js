import { compare } from 'bcrypt';
import { TryCatch } from '../middlewares/error.js';
import { cookieOptions, sendToken } from '../utils/features.js';
import { ErrorHandler } from '../utils/utility.js';
import { Client } from '../models/clients.js';
import { Gig } from '../models/gigs.js'
import { Profile } from '../models/workerProfile.js';

const newClient = TryCatch(
    async (req, res, next) => {

        const { name, password, email } = req.body;
        const user = await Client.create({
            name,
            password,
            email,
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
    const userId = req.user.id;
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
    const { searchVal = "", minPrice = 0, maxPrice = Infinity } = req.body;
    const gigs = await Gig.find({
        $and: [
            {
                $or: [
                    { tags: { $regex: searchVal, $options: "i" } },
                    { category: { $regex: searchVal, $options: "i" } },
                    { subCategory: { $regex: searchVal, $options: "i" } },
                ],
            },
            {
                price: { $gte: minPrice, $lte: maxPrice },
            },
        ],
    });
    return res.status(200).json({
        success: true,
        gigs,
    });
})

const getWorkerProfile = TryCatch(async (req, res, next) => {
    const {workerId} = req.params;
    if (!workerId) return next(new ErrorHandler('Please provide worker', 400));
    const worker = await Profile.findOne({ _id: workerId })
    return res.status(200).json({
        success: true,
        worker,
    });
})



export {
    logoutClient,
    newClient,
    loginClient,
    getClient,
    getGigs,
    getWorkerProfile,
}