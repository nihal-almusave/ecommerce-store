import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { sendOrderInvoiceEmail } from '@/lib/email';
import mongoose from 'mongoose';

// GET all orders
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const email = searchParams.get('email'); // For user-specific orders
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    // Build query
    const query: any = {};

    // Filter by user email if provided (for user's own orders)
    if (email) {
      query['customer.email'] = email.toLowerCase();
    }

    if (status && status !== 'all') {
      query.status = status.toLowerCase();
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
        { 'customer.firstName': { $regex: search, $options: 'i' } },
        { 'customer.lastName': { $regex: search, $options: 'i' } },
        { 'customer.phone': { $regex: search, $options: 'i' } },
      ];
    }

    // Get total count for pagination
    const total = await Order.countDocuments(query);

    // Fetch orders with pagination
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST create new order
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      customer,
      items,
      subtotal,
      shipping,
      tax,
      total,
      shippingMethod,
      paymentMethod,
      notes,
    } = body;

    // Validation
    if (!customer || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Customer information and items are required' },
        { status: 400 }
      );
    }

    if (!customer.email || !customer.firstName || !customer.phone || !customer.address) {
      return NextResponse.json(
        { success: false, error: 'Missing required customer fields' },
        { status: 400 }
      );
    }

    if (subtotal === undefined || shipping === undefined || total === undefined) {
      return NextResponse.json(
        { success: false, error: 'Subtotal, shipping, and total are required' },
        { status: 400 }
      );
    }

    // Validate and convert product IDs to ObjectId
    const orderItems = items.map((item: any) => {
      // Convert productId string to ObjectId
      let productId: mongoose.Types.ObjectId;
      try {
        productId = new mongoose.Types.ObjectId(item.productId);
      } catch (error) {
        throw new Error(`Invalid product ID: ${item.productId}`);
      }

      // Validate item data
      if (!item.name || item.price === undefined || item.quantity === undefined) {
        throw new Error('Invalid item data: name, price, and quantity are required');
      }

      if (item.price < 0 || item.quantity < 1) {
        throw new Error('Item price must be non-negative and quantity must be at least 1');
      }

      return {
        productId: productId,
        name: item.name,
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity),
        image: item.image || '',
      };
    });

    // Generate order number before creating order
    const OrderModel = mongoose.models.Order || Order;
    const orderCount = await OrderModel.countDocuments();
    const orderNumber = `ORD-${String(orderCount + 1).padStart(6, '0')}`;

    // Create order
    const order = new Order({
      orderNumber: orderNumber,
      customer: {
        email: customer.email.toLowerCase().trim(),
        firstName: customer.firstName.trim(),
        lastName: customer.lastName?.trim() || '',
        phone: customer.phone.trim(),
        address: customer.address.trim(),
        city: customer.city?.trim() || '',
        province: customer.province?.trim() || '',
        zip: customer.zip?.trim() || '',
        country: customer.country?.trim() || 'Bangladesh',
      },
      items: orderItems,
      subtotal: parseFloat(subtotal),
      shipping: parseFloat(shipping),
      tax: parseFloat(tax || 0),
      total: parseFloat(total),
      shippingMethod: shippingMethod || 'inside',
      paymentMethod: paymentMethod || 'cash_on_delivery',
      status: 'pending',
      notes: notes || '',
    });

    await order.save();

    // Send order invoice email to customer
    console.log('Preparing to send invoice email for order:', order.orderNumber);
    try {
      const emailSent = await sendOrderInvoiceEmail({
        orderNumber: order.orderNumber,
        customer: {
          firstName: order.customer.firstName,
          lastName: order.customer.lastName,
          email: order.customer.email,
          phone: order.customer.phone,
          address: order.customer.address,
          city: order.customer.city,
          province: order.customer.province,
          zip: order.customer.zip,
          country: order.customer.country,
        },
        items: order.items.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || '',
        })),
        subtotal: order.subtotal,
        shipping: order.shipping,
        tax: order.tax,
        total: order.total,
        shippingMethod: order.shippingMethod,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt,
      });

      if (!emailSent) {
        console.error('❌ Order created but email could not be sent. Order ID:', order._id);
        console.error('Order Number:', order.orderNumber);
        console.error('Customer Email:', order.customer.email);
        console.error('Please check the email logs above for detailed error information.');
      } else {
        console.log('✅ Invoice email sent successfully for order:', order.orderNumber);
        console.log('Email sent to:', order.customer.email);
      }
    } catch (emailError: any) {
      // Don't fail the order creation if email fails
      console.error('❌ Exception while sending order invoice email:', emailError);
      console.error('Error message:', emailError.message);
      console.error('Error code:', emailError.code);
      console.error('Error response:', emailError.response);
      console.error('Error stack:', emailError.stack);
      console.error('Order ID:', order._id);
      console.error('Order Number:', order.orderNumber);
      console.error('Customer Email:', order.customer.email);
    }

    // Return order data with proper ID format
    const orderResponse = {
      _id: order._id.toString(),
      orderNumber: order.orderNumber,
      customer: order.customer,
      items: order.items,
      subtotal: order.subtotal,
      shipping: order.shipping,
      tax: order.tax,
      total: order.total,
      shippingMethod: order.shippingMethod,
      paymentMethod: order.paymentMethod,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };

    return NextResponse.json(
      {
        success: true,
        data: orderResponse,
        message: 'Order created successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating order:', error);
    console.error('Error stack:', error.stack);
    
    // Return more specific error messages
    let errorMessage = 'Failed to create order';
    let statusCode = 500;

    if (error.message) {
      errorMessage = error.message;
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      statusCode = 400;
      const validationErrors = Object.values(error.errors || {}).map((err: any) => err.message);
      errorMessage = validationErrors.join(', ') || 'Validation error';
    }

    // Handle duplicate key errors (e.g., order number)
    if (error.code === 11000) {
      statusCode = 400;
      errorMessage = 'Order number already exists. Please try again.';
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: statusCode }
    );
  }
}

