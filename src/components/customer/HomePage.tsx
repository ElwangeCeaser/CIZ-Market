import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { CATEGORIES } from '../../data/mockData';
import { HeroShowcase } from './HeroShowcase';
import { CategoryRibbon } from './CategoryRibbon';
import { ProductCard } from '../common/ProductCard';
import {
  Flame,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  ArrowRight,
  ChevronRight,
  Zap,
  ShoppingBag,
  Store
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    products,
    setSelectedCategory,
    setCurrentView,
    setSelectedProductId,
    setActiveProductModal
  } = useMarketplace();

  // Highlight subsets
  const flashDeals = products.filter(p => p.isFlashDeal);
  const bestSellers = products.filter(p => p.isBestSeller);
  const newArrivals = products.filter(p => p.isNewArrival);
  const featured = products.filter(p => p.isFeatured);

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentView('PRODUCT_LISTING');
  };

  return (
    <div className="space-y-8 sm:space-y-12 pb-16">
      {/* 1. Hero Promotional Showcase Carousel & Value Props */}
      <HeroShowcase />

      {/* 2. Uganda Marketplace Guarantees & Features Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900">Swift Delivery</h4>
            <p className="text-[11px] text-slate-500">Same-day in Kampala & Entebbe</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-yellow-50 text-yellow-800 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900">MoMo Escrow</h4>
            <p className="text-[11px] text-slate-500">Zero fraud, 100% money back</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900">7-Day Free Returns</h4>
            <p className="text-[11px] text-slate-500">Hassle-free return policy</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-800 flex items-center justify-center shrink-0">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900">24/7 CIZ Care</h4>
            <p className="text-[11px] text-slate-500">WhatsApp & Phone helpdesk</p>
          </div>
        </div>
      </div>

      {/* 3. Category Horizontal Ribbon */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wider">
              Explore Popular Categories
            </h2>
            <p className="text-xs text-slate-500">Browse thousands of verified products</p>
          </div>
          <button
            onClick={() => setCurrentView('CATEGORIES')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 hover:underline"
          >
            <span>View All ({CATEGORIES.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <CategoryRibbon />
      </section>

      {/* 4. Flash Deals Section */}
      {flashDeals.length > 0 && (
        <section className="bg-gradient-to-br from-red-600 via-rose-700 to-red-900 rounded-2xl p-5 sm:p-7 text-white shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-red-500/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-yellow-300 animate-pulse">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider">
                    Today's Flash Deals
                  </h2>
                  <span className="bg-yellow-400 text-red-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                    Up to 40% Off
                  </span>
                </div>
                <p className="text-xs text-red-100">Limited quantities remaining in Kampala warehouse</p>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedCategory('all');
                setCurrentView('PRODUCT_LISTING');
              }}
              className="inline-flex items-center gap-1 text-xs font-black bg-white text-red-900 px-4 py-2 rounded-lg hover:bg-red-50 active:scale-95 transition-all shadow-sm shrink-0 self-start sm:self-auto"
            >
              <span>See All Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {flashDeals.map(deal => (
              <div key={deal.id} className="bg-white rounded-xl overflow-hidden shadow-md">
                <ProductCard product={deal} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Best Sellers Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wider">
                Trending Best Sellers
              </h2>
              <p className="text-xs text-slate-500">Most ordered items across Uganda this week</p>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedCategory('all');
              setCurrentView('PRODUCT_LISTING');
            }}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 hover:underline"
          >
            <span>Explore All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {bestSellers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Featured Categories Showcase Banners */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CATEGORIES.slice(0, 3).map((cat, idx) => (
          <div
            key={cat.id}
            onClick={() => handleSelectCategory(cat.id)}
            className="group relative rounded-xl overflow-hidden h-44 sm:h-52 cursor-pointer border border-slate-200 shadow-xs transition-transform duration-300 hover:-translate-y-1"
          >
            <img
              src={cat.featuredImage}
              alt={cat.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-4 text-white">
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                {cat.itemCount}+ Products
              </span>
              <h3 className="text-base font-black leading-tight group-hover:text-yellow-300 transition-colors">
                {cat.name}
              </h3>
              <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">{cat.description}</p>
              <div className="mt-2.5 flex items-center gap-1 text-xs font-bold text-emerald-300 group-hover:translate-x-1 transition-transform">
                <span>Shop Category</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 7. New Arrivals */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-yellow-100 text-yellow-800">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wider">
                Just Arrived on CIZ Market
              </h2>
              <p className="text-xs text-slate-500">Fresh stock from local & regional verified importers</p>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedCategory('all');
              setCurrentView('PRODUCT_LISTING');
            }}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 hover:underline"
          >
            <span>See New Stock</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {newArrivals.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 8. Verified Local Vendor Spotlight */}
      <section className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/60 border border-emerald-600 text-emerald-300 text-xs font-bold">
            <Store className="w-3.5 h-3.5" />
            <span>Join 1,200+ Ugandan Merchants</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Sell Your Products on CIZ Market Uganda
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Reach hundreds of thousands of active buyers with automated MoMo payouts, dispatch logistics, and free warehouse staging in Kampala.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
          <button
            onClick={() => setCurrentView('CATEGORIES')}
            className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider active:scale-95 transition-all text-center"
          >
            Explore Marketplace
          </button>
          <button
            onClick={() => setCurrentView('SUPPORT')}
            className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs uppercase tracking-wider active:scale-95 transition-all text-center"
          >
            Seller Helpdesk
          </button>
        </div>
      </section>
    </div>
  );
};
