import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { PriceComponent } from '../common/PriceComponent';
import { CheckoutSummary } from './CheckoutSummary';
import { EmptyState } from '../common/EmptyState';
import { formatUGX } from '../../lib/formatters';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ShoppingCart,
  ShieldCheck,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const ShoppingCartPage: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    setCurrentView,
    cartItemCount,
    setSelectedProductId
  } = useMarketplace();

  if (cart.length === 0) {
    return (
      <div className="py-12">
        <EmptyState
          icon={ShoppingCart}
          title="Your shopping cart is empty"
          description="Explore our authentic Ugandan marketplace to discover amazing electronics, fresh groceries, fashion, and hardware."
          actionLabel="Start Shopping Now"
          onAction={() => setCurrentView('PRODUCT_LISTING')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <span>Bag Overview</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Shopping Cart ({cartItemCount} {cartItemCount === 1 ? 'item' : 'items'})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review your selected items before proceeding to instant Mobile Money or Card checkout.
          </p>
        </div>

        <button
          onClick={clearCart}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors border border-red-200 self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      {/* Cart Layout: Items list + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Cart items list (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map(item => {
            const product = item.product;
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
              >
                <div className="flex gap-4 items-center">
                  <div
                    onClick={() => {
                      setSelectedProductId(product.id);
                      setCurrentView('PRODUCT_DETAILS');
                    }}
                    className="w-20 h-20 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shrink-0 cursor-pointer"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                      {product.brand}
                    </span>
                    <h3
                      onClick={() => {
                        setSelectedProductId(product.id);
                        setCurrentView('PRODUCT_DETAILS');
                      }}
                      className="text-xs sm:text-sm font-black text-slate-900 hover:text-emerald-800 cursor-pointer line-clamp-2 leading-snug"
                    >
                      {product.title}
                    </h3>
                    {item.selectedVariant && (
                      <span className="inline-block text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                        Variant: {item.selectedVariant.variantName}
                      </span>
                    )}
                    <div className="pt-1">
                      <span className="text-xs font-black text-slate-900">
                        {formatUGX(item.unitPrice)} each
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                  <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 py-1 text-xs font-black text-slate-900 min-w-[28px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-emerald-950 block">
                      {formatUGX(item.totalPrice)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-[11px] text-red-600 hover:text-red-700 hover:underline font-bold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Continue Shopping Link */}
          <div className="pt-2">
            <button
              onClick={() => setCurrentView('PRODUCT_LISTING')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue browsing more products</span>
            </button>
          </div>
        </div>

        {/* Order Summary & Proceed to Checkout (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <CheckoutSummary />

          <button
            onClick={() => setCurrentView('CHECKOUT')}
            className="w-full flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white font-black py-4 px-6 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
