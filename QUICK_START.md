# Quick Start Guide

Get your e-commerce store up and running in minutes!

## 🚀 Quick Setup (5 Steps)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Environment Variables
Copy `.env.example` to `.env.local` and fill in your values:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your MongoDB connection string and API keys.

### Step 3: Start MongoDB
**Option A - Local:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option B - MongoDB Atlas:**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Add to `.env.local`

### Step 4: Run Development Server
```bash
npm run dev
```

### Step 5: Open Browser
Visit http://localhost:3000

## 📋 Checklist

- [ ] Node.js 18+ installed
- [ ] MongoDB running (local or Atlas)
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables configured (`.env.local`)
- [ ] Development server running (`npm run dev`)

## 🎯 Next Steps

1. **Create Database Models** - Set up User, Product, Cart, Order models
2. **Build Authentication** - Implement login/register
3. **Create Product Pages** - Build product catalog
4. **Add Shopping Cart** - Implement cart functionality
5. **Build Checkout** - Create checkout flow
6. **Integrate Payments** - Add Stripe integration

## 📚 Documentation

- **README.md** - Full project documentation
- **PROJECT_SETUP.md** - Detailed setup instructions
- **IMPLEMENTATION_GUIDE.md** - Step-by-step implementation guide

## 🆘 Troubleshooting

### MongoDB Connection Error
- Check if MongoDB is running
- Verify MONGODB_URI in `.env.local`
- Ensure network/firewall allows connection

### Module Not Found
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then reinstall

### Port Already in Use
- Change port: `npm run dev -- -p 3001`
- Or kill process using port 3000

## 💡 Tips

- Use MongoDB Atlas for cloud database (free tier available)
- Start with local development, then deploy to Vercel
- Test API endpoints with Postman or Thunder Client
- Use TypeScript for better code quality

## 🔗 Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/docs/)
- [Stripe Docs](https://stripe.com/docs)

Happy coding! 🎉

