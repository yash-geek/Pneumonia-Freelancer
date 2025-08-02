import pkg, { Types } from 'mongoose';
const { Schema, model, models } = pkg;
import { hash } from 'bcrypt';

const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    picture: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    bio: {
        type: String
    },
    owner: {
        type: Types.ObjectId,
        ref: "Freelancer",
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    contact: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        required: true,
    },
    skills: [{
        type: String,
        required: true,
    }],
    rating: {
        average: { type: Number, default: 0, min: 0, max: 5 },
        count: { type: Number, default: 0 },
    },
}, {
    timestamps: true,
});

export const Profile = models.Profile || model('Profile', schema);
