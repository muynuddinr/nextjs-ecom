import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
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
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64File = `data:${file.type};base64,${buffer.toString('base64')}`;

    try {
      // Upload to Cloudinary with optimizations
      const result = await cloudinary.uploader.upload(base64File, {
        folder: 'ecommerce',
        resource_type: 'auto',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'],
        transformation: [
          { quality: 'auto:best' },
          { fetch_format: 'auto' },
          { flags: 'preserve_transparency' },
          { dpr: 'auto' },
        ],
        max_file_size: 10 * 1024 * 1024 // 10MB limit
      });

      console.log('Cloudinary upload result:', result);

      return NextResponse.json({ 
        success: true,
        url: result.secure_url,
        public_id: result.public_id
      });

    } catch (cloudinaryError) {
      console.error('Cloudinary upload error:', cloudinaryError);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to upload to Cloudinary',
        details: cloudinaryError instanceof Error ? cloudinaryError.message : 'Unknown error'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('File processing error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error processing file upload',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 