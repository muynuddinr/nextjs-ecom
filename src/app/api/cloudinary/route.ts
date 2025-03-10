import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const oldImageUrl = formData.get('oldImageUrl') as string;
    
    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    // Delete old image if it exists
    if (oldImageUrl) {
      try {
        const publicId = oldImageUrl.split('/').pop()?.split('.')[0];
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (error) {
        console.error('Error deleting old image:', error);
      }
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64String = buffer.toString('base64');
    const fileStr = `data:${file.type};base64,${base64String}`;

    // Upload to Cloudinary with minimal restrictions
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      resource_type: 'auto',
      transformation: [{
        quality: 'auto',
        fetch_format: 'auto'
      }]
    });

    return NextResponse.json({
      success: true,
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id
    });

  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    if (error instanceof Error) {
      return NextResponse.json({ 
        success: false, 
        message: error.message 
      }, { status: 500 });
    }
    return NextResponse.json({ 
      success: false, 
      message: 'Error uploading file' 
    }, { status: 500 });
  }
}