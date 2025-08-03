import pkg, { Types } from 'mongoose';
const { Schema, model, models } = pkg;
const schema = new Schema({
    chat: {
        type: Types.ObjectId,
        ref: 'Chat',
        required: true,
    },
    sender: {
        type: Types.ObjectId,
        required: true,
        refPath: 'senderModel',
    },
    senderModel: {
        type: String,
        required: true,
        enum: ['Client', 'Freelancer'],
        // Assuming 'Profile' is your Freelancer model
    },
    role: {
        type: String,
        required: true,
        enum: ['Client', 'Freelancer'],
    },
    text: {
        type: String,
        required: true,
    },
    sentAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

export const Message = models.Message || model('Message', schema);
