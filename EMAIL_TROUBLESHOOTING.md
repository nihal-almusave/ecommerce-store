# Email Troubleshooting Guide

## Current Configuration
- **SMTP Email**: tannaro.contact@gmail.com
- **SMTP Password**: jviemflupbziaue (16 characters - correct format)

## Common Issues and Solutions

### 1. Authentication Error (EAUTH)
**Symptoms**: Error code `EAUTH` or response code `535`

**Solutions**:
1. Verify the Gmail app password is correct:
   - Go to https://myaccount.google.com/apppasswords
   - Make sure you're signed in as `tannaro.contact@gmail.com`
   - Verify the app password is 16 characters (no spaces)
   - If unsure, generate a new app password

2. Check 2-Step Verification:
   - Go to https://myaccount.google.com/security
   - Ensure 2-Step Verification is enabled
   - App passwords only work with 2-Step Verification enabled

3. Verify App Password was generated for "Mail":
   - When generating, select "Mail" as the app
   - Copy the password immediately (it's only shown once)

### 2. Connection Error (ECONNECTION)
**Symptoms**: Error code `ECONNECTION`

**Solutions**:
1. Check internet connection
2. Verify Gmail SMTP is not blocked by firewall
3. Try using different SMTP settings (see below)

### 3. Environment Variables Not Loading
**Symptoms**: "SMTP_PASSWORD not configured"

**Solutions**:
1. Ensure `.env.local` file exists in project root
2. Restart Next.js dev server after changing `.env.local`
3. Verify variables are set:
   ```bash
   cat .env.local | grep SMTP
   ```

### 4. Test Email Endpoint
Visit: `http://localhost:3000/api/test-email`

This will:
- Test email configuration
- Show detailed error messages
- Verify SMTP connection

## Alternative: Use Direct SMTP Configuration

If Gmail service doesn't work, try direct SMTP:

```typescript
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'tannaro.contact@gmail.com',
    pass: 'your-app-password',
  },
});
```

## Verify App Password Format

Gmail app passwords should be:
- Exactly 16 characters
- No spaces
- Generated from Google Account settings
- Example format: `abcd efgh ijkl mnop` (remove spaces: `abcdefghijklmnop`)

## Next Steps

1. **Test the email endpoint**: Visit `/api/test-email` to see detailed error messages
2. **Check server logs**: Look for detailed error messages when placing an order
3. **Regenerate app password**: If authentication fails, generate a new app password
4. **Check Gmail account**: Ensure `tannaro.contact@gmail.com` is accessible and 2-Step Verification is enabled

