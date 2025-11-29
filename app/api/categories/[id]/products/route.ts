import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';
import mongoose from 'mongoose';

// GET products in a category
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

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    const productIds = category.products || [];
    let products: any[] = [];

    if (productIds.length > 0) {
      products = await Product.find({
        _id: { $in: productIds },
      })
        .select('name price images stock status')
        .lean();
      
      // Ensure _id is properly formatted as string
      products = products.map((p: any) => ({
        ...p,
        _id: p._id.toString(),
      }));
    }

    return NextResponse.json({
      success: true,
      data: {
        category: {
          _id: category._id.toString(),
          name: category.name,
          slug: category.slug,
        },
        products,
        productCount: products.length,
      },
    });
  } catch (error: any) {
    console.error('Error fetching category products:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch category products' },
      { status: 500 }
    );
  }
}

// POST add products to category
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;
    const body = await request.json();
    const { productIds } = body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Product IDs array is required' },
        { status: 400 }
      );
    }

    // Validate all product IDs
    const validProductIds = productIds.filter((pid: string) =>
      mongoose.Types.ObjectId.isValid(pid)
    );

    if (validProductIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid product IDs provided' },
        { status: 400 }
      );
    }

    // Check if products exist
    const existingProducts = await Product.find({
      _id: { $in: validProductIds },
    });

    if (existingProducts.length !== validProductIds.length) {
      return NextResponse.json(
        { success: false, error: 'Some products not found' },
        { status: 404 }
      );
    }

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    // Add products to category (avoid duplicates)
    const objectIds = validProductIds.map((pid: string) => new mongoose.Types.ObjectId(pid));
    const existingProductIds = (category.products || []).map((p: any) => p.toString());
    const newProductIds = objectIds.map((id: mongoose.Types.ObjectId) => id.toString());
    const allProductIds = [...existingProductIds, ...newProductIds];
    const uniqueProductIds = Array.from(new Set(allProductIds));

    category.products = uniqueProductIds
      .filter((pid: string) => mongoose.Types.ObjectId.isValid(pid))
      .map((pid: string) => new mongoose.Types.ObjectId(pid));

    category.markModified('products');
    await category.save();

    // Fetch updated category with products
    const updatedCategory = await Category.findById(id);
    if (!updatedCategory) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch updated category' },
        { status: 500 }
      );
    }

    const categoryProductIds = updatedCategory.products || [];
    let categoryProducts: any[] = [];

    if (categoryProductIds.length > 0) {
      categoryProducts = await Product.find({
        _id: { $in: categoryProductIds },
      })
        .select('name price images stock status')
        .lean();
      
      // Ensure _id is properly formatted as string
      categoryProducts = categoryProducts.map((p: any) => ({
        ...p,
        _id: p._id.toString(),
      }));
    }

    return NextResponse.json({
      success: true,
      data: {
        _id: updatedCategory._id.toString(),
        name: updatedCategory.name,
        slug: updatedCategory.slug,
        products: categoryProducts,
        productCount: categoryProductIds.length,
      },
    });
  } catch (error: any) {
    console.error('Error adding products to category:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to add products to category' },
      { status: 500 }
    );
  }
}

// DELETE remove products from category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;
    const { searchParams } = new URL(request.url);
    const productIdsParam = searchParams.get('productIds');

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    if (!productIdsParam) {
      return NextResponse.json(
        { success: false, error: 'Product IDs are required' },
        { status: 400 }
      );
    }

    const productIds = Array.isArray(productIdsParam)
      ? productIdsParam
      : productIdsParam.split(',').filter((pid) => pid.trim());

    if (productIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No product IDs provided' },
        { status: 400 }
      );
    }

    // Validate all product IDs
    const validProductIds = productIds.filter((pid: string) =>
      mongoose.Types.ObjectId.isValid(pid.trim())
    );

    if (validProductIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid product IDs provided' },
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

    // Remove products from category
    const objectIds = validProductIds.map((pid: string) => new mongoose.Types.ObjectId(pid.trim()));
    category.products = (category.products || []).filter(
      (pid: any) => !objectIds.some((oid) => oid.toString() === pid.toString())
    );

    category.markModified('products');
    await category.save();

    // Fetch updated category with products
    const updatedCategory = await Category.findById(id);
    if (!updatedCategory) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch updated category' },
        { status: 500 }
      );
    }

    const categoryProductIds = updatedCategory.products || [];
    let categoryProducts: any[] = [];

    if (categoryProductIds.length > 0) {
      categoryProducts = await Product.find({
        _id: { $in: categoryProductIds },
      })
        .select('name price images stock status')
        .lean();
      
      // Ensure _id is properly formatted as string
      categoryProducts = categoryProducts.map((p: any) => ({
        ...p,
        _id: p._id.toString(),
      }));
    }

    return NextResponse.json({
      success: true,
      data: {
        _id: updatedCategory._id.toString(),
        name: updatedCategory.name,
        slug: updatedCategory.slug,
        products: categoryProducts,
        productCount: categoryProductIds.length,
      },
    });
  } catch (error: any) {
    console.error('Error removing products from category:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to remove products from category' },
      { status: 500 }
    );
  }
}
