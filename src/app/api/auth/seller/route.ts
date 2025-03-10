import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Seller from '@/models/Seller';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { action, ...sellerData } = body;

    if (action === 'signup') {
      try {
        // Check if seller already exists
        const existingSeller = await Seller.findOne({ email: sellerData.email });
        if (existingSeller) {
          return NextResponse.json({ 
            success: false, 
            message: 'Email already registered' 
          }, { status: 400 });
        }

        // Validate required fields
        if (!sellerData.phone) {
          return NextResponse.json({ 
            success: false, 
            message: 'Phone number is required' 
          }, { status: 400 });
        }

        // Create new seller
        const seller = await Seller.create(sellerData);
        const token = jwt.sign({ userId: seller._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
        
        return NextResponse.json({ 
          success: true, 
          token,
          user: {
            id: seller._id,
            email: seller.email,
            businessName: seller.businessName,
            phone: seller.phone,
            address: seller.address,
            photo: seller.photo,
            role: seller.role,
            storeDetails: seller.storeDetails
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
      const seller = await Seller.findOne({ email: sellerData.email });
      if (!seller || !(await bcrypt.compare(sellerData.password, seller.password))) {
        return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
      }

      const token = jwt.sign({ userId: seller._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
      
      return NextResponse.json({ 
        success: true, 
        token,
        user: {
          id: seller._id,
          email: seller.email,
          businessName: seller.businessName,
          phone: seller.phone,
          address: seller.address,
          photo: seller.photo,
          role: seller.role,
          storeDetails: seller.storeDetails
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