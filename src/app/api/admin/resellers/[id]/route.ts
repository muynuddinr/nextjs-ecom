import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Reseller from '@/models/Reseller';

interface Params {
  id: string;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    await connectDB();
    const { id } = params;
    const body = await req.json();

    const updatedReseller = await Reseller.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    if (!updatedReseller) {
      return NextResponse.json(
        { success: false, message: 'Reseller not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, reseller: updatedReseller });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to update reseller' },
      { status: 500 }
    );
  }
}