import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ProductVariant } from '../../types';
import { PriceComponent } from '../common/PriceComponent';
import { RatingComponent } from '../common/RatingComponent';
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Store,
  MapPin,
  CheckCircle2,
  Share2,
  Star,
  Plus,
  Minus,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

export const ProductDetailsPage: React.FC = () => {
  const {
    selectedProductId,
    products,
    setCurrentView,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsCheckoutOpen,
    reviews,
    addReview,
    showToast
  } = useMarketplace();

  const product = products.find(p => p.id === selectedProductId) || products[0];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews' | 'seller'>('desc');

  // Review submission state
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Product not found.</p>
        <button
          onClick={() => setCurrentView('PRODUCT_LISTING')}
          className="mt-4 text-emerald-800 font-bold underline"
        >
          Return to products
        </button>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const productReviews = reviews.filter(r => r.productId === product.id);

  const currentUnitPrice =
    (product.discountPrice || product.basePrice) + (selectedVariant?.additionalPrice || 0);

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity);
    setCurrentView('CHECKOUT');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!');
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      showToast('Please write a comment describing your experience.');
      return;
    }
    setIsSubmittingReview(true);
    addReview(product.id, newRating, newComment, newTitle);
    setNewTitle('');
    setNewComment('');
    setIsSubmittingReview(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Back Button & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('PRODUCT_LISTING')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Product Listing</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors"
            title="Share Product"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleWishlist(product.id)}
            className={`p-2 rounded-lg border transition-colors ${
              inWishlist
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-slate-200 text-slate-600 hover:text-rose-600'
            }`}
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Grid: Gallery + Details + Buy Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Product Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="aspect-square rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs relative flex items-center justify-center p-4">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.title}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-16 rounded-lg border-2 overflow-hidden shrink-0 bg-white transition-all ${
                    selectedImageIndex === idx
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Value Badges */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 text-xs text-slate-700">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span><strong>100% Genuine:</strong> Verified supplier authenticity warranty</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span><strong>Express Dispatch:</strong> {product.deliveryEstimatedHours || 'Dispatches in 2-4 hours in Kampala'}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-emerald-700 shrink-0" />
              <span><strong>7-Day Free Returns:</strong> Full refund if item differs from description</span>
            </div>
          </div>
        </div>

        {/* Center Details & Purchase Panel (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          {/* Brand & Title */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md">
                Brand: {product.brand}
              </span>
              <span className="text-slate-500">Category: {product.category}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
              {product.title}
            </h1>

            {/* Ratings & Orders */}
            <div className="flex items-center gap-4 mt-2.5 pb-4 border-b border-slate-100 text-xs">
              <RatingComponent rating={product.rating} reviewCount={productReviews.length} size="md" />
              <span className="text-slate-300">|</span>
              <span className="text-slate-600 font-medium">150+ Orders Placed</span>
              <span className="text-slate-300">|</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>In Stock ({product.stockQuantity} available)</span>
              </span>
            </div>
          </div>

          {/* Price Component */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <PriceComponent
              basePrice={product.basePrice}
              discountPrice={product.discountPrice}
              size="xl"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Price includes local import duty and standard value added tax.
            </p>
          </div>

          {/* Variants selector (if any) */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                Select Option / Variant:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map(variant => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                      selectedVariant?.id === variant.id
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <span>{variant.variantName}</span>
                    {variant.additionalPrice > 0 && (
                      <span className="ml-1.5 opacity-80">(+{variant.additionalPrice.toLocaleString()} UGX)</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity selector */}
          <div className="flex items-center gap-4">
            <label className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Quantity:
            </label>
            <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-4 py-2 text-xs font-black text-slate-900 min-w-[36px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                className="px-3 py-2 text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="text-xs text-slate-500">
              Total: <strong>{(currentUnitPrice * quantity).toLocaleString()} UGX</strong>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-black py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Shopping Cart</span>
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white font-black py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md"
            >
              <Zap className="w-4 h-4" />
              <span>Buy Now with MoMo</span>
            </button>
          </div>

          {/* Verified Seller Box */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{product.vendorName}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-black">
                    Verified Merchant
                  </span>
                </h4>
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{product.vendorLocation}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('seller')}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              Seller Profile
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Section: Description, Specifications, Verified Reviews, Seller Information */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50/50">
          <button
            onClick={() => setActiveTab('desc')}
            className={`px-6 py-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all shrink-0 ${
              activeTab === 'desc'
                ? 'border-emerald-800 text-emerald-900 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Product Description
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-6 py-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all shrink-0 ${
              activeTab === 'specs'
                ? 'border-emerald-800 text-emerald-900 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-emerald-800 text-emerald-900 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Customer Reviews</span>
            <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full text-[10px]">
              {productReviews.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('seller')}
            className={`px-6 py-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all shrink-0 ${
              activeTab === 'seller'
                ? 'border-emerald-800 text-emerald-900 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Merchant Information
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {/* Tab 1: Description */}
          {activeTab === 'desc' && (
            <div className="max-w-3xl space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p className="font-medium text-slate-900">{product.shortDescription}</p>
              <p>{product.description}</p>
              {product.warrantyInfo && (
                <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200/60 text-emerald-900">
                  <strong>Warranty Guarantee:</strong> {product.warrantyInfo}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Specs */}
          {activeTab === 'specs' && (
            <div className="max-w-2xl">
              <table className="w-full text-xs text-left border-collapse">
                <tbody>
                  {Object.entries(product.specifications || {}).map(([key, val], idx) => (
                    <tr key={key} className={idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                      <td className="py-2.5 px-4 font-bold text-slate-600 w-1/3 border-b border-slate-100">
                        {key}
                      </td>
                      <td className="py-2.5 px-4 text-slate-900 border-b border-slate-100 font-medium">
                        {val}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 3: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Write a Review Section */}
              <div className="bg-slate-50 p-5 sm:p-6 rounded-xl border border-slate-200">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-3">
                  Write a Verified Customer Review
                </h3>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Your Rating (1 to 5 Stars):
                    </label>
                    <RatingComponent
                      rating={newRating}
                      interactive={true}
                      onRatingChange={r => setNewRating(r)}
                      size="lg"
                      showCount={false}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Review Headline / Summary:
                    </label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      placeholder="e.g. Excellent build quality, swift Boda delivery!"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Your Detailed Feedback:
                    </label>
                    <textarea
                      rows={3}
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      placeholder="Share what you liked, product performance, packaging condition, or courier experience..."
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-emerald-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white text-xs font-black px-5 py-2.5 rounded-lg uppercase tracking-wider transition-all"
                  >
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span>Submit Review</span>
                  </button>
                </form>
              </div>

              {/* Existing Reviews List */}
              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Verified Customer Ratings ({productReviews.length})
                </h3>

                {productReviews.length === 0 ? (
                  <p className="text-xs text-slate-500">
                    No customer reviews yet. Be the first to review this product!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {productReviews.map(rev => (
                      <div
                        key={rev.id}
                        className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-xs text-slate-900">{rev.author}</span>
                            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                              Verified Buyer ({rev.location})
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400">{rev.date}</span>
                        </div>
                        <RatingComponent rating={rev.rating} size="sm" showCount={false} />
                        <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 4: Seller Info */}
          {activeTab === 'seller' && (
            <div className="max-w-xl space-y-4 text-xs text-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">{product.vendorName}</h3>
                  <p className="text-slate-500">{product.vendorLocation}</p>
                </div>
              </div>
              <p className="leading-relaxed">
                This merchant is registered with the Uganda Registration Services Bureau (URSB) and maintains verified warehousing with CIZ Market Uganda for fast fulfillment.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Merchant Rating</span>
                  <span className="text-sm font-black text-slate-900">4.9 / 5.0 (98% Positive)</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Order Dispatch Time</span>
                  <span className="text-sm font-black text-slate-900">&lt; 3 Hours Average</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
