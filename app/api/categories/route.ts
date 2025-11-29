import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';

// GET all categories
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const query: any = {};
    if (status) {
      query.status = status;
    }

    const categories = await Category.find(query)
      .sort({ createdAt: -1 })
      .lean();

    // Add product count to each category
    const categoriesWithCount = categories.map((category: any) => ({
      ...category,
      productCount: category.products ? category.products.length : 0,
    }));

    return NextResponse.json({
      success: true,
      data: categoriesWithCount,
      count: categoriesWithCount.length,
    });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch categories',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// POST create new category
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, slug, description, image, status } = body;

    // Validation
    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category name is required',
        },
        { status: 400 }
      );
    }

    // Auto-generate slug if not provided
    let categorySlug = slug;
    if (!categorySlug) {
      categorySlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Check if category with same name or slug exists
    const existingCategory = await Category.findOne({
      $or: [{ name }, { slug: categorySlug }],
    });

    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category with this name or slug already exists',
        },
        { status: 400 }
      );
    }

    // Create category
    const category = new Category({
      name,
      slug: categorySlug,
      description: description || '',
      image: image || '',
      status: status || 'active',
    });

    await category.save();

    return NextResponse.json(
      {
        success: true,
        data: category,
        message: 'Category created successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating category:', error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category with this name or slug already exists',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create category',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

