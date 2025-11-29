# E-Commerce Store - Complete Setup Guide

This document provides step-by-step instructions to set up and run the e-commerce store.

## Prerequisites

- Node.js 18+ installed
- MongoDB installed locally OR MongoDB Atlas account
- npm, yarn, or pnpm package manager

## Step 1: Initialize Next.js Project

```bash
npx create-next-app@latest ecommerce-store --typescript --tailwind --app --no-src-dir
cd ecommerce-store
```

## Step 2: Install Dependencies

```bash
npm install mongoose bcryptjs jsonwebtoken stripe zod react-hook-form @hookform/resolvers
npm install -D @types/bcryptjs @types/jsonwebtoken
```

## Step 3: MongoDB Setup

### Option A: Local MongoDB

1. Install MongoDB locally or use Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

2. Connection string: `mongodb://localhost:27017/ecommerce`

### Option B: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Create database user
5. Whitelist your IP address
6. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/ecommerce`

## Step 4: Environment Variables

Create `.env.local` file:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000

# Stripe (Get from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 5: Project Structure

Create the following directories:

```bash
mkdir -p app/api/{auth,products,cart,orders,categories}
mkdir -p app/{login,register,products,cart,checkout,orders,admin}
mkdir -p lib models components/{product,cart,checkout,layout,ui}
mkdir -p public/images
```

## Step 6: Core Files to Create

### 1. MongoDB Connection (`lib/mongodb.ts`)
### 2. Models (`models/*.ts`)
### 3. API Routes (`app/api/**/route.ts`)
### 4. Pages (`app/**/page.tsx`)
### 5. Components (`components/**/*.tsx`)

## Step 7: Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Step 8: Seed Database (Optional)

Create a seed script to populate initial data:

```typescript
// scripts/seed.ts
import connectDB from '../lib/mongodb';
import Product from '../models/Product';
import Category from '../models/Category';

async function seed() {
  await connectDB();
  
  // Create categories
  const categories = await Category.insertMany([
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Clothing', slug: 'clothing' },
    { name: 'Books', slug: 'books' },
  ]);
  
  // Create products
  await Product.insertMany([
    {
      name: 'Laptop',
      description: 'High-performance laptop',
      price: 999.99,
      category: categories[0]._id,
      stock: 10,
      sku: 'LAP-001',
      images: ['/images/laptop.jpg'],
    },
    // Add more products...
  ]);
  
  console.log('Database seeded successfully!');
  process.exit(0);
}

seed();
```

Run with: `ts-node scripts/seed.ts`

## Testing the Setup

1. **Test MongoDB Connection:**
   - Create a test API route that connects to MongoDB
   - Check if connection is successful

2. **Test API Endpoints:**
   - Use Postman or curl to test API routes
   - Verify responses

3. **Test Frontend:**
   - Navigate to pages
   - Check if components render correctly

## Common Issues & Solutions

### Issue: MongoDB Connection Failed
- **Solution**: Check MONGODB_URI in .env.local
- Verify MongoDB is running
- Check network/firewall settings

### Issue: Module Not Found
- **Solution**: Run `npm install` again
- Check if all dependencies are in package.json

### Issue: TypeScript Errors
- **Solution**: Run `npm run build` to check for type errors
- Ensure all types are properly imported

## Next Steps

1. Implement authentication
2. Create product pages
3. Build shopping cart
4. Add checkout flow
5. Integrate payments
6. Create admin panel

## Production Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Update `.env.local` with production values:
- MongoDB Atlas connection string
- Production Stripe keys
- Secure JWT secret
- Production app URL

## Security Checklist

- [ ] Use environment variables for secrets
- [ ] Hash passwords with bcrypt
- [ ] Validate all user inputs
- [ ] Use HTTPS in production
- [ ] Implement rate limiting
- [ ] Sanitize user inputs
- [ ] Use httpOnly cookies for tokens
- [ ] Implement CSRF protection

