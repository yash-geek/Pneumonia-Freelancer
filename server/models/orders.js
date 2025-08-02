import pkg, { Types } from 'mongoose';
const { Schema, model, models } = pkg;
const schema = new Schema({
  status: {
    type: String,
    enum: ['pending', 'in progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  orderID: {
    type: String,
    required: true,
    unique: true,
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid',
  },
  price: {
    type: Number,
    default: 0,
  },
  giveRating: {
    type: Number,
    min: 0,
    max: 5,
    default:null
  },
  client: {
    type: Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  freelancer: {
    type: Types.ObjectId,
    ref: 'Profile',
    required: true,
  },
  gig: {
    type: Types.ObjectId,
    ref: 'Gig',
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

export const Order = models.Order || model('Order', schema);