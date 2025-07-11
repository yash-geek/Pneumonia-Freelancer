import pkg, { Types } from 'mongoose';
const { Schema, model, models } = pkg;
const schema = new Schema({
    chatId: {
        type: Types.ObjectId,
        ref: 'Chat',
        required: true,
    },
    sender: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
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