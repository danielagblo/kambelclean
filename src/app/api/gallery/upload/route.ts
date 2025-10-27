import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const timestamp = Date.now();
    const ext = path.extname(file.name);
    const filename = `image-${timestamp}${ext}`;

    // Save to public/gallery directory
    const publicPath = path.join(process.cwd(), 'public', 'gallery');
    const filePath = path.join(publicPath, filename);

    // Ensure gallery directory exists
    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      filename,
      url: `/gallery/${filename}`,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

