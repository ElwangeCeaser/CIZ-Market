import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { formatUGX } from '../../lib/formatters';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, ShieldCheck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    selectedDeliveryFee,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
    orderTotal,
    setIsCheckoutOpen
  } = useMarketplace();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError(null);
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 bg-emerald-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-yellow-400" />
              <h2 className="text-base font-black tracking-tight">Your Shopping Cart</h2>
              <span className="bg-emerald-900 text-yellow-300 text-xs px-2 py-0.5 rounded-full font-bold">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-md text-emerald-200 hover:text-white hover:bg-emerald-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Your cart is empty</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Explore our catalog of phones, fresh farm matooke, fashion, laptops, and appliances.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-md text-xs uppercase tracking-wide transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.map(item => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-lg border border-slate-200 hover:border-emerald-200 transition-colors bg-slate-50/50"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-18 h-18 object-cover rounded-md bg-white border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">
                          {item.product.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {item.selectedVariant && (
                        <span className="inline-block text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded mt-0.5">
                          {item.selectedVariant.variantName}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/60">
                      <span className="text-xs font-black text-slate-900">
                        {formatUGX(item.unitPrice)}
                      </span>

                      {/* Quantity Selector */}
                      <div className="flex items-center border border-slate-300 rounded bg-white overflow-hidden shadow-2xs">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-800 min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Coupon Code Section */}
              <div className="pt-2">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value)}
                      placeholder="Try 'WELCOME10' or 'MOMOFEST'"
                      className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-md outline-none focus:border-emerald-600 uppercase font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-3 py-2 rounded-md transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </form>

                {couponError && <p className="text-[11px] text-red-600 mt-1">{couponError}</p>}

                {appliedCoupon && (
                  <div className="mt-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded p-2 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold font-mono uppercase">{appliedCoupon.code}</span>
                      <span className="ml-1 text-[11px] text-emerald-600">({appliedCoupon.description})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-red-500 hover:text-red-700 font-bold text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="border-t border-slate-200 p-5 bg-slate-50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">{formatUGX(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimated Delivery</span>
                  <span className="font-semibold text-slate-800">{formatUGX(selectedDeliveryFee)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span>-{formatUGX(discountAmount)}</span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-2 flex justify-between text-base font-black text-slate-900">
                  <span>Total (UGX)</span>
                  <span className="text-emerald-800 font-black">{formatUGX(orderTotal)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Protected by CIZ Ugandan Buyer Guarantee</span>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full bg-yellow-500 hover:bg-yellow-400 active:scale-[0.99] text-emerald-950 font-black py-3 px-4 rounded-lg text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
