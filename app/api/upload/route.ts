import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type - Supports PNG, JPEG, JPG, WEBP, and GIF
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const fileExtensionWithDot = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validTypes.includes(file.type) || !validExtensions.includes(fileExtensionWithDot)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only PNG, JPEG, JPG, WEBP, and GIF images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const filename = `${timestamp}-${randomString}.${fileExtension}`;

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'products');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Save file
    const filepath = join(uploadsDir, filename);
    await writeFile(filepath, buffer);

    // Return the URL path
    const imageUrl = `/uploads/products/${filename}`;

    return NextResponse.json({
      success: true,
      data: {
        url: imageUrl,
        filename: filename,
      },
    });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to upload file',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

