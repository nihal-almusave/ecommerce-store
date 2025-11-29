# Admin Dashboard Security Guide

## 🔐 Security Features Implemented

### 1. **JWT Token Authentication**
- Secure token-based authentication using JSON Web Tokens
- Tokens stored in httpOnly cookies (not accessible via JavaScript)
- 24-hour token expiration
- Automatic token verification on each request

### 2. **Password Security**
- Passwords are hashed using bcrypt (salt rounds: 10)
- Minimum password length: 6 characters
- Passwords are never stored in plain text

### 3. **Rate Limiting**
- Maximum 5 login attempts per IP address
- 15-minute lockout after failed attempts
- Prevents brute force attacks

### 4. **Role-Based Access Control**
- Only users with `role: 'admin'` can access admin dashboard
- Middleware protects all admin routes
- API routes verify admin role before processing

### 5. **Secure Cookies**
- httpOnly cookies (prevents XSS attacks)
- Secure flag in production (HTTPS only)
- SameSite: strict (prevents CSRF attacks)
- Path restricted to `/`

### 6. **Route Protection**
- Middleware protects all `/admin/*` routes
- API routes protected at `/api/admin/*`
- Automatic redirect to login if not authenticated

## 🚀 Setting Up Your First Admin User

### Option 1: Using the Script (Recommended)

1. Make sure your `.env.local` has `MONGODB_URI` set
2. Run the admin creation script:
   ```bash
   npx ts-node scripts/create-admin.ts
   ```
3. Follow the prompts to enter:
   - Admin name
   - Admin email
   - Admin password (min 6 characters)

### Option 2: Using MongoDB Directly

1. Connect to your MongoDB database
2. Insert an admin user:
   ```javascript
   // The password will be automatically hashed by the User model
   db.users.insertOne({
     name: "Admin User",
     email: "admin@tannaro.com",
     password: "your-secure-password", // Will be hashed automatically
     role: "admin",
     createdAt: new Date(),
     updatedAt: new Date()
   })
   ```

### Option 3: Using the User Registration API

1. Register a user through the normal registration flow
2. Update the user's role to 'admin' in MongoDB:
   ```javascript
   db.users.updateOne(
     { email: "user@example.com" },
     { $set: { role: "admin" } }
   )
   ```

## 🔑 Login Process

1. Go to `/admin/login`
2. Enter your admin email and password
3. System verifies credentials against database
4. JWT token is generated and stored in httpOnly cookie
5. You're redirected to `/admin/dashboard`

## 🛡️ Security Best Practices

### For Production:

1. **Change Default Credentials**
   - Never use default passwords
   - Use strong, unique passwords (12+ characters, mix of letters, numbers, symbols)

2. **Environment Variables**
   - Keep `JWT_SECRET` secure and unique
   - Use a strong, randomly generated secret (at least 32 characters)
   - Never commit `.env.local` to version control

3. **HTTPS Only**
   - Always use HTTPS in production
   - Secure cookies will only work over HTTPS

4. **Regular Security Updates**
   - Keep dependencies updated
   - Monitor for security vulnerabilities
   - Review access logs regularly

5. **Limit Admin Accounts**
   - Only create admin accounts for trusted users
   - Regularly audit admin access
   - Remove admin access when no longer needed

6. **Two-Factor Authentication (Future Enhancement)**
   - Consider implementing 2FA for additional security
   - Use services like Google Authenticator or Authy

## 🔍 Verifying Security

### Test Authentication:
1. Try accessing `/admin/dashboard` without logging in → Should redirect to login
2. Try logging in with wrong password 6 times → Should show rate limit error
3. Check browser cookies → Should see `adminToken` as httpOnly cookie
4. Try accessing `/api/admin/*` without token → Should return 401 Unauthorized

### Check Token:
- Tokens are stored in httpOnly cookies (not visible in localStorage)
- Tokens expire after 24 hours
- Tokens are verified on every admin route access

## 🚨 Security Checklist

- [ ] Admin user created with strong password
- [ ] JWT_SECRET is set and secure (32+ characters)
- [ ] HTTPS enabled in production
- [ ] Rate limiting is active
- [ ] Middleware is protecting routes
- [ ] No hardcoded credentials in code
- [ ] Environment variables are secure
- [ ] Regular security audits scheduled

## 📝 API Endpoints

### Admin Authentication:
- `POST /api/admin/auth/login` - Login with email/password
- `GET /api/admin/auth/verify` - Verify current token
- `POST /api/admin/auth/logout` - Logout and clear token

### Protected Routes:
All routes under `/admin/*` and `/api/admin/*` require authentication.

## 🆘 Troubleshooting

### "Invalid email or password"
- Verify admin user exists in database with `role: 'admin'`
- Check password is correct
- Ensure user model is hashing passwords correctly

### "Too many login attempts"
- Wait 15 minutes or clear rate limit (restart server in development)
- Check IP address is not blocked

### "Unauthorized" errors
- Verify JWT_SECRET is set in environment
- Check token hasn't expired (24 hours)
- Ensure cookie is being sent with requests

### Token not persisting
- Check browser allows cookies
- Verify httpOnly cookies are supported
- In production, ensure HTTPS is enabled

## 📚 Additional Resources

- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

