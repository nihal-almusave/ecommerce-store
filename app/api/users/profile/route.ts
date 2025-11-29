import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

// GET - Get user profile
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get email from query params or headers
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email is required',
        },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('-password').lean();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        image: user.image,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user profile',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, name, phone } = body;

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email is required',
        },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    // Update fields
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone || undefined;

    await user.save();

    // Return updated user data without password
    const userData = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      image: user.image,
      role: user.role,
      createdAt: user.createdAt,
    };

    return NextResponse.json({
      success: true,
      data: userData,
      message: 'Profile updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update profile',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

