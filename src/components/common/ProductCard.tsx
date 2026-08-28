import React from 'react';
import { Product } from '../../types';
import { useMarketplace } from '../../context/MarketplaceContext';
import { formatUGX, formatPercentage } from '../../lib/formatters';
import { Star, Heart, ShoppingCart, Eye, Sparkles, MapPin, Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  badgeStyle?: 'discount' | 'best-seller' | 'flash';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, setActiveProductModal } = useMarketplace();
  const inWishlist = isInWishlist(product.id);

  const discountFraction =
    product.discountPrice && product.basePrice > product.discountPrice
      ? (product.basePrice - product.discountPrice) / product.basePrice
      : 0;

  const currentPrice = product.discountPrice || product.basePrice;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-3 flex flex-col group cursor-pointer hover:shadow-lg hover:border-emerald-300 transition-all duration-200 relative h-full">
      {/* Product Image Container */}
      <div
        onClick={() => setActiveProductModal(product)}
        className="bg-slate-100 aspect-square rounded-md mb-2.5 flex items-center justify-center relative overflow-hidden group/img"
      >
        <img
          src={product.images[0]}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {discountFraction > 0 && (
            <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold shadow-sm">
              {formatPercentage(discountFraction)}
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider uppercase shadow-sm">
              BEST SELLER
            </span>
          )}
          {product.isFlashDeal && (
            <span className="bg-yellow-500 text-emerald-950 text-[9px] px-1.5 py-0.5 rounded font-black flex items-center gap-0.5 shadow-sm">
              <Zap className="w-2.5 h-2.5 fill-emerald-950" /> FLASH
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2 right-2 p-1.5 rounded-full shadow-sm backdrop-blur-md transition-colors z-10 ${
            inWishlist ? 'bg-red-50 text-red-500' : 'bg-white/80 text-slate-500 hover:text-red-500'
          }`}
          title={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-red-500' : ''}`} />
        </button>

        {/* Quick View Overlay Bar on Desktop Hover */}
        <div className="absolute inset-x-0 bottom-0 bg-slate-900/60 backdrop-blur-xs py-1.5 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-semibold">
          <Eye className="w-3.5 h-3.5" />
          <span>Quick View</span>
        </div>
      </div>

      {/* Category & Brand Tag */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-medium">
        <span className="truncate max-w-[65%] text-emerald-700 font-semibold">{product.brand}</span>
        <span className="flex items-center gap-0.5 text-slate-400">
          <MapPin className="w-2.5 h-2.5" /> {product.vendorLocation.split(',')[0]}
        </span>
      </div>

      {/* Product Title */}
      <h4
        onClick={() => setActiveProductModal(product)}
        className="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors mb-2 min-h-[32px]"
      >
        {product.title}
      </h4>

      {/* Price & Rating */}
      <div className="mt-auto pt-1 border-t border-slate-100">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-base font-black text-slate-900 tracking-tight">
            {formatUGX(currentPrice)}
          </span>
          {product.discountPrice && (
            <span className="text-[11px] text-slate-400 line-through font-normal">
              {formatUGX(product.basePrice)}
            </span>
          )}
        </div>

        {/* Star Rating & Review Count */}
        <div className="flex items-center justify-between mt-1 text-xs">
          <div className="flex items-center gap-1">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`}
                />
              ))}
            </div>
            <span className="text-[10px] text-slate-400 font-medium">({product.reviewCount})</span>
          </div>

          <span className="text-[10px] text-emerald-700 font-medium">
            {product.stockQuantity > 0 ? 'In Stock' : 'Low Stock'}
          </span>
        </div>

        {/* Action Button */}
        <button
          onClick={e => {
            e.stopPropagation();
            addToCart(product);
          }}
          className="w-full mt-2.5 bg-emerald-50 hover:bg-emerald-700 text-emerald-800 hover:text-white font-bold py-1.5 px-3 rounded-md text-xs transition-colors flex items-center justify-center gap-1.5 border border-emerald-200 hover:border-emerald-700"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};
