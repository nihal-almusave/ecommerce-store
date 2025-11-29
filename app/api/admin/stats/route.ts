import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import { verifyAdminToken } from '@/lib/admin-auth';

// GET dashboard statistics
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get total products count
    const totalProducts = await Product.countDocuments({});

    // Get active products count
    const activeProducts = await Product.countDocuments({ status: 'active' });

    // Get inactive products count
    const inactiveProducts = await Product.countDocuments({ status: 'inactive' });

    // Get out of stock products count
    const outOfStockProducts = await Product.countDocuments({ stock: 0 });

    // Get products with low stock (less than 10)
    const lowStockProducts = await Product.countDocuments({ 
      stock: { $gt: 0, $lt: 10 } 
    });

    // Get featured products count
    const featuredProductsCount = await Product.countDocuments({ featured: true });

    // Get order statistics
    const totalOrders = await Order.countDocuments({});
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const processingOrders = await Order.countDocuments({ status: 'processing' });
    const shippedOrders = await Order.countDocuments({ status: 'shipped' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });

    // Calculate total revenue from all non-cancelled orders
    // This includes pending, processing, shipped, and delivered orders
    let totalRevenue = 0;
    let deliveredRevenue = 0;
    
    try {
      const revenueResult = await Order.aggregate([
        { 
          $match: { 
            status: { $in: ['pending', 'processing', 'shipped', 'delivered'] } 
          } 
        },
        { 
          $group: { 
            _id: null, 
            total: { $sum: '$total' }
          } 
        }
      ]);
      
      totalRevenue = revenueResult.length > 0 ? (revenueResult[0].total || 0) : 0;
      
      // Also calculate revenue from delivered orders only
      const deliveredRevenueResult = await Order.aggregate([
        { $match: { status: 'delivered' } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]);
      
      deliveredRevenue = deliveredRevenueResult.length > 0 ? (deliveredRevenueResult[0].total || 0) : 0;
      
      console.log('Revenue calculation:', {
        totalRevenue,
        deliveredRevenue,
        totalOrders,
        deliveredOrders: deliveredOrders
      });
    } catch (revenueError: any) {
      console.error('Error calculating revenue:', revenueError);
      // Fallback: calculate manually if aggregation fails
      try {
        const allOrders = await Order.find({ 
          status: { $in: ['pending', 'processing', 'shipped', 'delivered'] } 
        }).select('total');
        totalRevenue = allOrders.reduce((sum, order) => sum + (order.total || 0), 0);
        
        const deliveredOrdersList = await Order.find({ status: 'delivered' }).select('total');
        deliveredRevenue = deliveredOrdersList.reduce((sum, order) => sum + (order.total || 0), 0);
      } catch (fallbackError: any) {
        console.error('Fallback revenue calculation also failed:', fallbackError);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        products: {
          total: totalProducts,
          active: activeProducts,
          inactive: inactiveProducts,
          outOfStock: outOfStockProducts,
          lowStock: lowStockProducts,
          featured: featuredProductsCount,
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          processing: processingOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders,
          cancelled: cancelledOrders,
          revenue: totalRevenue, // Total revenue from all non-cancelled orders
          deliveredRevenue: deliveredRevenue, // Revenue from delivered orders only
        },
      },
    });
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
