import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

// GET - Fetch all products (only active products for public, all for admin)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';
    const admin = searchParams.get('admin') === 'true';
    const limit = searchParams.get('limit');

    // Build query
    const query: any = {};
    
    // For public access, only show active products
    if (!admin) {
      query.status = 'active';
    } else if (status) {
      query.status = status;
    }

    // Handle category filtering (using old category field on Product)
    if (category) {
      query.category = category;
    }

    // Handle featured products filtering
    if (featured) {
      query.featured = true;
      // For featured products, also ensure they are active
      if (!admin) {
        query.status = 'active';
      }
    }

    let productsQuery = Product.find(query).sort({ createdAt: -1 }); // Newest first
    
    // Apply limit if provided
    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        productsQuery = productsQuery.limit(limitNum);
      }
    }

    const products = await productsQuery.lean();

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// POST - Create a new product
export async function POST(request: NextRequest) {
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

    // Validation
    if (!name || !description || price === undefined || stock === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: name, description, price, and stock are required',
        },
        { status: 400 }
      );
    }

    if (price < 0 || stock < 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Price and stock must be non-negative numbers',
        },
        { status: 400 }
      );
    }

    // Create product
    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : undefined,
      images: images || [],
      sku: sku || undefined,
      stock: parseInt(stock),
      category: category || undefined,
      status: status || 'active',
      featured: featured || false,
    });

    await product.save();

    return NextResponse.json(
      {
        success: true,
        data: product,
        message: 'Product created successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating product:', error);
    
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
        error: 'Failed to create product',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

