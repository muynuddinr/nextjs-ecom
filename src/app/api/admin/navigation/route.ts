import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Navigation from '@/models/Navigation';

export async function GET() {
  try {
    await connectDB();
    const items = await Navigation.find({ isActive: true }).sort('order');
    return NextResponse.json({ success: true, items });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch navigation items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const item = await Navigation.create(data);
    return NextResponse.json({ success: true, item });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create navigation item' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const { _id, ...updateData } = data;
    const item = await Navigation.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json({ success: true, item });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update navigation item' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    await connectDB();
    await Navigation.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete navigation item' }, { status: 500 });
  }
} 