import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Seller from '@/models/Seller';
import Reseller from '@/models/Reseller';
import jwt from 'jsonwebtoken';

export async function PUT(request: Request) {
  try {
    await connectDB();

    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
    }

    // Verify the token
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    // Get the updated user data
    const userData = await request.json();

    // Find the user in all possible collections
    let user = await User.findById(decoded.userId);
    let model = User;

    if (!user) {
      user = await Seller.findById(decoded.userId);
      model = Seller;
    }

    if (!user) {
      user = await Reseller.findById(decoded.userId);
      model = Reseller;
    }

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Update the user
    const updatedUser = await model.findByIdAndUpdate(
      decoded.userId,
      { $set: userData },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        fullName: updatedUser.fullName || updatedUser.businessName,
        phone: updatedUser.phone,
        address: updatedUser.address,
        photo: updatedUser.photo,
        role: updatedUser.role,
        storeDetails: updatedUser.storeDetails
      }
    });

  } catch (error) {
    console.error('Error in update route:', error);
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
} 