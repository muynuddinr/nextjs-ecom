import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const sellerSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: [true, 'Please provide your business name'],
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
  storeDetails: {
    description: String,
    category: String,
    openingTime: String,
    closingTime: String,
  },
  gstNumber: {
    type: String,
    required: [true, 'Please provide GST number'],
  },
  panNumber: {
    type: String,
    required: [true, 'Please provide PAN number'],
  },
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String,
    bankName: String,
  },
  role: {
    type: String,
    default: 'seller',
  }
}, {
  timestamps: true,
});

// Hash password before saving
sellerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const Seller = mongoose.models.Seller || mongoose.model('Seller', sellerSchema);
export default Seller;