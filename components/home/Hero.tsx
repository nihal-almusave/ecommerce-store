'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

// Banner images support PNG, JPG, JPEG, WEBP formats
const slides = [
  {
    id: 1,
    title: 'ELEGANCE IS ELIMINATION',
    subtitle: 'Stay Ahead of The Trends',
    description: "Tell your brand's story through images",
    image: '/images/banners/banner-1.jpg', // Supports .jpg, .jpeg, .png, .webp
    buttonText: 'Shop Now',
    buttonLink: '/products',
  },
  {
    id: 2,
    title: 'COLLECTIONS',
    subtitle: 'We have your occasion covered',
    description: 'Discover our latest collection',
    image: '/images/banners/banner-2.jpg', // Supports .jpg, .jpeg, .png, .webp
    buttonText: 'Explore',
    buttonLink: '/products',
  },
  {
    id: 3,
    title: 'PREMIUM QUALITY',
    subtitle: 'Timeless Style, Lasting Quality',
    description: 'Experience luxury in every detail',
    image: '/images/banners/banner-3.jpg', // Supports .jpg, .jpeg, .png, .webp
    buttonText: 'Shop Now',
    buttonLink: '/products',
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative h-[600px] md:h-[700px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${slide.image})`,
            }}
          >
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          
          {/* Content */}
          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div className="max-w-2xl text-white">
              <p className="text-xs md:text-sm lg:text-base uppercase tracking-wider mb-2 md:mb-4 text-gray-200">
                {slide.title}
              </p>
              <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold mb-3 md:mb-4">
                {slide.subtitle}
              </h1>
              <p className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 text-gray-100">
                {slide.description}
              </p>
              <Link
                href={slide.buttonLink}
                className="inline-block bg-white text-black px-6 md:px-8 py-3 md:py-3 font-semibold hover:bg-gray-100 transition min-h-[44px] flex items-center justify-center"
              >
                {slide.buttonText}
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2.5 md:p-2 rounded-full transition z-10 min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 flex items-center justify-center"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2.5 md:p-2 rounded-full transition z-10 min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 flex items-center justify-center"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 md:w-2 md:h-2 rounded-full transition min-w-[20px] min-h-[20px] md:min-w-0 md:min-h-0 ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
