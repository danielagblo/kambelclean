import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Disable caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const publicPath = path.join(process.cwd(), 'public', 'gallery');
    
    // Create gallery directory if it doesn't exist
    if (!fs.existsSync(publicPath)) {
      fs.mkdirSync(publicPath, { recursive: true });
    }

    const files = fs.readdirSync(publicPath);
    const images = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map((filename, index) => ({
        id: index + 1,
        filename,
        url: `/gallery/${filename}`,
        uploadedAt: fs.statSync(path.join(publicPath, filename)).mtime.toISOString(),
        type: 'carousel' as const,
      }));

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error reading gallery:', error);
    return NextResponse.json(
      { error: 'Failed to load images' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const filename = searchParams.get('filename');

    if (!id || !filename) {
      return NextResponse.json(
        { error: 'Missing id or filename' },
        { status: 400 }
      );
    }

    const publicPath = path.join(process.cwd(), 'public', 'gallery', filename);
    
    if (fs.existsSync(publicPath)) {
      fs.unlinkSync(publicPath);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}

