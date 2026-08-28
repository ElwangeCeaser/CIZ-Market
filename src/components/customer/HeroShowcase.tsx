import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Sparkles, Zap, ArrowRight, Shield, Smartphone, Leaf } from 'lucide-react';

export const HeroShowcase: React.FC = () => {
  const { setSelectedCategory } = useMarketplace();

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
      {/* 8-Column Main Flash Sale Banner */}
      <div className="lg:col-span-8 bg-emerald-700 rounded-xl relative overflow-hidden flex items-center p-6 sm:p-10 shadow-sm min-h-[280px]">
        <div className="z-10 text-white max-w-md">
          <div className="inline-flex items-center gap-1.5 bg-yellow-400 text-emerald-950 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-xs mb-3">
            <Zap className="w-3 h-3 fill-emerald-950" />
            <span>Super Flash Sale • Kampala & Suburbs</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight text-white">
            Upgrade Your Workspace
          </h1>

          <p className="mt-3 text-emerald-100 text-sm sm:text-base leading-relaxed">
            Up to <span className="font-bold text-yellow-300">40% OFF</span> on computing accessories, original laptops, and office supplies this week.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setSelectedCategory('cat-computers')}
              className="bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-emerald-950 px-6 py-2.5 rounded-lg font-black text-xs sm:text-sm uppercase tracking-wide transition-all shadow-md flex items-center gap-2"
            >
              <span>Shop Computers</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedCategory('cat-phones')}
              className="bg-emerald-900/60 hover:bg-emerald-950 text-white border border-emerald-500/40 px-5 py-2.5 rounded-lg font-bold text-xs sm:text-sm uppercase tracking-wide transition-colors"
            >
              Phones & Audio
            </button>
          </div>
        </div>

        {/* Decorative Modern African Wave & Geometric Glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-emerald-500/80 to-transparent flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 bg-white/20 rounded-full blur-3xl absolute"></div>
          <div className="w-64 h-64 border-4 border-white/10 rounded-full absolute rotate-12"></div>
          <div className="w-80 h-80 border border-yellow-300/10 rounded-full absolute"></div>
        </div>
      </div>

      {/* 4-Column Side Promo Stacks */}
      <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
        {/* Groceries Card */}
        <div
          onClick={() => setSelectedCategory('cat-foodstuff')}
          className="flex-1 bg-slate-900 rounded-xl p-5 text-white flex flex-col justify-center border-l-4 border-yellow-500 cursor-pointer hover:bg-slate-800 transition-colors group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-yellow-400 text-xs font-black tracking-wider flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5 text-yellow-400" />
              <span>CIZ FRESH GROCERIES</span>
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-lg font-bold mt-1 text-white">Direct Farm Matooke & Produce</h3>
          <p className="text-slate-300 text-xs mt-1.5 leading-relaxed">
            Fresh from Mbarara and Nakasero markets directly to your kitchen in under 4 hours.
          </p>
        </div>

        {/* Payment Cashback Card */}
        <div className="flex-1 bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col justify-center group hover:border-emerald-400 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-emerald-700 text-xs font-bold flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>PAYMENT PROMO</span>
            </span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded">
              MTN & AIRTEL
            </span>
          </div>
          <h3 className="text-lg font-bold mt-1 text-slate-800">Mobile Money Deals</h3>
          <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
            Get instant UGX 15,000 off with code <span className="font-mono font-bold text-emerald-700">MOMOFEST</span> on checkout.
          </p>
        </div>
      </div>
    </section>
  );
};
