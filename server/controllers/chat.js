import { Chat } from '../models/chats.js';
import { Order } from '../models/orders.js';
import { Message } from '../models/messages.js';
import { TryCatch } from '../middlewares/error.js';
import { ErrorHandler } from '../utils/utility.js'; 
import { emitEvent } from '../utils/features.js';
import { Profile } from '../models/workerProfile.js';

const getMessages = TryCatch(async (req, res, next) => {
    const { orderId } = req.params;
    const { page = 1 } = req.query;
    const resultPerPage = 20;
    const skip = (page - 1) * resultPerPage;

    let chat = await Chat.findOne({ order: orderId });

    // Create chat if not exists
    if (!chat) {
        return next(new ErrorHandler("Chat not found", 404));
    }

    // Permission check
    let currParticipant = req.user._id;

    if (req.user.role === 'worker') {
        const profile = await Profile.findOne({ owner: currParticipant });

        if (!profile) {
            return next(new ErrorHandler("Worker profile not found", 404));
        }

        currParticipant = profile._id;
    }
    if (!chat.participants.some(p => p.user.toString() === currParticipant.toString())) {
        return next(new ErrorHandler("You are not allowed to access this chat", 403));
    }


    // Get messages + pagination
    const [messages, totalMessageCount] = await Promise.all([
        Message.find({ chat: chat._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(resultPerPage)
            .populate("sender", "name avatar")
            .lean(),

        Message.countDocuments({ chat: chat._id })
    ]);
    if (totalMessageCount === 0) {
        return res.status(200).json({
            success: true,
            messages: [],
            totalPages: 0,
            message: "Chat started! Say hi~ 👋"
        });
    }

    const totalPages = Math.ceil(totalMessageCount / resultPerPage) || 0;
    return res.status(200).json({
        success: true,
        messages: messages.reverse(), // for chronological order
        totalPages,
    });
});
// const sendMessages = TryCatch(async (req, res, next) => {
//     const { content, orderId } = req.body;

//     if (!content || !orderId) {
//         return next(new ErrorHandler("Invalid data passed into request", 400));
//     }

//     const chat = await Chat.findOne({ order: orderId });
//     if (!chat) return next(new ErrorHandler("Chat not found", 404));

//     if (!chat.participants.map(p => p.toString()).includes(req.user._id.toString())) {
//         return next(new ErrorHandler("You are not allowed to send messages in this chat", 403));
//     }

//     const senderModel = req.user.role === 'worker' ? 'Freelancer' : 'Client';
//     const role = req.user.role;

//     const message = await Message.create({
//         chatId: chat._id,
//         sender: req.user._id,
//         senderModel,
//         role,
//         text: content,
//     });

//     const receiver = chat.participants.find(p => p.toString() !== req.user._id.toString());

//     emitEvent(req, "NEW_MESSAGE", receiver, {
//         message,
//         chatId: chat._id,
//     });

//     return res.status(201).json({
//         success: true,
//         message,
//     });
// });


export {
    getMessages,
}