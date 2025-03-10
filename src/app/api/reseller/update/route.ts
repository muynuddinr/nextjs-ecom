import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Reseller from '@/models/Reseller';
import jwt from 'jsonwebtoken';

export async function PUT(request: Request) {
  try {
    await connectDB();

    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const updates = await request.json();

    const reseller = await Reseller.findByIdAndUpdate(
      decoded.userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!reseller) {
      return NextResponse.json({ success: false, message: 'Reseller not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: reseller._id,
        email: reseller.email,
        fullName: reseller.fullName,
        phone: reseller.phone,
        address: reseller.address,
        photo: reseller.photo,
        role: reseller.role,
        storeDetails: reseller.storeDetails,
        bankDetails: reseller.bankDetails,
        gstNumber: reseller.gstNumber,
        panNumber: reseller.panNumber
      }
    });
  } catch (error) {
    console.error('Error updating reseller:', error);
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Error updating profile'
    }, { status: 500 });
  }
} 