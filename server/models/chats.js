import pkg, { Types } from 'mongoose'
const { Schema, model, models } = pkg;
const schema = new Schema({
    orderId: {
        type: Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    participants: [
        {
            role:String,
            type: Types.ObjectId,
            ref: 'Client',
            required: true,
        },
        {
            role:String,
            type: Types.ObjectId,
            ref: 'Freelancer',
            required: true,
        }
    ],
}, {
    timestamps: true,
});

export const Chat = models.Chat || model('Chat', schema);