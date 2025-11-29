# Quick Admin Dashboard Setup

## Step 1: Create an Admin User

You need to create an admin user in your database. Choose one method:

### Method 1: Using the Script (Easiest)
```bash
cd ecommerce-store
npm run create-admin
```

Follow the prompts to create your admin account.

### Method 2: Using MongoDB Directly
1. Connect to your MongoDB database
2. Run this command (replace with your desired email and password):
```javascript
db.users.insertOne({
  name: "Admin",
  email: "admin@tannaro.com",
  password: "your-secure-password", // Will be hashed automatically
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**Note:** The password will be automatically hashed by the User model when saved.

### Method 3: Update Existing User
If you already have a user, update their role:
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## Step 2: Login to Admin Dashboard

1. Go to: `http://localhost:3000/admin/login`
2. Enter your admin email and password
3. You should be redirected to `/admin/dashboard`

## Troubleshooting

### "Invalid email or password"
- Make sure the user exists in the database
- Verify the user has `role: "admin"`
- Check the password is correct
- Ensure MongoDB is running and connected

### "Unauthorized" or redirects to login
- Check if JWT_SECRET is set in `.env.local`
- Verify the adminToken cookie is being set (check browser DevTools > Application > Cookies)
- Try logging out and logging back in
- Clear browser cookies and try again

### Dashboard shows "Loading..." forever
- Check browser console for errors
- Verify `/api/admin/stats` is accessible
- Check server logs for errors
- Ensure MongoDB connection is working

### API returns 401 Unauthorized
- Make sure you're logged in
- Check the adminToken cookie exists
- Verify JWT_SECRET matches between login and verify
- Try logging out and logging back in

## Quick Test

1. Create admin user using Method 1 above
2. Go to `/admin/login`
3. Login with your credentials
4. Should redirect to `/admin/dashboard`

If it still doesn't work, check:
- Browser console for JavaScript errors
- Network tab for failed API requests
- Server terminal for error messages

