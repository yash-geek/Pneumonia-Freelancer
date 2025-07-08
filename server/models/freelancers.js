import pkg from 'mongoose';
const { Schema, model, models } = pkg;
import { hash } from 'bcrypt';

const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
}, {
    timestamps: true,
});

schema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    this.password = await hash(this.password, 10);
    next();
});

export const FreeLancer = models.FreeLancer || model('FreeLancer', schema);
