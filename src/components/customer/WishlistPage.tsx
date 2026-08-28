import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ProductGrid } from '../common/ProductGrid';
import { EmptyState } from '../common/EmptyState';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, setCurrentView, toggleWishlist } = useMarketplace();

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
            <Heart className="w-4 h-4 fill-rose-600" />
            <span>Saved For Later</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            My Wishlist ({wishlist.length} items)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Keep track of items you plan to buy or want to monitor for price drops.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('PRODUCT_LISTING')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition-colors border border-slate-200 self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </button>
      </div>

      {/* Wishlist Items Grid */}
      {wishlistProducts.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is currently empty"
          description="Click the heart icon on any product in our marketplace to save items for future orders or price drop alerts."
          actionLabel="Browse Products"
          onAction={() => setCurrentView('PRODUCT_LISTING')}
        />
      ) : (
        <ProductGrid products={wishlistProducts} />
      )}
    </div>
  );
};
