import mongoose from 'mongoose';

const navigationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
  },
  path: {
    type: String,
    required: [true, 'Please provide a path'],
    unique: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true,
});

export default mongoose.models.Navigation || mongoose.model('Navigation', navigationSchema); 