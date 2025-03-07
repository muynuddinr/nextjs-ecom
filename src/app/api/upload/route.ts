import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    await writeFile(uploadDir, '').catch(() => {});

    // Create unique filename
    const uniqueFilename = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, uniqueFilename);
    
    await writeFile(filePath, buffer);
    
    return NextResponse.json({ 
      success: true,
      filePath: `/uploads/${uniqueFilename}`
    });
  } catch (error: unknown) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
  }
} 