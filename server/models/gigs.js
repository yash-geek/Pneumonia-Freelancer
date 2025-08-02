import pkg, { Types } from 'mongoose';
const { Schema, model, models } = pkg;

const gigSchema = new Schema({
  creator: {
    type: Types.ObjectId,
    ref: 'Profile',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  deliveryTime: {
    type: Number, // in days
    required: true,
  },
  revisions: {
    type: Number,
    default: 1,
  },
  tags: {
    type: [String],
    index: true,
  },
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
  },
  faq: [
    {
      question: String,
      answer: String,
      askedBy: {
        type: Types.ObjectId,
        ref: 'Client',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  gigImages: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export const Gig = models.Gig || model('Gig', gigSchema);
