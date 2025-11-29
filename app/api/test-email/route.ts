import { NextRequest, NextResponse } from 'next/server';
import { sendOrderInvoiceEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    // Test email with sample data
    const testOrderData = {
      orderNumber: 'ORD-000001',
      customer: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com', // Change this to your test email
        phone: '1234567890',
        address: '123 Test Street',
        city: 'Dhaka',
        province: 'Dhaka',
        zip: '1200',
        country: 'Bangladesh',
      },
      items: [
        {
          name: 'Test Product',
          price: 100,
          quantity: 1,
          image: '',
        },
      ],
      subtotal: 100,
      shipping: 60,
      tax: 0,
      total: 160,
      shippingMethod: 'inside' as const,
      paymentMethod: 'cash_on_delivery',
      createdAt: new Date(),
    };

    console.log('Testing email sending...');
    console.log('SMTP_EMAIL:', process.env.SMTP_EMAIL);
    console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? 'SET (' + process.env.SMTP_PASSWORD.length + ' chars)' : 'NOT SET');

    const result = await sendOrderInvoiceEmail(testOrderData);

    return NextResponse.json({
      success: result,
      message: result ? 'Test email sent successfully' : 'Failed to send test email',
      smtpEmail: process.env.SMTP_EMAIL || 'tannaro.contact@gmail.com',
      smtpPasswordSet: !!process.env.SMTP_PASSWORD,
    });
  } catch (error: any) {
    console.error('Test email error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

