import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ProductVariant } from '../../types';
import { formatUGX, formatPercentage } from '../../lib/formatters';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  Heart,
  ShoppingCart,
  MapPin,
  CheckCircle2,
  Share2,
  RefreshCw,
  Plus,
  Minus
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    activeProductModal: product,
    setActiveProductModal,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsCartOpen,
    setIsCheckoutOpen
  } = useMarketplace();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);
  const discountFraction =
    product.discountPrice && product.basePrice > product.discountPrice
      ? (product.basePrice - product.discountPrice) / product.basePrice
      : 0;

  const currentUnitPrice =
    (product.discountPrice || product.basePrice) + (selectedVariant?.additionalPrice || 0);

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity);
    setActiveProductModal(null);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => setActiveProductModal(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-5 sm:p-8">
          {/* Left Column: Image Gallery */}
          <div className="md:col-span-6 flex flex-col gap-3">
            <div className="aspect-square rounded-lg bg-slate-100 overflow-hidden border border-slate-200 relative flex items-center justify-center">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover object-center"
              />
              {discountFraction > 0 && (
                <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                  {formatPercentage(discountFraction)} OFF
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 rounded-md border-2 overflow-hidden shrink-0 transition-all ${
                      selectedImageIndex === idx ? 'border-emerald-600 ring-2 ring-emerald-500/30' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust and Return Guarantee */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-2 mt-2">
              <div className="flex items-center gap-2 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Authenticity:</strong> 100% genuine verified inventory</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <RefreshCw className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Returns:</strong> 7-day hassle-free return for defective items</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Truck className="w-4 h-4 text-yellow-600 shrink-0" />
                <span><strong>Delivery:</strong> {product.deliveryEstimatedHours || '2-4 hours in Kampala'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Variants */}
          <div className="md:col-span-6 flex flex-col">
            {/* Vendor & Category Badge */}
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded">
                {product.category}
              </span>
              <span className="flex items-center gap-1 font-medium text-slate-600">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>Sold by <strong>{product.vendorName}</strong></span>
              </span>
            </div>

            {/* Title */}
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug mt-1">
              {product.title}
            </h2>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-3 my-2.5">
              <div className="flex items-center gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`}
                  />
                ))}
                <span className="text-xs font-bold text-slate-800 ml-1">{product.rating}</span>
              </div>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500">{product.reviewCount} Verified Ugandan Reviews</span>
            </div>

            {/* Price Box */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">
                  {formatUGX(currentUnitPrice)}
                </span>
                {product.discountPrice && (
                  <span className="text-xs text-slate-400 line-through">
                    {formatUGX(product.basePrice)}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                Prices include all standard taxes. Cash on delivery & MoMo available.
              </div>
            </div>

            {/* Variant Picker (if available) */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Select Variant:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map(v => {
                    const isSelected = selectedVariant?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs ring-2 ring-emerald-500/30'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-500'
                        }`}
                      >
                        {v.colorHex && (
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-white/50"
                            style={{ backgroundColor: v.colorHex }}
                          />
                        )}
                        <span>{v.variantName}</span>
                        {v.additionalPrice > 0 && (
                          <span className="text-[10px] opacity-80">(+{formatUGX(v.additionalPrice)})</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-5">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Quantity:</span>
              <div className="flex items-center border border-slate-300 rounded-md bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-bold text-slate-800 min-w-[28px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-xs text-emerald-700 font-medium">
                {product.stockQuantity} units available
              </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={handleAddToCart}
                className="bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold py-3 px-4 rounded-lg text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <ShoppingCart className="w-4 h-4 text-yellow-400" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="bg-yellow-500 hover:bg-yellow-400 active:scale-[0.99] text-emerald-950 font-black py-3 px-4 rounded-lg text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Buy Now</span>
              </button>
            </div>

            {/* Specifications Table */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
                Key Specifications
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="py-1 border-b border-slate-100 flex flex-col">
                    <span className="text-[11px] text-slate-400">{key}</span>
                    <span className="font-semibold text-slate-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Warranty */}
            {product.warrantyInfo && (
              <div className="mt-4 text-xs text-slate-600 bg-emerald-50/50 p-2.5 rounded border border-emerald-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Warranty:</strong> {product.warrantyInfo}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
