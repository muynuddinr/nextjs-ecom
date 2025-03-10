import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const resellerSchema = new mongoose.Schema({
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
  storeDetails: {
    storeName: String,
    description: String,
    category: String,
    openingTime: String,
    closingTime: String,
    storeAddress: {
      street: String,
      landmark: String,
      city: String,
      state: String,
      pinCode: String
    }
  },
  gstNumber: String,
  panNumber: String,
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String,
    bankName: String,
  },
  role: {
    type: String,
    default: 'reseller',
  }
}, {
  timestamps: true,
});

resellerSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

const Reseller = mongoose.models.Reseller || mongoose.model('Reseller', resellerSchema);
export default Reseller; 