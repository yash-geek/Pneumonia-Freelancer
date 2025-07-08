import { compare } from 'bcrypt';
import { TryCatch } from '../middlewares/error.js';
import { cookieOptions, sendToken} from '../utils/features.js';
import { ErrorHandler } from '../utils/utility.js';
import { FreeLancer } from '../models/freelancers.js';


const newWorker = TryCatch(
    async (req, res, next) => {

        const { name, password, email } = req.body;
        const user = await FreeLancer.create({
            name,
            password,
            email,
        });
        sendToken(res, user, 201, "User Created",'worker')
    }
)

const loginWorker = TryCatch(async (req, res, next) => {
    const { password, email } = req.body;
    const user = await FreeLancer.findOne({ email }).select("+password");
    if (!user) return next(new ErrorHandler('User not found', 404));
    const isMatch = await compare(password, user.password);
    if (!isMatch) return next(new ErrorHandler('Invalid Username or Password', 404));
    sendToken(res, user, 200, `Welcome back, ${user.name}`,'worker');
});
const logoutWorker = TryCatch(async (req, res) => {
    return res.status(200).cookie("pneumonia-worker-token", "", {
        ...cookieOptions,
        maxAge: 0,
    }).json({
        success: true,
        message: "Logged out successfully",
    });
})

const getWorker = TryCatch(async (req, res, next) => {
    const userId = req.user.id;
    const role = req.user.role
    if(role == 'client')
        return next(new ErrorHandler('You are not a worker', 404));
    if (!userId) return next(new ErrorHandler('User not found', 404));
    const user = await FreeLancer.findOne({_id:userId})
    return res.status(200).json({
        success: true,
        user,
        role,
    });
})


export {
    logoutWorker,
    newWorker,
    loginWorker,
    getWorker,
}