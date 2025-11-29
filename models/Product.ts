import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  sku?: string;
  stock: number;
  category?: string;
  featured?: boolean;
  status: 'active' | 'inactive' | 'out_of_stock';
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    compareAtPrice: {
      type: Number,
      min: 0,
    },
    images: {
      type: [String],
      default: [],
    },
    sku: {
      type: String,
      trim: true,
      sparse: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    category: {
      type: String,
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'out_of_stock'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Create index for better query performance
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ status: 1 });
ProductSchema.index({ category: 1 });

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;

