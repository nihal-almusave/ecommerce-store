'use client';
/* eslint-disable react/no-unescaped-entities */

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Truck, RotateCcw, Award, TrendingUp } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-4">
          <div className="container mx-auto px-4">
            <nav className="text-sm text-gray-600">
              <span>Home</span> / <span className="text-black">Terms of Service</span>
            </nav>
          </div>
        </div>

        {/* Terms of Service Content */}
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <h1 className="text-4xl font-bold mb-4 text-black">Terms of service</h1>
          <p className="text-gray-600 mb-8">Last updated: October 1, 2025</p>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              These Terms of Service ("Terms") govern your access to and use of the TANNARO website and services (the "Service") operated by TANNARO ("we", "us", or "our"). By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these Terms, then you may not access the Service.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">1. Use of the Service</h2>
            <p className="text-gray-700 mb-4">
              You may use our Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>In any way that violates any applicable national or international law or regulation</li>
              <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent</li>
              <li>To impersonate or attempt to impersonate the company, a company employee, another user, or any other person or entity</li>
              <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">2. Products and Pricing</h2>
            <p className="text-gray-700 mb-4">
              We strive to provide accurate product descriptions, images, and pricing information. However, we do not warrant that product descriptions, images, or other content on the Service is accurate, complete, reliable, current, or error-free.
            </p>
            <p className="text-gray-700 mb-6">
              All prices are subject to change without notice. We reserve the right to modify or discontinue any product at any time without prior notice. We shall not be liable to you or to any third party for any modification, price change, suspension, or discontinuance of any product.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">3. Orders and Payment</h2>
            <p className="text-gray-700 mb-4">
              When you place an order through our Service, you are making an offer to purchase products. We reserve the right to accept or reject your order for any reason, including product availability, errors in pricing or product information, or issues identified by our fraud prevention systems.
            </p>
            <p className="text-gray-700 mb-6">
              Payment must be received by us before we ship your order. We accept various payment methods as displayed on our checkout page. By providing payment information, you represent and warrant that you are authorized to use the payment method provided.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">4. Shipping and Delivery</h2>
            <p className="text-gray-700 mb-4">
              We will arrange for shipment of products to you. Shipping costs and estimated delivery times are displayed during checkout. While we make every effort to deliver products within the estimated timeframe, delivery dates are not guaranteed.
            </p>
            <p className="text-gray-700 mb-6">
              Risk of loss and title for products purchased from us pass to you upon delivery to the carrier. You are responsible for filing any claims with carriers for damaged or lost shipments.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">5. Returns and Refunds</h2>
            <p className="text-gray-700 mb-4">
              We want you to be completely satisfied with your purchase. If you are not satisfied, you may return eligible products within the timeframe specified in our Return Policy. Returned products must be in their original condition, unused, and in their original packaging.
            </p>
            <p className="text-gray-700 mb-6">
              Refunds will be processed to the original payment method used for the purchase. Please allow a reasonable time for the refund to be processed and appear in your account.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">6. Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              The Service and its original content, features, and functionality are and will remain the exclusive property of TANNARO and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">7. User Accounts</h2>
            <p className="text-gray-700 mb-4">
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.
            </p>
            <p className="text-gray-700 mb-6">
              You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">8. Prohibited Uses</h2>
            <p className="text-gray-700 mb-4">
              You may not use our Service:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
              <li>To upload or transmit viruses or any other type of malicious code</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">9. Limitation of Liability</h2>
            <p className="text-gray-700 mb-6">
              In no event shall TANNARO, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">10. Indemnification</h2>
            <p className="text-gray-700 mb-6">
              You agree to defend, indemnify, and hold harmless TANNARO and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees).
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">11. Termination</h2>
            <p className="text-gray-700 mb-6">
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">12. Governing Law</h2>
            <p className="text-gray-700 mb-6">
              These Terms shall be interpreted and governed by the laws of Bangladesh, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">13. Changes to Terms</h2>
            <p className="text-gray-700 mb-6">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">14. Contact Information</h2>
            <p className="text-gray-700 mb-8">
              If you have any questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:tannaro.contract@gmail.com" className="text-black hover:underline font-semibold">
                tannaro.contract@gmail.com
              </a>
              {' '}or call us at 01572915263.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <section className="py-16 container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
                <Truck className="w-8 h-8" style={{ color: '#6F432C' }} />
              </div>
              <h3 className="font-semibold mb-2">Fast Shipping</h3>
              <p className="text-sm text-gray-600">Get your order with-in 3-5 days</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
                <RotateCcw className="w-8 h-8" style={{ color: '#6F432C' }} />
              </div>
              <h3 className="font-semibold mb-2">Easy Return</h3>
              <p className="text-sm text-gray-600">Money back guaranteed</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
                <Award className="w-8 h-8" style={{ color: '#6F432C' }} />
              </div>
              <h3 className="font-semibold mb-2">Premium Quality</h3>
              <p className="text-sm text-gray-600">Experience luxury with every purchase</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
                <TrendingUp className="w-8 h-8" style={{ color: '#6F432C' }} />
              </div>
              <h3 className="font-semibold mb-2">Future Trends</h3>
              <p className="text-sm text-gray-600">Stay ahead of what&apos;s next with us.</p>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-12 bg-black text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Subscribe to our newsletter</h2>
            <p className="mb-6 text-gray-300">
              Sign up and receive information on new collections, events and offers from us.
            </p>
            <form 
              className="max-w-md mx-auto flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const email = formData.get('email');
                // TODO: Implement newsletter subscription
                console.log('Newsletter subscription:', email);
                alert('Thank you for subscribing!');
                e.currentTarget.reset();
              }}
            >
              <input
                type="email"
                name="email"
                placeholder="Your e-mail"
                className="flex-1 px-4 py-3 bg-white text-black placeholder-gray-500 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="px-8 py-3 bg-gray-800 hover:bg-gray-700 transition font-semibold"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

