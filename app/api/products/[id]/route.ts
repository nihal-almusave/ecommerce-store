import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

// GET - Fetch a single product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const product = await Product.findById(params.id).lean();

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch product',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT - Update a product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      name,
      description,
      price,
      compareAtPrice,
      images,
      sku,
      stock,
      category,
      status,
      featured,
    } = body;

    // Find product
    const product = await Product.findById(params.id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 }
      );
    }

    // Validation
    if (price !== undefined && price < 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Price must be a non-negative number',
        },
        { status: 400 }
      );
    }

    if (stock !== undefined && stock < 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Stock must be a non-negative number',
        },
        { status: 400 }
      );
    }

    // Update product fields
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = parseFloat(price);
    if (compareAtPrice !== undefined) {
      product.compareAtPrice = compareAtPrice ? parseFloat(compareAtPrice) : undefined;
    }
    if (images !== undefined) product.images = images;
    if (sku !== undefined) product.sku = sku || undefined;
    if (stock !== undefined) product.stock = parseInt(stock);
    if (category !== undefined) product.category = category || undefined;
    if (status !== undefined) product.status = status;
    if (featured !== undefined) product.featured = featured;

    await product.save();

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating product:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product with this SKU already exists',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update product',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const product = await Product.findByIdAndDelete(params.id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete product',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

