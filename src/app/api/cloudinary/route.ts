import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

console.log('Cloudinary config check:', {
  hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
  hasApiKey: !!process.env.CLOUDINARY_API_KEY,
  hasApiSecret: !!process.env.CLOUDINARY_API_SECRET
});

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error('Missing Cloudinary credentials');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const oldImageUrl = formData.get('oldImageUrl') as string;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 8000 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64File = `data:${file.type};base64,${buffer.toString('base64')}`;

    try {
      // Generate a unique filename using timestamp and random string
      const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2)}`;

      const result = await cloudinary.uploader.upload(base64File, {
        folder: 'ecommerce_profiles',
        public_id: uniqueFilename,
        resource_type: 'auto',
        transformation: [
          { width: 500, height: 500, crop: 'fill' },
          { quality: 'auto' }
        ],
        overwrite: false
      });

      // If upload successful and there's an old image, delete it
      if (oldImageUrl) {
        try {
          const oldPublicId = oldImageUrl.split('/').slice(-1)[0].split('.')[0];
          if (oldPublicId) {
            await cloudinary.uploader.destroy(`ecommerce_profiles/${oldPublicId}`);
          }
        } catch (deleteError) {
          console.error('Error deleting old image:', deleteError);
          // Continue execution even if delete fails
        }
      }

      return NextResponse.json({ 
        success: true,
        url: result.secure_url,
        public_id: result.public_id
      });

    } catch (cloudinaryError) {
      console.error('Cloudinary upload error:', cloudinaryError);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to upload to Cloudinary'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('File processing error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error processing file upload'
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { public_id } = await request.json();
    
    if (!public_id) {
      return NextResponse.json({ error: 'No image ID provided' }, { status: 400 });
    }

    const result = await cloudinary.uploader.destroy(public_id);
    
    return NextResponse.json({ 
      success: true,
      result 
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete image' 
    }, { status: 500 });
  }
} 