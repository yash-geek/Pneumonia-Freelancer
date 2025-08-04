import { v2 as cloudinary } from 'cloudinary';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuid } from 'uuid';
import { corsOptions } from './constants/config.js';

import clientRoute from './routes/client.js'
import workerRoute from './routes/freelancer.js'
import commonRoute from './routes/commonRoute.js'
import chatRoute from './routes/chat.js'
import { connectDB } from './utils/features.js';
import { errorMiddleware } from './middlewares/error.js';
import { socketAuthenticator } from './middlewares/auth.js'
import { Message } from './models/messages.js';
import { Order } from './models/orders.js';
import { Chat } from './models/chats.js';
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from './constants/events.js';
import { Profile } from './models/workerProfile.js';

dotenv.config({
    path: './.env',
})
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const mongoURI = process.env.MONGO_URI
connectDB(mongoURI)

const port = process.env.PORT || 3000
const envMode = process.env.NODE_ENV.trim() || "PRODUCTION";
const app = express();


const userSocketIDs = new Map();
const server = createServer(app);
const io = new Server(server, {
    cors: corsOptions,

});
app.set('io', io);





app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/user', commonRoute);
app.use('/api/v1/client', clientRoute)
app.use('/api/v1/worker', workerRoute)
app.use('/api/v1/chat', chatRoute)


app.get('/', (req, res) => {
    res.send('Hello World');
})

io.use((socket, next) => {
    cookieParser()(socket.request, socket.request.res, async (err) => {
        await socketAuthenticator(err, socket, next);
    })
})

io.on('connection', (socket) => {
    const user = socket.user;
    userSocketIDs.set(user._id.toString(), socket.id);

    socket.on(NEW_MESSAGE, async ({ orderId, content }) => {
        try {
            // 1. Validate
            if (!orderId || !content)
                return socket.emit("ERROR", { message: "Missing orderId or content" });

            // 2. Find chat
            let chat = await Chat.findOne({ order: orderId });
            if (!chat) {
                const order = await Order.findById(orderId);
                if (!order)
                    return socket.emit("ERROR", { message: "Order not found" });

                chat = await Chat.create({
                    order: orderId,
                    participants: [
                        { user: order.client, roleModel: "Client" },
                        { user: order.freelancer, roleModel: "Freelancer" }
                    ]
                });

            }

            // 3. Permission check
            let participantId = user._id;
            if (socket.userRole === 'Freelancer') {
                const profile = await Profile.findOne({ owner: user._id });
                if (!profile) {
                    return socket.emit("ERROR", { message: "Worker profile not found" });
                }
                participantId = profile._id;
            }
            if (!chat.participants.some(p => p.user.toString() === participantId.toString())) {

                return socket.emit("ERROR", { message: "You are not part of this chat" });
            }

            // 4. Determine sender model + role
            const senderModel = socket.userRole;
            const role = socket.userRole

            // 5. Save message to DB
            const message = await Message.create({
                chat: chat._id,
                sender: user._id,
                senderModel,
                role,
                text: content,
            });

            // 6. Emit to both users
            const receiver = chat.participants.find(p => p.user.toString() !== user._id.toString());
       
            if (!receiver) return;

            let receiverSocketId = null;

            if (receiver.roleModel === "Freelancer") {
                const profile = await Profile.findById(receiver.user);
                if (profile) {
                    receiverSocketId = userSocketIDs.get(profile.owner.toString());
                }
            } else {
                receiverSocketId = userSocketIDs.get(receiver.user.toString());
            }

            const senderSocketId = userSocketIDs.get(user._id.toString());

            const membersSocket = [senderSocketId, receiverSocketId].filter(Boolean);


            const messageForRealTime = {
                _id: message._id,
                text: message.text,
                sender: {
                    _id: user._id,
                    name: user.name,
                },
                role,
                chatId: chat._id,
                sentAt: message.createdAt,
            };

            membersSocket.forEach(socketId => {
                io.to(socketId).emit(NEW_MESSAGE, {
                    chatId: chat._id,
                    message: messageForRealTime,
                });

                io.to(socketId).emit(NEW_MESSAGE_ALERT, {
                    chatId: chat._id,
                });
            });


        } catch (error) {
            socket.emit("ERROR", { message: "Something went wrong!" });
        }
    });

    socket.on("disconnect", () => {
        userSocketIDs.delete(user._id.toString());
    });

});


app.use(errorMiddleware)
server.listen(port, () => {
    console.log(`server is running at http://localhost:${port} in ${envMode} mode`)
})
export {
    envMode, userSocketIDs
};