import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { CATEGORIES } from '../../data/mockData';
import {
  Layers,
  Tv,
  Smartphone,
  Laptop,
  Shirt,
  Footprints,
  Sparkles,
  Utensils,
  Armchair,
  ShoppingBasket,
  Wheat,
  Baby,
  Dumbbell,
  Car,
  BookOpen,
  Wrench,
  HeartPulse,
  Gift,
  ArrowRight,
  Search
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  Tv: <Tv className="w-6 h-6" />,
  Smartphone: <Smartphone className="w-6 h-6" />,
  Laptop: <Laptop className="w-6 h-6" />,
  Shirt: <Shirt className="w-6 h-6" />,
  Footprints: <Footprints className="w-6 h-6" />,
  Layers: <Layers className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
  Utensils: <Utensils className="w-6 h-6" />,
  Armchair: <Armchair className="w-6 h-6" />,
  ShoppingBasket: <ShoppingBasket className="w-6 h-6" />,
  Wheat: <Wheat className="w-6 h-6" />,
  Baby: <Baby className="w-6 h-6" />,
  Dumbbell: <Dumbbell className="w-6 h-6" />,
  Car: <Car className="w-6 h-6" />,
  BookOpen: <BookOpen className="w-6 h-6" />,
  Wrench: <Wrench className="w-6 h-6" />,
  HeartPulse: <HeartPulse className="w-6 h-6" />,
  Gift: <Gift className="w-6 h-6" />
};

export const CategoriesPage: React.FC = () => {
  const { setSelectedCategory, setCurrentView, products } = useMarketplace();
  const [filterQuery, setFilterQuery] = useState('');

  const filteredCategories = CATEGORIES.filter(cat =>
    cat.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    (cat.description && cat.description.toLowerCase().includes(filterQuery.toLowerCase()))
  );

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentView('PRODUCT_LISTING');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-2xl space-y-2">
          <span className="text-[11px] font-black uppercase tracking-widest text-yellow-300">
            Marketplace Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            All Product Categories
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Find everything from Ugandan farm produce and kitenge fashion to genuine electronics, verified auto spares, and hardware tools.
          </p>

          {/* Quick Search */}
          <div className="pt-3 max-w-md">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filterQuery}
                onChange={e => setFilterQuery(e.target.value)}
                placeholder="Filter categories (e.g., Electronics, Foodstuff, Fashion)..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-white text-slate-900 rounded-lg outline-none placeholder:text-slate-400 shadow-inner"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCategories.map(cat => {
          const catProductsCount = products.filter(
            p => p.categoryId === cat.id || p.category.toLowerCase().includes(cat.name.toLowerCase())
          ).length;

          return (
            <div
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-emerald-500/40 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-36 overflow-hidden bg-slate-100">
                <img
                  src={cat.featuredImage}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 w-9 h-9 rounded-lg bg-white/95 backdrop-blur-xs text-emerald-800 flex items-center justify-center shadow-md">
                  {ICON_MAP[cat.iconName] || <Layers className="w-5 h-5" />}
                </div>
                <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-black px-2 py-0.5 rounded">
                  {cat.itemCount}+ Items
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-800 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {cat.description || 'Top quality items with fast shipping.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-800">
                  <span>Browse Category</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
