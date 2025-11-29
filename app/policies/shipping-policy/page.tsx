'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Truck, RotateCcw, Award, TrendingUp } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-4">
          <div className="container mx-auto px-4">
            <nav className="text-sm text-gray-600">
              <span>Home</span> / <span className="text-black">Shipping Policy</span>
            </nav>
          </div>
        </div>

        {/* Shipping Policy Content */}
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 text-black">Shipping policy</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6 text-lg">
              <strong>TANNARO</strong> Is Confident Of Delivering The Product Anywhere In Bangladesh <strong>Within 1 To 3 Days</strong>. <strong>TANNARO</strong> Is Always Working To Ensure Fast Product Delivery.
            </p>

            <p className="text-gray-700 mb-6 text-lg">
              Products Are Delivered Within <strong>1 To 2 Days Inside Dhaka.</strong><br />
              Outside Dhaka, The Product Is Delivered In <strong>1 To 3 Days</strong> All Over Bangladesh.
            </p>

            <div className="mb-6">
              <ul className="list-disc pl-6 text-gray-700 space-y-2 text-lg">
                <li><strong>Inside Dhaka Shipping Cost: ৳ 60 BDT</strong></li>
                <li><strong>Out Side Dhaka Shipping Cost: ৳ 120 BDT</strong></li>
              </ul>
            </div>

            <p className="text-gray-700 mb-8 text-lg">
              If The Weight Of Any Parcel Of The Customer Is More Than 1 Kg, Then For Every Extra Kg, ৳ 20 BDT Shipping Charges Have To Be Paid.
            </p>

            <div className="border-t border-gray-300 pt-6 mt-8">
              <h2 className="text-2xl font-semibold mb-4 text-black">Contact Information:</h2>
              <ul className="space-y-3 text-gray-700 text-lg">
                <li>
                  <span className="mr-2">✉</span>
                  <strong>Email:</strong>{' '}
                  <a href="mailto:tannaro.contract@gmail.com" className="text-black hover:underline font-semibold">
                    tannaro.contract@gmail.com
                  </a>
                </li>
                <li>
                  <span className="mr-2">📞</span>
                  <strong>Phone:</strong> 01572915263
                </li>
                <li>
                  <span className="mr-2">⏰</span>
                  <strong>Business Hours:</strong> 09:00 AM TO 09:00 PM
                </li>
              </ul>
            </div>
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

