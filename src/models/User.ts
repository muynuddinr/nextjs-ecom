import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide your full name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number'],
  },
  address: {
    street: String,
    landmark: String,
    city: String,
    state: String,
    pinCode: String,
  },
  photo: String,
  role: {
    type: String,
    default: 'customer',
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User; 