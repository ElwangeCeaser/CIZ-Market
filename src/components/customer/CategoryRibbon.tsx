import React from 'react';
import { CATEGORIES } from '../../data/mockData';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  Tv,
  Smartphone,
  Laptop,
  Shirt,
  Footprints,
  Layers,
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
  Package,
  CheckCircle2
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Tv,
  Smartphone,
  Laptop,
  Shirt,
  Footprints,
  Layers,
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
  Package
};

export const CategoryRibbon: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useMarketplace();

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">Explore Categories</h2>
          <span className="text-xs text-slate-400 font-normal">({CATEGORIES.length} Categories)</span>
        </div>

        {selectedCategory !== 'all' && (
          <button
            onClick={() => setSelectedCategory('all')}
            className="text-xs text-emerald-700 font-bold hover:underline"
          >
            Clear Category Filter
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 xl:grid-cols-10 gap-2.5">
        {CATEGORIES.map(cat => {
          const IconComponent = ICON_MAP[cat.iconName] || Package;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(isSelected ? 'all' : cat.id)}
              className={`p-2.5 rounded-lg border flex flex-col items-center justify-center text-center transition-all group relative ${
                isSelected
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm ring-2 ring-emerald-500/50'
                  : 'bg-white hover:bg-emerald-50/60 text-slate-700 border-slate-200 hover:border-emerald-300'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center mb-1.5 transition-colors ${
                  isSelected
                    ? 'bg-emerald-700 text-yellow-300'
                    : 'bg-slate-100 text-emerald-800 group-hover:bg-emerald-100'
                }`}
              >
                <IconComponent className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold leading-tight line-clamp-2">
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
