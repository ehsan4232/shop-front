'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { useCart, addToCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    images?: string[];
    rating?: number;
    reviewCount?: number;
    description?: string;
    category?: string;
    isNew?: boolean;
    isOnSale?: boolean;
    discount?: number;
    inStock?: boolean;
    storeId: string;
    storeName?: string;
  };
  variant?: 'default' | 'compact' | 'featured';
  showQuickActions?: boolean;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant = 'default',
  showQuickActions = true,
  className = '',
}) => {
  const { dispatch } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart(dispatch, {
      id: `${product.id}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      storeId: product.storeId,
    });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement quick view modal
    console.log('Quick view:', product.id);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement wishlist functionality
    console.log('Add to wishlist:', product.id);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : index < rating
            ? 'fill-yellow-200 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : product.discount;

  if (variant === 'compact') {
    return (
      <Link href={`/store/${product.storeId}/product/${product.id}`}>
        <div className={`group cursor-pointer rounded-lg border bg-white p-3 shadow-sm transition-shadow hover:shadow-md ${className}`}>
          <div className="flex items-center space-x-3">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="truncate text-sm font-medium text-gray-900">
                {product.name}
              </h3>
              <div className="mt-1 flex items-center space-x-1">
                <span className="text-lg font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              {product.rating && (
                <div className="mt-1 flex items-center space-x-1">
                  <div className="flex">{renderStars(product.rating)}</div>
                  <span className="text-xs text-gray-500">({product.reviewCount})</span>
                </div>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/store/${product.storeId}/product/${product.id}`}>
      <div className={`group cursor-pointer rounded-lg border bg-white shadow-sm transition-all hover:shadow-lg ${
        variant === 'featured' ? 'p-6' : 'p-4'
      } ${className}`}>
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-lg">
          <div className={`relative ${variant === 'featured' ? 'h-64' : 'h-48'} w-full`}>
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Badges */}
            <div className="absolute left-2 top-2 flex flex-col space-y-1">
              {product.isNew && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  New
                </Badge>
              )}
              {product.isOnSale && discountPercentage && (
                <Badge variant="destructive" className="bg-red-100 text-red-800">
                  -{discountPercentage}%
                </Badge>
              )}
              {!product.inStock && (
                <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Quick Actions */}
            {showQuickActions && (
              <div className="absolute right-2 top-2 flex flex-col space-y-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={handleQuickView}
                  className="rounded-full bg-white p-2 shadow-md hover:bg-gray-50"
                  title="Quick View"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={handleWishlist}
                  className="rounded-full bg-white p-2 shadow-md hover:bg-gray-50"
                  title="Add to Wishlist"
                >
                  <Heart className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Add to Cart Button (On Hover) */}
            <div className="absolute inset-x-2 bottom-2 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-4 space-y-2">
          {/* Category & Store */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{product.category}</span>
            {product.storeName && <span>{product.storeName}</span>}
          </div>

          {/* Product Name */}
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center space-x-1">
              <div className="flex">{renderStars(product.rating)}</div>
              <span className="text-sm text-gray-500">
                ({product.reviewCount || 0})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Description (Featured variant only) */}
          {variant === 'featured' && product.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        {/* Add to Cart Button (Always visible for featured) */}
        {variant === 'featured' && (
          <div className="mt-4">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
            </button>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;