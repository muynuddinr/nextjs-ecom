import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Seller from '@/models/Seller';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;
    const body = await request.json();

    const updatedSeller = await Seller.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    if (!updatedSeller) {
      return NextResponse.json(
        { success: false, message: 'Seller not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, seller: updatedSeller });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to update seller' },
      { status: 500 }
    );
  }
} 