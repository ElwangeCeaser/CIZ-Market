import React, { useState } from 'react';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HeroShowcase } from './components/customer/HeroShowcase';
import { CategoryRibbon } from './components/customer/CategoryRibbon';
import { ProductCard } from './components/common/ProductCard';
import { CartDrawer } from './components/common/CartDrawer';
import { ProductDetailModal } from './components/customer/ProductDetailModal';
import { CheckoutModal } from './components/customer/CheckoutModal';
import { OrderTrackerModal } from './components/customer/OrderTrackerModal';
import { ProfileModal } from './components/customer/ProfileModal';
import { VendorDashboard } from './components/vendor/VendorDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DeliveryDashboard } from './components/delivery/DeliveryDashboard';
import { formatUGX } from './lib/formatters';
import {
  SlidersHorizontal,
  Zap,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShoppingBag,
  Filter,
  CheckCircle2,
  Bell
} from 'lucide-react';

const MarketplaceContent: React.FC = () => {
  const {
    filteredProducts,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    activeRole,
    toastMessage,
    products
  } = useMarketplace();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeBrandFilter, setActiveBrandFilter] = useState('all');

  // Flash deals & Best sellers subsets
  const flashDeals = products.filter(p => p.isFlashDeal || p.discountPrice);
  const bestSellers = products.filter(p => p.isBestSeller);

  // Brands extracted from current products
  const availableBrands = Array.from(new Set(products.map(p => p.brand)));

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col selection:bg-emerald-200 selection:text-emerald-950">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-2xl border border-slate-700 text-xs font-bold flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-200">
          <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header onOpenProfile={() => setIsProfileOpen(true)} />

      {/* Conditional Portal View based on active role */}
      <main className="flex-grow">
        {activeRole === 'VENDOR' && <VendorDashboard />}
        {activeRole === 'ADMIN' && <AdminDashboard />}
        {activeRole === 'DELIVERY_AGENT' && <DeliveryDashboard />}

        {activeRole === 'CUSTOMER' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
            {/* If no search query and looking at all categories, show hero banners and flash deals */}
            {!searchQuery && selectedCategory === 'all' && (
              <>
                {/* Hero 12-Col Promotional Grid */}
                <HeroShowcase />

                {/* 19 Categories Explorer Ribbon */}
                <CategoryRibbon />

                {/* Flash Deals Section */}
                <section className="mb-8 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-yellow-500 flex items-center justify-center text-emerald-950">
                        <Zap className="w-4 h-4 fill-emerald-950" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-black text-slate-900">Today's Flash Deals</h2>
                          <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase animate-pulse">
                            Ending Soon
                          </span>
                        </div>
                        <div className="h-0.5 w-12 bg-emerald-600 mt-0.5"></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                      <span>Time Remaining:</span>
                      <span className="bg-slate-900 text-yellow-300 font-bold px-2 py-1 rounded text-xs">
                        08h : 42m : 19s
                      </span>
                    </div>
                  </div>

                  {/* 5-Column Flash Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                    {flashDeals.slice(0, 5).map(prod => (
                      <ProductCard key={prod.id} product={prod} />
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* Main Catalog Header / Search Filter Bar */}
            <section className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {searchQuery
                      ? `Search Results for "${searchQuery}"`
                      : selectedCategory !== 'all'
                      ? products.find(p => p.categoryId === selectedCategory)?.category || 'Category Products'
                      : 'Featured Marketplace Catalog'}
                  </h2>
                  <div className="h-1 w-12 bg-emerald-600 mt-1"></div>
                </div>

                {/* Sort & Filter Controls */}
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-500 font-medium">
                    Showing <strong>{filteredProducts.length}</strong> items
                  </span>

                  <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md px-2.5 py-1.5 shadow-2xs">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-500 font-medium hidden sm:inline">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value as any)}
                      className="bg-transparent outline-none font-bold text-slate-800 cursor-pointer"
                    >
                      <option value="featured">Featured / Popular</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="newest">New Arrivals</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                  <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">No products found</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Try searching with another keyword or resetting category filters to view all Ugandan inventory.
                  </p>
                  <button
                    onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                    className="mt-4 bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-md uppercase tracking-wider hover:bg-emerald-900 transition-colors"
                  >
                    View All Products
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                  {filteredProducts.map(prod => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <CartDrawer />
      <ProductDetailModal />
      <CheckoutModal />
      <OrderTrackerModal />
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <MarketplaceProvider>
      <MarketplaceContent />
    </MarketplaceProvider>
  );
}
