'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Truck, RotateCcw, Award, TrendingUp } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement contact form submission
    console.log('Contact form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', message: '' });
    alert('Thank you for your message! We will get back to you soon.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-4">
          <div className="container mx-auto px-4">
            <nav className="text-sm text-gray-600">
              <span>Home</span> / <span className="text-black">Contact</span>
            </nav>
          </div>
        </div>

        {/* Contact Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-4 text-center text-black">Contact</h1>
            <h2 className="text-2xl font-semibold mb-8 text-center text-gray-700">Contact Us</h2>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4 mb-12">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-black">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-black">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2 text-black">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-3 px-6 font-semibold hover:bg-gray-800 transition"
              >
                Submit
              </button>
            </form>
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

