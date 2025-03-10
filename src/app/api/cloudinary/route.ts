import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileStr = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: 'reseller_photos',
    });

    return NextResponse.json({
      success: true,
      url: uploadResponse.secure_url
    });

  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return NextResponse.json({ success: false, message: 'Error uploading file' }, { status: 500 });
  }
}