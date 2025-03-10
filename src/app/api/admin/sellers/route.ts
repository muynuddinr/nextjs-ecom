// Similar to resellers route but for sellers 
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Seller from '@/models/Seller';

export async function GET() {
  try {
    await connectDB();
    const sellers = await Seller.find({})
      .select('businessName email phone storeDetails isActive createdAt')
      .sort({ createdAt: -1 });

    return NextResponse.json({ 
      success: true, 
      sellers 
    });
  } catch (error: unknown) {
    const mongoError = error as Error;
    return NextResponse.json({ 
      success: false, 
      error: mongoError.message 
    }, { status: 500 });
  }
} 