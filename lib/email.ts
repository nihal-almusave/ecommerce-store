import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  // Use tannaro.contact@gmail.com as the sender email
  const email = process.env.SMTP_EMAIL || 'tannaro.contact@gmail.com';
  let password = process.env.SMTP_PASSWORD;

  if (!password) {
    console.error('SMTP_PASSWORD not configured. Email sending will be disabled.');
    console.error('Please set SMTP_PASSWORD in your .env.local file');
    return null;
  }

  // Remove any spaces from the app password (Gmail app passwords should not have spaces)
  password = password.replace(/\s+/g, '');

  console.log('Creating email transporter with:', {
    email: email,
    passwordLength: password.length,
    passwordPreview: password.length > 4 ? password.substring(0, 2) + '***' + password.slice(-2) : '***',
  });

  // Use direct SMTP configuration for better reliability
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: email,
      pass: password,
    },
    // Add timeout and connection options
    connectionTimeout: 30000, // 30 seconds
    greetingTimeout: 30000,
    socketTimeout: 30000,
    // TLS options
    tls: {
      rejectUnauthorized: false, // Accept self-signed certificates if needed
    },
  });

  return transporter;
};

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface OrderData {
  orderNumber: string;
  customer: {
    firstName: string;
    lastName?: string;
    email: string;
    phone: string;
    address: string;
    city?: string;
    province?: string;
    zip?: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingMethod: 'inside' | 'outside';
  paymentMethod: string;
  createdAt: Date | string;
}

export const sendOrderInvoiceEmail = async (orderData: OrderData): Promise<boolean> => {
  console.log('\n========== EMAIL SENDING START ==========');
  console.log('Attempting to send order invoice email...');
  console.log('Order Number:', orderData.orderNumber);
  console.log('Customer Email:', orderData.customer.email);
  
  // Check environment variables first
  const smtpEmail = process.env.SMTP_EMAIL || 'tannaro.contact@gmail.com';
  const smtpPassword = process.env.SMTP_PASSWORD;
  
  console.log('Environment check:');
  console.log('  SMTP_EMAIL:', smtpEmail);
  console.log('  SMTP_PASSWORD:', smtpPassword ? `SET (${smtpPassword.length} chars)` : '❌ NOT SET');
  
  if (!smtpPassword) {
    console.error('\n❌ EMAIL FAILED: SMTP_PASSWORD environment variable is not set.');
    console.error('Please set SMTP_PASSWORD in your .env.local file with your Gmail App Password.');
    console.error('Steps to get Gmail App Password:');
    console.error('1. Go to https://myaccount.google.com/apppasswords');
    console.error('2. Sign in with tannaro.contact@gmail.com');
    console.error('3. Generate an app password for "Mail"');
    console.error('4. Copy the 16-character password');
    console.error('5. Add to .env.local: SMTP_PASSWORD=your-app-password');
    console.error('========== EMAIL SENDING END (FAILED) ==========\n');
    return false;
  }
  
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.error('\n❌ EMAIL FAILED: Email transporter could not be created.');
      console.error('SMTP_EMAIL:', smtpEmail);
      console.error('SMTP_PASSWORD:', smtpPassword ? `SET (${smtpPassword.length} chars)` : 'NOT SET');
      console.error('========== EMAIL SENDING END (FAILED) ==========\n');
      return false;
    }

    console.log('✅ Email transporter created successfully');

    const customerName = `${orderData.customer.firstName} ${orderData.customer.lastName || ''}`.trim();
    const orderDate = new Date(orderData.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const shippingMethodText = orderData.shippingMethod === 'inside' ? 'Inside Dhaka (৳60)' : 'Outside Dhaka (৳120)';
    const paymentMethodText = orderData.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : orderData.paymentMethod;

    const itemsHtml = orderData.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          <div style="display: flex; align-items: center; gap: 12px;">
            ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" />` : ''}
            <span style="font-weight: 500; color: #111827;">${item.name}</span>
          </div>
        </td>
        <td style="padding: 12px; text-align: center; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${item.quantity}</td>
        <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb; color: #6b7280;">৳${item.price.toFixed(2)}</td>
        <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #111827;">৳${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `
      )
      .join('');

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Invoice - ${orderData.orderNumber}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; background-color: #000000; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">TANNARO</h1>
              <p style="margin: 8px 0 0; color: #d1d5db; font-size: 14px;">Order Invoice</p>
            </td>
          </tr>
          
          <!-- Order Info -->
          <tr>
            <td style="padding: 30px 40px;">
              <p style="margin: 0 0 16px; color: #6b7280; font-size: 14px;">Hello ${customerName},</p>
              <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">
                Thank you for your order! We've received your order and will begin processing it right away. 
                Your order details are below.
              </p>
              
              <div style="background-color: #f9fafb; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 4px 0; color: #6b7280; font-size: 14px;">Order Number:</td>
                    <td style="padding: 4px 0; text-align: right; font-weight: 600; color: #111827; font-size: 14px;">${orderData.orderNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #6b7280; font-size: 14px;">Order Date:</td>
                    <td style="padding: 4px 0; text-align: right; color: #374151; font-size: 14px;">${orderDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #6b7280; font-size: 14px;">Payment Method:</td>
                    <td style="padding: 4px 0; text-align: right; color: #374151; font-size: 14px;">${paymentMethodText}</td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
          
          <!-- Order Items -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <h2 style="margin: 0 0 20px; color: #111827; font-size: 20px; font-weight: 600;">Order Items</h2>
              <table role="presentation" style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #f9fafb;">
                    <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151; font-size: 14px; border-bottom: 2px solid #e5e7eb;">Product</th>
                    <th style="padding: 12px; text-align: center; font-weight: 600; color: #374151; font-size: 14px; border-bottom: 2px solid #e5e7eb;">Qty</th>
                    <th style="padding: 12px; text-align: right; font-weight: 600; color: #374151; font-size: 14px; border-bottom: 2px solid #e5e7eb;">Price</th>
                    <th style="padding: 12px; text-align: right; font-weight: 600; color: #374151; font-size: 14px; border-bottom: 2px solid #e5e7eb;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
            </td>
          </tr>
          
          <!-- Order Summary -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <div style="background-color: #f9fafb; border-radius: 6px; padding: 20px;">
                <h3 style="margin: 0 0 16px; color: #111827; font-size: 18px; font-weight: 600;">Order Summary</h3>
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Subtotal:</td>
                    <td style="padding: 8px 0; text-align: right; color: #374151; font-size: 14px;">৳${orderData.subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Shipping (${shippingMethodText}):</td>
                    <td style="padding: 8px 0; text-align: right; color: #374151; font-size: 14px;">৳${orderData.shipping.toFixed(2)}</td>
                  </tr>
                  ${orderData.tax > 0 ? `
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Tax:</td>
                    <td style="padding: 8px 0; text-align: right; color: #374151; font-size: 14px;">৳${orderData.tax.toFixed(2)}</td>
                  </tr>
                  ` : ''}
                  <tr style="border-top: 2px solid #e5e7eb;">
                    <td style="padding: 12px 0 0; font-weight: 600; color: #111827; font-size: 16px;">Total:</td>
                    <td style="padding: 12px 0 0; text-align: right; font-weight: 700; color: #111827; font-size: 18px;">৳${orderData.total.toFixed(2)}</td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
          
          <!-- Shipping Address -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <h3 style="margin: 0 0 12px; color: #111827; font-size: 18px; font-weight: 600;">Shipping Address</h3>
              <div style="background-color: #f9fafb; border-radius: 6px; padding: 16px; color: #374151; font-size: 14px; line-height: 1.8;">
                ${customerName}<br>
                ${orderData.customer.address}<br>
                ${orderData.customer.city ? `${orderData.customer.city}, ` : ''}
                ${orderData.customer.province ? `${orderData.customer.province} ` : ''}
                ${orderData.customer.zip ? `${orderData.customer.zip}` : ''}<br>
                ${orderData.customer.country}<br>
                Phone: ${orderData.customer.phone}
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; text-align: center;">
              <p style="margin: 0 0 12px; color: #6b7280; font-size: 14px;">
                If you have any questions about your order, please contact us at:
              </p>
              <p style="margin: 0 0 8px;">
                <a href="mailto:tannaro.contract@gmail.com" style="color: #000000; text-decoration: none; font-weight: 600;">tannaro.contract@gmail.com</a>
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                Phone: 01572915263
              </p>
              <p style="margin: 16px 0 0; color: #9ca3af; font-size: 12px;">
                Thank you for shopping with TANNARO!
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const senderEmail = process.env.SMTP_EMAIL || 'tannaro.contact@gmail.com';
    const mailOptions = {
      from: `"TANNARO" <${senderEmail}>`,
      to: orderData.customer.email,
      subject: `Order Confirmation - ${orderData.orderNumber}`,
      html,
    };

    console.log('Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    });

    // Verify connection before sending (with better error handling)
    try {
      console.log('Verifying SMTP connection...');
      await transporter.verify();
      console.log('✅ SMTP server connection verified successfully');
    } catch (verifyError: any) {
      console.error('\n❌ SMTP VERIFICATION FAILED:');
      console.error('Error code:', verifyError.code);
      console.error('Error command:', verifyError.command);
      console.error('Error response:', verifyError.response);
      console.error('Error message:', verifyError.message);
      console.error('Full error:', JSON.stringify(verifyError, null, 2));
      
      // Provide helpful error messages
      if (verifyError.code === 'EAUTH') {
        console.error('\n🔐 AUTHENTICATION ERROR: Invalid Gmail credentials');
        console.error('Please check:');
        console.error('1. Gmail app password is correct');
        console.error('2. 2-Step Verification is enabled');
        console.error('3. App password was generated for "Mail"');
        throw new Error('Authentication failed. Please check your Gmail app password.');
      } else if (verifyError.code === 'ECONNECTION') {
        console.error('\n🌐 CONNECTION ERROR: Cannot connect to Gmail SMTP');
        throw new Error('Connection failed. Please check your internet connection and Gmail settings.');
      } else {
        throw new Error(`SMTP verification failed: ${verifyError.message}`);
      }
    }

    console.log('Attempting to send email via SMTP...');
    const info = await transporter.sendMail(mailOptions);
    console.log(`\n✅ SUCCESS: Order invoice email sent successfully to ${orderData.customer.email}`);
    console.log(`MessageId: ${info.messageId}`);
    console.log(`Response: ${info.response}`);
    console.log('========== EMAIL SENDING END (SUCCESS) ==========\n');
    return true;
  } catch (error: any) {
    console.error('\n❌❌❌ EMAIL SENDING FAILED ❌❌❌');
    console.error('Order Number:', orderData.orderNumber);
    console.error('Customer Email:', orderData.customer.email);
    console.error('Error Type:', error.constructor.name);
    console.error('Error Message:', error.message);
    console.error('Error Code:', error.code);
    console.error('Error Command:', error.command);
    console.error('Error Response:', error.response);
    console.error('Error Response Code:', error.responseCode);
    
    // Log environment status
    console.error('\n📋 Environment Status:');
    console.error('  SMTP_EMAIL:', process.env.SMTP_EMAIL || 'tannaro.contact@gmail.com (default)');
    console.error('  SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? `SET (${process.env.SMTP_PASSWORD.length} chars)` : '❌ NOT SET');
    console.error('  NODE_ENV:', process.env.NODE_ENV || 'not set');
    
    if (error.stack) {
      console.error('\nStack Trace:', error.stack);
    }

    // Provide specific error messages with actionable steps
    if (error.code === 'EAUTH' || error.responseCode === 535) {
      console.error('\n🔐 AUTHENTICATION ERROR DETECTED');
      console.error('The Gmail app password or email address is incorrect.');
      console.error('\n📝 Troubleshooting steps:');
      console.error('1. Go to: https://myaccount.google.com/apppasswords');
      console.error('2. Sign in with: tannaro.contact@gmail.com');
      console.error('3. Enable 2-Step Verification if not already enabled');
      console.error('4. Generate a new app password:');
      console.error('   - Select "Mail" as the app');
      console.error('   - Select "Other (Custom name)" as device');
      console.error('   - Enter "TANNARO Store" as the name');
      console.error('   - Click "Generate"');
      console.error('5. Copy the 16-character password (no spaces)');
      console.error('6. Add to .env.local: SMTP_PASSWORD=your-16-char-password');
      console.error('7. Restart your development server');
      console.error('\n⚠️  Important: Use App Password, NOT your regular Gmail password!');
    } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
      console.error('\n🌐 CONNECTION ERROR DETECTED');
      console.error('Cannot connect to Gmail SMTP server.');
      console.error('\n📝 Troubleshooting steps:');
      console.error('1. Check your internet connection');
      console.error('2. Verify firewall is not blocking port 587');
      console.error('3. Try using port 465 with secure: true');
      console.error('4. Check if Gmail SMTP is accessible from your network');
    } else if (error.code === 'EENVELOPE') {
      console.error('\n📧 ENVELOPE ERROR');
      console.error('Invalid email address format.');
      console.error('Customer email:', orderData.customer.email);
      console.error('Please verify the email address is valid.');
    } else {
      console.error('\n⚠️ UNKNOWN ERROR');
      console.error('Error details:', JSON.stringify({
        code: error.code,
        message: error.message,
        response: error.response,
        responseCode: error.responseCode,
      }, null, 2));
    }

    console.error('\n========== EMAIL SENDING END (FAILED) ==========\n');
    return false;
  }
};

