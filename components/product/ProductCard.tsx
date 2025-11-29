'use client';

import Link from 'next/link';
import { Star } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  reviews?: number;
  rating?: number;
  isSale?: boolean;
  isSoldOut?: boolean;
}

export default function ProductCard({
  id,
  name,
  price,
  compareAtPrice,
  image,
  reviews = 0,
  rating = 0,
  isSale = false,
  isSoldOut = false,
}: ProductCardProps) {
  const [imageSrc, setImageSrc] = useState(image);
  const [showQuickView, setShowQuickView] = useState(false);

  const handleImageError = () => {
    setImageSrc('https://via.placeholder.com/400x400/000000/FFFFFF?text=Product+Image');
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement quick view modal
    console.log('Quick view for product:', id);
  };

  return (
    <div className="group">
      <Link href={`/products/${id}`} className="block">
        <div className="relative overflow-hidden">
          {/* Sale Badge */}
          {isSale && (
            <span className="absolute top-2 left-2 bg-black text-white px-2 py-1 text-xs font-semibold z-10">
              SALE
            </span>
          )}

          {/* Sold Out Overlay */}
          {isSoldOut && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
              <span className="text-black font-semibold">Sold out</span>
            </div>
          )}

          {/* Product Image */}
          <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={handleImageError}
            />
          </div>

          {/* Quick View on Hover */}
          <div 
            className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
            onMouseEnter={() => setShowQuickView(true)}
            onMouseLeave={() => setShowQuickView(false)}
          >
            <button 
              onClick={handleQuickViewClick}
              className="bg-white text-black px-6 py-2 font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
            >
              Quick View
            </button>
          </div>
        </div>

      </Link>

      {/* Product Info */}
      <div className="mt-4">
        {/* Reviews */}
        {reviews > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-1">({reviews})</span>
          </div>
        )}

        {/* Product Name */}
        <Link href={`/products/${id}`}>
          <h3 className="font-semibold mb-2 group-hover:text-gray-600 transition text-sm md:text-base line-clamp-2">
            {name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2">
          {isSale && compareAtPrice && (
            <span className="text-gray-500 line-through">৳{compareAtPrice.toLocaleString()}</span>
          )}
          <span className="font-semibold">৳{price.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

