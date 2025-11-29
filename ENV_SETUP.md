# Environment Variables Setup Guide

## ✅ Environment File Created

The `.env.local` file has been created in your project root. This file contains all the necessary environment variables for your e-commerce store.

## 🔐 Generated Secure Secrets

I've generated secure random secrets for you. Update your `.env.local` file with these values:

**JWT_SECRET:**
```
fFNg+1t3SYmVXpJ5sIsiWMSPP62+gfRdp7CO+Bp4E6k=
```

**NEXTAUTH_SECRET:**
```
jPSQEV0tVq85kAYJbKyAKiMMfoxftslKaciev5FXEjU=
```

## 📝 Required Environment Variables

### 1. MongoDB Connection

**For Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
```

**For MongoDB Atlas (Cloud):**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Replace `<dbname>` with `ecommerce`

Example:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
```

### 2. Authentication Secrets

Update these with the generated secrets above:
```env
JWT_SECRET=fFNg+1t3SYmVXpJ5sIsiWMSPP62+gfRdp7CO+Bp4E6k=
NEXTAUTH_SECRET=jPSQEV0tVq85kAYJbKyAKiMMfoxftslKaciev5FXEjU=
NEXTAUTH_URL=http://localhost:3000
```

### 3. Stripe Payment Integration (Optional for now)

1. Go to https://dashboard.stripe.com/test/apikeys
2. Sign up or log in
3. Copy your test API keys
4. Update in `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_your_actual_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_stripe_publishable_key
```

### 4. Email Configuration (For Order Invoices)

The system automatically sends order invoice emails to customers from **tannaro.contact@gmail.com**. To enable this feature:

**Using Gmail:**
1. Go to your Google Account settings for **tannaro.contact@gmail.com**
2. Enable 2-Step Verification
3. Go to "App Passwords" (https://myaccount.google.com/apppasswords)
4. Generate an app password for "Mail"
5. Add the app password to your `.env.local` file

```env
SMTP_EMAIL=tannaro.contact@gmail.com
SMTP_PASSWORD=your-app-password-here
```

**Note:** 
- The email will be sent from `tannaro.contact@gmail.com` by default
- Use an App Password, not your regular Gmail password. Regular passwords won't work with Gmail SMTP
- If `SMTP_EMAIL` is not set, it defaults to `tannaro.contact@gmail.com`
- Only `SMTP_PASSWORD` is required (the email address is already configured)

**Alternative Email Services:**
You can also use other SMTP services like SendGrid, Mailgun, or AWS SES. Update the email service configuration in `lib/email.ts` accordingly.

### 5. Application URL

For development:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For production, update with your domain:
```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## 🚀 Quick Setup Steps

### Step 1: Update MongoDB URI

**Option A - Use Local MongoDB:**
```bash
# Make sure MongoDB is running
# Check with: mongosh or mongo
```

**Option B - Use MongoDB Atlas:**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create cluster (free tier available)
3. Create database user
4. Whitelist your IP (0.0.0.0/0 for development)
5. Get connection string and update `MONGODB_URI`

### Step 2: Update Secrets

Open `.env.local` and replace the placeholder secrets with the generated ones above.

### Step 3: (Optional) Set Up Stripe

If you want payment functionality:
1. Create Stripe account
2. Get test API keys
3. Update Stripe variables in `.env.local`

### Step 4: Verify Setup

```bash
# Check if .env.local exists
ls -la .env.local

# Verify variables are loaded (in your code)
console.log(process.env.MONGODB_URI) // Should not be undefined
```

## 🔒 Security Notes

1. **Never commit `.env.local` to Git**
   - It's already in `.gitignore`
   - Contains sensitive information

2. **Use different secrets for production**
   - Generate new secrets for production
   - Use environment variables in your hosting platform

3. **Keep secrets secure**
   - Don't share `.env.local` file
   - Use strong, randomly generated secrets

4. **For Production:**
   - Set environment variables in your hosting platform (Vercel, etc.)
   - Don't use `.env.local` in production
   - Use platform's environment variable settings

## 🧪 Testing Your Setup

After configuring your environment variables:

1. **Test MongoDB Connection:**
   ```typescript
   // Create a test file: test-db.ts
   import connectDB from './lib/mongodb';
   
   async function test() {
     try {
       await connectDB();
       console.log('✅ MongoDB connected successfully!');
     } catch (error) {
       console.error('❌ MongoDB connection failed:', error);
     }
   }
   
   test();
   ```

2. **Verify Environment Variables:**
   ```bash
   # In your Next.js API route or component
   console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
   console.log('JWT Secret:', process.env.JWT_SECRET ? 'Set' : 'Not set');
   ```

## 📋 Environment Variables Checklist

- [ ] MongoDB URI configured (local or Atlas)
- [ ] JWT_SECRET updated with generated secret
- [ ] NEXTAUTH_SECRET updated with generated secret
- [ ] NEXTAUTH_URL set to http://localhost:3000
- [ ] (Optional) Stripe keys configured
- [ ] (Optional) SMTP_EMAIL and SMTP_PASSWORD configured for order invoices
- [ ] NEXT_PUBLIC_APP_URL set correctly

## 🆘 Troubleshooting

### Issue: "MONGODB_URI is not defined"
- **Solution:** Make sure `.env.local` exists in the project root
- Restart your development server after creating/updating `.env.local`

### Issue: "Cannot connect to MongoDB"
- **Solution:** 
  - Check if MongoDB is running (local)
  - Verify connection string is correct
  - Check network/firewall settings (Atlas)
  - Ensure IP is whitelisted (Atlas)

### Issue: Environment variables not loading
- **Solution:**
  - Make sure file is named `.env.local` (not `.env`)
  - Restart Next.js dev server
  - Variables starting with `NEXT_PUBLIC_` are available in browser
  - Other variables are server-side only

### Issue: Order emails not being sent
- **Solution:**
  - Verify `SMTP_EMAIL` and `SMTP_PASSWORD` are set in `.env.local`
  - For Gmail, make sure you're using an App Password (not regular password)
  - Check server logs for email sending errors
  - Note: Order creation will still succeed even if email fails

## 📚 Next Steps

Once environment variables are set up:
1. ✅ Test MongoDB connection
2. ✅ Create database models
3. ✅ Build authentication system
4. ✅ Start building features

Your environment is now configured! 🎉

