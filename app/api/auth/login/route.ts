import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email and password are required',
        },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email or password',
        },
        { status: 401 }
      );
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email or password',
        },
        { status: 401 }
      );
    }

    // Return user data without password
    const userData = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      image: user.image,
      createdAt: user.createdAt,
    };

    return NextResponse.json({
      success: true,
      data: userData,
      message: 'Login successful',
    });
  } catch (error: any) {
    console.error('Error logging in user:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to login',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

