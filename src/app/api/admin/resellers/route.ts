import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Reseller from '@/models/Reseller';

export async function GET() {
  try {
    await connectDB();
    const resellers = await Reseller.find({})
      .select('fullName email phone photo storeDetails isActive createdAt')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ 
      success: true, 
      resellers 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch resellers'
    }, { status: 500 });
  }
} 