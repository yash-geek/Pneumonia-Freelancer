import mongoose from "mongoose"
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import { v4 as uuid } from 'uuid'
import { getBase64 } from "./helper.js"
const isProduction = process.env.NODE_ENV === "PRODUCTION";

const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: isProduction ? "none" : "lax",
    httpOnly: true,
    secure: isProduction,
};

const connectDB = async (uri) => {
    try {
        // Validate URI exists
        if (!uri) {
            throw new Error('MongoDB URI is required');
        }

        // Debug log (remove in production)
        console.log('Attempting to connect to MongoDB...');

        // Connection options
        const options = {
            dbName: 'Pneumonia',
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            serverSelectionTimeoutMS: 5000
        };


        // Attempt connection
        const connection = await mongoose.connect(uri, options);

        console.log(`✅ MongoDB Connected: ${connection.connection.host}`);
        console.log(`📁 Database: ${connection.connection.name}`);

        // Connection event listeners
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to DB');
        });

        mongoose.connection.on('error', (err) => {
            console.error('Mongoose connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('Mongoose disconnected from DB');
        });

        // Return the connection
        return connection;
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);

        // More specific error handling
        if (err.name === 'MongooseServerSelectionError') {
            console.error('This usually indicates:');
            console.error('1. IP not whitelisted in Atlas');
            console.error('2. Incorrect credentials');
            console.error('3. Network connectivity issues');
        }

        // Exit process with failure
        process.exit(1);
    }
};

// Graceful shutdown handler
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Mongoose connection closed due to app termination');
    process.exit(0);
});

const sendToken = (res, user, code, message, role) => {
    const token = jwt.sign(
        { _id: user._id, role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    const cookieName = role === 'client'
        ? 'pneumonia-client-token'
        : 'pneumonia-worker-token';

    return res
        .status(code)
        .cookie(cookieName, token, cookieOptions)
        .json({
            success: true,
            user,
            role,
            message,
        });
};


// controllers/common.js





const emitEvent = (req, event, users, data) => {
    let io = req.app.get('io');
    const userSocket = getSockets(users)
    io.to(userSocket).emit(event, data);
}
const uploadFilesToCloudinary = async (files) => {
    const uploadPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
                getBase64(file),
                {
                    folder: 'pneumonia',
                    resource_type: 'auto',
                    public_id: uuid(),
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    });

    try {
        const results = await Promise.all(uploadPromises);
        const formattedResults = results.map((result) => ({
            public_id: result.public_id,
            url: result.secure_url,
        }));
        return formattedResults;
    } catch (error) {
        throw new Error("Error uploading files to cloudinary", error);
    }
};
const deleteFilesFromCloudinary = async (public_ids) => {


}

export {
    connectDB,
    sendToken,
    cookieOptions,

    emitEvent,
    // deleteFilesFromCloudinary,
    uploadFilesToCloudinary,

}