import pkg, { Types } from 'mongoose'
const { Schema, model, models } = pkg;
const schema = new Schema({
    order: {
        type: Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    participants: [{
        user: {
            type: Types.ObjectId,
            required: true,
            refPath: 'participants.roleModel'
        },
        roleModel: {
            type: String,
            required: true,
            enum: ['Client', 'Freelancer'],
        },
    }]
    ,
}, {
    timestamps: true,
});

export const Chat = models.Chat || model('Chat', schema);