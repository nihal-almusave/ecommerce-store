import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import mongoose from 'mongoose';

// GET single category
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    const category = await Category.findById(id).lean();

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    // Get product count
    const productCount = category.products ? category.products.length : 0;

    return NextResponse.json({
      success: true,
      data: {
        ...category,
        productCount,
      },
    });
  } catch (error: any) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PUT update category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;
    const body = await request.json();
    const { name, slug, description, image, status } = body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if name or slug conflicts with another category
    if (name || slug) {
      const existingCategory = await Category.findOne({
        _id: { $ne: id },
        $or: [
          name ? { name } : {},
          slug ? { slug } : {},
        ],
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
    }

    // Update fields
    if (name) {
      category.name = name;
      // Auto-generate slug if name changed and slug not provided
      if (!slug) {
        category.slug = name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
    }
    if (slug) category.slug = slug;
    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (status) category.status = status;

    await category.save();

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating category:', error);

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
      { success: false, error: error.message || 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete category' },
      { status: 500 }
    );
  }
}

