import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  customer: {
    email: string;
    firstName: string;
    lastName?: string;
    phone: string;
    address: string;
    city?: string;
    province?: string;
    zip?: string;
    country: string;
  };
  items: IOrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingMethod: 'inside' | 'outside';
  paymentMethod: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema: Schema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  image: {
    type: String,
  },
});

const OrderSchema: Schema = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      email: {
        type: String,
        required: true,
      },
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
      },
      province: {
        type: String,
      },
      zip: {
        type: String,
      },
      country: {
        type: String,
        required: true,
        default: 'Bangladesh',
      },
    },
    items: [OrderItemSchema],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shipping: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingMethod: {
      type: String,
      enum: ['inside', 'outside'],
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      default: 'cash_on_delivery',
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for better query performance
// Note: orderNumber already has unique: true which creates an index, so we don't need to add it again
OrderSchema.index({ 'customer.email': 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

// Generate unique order number before saving
OrderSchema.pre('save', async function (next) {
  if (!this.isNew || this.orderNumber) {
    return next();
  }

  try {
    // Get the count of existing orders to generate unique order number
    const OrderModel = mongoose.models.Order || Order;
    const count = await OrderModel.countDocuments();
    this.orderNumber = `ORD-${String(count + 1).padStart(6, '0')}`;
    next();
  } catch (error: any) {
    next(error);
  }
});

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;

