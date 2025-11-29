import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Rate limiting store (in production, use Redis or a proper rate limiting service)
const loginAttempts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);

  if (!attempt || now > attempt.resetTime) {
    loginAttempts.set(ip, { count: 1, resetTime: now + 15 * 60 * 1000 }); // 15 minutes
    return true;
  }

  if (attempt.count >= 5) {
    return false; // Blocked
  }

  attempt.count++;
  return true;
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0] || realIP || 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const clientIP = getClientIP(request);
    
    // Rate limiting check
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many login attempts. Please try again in 15 minutes.',
        },
        { status: 429 }
      );
    }

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

    // Find user by email with admin role
    const user = await User.findOne({ 
      email: email.toLowerCase().trim(),
      role: 'admin'
    });

    if (!user) {
      // Don't reveal if user exists or not
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

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not set in environment variables');
      return NextResponse.json(
        {
          success: false,
          error: 'Server configuration error',
        },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: '24h' }
    );

    // Reset rate limit on successful login
    loginAttempts.delete(clientIP);

    // Return user data without password
    const userData = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // Create response with httpOnly cookie
    const response = NextResponse.json({
      success: true,
      data: userData,
      message: 'Login successful',
    });

    // Set httpOnly cookie for token
    response.cookies.set('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Error in admin login:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to login',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

