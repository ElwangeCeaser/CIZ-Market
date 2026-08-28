import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { CATEGORIES } from '../../data/mockData';
import { formatUGX } from '../../lib/formatters';
import { SlidersHorizontal, RotateCcw, Check, Sparkles, MapPin, Tag } from 'lucide-react';

interface ProductFiltersProps {
  onCloseMobile?: () => void;
  className?: string;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({ onCloseMobile, className = '' }) => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    priceFilter,
    setPriceFilter,
    selectedBrand,
    setSelectedBrand,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery
  } = useMarketplace();

  // Distinct brands
  const brands = Array.from(new Set(products.map(p => p.brand))).filter(Boolean);

  // Price presets in UGX
  const pricePresets = [
    { label: 'All Prices', min: 0, max: 20000000 },
    { label: 'Under UGX 50,000', min: 0, max: 50000 },
    { label: 'UGX 50,000 - 200,000', min: 50000, max: 200000 },
    { label: 'UGX 200,000 - 1,000,000', min: 200000, max: 1000000 },
    { label: 'Above UGX 1,000,000', min: 1000000, max: 20000000 }
  ];

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setPriceFilter([0, 20000000]);
    setSortBy('featured');
    setSearchQuery('');
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className={`bg-white rounded-xl border border-slate-200 p-5 space-y-6 shadow-2xs ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-emerald-800" />
          <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">Filters</h3>
        </div>
        <button
          onClick={handleResetFilters}
          className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 hover:underline"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Categories */}
      <div className="space-y-2.5">
        <label className="text-xs font-black text-slate-900 uppercase tracking-wider block">
          Categories ({CATEGORIES.length})
        </label>
        <div className="max-h-52 overflow-y-auto space-y-1 pr-1 text-xs scrollbar-thin">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between transition-colors ${
              selectedCategory === 'all'
                ? 'bg-emerald-800 text-white font-bold'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>All Categories</span>
            <span className="text-[10px] opacity-80">{products.length}</span>
          </button>
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-emerald-800 text-white font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="truncate pr-2">{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded ${isSelected ? 'bg-emerald-900 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {cat.itemCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Presets */}
      <div className="space-y-2.5 pt-3 border-t border-slate-100">
        <label className="text-xs font-black text-slate-900 uppercase tracking-wider block">
          Price Range (UGX)
        </label>
        <div className="space-y-1 text-xs">
          {pricePresets.map((preset, idx) => {
            const isMatch = priceFilter[0] === preset.min && priceFilter[1] === preset.max;
            return (
              <button
                key={idx}
                onClick={() => setPriceFilter([preset.min, preset.max])}
                className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between transition-colors ${
                  isMatch
                    ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-300'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{preset.label}</span>
                {isMatch && <Check className="w-3.5 h-3.5 text-emerald-700" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brands */}
      <div className="space-y-2.5 pt-3 border-t border-slate-100">
        <label className="text-xs font-black text-slate-900 uppercase tracking-wider block">
          Brands
        </label>
        <div className="max-h-40 overflow-y-auto space-y-1 pr-1 text-xs">
          <button
            onClick={() => setSelectedBrand('all')}
            className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between transition-colors ${
              selectedBrand === 'all'
                ? 'bg-emerald-800 text-white font-bold'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>All Brands</span>
          </button>
          {brands.map(brand => {
            const isSelected = selectedBrand === brand;
            return (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-emerald-800 text-white font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{brand}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Uganda Local Trust Signals */}
      <div className="p-3 bg-emerald-50/70 rounded-lg border border-emerald-200/60 text-emerald-900 text-xs space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>Local Buyer Shield</span>
        </div>
        <p className="text-[11px] text-emerald-800 leading-snug">
          All listed sellers are verified with valid URA TIN and local inventory hubs in Kampala, Entebbe, and Jinja.
        </p>
      </div>
    </aside>
  );
};
