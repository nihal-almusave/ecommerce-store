import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('adminToken')?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'No authentication token',
        },
        { status: 401 }
      );
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json(
        {
          success: false,
          error: 'Server configuration error',
        },
        { status: 500 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, jwtSecret) as {
      userId: string;
      email: string;
      role: string;
    };

    // Verify user still exists and is admin
    await connectDB();
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid or expired token',
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid or expired token',
        },
        { status: 401 }
      );
    }

    console.error('Error verifying admin token:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to verify token',
      },
      { status: 500 }
    );
  }
}

