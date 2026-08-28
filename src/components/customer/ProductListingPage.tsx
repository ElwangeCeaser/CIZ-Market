import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { CATEGORIES } from '../../data/mockData';
import { ProductFilters } from '../common/ProductFilters';
import { ProductGrid } from '../common/ProductGrid';
import {
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Sparkles,
  Search,
  Check
} from 'lucide-react';

interface ProductListingPageProps {
  isSearchMode?: boolean;
}

export const ProductListingPage: React.FC<ProductListingPageProps> = ({ isSearchMode = false }) => {
  const {
    filteredProducts,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    priceFilter,
    setPriceFilter,
    selectedBrand,
    setSelectedBrand
  } = useMarketplace();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const activeCategoryObj = CATEGORIES.find(c => c.id === selectedCategory);
  const pageTitle = isSearchMode
    ? searchQuery
      ? `Search results for "${searchQuery}"`
      : 'Search Marketplace'
    : selectedCategory === 'all'
    ? 'All Marketplace Products'
    : activeCategoryObj?.name || 'Category Products';

  const handleClearAll = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setPriceFilter([0, 20000000]);
    setSortBy('featured');
    setSearchQuery('');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner / Breadcrumb Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
              <span>Marketplace Catalog</span>
              {selectedCategory !== 'all' && (
                <>
                  <span>•</span>
                  <span>{activeCategoryObj?.name}</span>
                </>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {pageTitle}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing <strong>{filteredProducts.length}</strong> available items verified for Uganda delivery
            </p>
          </div>

          {/* Sort selector & Mobile filter button */}
          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors border border-slate-200"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 font-medium hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                aria-label="Sort products by"
                className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer"
              >
                <option value="featured">Featured & Best Deals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Customer Rating</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Pills */}
        {(selectedCategory !== 'all' || selectedBrand !== 'all' || searchQuery || priceFilter[0] > 0 || priceFilter[1] < 20000000) && (
          <div className="flex items-center flex-wrap gap-2 pt-4 mt-4 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-medium text-[11px]">Active Filters:</span>
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                <span>Category: {activeCategoryObj?.name || selectedCategory}</span>
                <button onClick={() => setSelectedCategory('all')} className="hover:text-emerald-950">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedBrand !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                <span>Brand: {selectedBrand}</span>
                <button onClick={() => setSelectedBrand('all')} className="hover:text-emerald-950">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                <span>Query: "{searchQuery}"</span>
                <button onClick={() => setSearchQuery('')} className="hover:text-emerald-950">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={handleClearAll}
              className="text-[11px] text-red-600 hover:text-red-700 font-bold hover:underline ml-1"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Main Content Layout: Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-3 sticky top-24">
          <ProductFilters />
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-9">
          <ProductGrid
            products={filteredProducts}
            onResetFilters={handleClearAll}
            emptyTitle={
              searchQuery
                ? `No products found for "${searchQuery}"`
                : 'No items match the selected criteria'
            }
            emptyDescription="Try clearing filters, searching for alternate keywords, or selecting 'All Categories'."
          />
        </div>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-5 overflow-y-auto flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2 font-black text-slate-900 uppercase tracking-wider text-sm">
                  <SlidersHorizontal className="w-4 h-4 text-emerald-800" />
                  <span>Filter Products</span>
                </div>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <ProductFilters onCloseMobile={() => setIsMobileFilterOpen(false)} />
            </div>

            <div className="pt-4 border-t border-slate-100 mt-6">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-emerald-800 text-white font-bold py-2.5 rounded-lg text-xs uppercase tracking-wider shadow-sm"
              >
                Apply Filters ({filteredProducts.length} Results)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
