import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Reseller from '@/models/Reseller';

export async function GET() {
  try {
    await connectDB();
    const resellers = await Reseller.find({})
      .select('fullName email phone storeDetails isActive createdAt')
      .sort({ createdAt: -1 });

    return NextResponse.json({ 
      success: true, 
      resellers 
    });
  } catch (error: unknown) {
    const mongoError = error as Error;
    return NextResponse.json({ 
      success: false, 
      error: mongoError.message 
    }, { status: 500 });
  }
} 