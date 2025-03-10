// Similar to resellers route but for customers 
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({ role: 'customer' })
      .select('fullName email phone address photo isActive createdAt')
      .sort({ createdAt: -1 });

    return NextResponse.json({ 
      success: true, 
      customers: users 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch users'
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const { id, isActive } = await request.json();

    const user = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      customer: user 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update user'
    }, { status: 500 });
  }
} 