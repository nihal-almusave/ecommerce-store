import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import mongoose from 'mongoose';

// GET single order
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    const order = await Order.findById(id).lean();

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PUT update order (mainly for status updates)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;
    const body = await request.json();
    const { status, notes } = body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update status if provided
    if (status) {
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (validStatuses.includes(status)) {
        order.status = status;
      }
    }

    // Update notes if provided
    if (notes !== undefined) {
      order.notes = notes;
    }

    await order.save();

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update order' },
      { status: 500 }
    );
  }
}

