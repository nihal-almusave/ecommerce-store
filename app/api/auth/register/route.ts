import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, email, password, phone } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name, email, and password are required',
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: 'Password must be at least 6 characters long',
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'User with this email already exists',
        },
        { status: 400 }
      );
    }

    // Create new user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || undefined,
      role: 'user',
    });

    await user.save();

    // Return user data without password
    const userData = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    };

    return NextResponse.json(
      {
        success: true,
        data: userData,
        message: 'User registered successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error registering user:', error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: 'User with this email already exists',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to register user',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

