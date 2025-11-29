import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  products: mongoose.Types.ObjectId[];
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Create index for better query performance
CategorySchema.index({ slug: 1 });
CategorySchema.index({ status: 1 });

// Auto-generate slug from name before saving
CategorySchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    const name = (this as any).name;
    if (name) {
      (this as any).slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
  }
  next();
});

const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;

