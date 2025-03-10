import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const customerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: {
    street: String,
    landmark: String,
    city: String,
    state: String,
    pinCode: String
  },
  photo: { type: String },
  isActive: { type: Boolean, default: true },
  role: { type: String, default: 'customer' },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving if modified
customerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

export default mongoose.models.Customer || mongoose.model('Customer', customerSchema); 