# E-Commerce Store - Next.js & MongoDB

A modern, full-featured e-commerce store built with Next.js 16, MongoDB, and TypeScript.

## 🚀 Features

- **Product Catalog**: Browse products with categories, filters, and search
- **Shopping Cart**: Add/remove items, update quantities
- **User Authentication**: Secure login/register with JWT or NextAuth
- **Checkout Process**: Complete order flow with payment integration
- **Order Management**: Track orders and order history
- **Admin Panel**: Manage products, orders, and users
- **Responsive Design**: Mobile-first, modern UI

## 📁 Project Structure

```
ecommerce-store/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (shop)/
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── cart/
│   │   │   └── page.tsx
│   │   ├── checkout/
│   │   │   └── page.tsx
│   │   └── orders/
│   │       ├── page.tsx
│   │       └── [id]/
│   │           └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts
│   │   │   └── register/
│   │   │       └── route.ts
│   │   ├── products/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── cart/
│   │   │   └── route.ts
│   │   ├── orders/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   └── categories/
│   │       └── route.ts
│   ├── admin/
│   │   ├── products/
│   │   ├── orders/
│   │   └── users/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib/
│   ├── mongodb.ts
│   ├── auth.ts
│   └── utils.ts
├── models/
│   ├── User.ts
│   ├── Product.ts
│   ├── Cart.ts
│   ├── Order.ts
│   └── Category.ts
├── components/
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductList.tsx
│   │   └── ProductDetails.tsx
│   ├── cart/
│   │   ├── CartItem.tsx
│   │   └── CartSummary.tsx
│   ├── checkout/
│   │   ├── CheckoutForm.tsx
│   │   └── PaymentForm.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navbar.tsx
│   └── ui/
│       └── (shadcn components)
├── public/
│   └── images/
├── .env.local
├── .gitignore
├── next.config.mjs
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/ecommerce
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce

# NextAuth (if using)
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# JWT (if using JWT auth)
JWT_SECRET=your-jwt-secret-key

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run MongoDB

**Local MongoDB:**
```bash
# Install MongoDB locally or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**MongoDB Atlas:**
- Create account at https://www.mongodb.com/cloud/atlas
- Create a cluster
- Get connection string
- Add to `.env.local`

### 4. Run Development Server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Dependencies

### Core Dependencies
- `next`: Next.js framework
- `react`: React library
- `react-dom`: React DOM
- `mongoose`: MongoDB ODM
- `typescript`: TypeScript support

### Authentication
- `next-auth`: Authentication (optional)
- `bcryptjs`: Password hashing
- `jsonwebtoken`: JWT tokens

### UI & Styling
- `tailwindcss`: Utility-first CSS
- `@radix-ui/*`: UI component primitives
- `lucide-react`: Icons
- `clsx`: Conditional classnames

### Forms & Validation
- `react-hook-form`: Form handling
- `zod`: Schema validation
- `@hookform/resolvers`: Form resolvers

### Payments
- `stripe`: Stripe payment integration

## 🗄️ Database Schema

### User Model
```typescript
{
  name: string
  email: string (unique)
  password: string (hashed)
  role: 'user' | 'admin'
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  phone: string
  createdAt: Date
}
```

### Product Model
```typescript
{
  name: string
  description: string
  price: number
  compareAtPrice?: number
  images: string[]
  category: ObjectId (ref: Category)
  stock: number
  sku: string (unique)
  tags: string[]
  featured: boolean
  status: 'active' | 'inactive'
  createdAt: Date
}
```

### Cart Model
```typescript
{
  userId: ObjectId (ref: User)
  items: [{
    productId: ObjectId (ref: Product)
    quantity: number
    price: number
  }]
  total: number
  updatedAt: Date
}
```

### Order Model
```typescript
{
  userId: ObjectId (ref: User)
  items: [{
    productId: ObjectId (ref: Product)
    name: string
    quantity: number
    price: number
  }]
  total: number
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentMethod: string
  paymentStatus: 'pending' | 'paid' | 'failed'
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  orderNumber: string (unique)
  createdAt: Date
}
```

### Category Model
```typescript
{
  name: string
  slug: string (unique)
  description: string
  image: string
  parentCategory: ObjectId (ref: Category) // for subcategories
  createdAt: Date
}
```

## 🔐 Authentication Flow

1. User registers/logs in
2. Server validates credentials
3. JWT token generated and stored in httpOnly cookie
4. Protected routes check for valid token
5. Token refreshed on each request

## 💳 Payment Integration

Using Stripe for payment processing:
1. Create Stripe account
2. Get API keys
3. Implement checkout flow
4. Handle webhooks for payment confirmation

## 🚦 API Endpoints

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/[id]` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart` - Update cart item
- `DELETE /api/cart` - Remove item from cart

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/[id]` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/[id]` - Update order status (admin)

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

## 🎨 UI Components

Using shadcn/ui components:
- Button, Input, Card, Dialog
- Form components
- Navigation components
- Toast notifications

## 📝 Development Roadmap

- [ ] Project setup and configuration
- [ ] MongoDB connection and models
- [ ] Authentication system
- [ ] Product catalog pages
- [ ] Shopping cart functionality
- [ ] Checkout process
- [ ] Order management
- [ ] Admin panel
- [ ] Payment integration
- [ ] Search and filters
- [ ] User profile management
- [ ] Responsive design
- [ ] Testing
- [ ] Deployment

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### MongoDB Atlas
1. Create cluster
2. Get connection string
3. Add to environment variables

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Stripe Documentation](https://stripe.com/docs)

## 📄 License

MIT

