import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export interface AdminUser {
  _id: string;
  email: string;
  name: string;
  role: 'admin';
}

export async function verifyAdminToken(request: NextRequest): Promise<AdminUser | null> {
  try {
    const token = request.cookies.get('adminToken')?.value;

    if (!token) {
      return null;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not set');
      return null;
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
      return null;
    }

    return {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: 'admin',
    };
  } catch (error) {
    return null;
  }
}

