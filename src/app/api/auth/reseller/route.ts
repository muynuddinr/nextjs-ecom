import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Reseller from '@/models/Reseller';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { action, ...resellerData } = body;

    if (action === 'signup') {
      try {
        const existingReseller = await Reseller.findOne({ email: resellerData.email });
        if (existingReseller) {
          return NextResponse.json({ 
            success: false, 
            message: 'Email already registered' 
          }, { status: 400 });
        }

        console.log('Attempting to create reseller with data:', resellerData);
        const reseller = await Reseller.create(resellerData);
        console.log('Reseller created:', reseller);

        const token = jwt.sign({ userId: reseller._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
        
        return NextResponse.json({ 
          success: true, 
          token,
          user: {
            id: reseller._id,
            email: reseller.email,
            fullName: reseller.fullName,
            phone: reseller.phone,
            address: reseller.address,
            photo: reseller.photo,
            role: reseller.role,
            storeDetails: reseller.storeDetails
          }
        });
      } catch (error) {
        console.error('Error during signup:', error);
        return NextResponse.json({ 
          success: false, 
          message: error instanceof Error ? error.message : 'Error during signup'
        }, { status: 500 });
      }
    } 
    
    else if (action === 'login') {
      const reseller = await Reseller.findOne({ email: resellerData.email });
      if (!reseller || !(await bcrypt.compare(resellerData.password, reseller.password))) {
        return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
      }

      const token = jwt.sign({ userId: reseller._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
      
      return NextResponse.json({ 
        success: true, 
        token,
        user: {
          id: reseller._id,
          email: reseller.email,
          fullName: reseller.fullName,
          phone: reseller.phone,
          address: reseller.address,
          photo: reseller.photo,
          role: reseller.role,
          storeDetails: reseller.storeDetails
        }
      });
    }

  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
} 