import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { CATEGORIES } from '../../data/mockData';
import { RoleType } from '../../types';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Package,
  Bell,
  Layers,
  ChevronDown,
  ShieldCheck,
  Truck,
  Store,
  SlidersHorizontal,
  Headphones,
  Star,
  X
} from 'lucide-react';

interface HeaderProps {
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenProfile }) => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    cartItemCount,
    wishlist,
    setIsCartOpen,
    activeRole,
    setActiveRole,
    orders,
    setActiveTrackingOrder,
    notifications,
    currentUser,
    currentView,
    setCurrentView
  } = useMarketplace();

  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read).length;
  const recentOrder = orders[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeRole === 'CUSTOMER') {
      setCurrentView('PRODUCT_LISTING');
    }
  };

  return (
    <header className="bg-emerald-900 text-white shrink-0 shadow-md sticky top-0 z-40">
      {/* Top Utility Bar */}
      <div className="flex justify-between items-center px-4 sm:px-6 py-1.5 text-xs border-b border-emerald-800/80 bg-emerald-950/40 text-emerald-100">
        <div className="flex items-center gap-3 sm:gap-6 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Uganda's Most Trusted Marketplace</span>
          </span>
          <span className="hidden md:flex items-center gap-1 text-emerald-300">
            <Truck className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            <span>Express Delivery: Kampala, Entebbe, Jinja, Wakiso</span>
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
          {/* Quick links to Customer Support & Reviews */}
          <button
            onClick={() => {
              setActiveRole('CUSTOMER');
              setCurrentView('SUPPORT');
            }}
            className="hidden sm:inline-flex items-center gap-1 font-semibold hover:text-yellow-300 transition-colors"
          >
            <Headphones className="w-3 h-3 text-emerald-400" />
            <span>Support</span>
          </button>

          <button
            onClick={() => {
              setActiveRole('CUSTOMER');
              setCurrentView('REVIEWS');
            }}
            className="hidden sm:inline-flex items-center gap-1 font-semibold hover:text-yellow-300 transition-colors"
          >
            <Star className="w-3 h-3 text-yellow-400" />
            <span>Reviews</span>
          </button>

          {/* Portal Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className="flex items-center gap-1.5 bg-emerald-800/90 hover:bg-emerald-700 text-yellow-300 px-2.5 py-0.5 rounded text-[11px] font-semibold border border-emerald-700/60 transition-colors"
            >
              <Store className="w-3 h-3 text-yellow-400" />
              <span>
                View: {activeRole === 'CUSTOMER' ? 'Shopper' : activeRole === 'VENDOR' ? 'Seller Portal' : activeRole === 'ADMIN' ? 'Admin Console' : 'Delivery Agent'}
              </span>
              <ChevronDown className="w-3 h-3 text-emerald-400" />
            </button>

            {isRoleMenuOpen && (
              <div className="absolute right-0 mt-1 w-52 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Switch Experience</div>
                <button
                  onClick={() => { setActiveRole('CUSTOMER'); setCurrentView('HOME'); setIsRoleMenuOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-emerald-50 flex items-center justify-between ${activeRole === 'CUSTOMER' ? 'font-bold text-emerald-700 bg-emerald-50/70' : 'text-slate-700'}`}
                >
                  <span>🛍️ Customer Storefront</span>
                  {activeRole === 'CUSTOMER' && <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded">Active</span>}
                </button>
                <button
                  onClick={() => { setActiveRole('VENDOR'); setIsRoleMenuOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-emerald-50 flex items-center justify-between ${activeRole === 'VENDOR' ? 'font-bold text-emerald-700 bg-emerald-50/70' : 'text-slate-700'}`}
                >
                  <span>🏪 Seller / Vendor Dashboard</span>
                  {activeRole === 'VENDOR' && <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded">Active</span>}
                </button>
                <button
                  onClick={() => { setActiveRole('ADMIN'); setIsRoleMenuOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-emerald-50 flex items-center justify-between ${activeRole === 'ADMIN' ? 'font-bold text-emerald-700 bg-emerald-50/70' : 'text-slate-700'}`}
                >
                  <span>⚙️ Marketplace Admin Console</span>
                  {activeRole === 'ADMIN' && <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded">Active</span>}
                </button>
                <button
                  onClick={() => { setActiveRole('DELIVERY_AGENT'); setIsRoleMenuOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-emerald-50 flex items-center justify-between ${activeRole === 'DELIVERY_AGENT' ? 'font-bold text-emerald-700 bg-emerald-50/70' : 'text-slate-700'}`}
                >
                  <span>🛵 Delivery Agent Portal</span>
                  {activeRole === 'DELIVERY_AGENT' && <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded">Active</span>}
                </button>
              </div>
            )}
          </div>

          <span className="hidden sm:inline font-semibold hover:text-yellow-300 cursor-pointer" onClick={() => setActiveRole('VENDOR')}>
            Sell on CIZ
          </span>

          <span className="flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800 text-[11px] font-bold text-yellow-400">
            <span className="w-3.5 h-2.5 bg-yellow-600 rounded-[2px] inline-block border border-yellow-400"></span>
            <span>UGX</span>
          </span>
        </div>
      </div>

      {/* Main Brand & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6 px-4 sm:px-6 py-3 bg-emerald-800">
        <div className="flex items-center justify-between w-full md:w-auto">
          {/* Logo */}
          <div
            onClick={() => {
              setActiveRole('CUSTOMER');
              setSelectedCategory('all');
              setSearchQuery('');
              setCurrentView('HOME');
            }}
            className="text-2xl font-black tracking-tight flex items-center gap-2 cursor-pointer select-none"
          >
            <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center text-white italic text-xl font-extrabold shadow-sm border border-emerald-400/40">
              C
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-white text-xl font-black tracking-tight">
                CIZ <span className="text-emerald-300">MARKET</span>
              </span>
              <span className="text-[9px] text-yellow-400 font-bold uppercase tracking-widest">Uganda Hub</span>
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => {
                setActiveRole('CUSTOMER');
                setCurrentView('NOTIFICATIONS');
              }}
              className="relative p-2 bg-emerald-700 rounded-md text-white"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-emerald-950 text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadNotifs}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveRole('CUSTOMER');
                setCurrentView('CART');
              }}
              className="relative p-2 bg-emerald-700 rounded-md text-white"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-yellow-500 text-emerald-950 text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full md:flex-1 max-w-3xl">
          <form onSubmit={handleSearchSubmit} className="flex items-center shadow-inner rounded-md overflow-hidden bg-white">
            {/* Category quick dropdown */}
            <div className="hidden sm:flex items-center bg-slate-100 text-slate-700 text-xs px-3 py-2.5 border-r border-slate-200 shrink-0">
              <select
                value={selectedCategory}
                onChange={e => {
                  setSelectedCategory(e.target.value);
                  if (activeRole === 'CUSTOMER') {
                    setCurrentView('PRODUCT_LISTING');
                  }
                }}
                className="bg-transparent outline-none font-medium text-slate-800 cursor-pointer pr-1"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative flex-grow flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search phones, Matooke, solar, laptops, kitenge, electronics..."
                className="w-full pl-9 pr-8 py-2.5 text-slate-900 text-sm outline-none placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 text-emerald-950 font-black px-5 sm:px-7 py-2.5 text-xs sm:text-sm uppercase tracking-wider transition-colors shrink-0 flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>
        </div>

        {/* Action Badges & Icons */}
        <div className="hidden md:flex items-center gap-5">
          {/* Notifications */}
          <div
            onClick={() => {
              setActiveRole('CUSTOMER');
              setCurrentView('NOTIFICATIONS');
            }}
            className="relative cursor-pointer hover:text-yellow-300 transition-colors p-1"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-emerald-200" />
            {unreadNotifs > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-emerald-950 text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow">
                {unreadNotifs}
              </span>
            )}
          </div>

          {/* Account Button */}
          <div
            onClick={() => {
              setActiveRole('CUSTOMER');
              setCurrentView('CUSTOMER_PROFILE');
            }}
            className="flex items-center gap-2 cursor-pointer hover:text-yellow-300 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-white border border-emerald-600">
              <User className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold leading-tight">{currentUser.name.split(' ')[0]}</span>
              <span className="text-[10px] text-emerald-200">My Account</span>
            </div>
          </div>

          {/* Orders Tracking Pill */}
          <div
            onClick={() => {
              setActiveRole('CUSTOMER');
              setCurrentView('MY_ORDERS');
            }}
            className="flex items-center gap-2 cursor-pointer hover:text-yellow-300 transition-colors"
          >
            <div className="relative">
              <Package className="w-5 h-5 text-emerald-200" />
              {orders.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-yellow-500 text-emerald-950 text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                  {orders.length}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold leading-tight">Orders</span>
              <span className="text-[10px] text-emerald-200">Track Status</span>
            </div>
          </div>

          {/* Wishlist */}
          <div
            onClick={() => {
              setActiveRole('CUSTOMER');
              setCurrentView('WISHLIST');
            }}
            className="flex items-center gap-2 cursor-pointer hover:text-yellow-300 transition-colors"
            title={`${wishlist.length} saved items`}
          >
            <div className="relative">
              <Heart className="w-5 h-5 text-emerald-200" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </div>
          </div>

          {/* Cart Button */}
          <button
            onClick={() => {
              setActiveRole('CUSTOMER');
              setCurrentView('CART');
            }}
            className="flex items-center gap-2.5 bg-emerald-700 hover:bg-emerald-600 active:scale-95 px-4 py-2 rounded-md font-bold text-sm shadow-sm transition-all border border-emerald-600/60"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-yellow-400" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-emerald-950 text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow">
                  {cartItemCount}
                </span>
              )}
            </div>
            <span className="text-sm font-bold">Cart</span>
          </button>
        </div>
      </div>

      {/* 19 Categories Navigation Bar */}
      <nav className="bg-white text-slate-700 px-4 sm:px-6 py-2 flex items-center justify-between border-b border-slate-200 shadow-sm text-xs font-semibold overflow-x-auto whitespace-nowrap scrollbar-none">
        <div className="flex items-center gap-5 sm:gap-7">
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setCurrentView('HOME');
            }}
            className={`flex items-center gap-1.5 uppercase tracking-wider py-0.5 border-b-2 transition-colors ${selectedCategory === 'all' && currentView === 'HOME' ? 'text-emerald-700 border-emerald-600 font-bold' : 'border-transparent hover:text-emerald-700'}`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>Home</span>
          </button>

          <button
            onClick={() => {
              setCurrentView('CATEGORIES');
            }}
            className={`uppercase tracking-wider py-0.5 border-b-2 transition-colors ${currentView === 'CATEGORIES' ? 'text-emerald-700 border-emerald-600 font-bold' : 'border-transparent hover:text-emerald-700'}`}
          >
            All Categories
          </button>

          {CATEGORIES.slice(0, 9).map(cat => {
            const isSelected = selectedCategory === cat.id && currentView === 'PRODUCT_LISTING';
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentView('PRODUCT_LISTING');
                }}
                className={`uppercase tracking-wider py-0.5 border-b-2 transition-colors ${isSelected ? 'text-emerald-700 border-emerald-600 font-bold' : 'border-transparent hover:text-emerald-700'}`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* More Categories dropdown */}
        <div className="relative pl-4 border-l border-slate-200 shrink-0">
          <button
            onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
            className="flex items-center gap-1 text-emerald-800 hover:text-emerald-900 font-bold uppercase tracking-wider"
          >
            <span>All 19 Categories</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {isCategoryMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white text-slate-800 rounded-lg shadow-2xl border border-slate-200 py-2 z-50 max-h-[70vh] overflow-y-auto">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                <span>Ugandan Taxonomy</span>
                <button
                  onClick={() => {
                    setCurrentView('CATEGORIES');
                    setIsCategoryMenuOpen(false);
                  }}
                  className="text-emerald-800 hover:underline font-bold text-[10px]"
                >
                  View Directory
                </button>
              </div>
              <div className="grid grid-cols-1 divide-y divide-slate-100">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setCurrentView('PRODUCT_LISTING');
                      setIsCategoryMenuOpen(false);
                    }}
                    className={`text-left px-3 py-2 hover:bg-emerald-50 text-xs flex items-center justify-between ${selectedCategory === cat.id ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700'}`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{cat.itemCount}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

