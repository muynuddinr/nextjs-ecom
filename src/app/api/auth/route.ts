import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { APIError } from '@/types/api';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { action, ...userData } = body;

    if (action === 'signup') {
      const user = await User.create(userData);
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
      
      return NextResponse.json({ 
        success: true, 
        token,
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          phone: user.phone,
          address: user.address,
          photo: user.photo,
          role: user.role
        }
      });
    } 
    
    else if (action === 'login') {
      const user = await User.findOne({ email: userData.email });
      if (!user || !(await bcrypt.compare(userData.password, user.password))) {
        return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
      
      return NextResponse.json({ 
        success: true, 
        token,
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          phone: user.phone,
          address: user.address,
          photo: user.photo,
          role: user.role
        }
      });
    }

  } catch (error) {
    if (error instanceof APIError) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.status });
    }
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
} 