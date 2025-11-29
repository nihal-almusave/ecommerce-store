import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

// GET all users with order statistics
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '100');
    const page = parseInt(searchParams.get('page') || '1');

    // Build query
    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    // Get total count for pagination
    const total = await User.countDocuments(query);

    // Fetch users with pagination
    const users = await User.find(query)
      .select('-password') // Exclude password from response
      .sort({ createdAt: -1 }) // Newest first
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    // Get order statistics for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        // Count orders for this user
        const orderCount = await Order.countDocuments({
          'customer.email': user.email.toLowerCase(),
        });

        // Calculate total spent from all non-cancelled orders
        const revenueResult = await Order.aggregate([
          {
            $match: {
              'customer.email': user.email.toLowerCase(),
              status: { $in: ['pending', 'processing', 'shipped', 'delivered'] },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$total' },
            },
          },
        ]);

        const totalSpent = revenueResult.length > 0 ? revenueResult[0].total : 0;

        return {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone || 'N/A',
          role: user.role || 'user',
          image: user.image,
          orders: orderCount,
          totalSpent: totalSpent,
          joined: user.createdAt,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: usersWithStats,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

