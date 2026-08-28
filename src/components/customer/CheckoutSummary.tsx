import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { formatUGX } from '../../lib/formatters';
import { Tag, Check, AlertCircle, ShieldCheck, Truck } from 'lucide-react';

interface CheckoutSummaryProps {
  showCouponInput?: boolean;
  className?: string;
}

export const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  showCouponInput = true,
  className = ''
}) => {
  const {
    cartSubtotal,
    selectedDeliveryFee,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
    orderTotal,
    cartItemCount,
    selectedAddress
  } = useMarketplace();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    const result = applyCoupon(couponCodeInput.trim());
    if (result.success) {
      setCouponFeedback({ type: 'success', message: result.message });
      setCouponCodeInput('');
    } else {
      setCouponFeedback({ type: 'error', message: result.message });
    }
  };

  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-5 ${className}`}>
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center justify-between">
        <span>Order Summary</span>
        <span className="text-xs text-slate-500 font-normal">({cartItemCount} items)</span>
      </h3>

      {/* Item Totals Breakdown */}
      <div className="space-y-3 text-xs sm:text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Items Subtotal</span>
          <span className="font-bold text-slate-900">{formatUGX(cartSubtotal)}</span>
        </div>

        <div className="flex justify-between text-slate-600">
          <div className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Delivery Fee ({selectedAddress ? selectedAddress.district : 'Central'})</span>
          </div>
          <span className="font-bold text-slate-900">{formatUGX(selectedDeliveryFee)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1.5 rounded-md">
            <span>Discount ({appliedCoupon?.code})</span>
            <span>-{formatUGX(discountAmount)}</span>
          </div>
        )}

        <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
          <div>
            <span className="text-sm sm:text-base font-black text-slate-900">Total Due</span>
            <span className="block text-[11px] text-slate-400 font-medium">Includes URA VAT & packaging</span>
          </div>
          <span className="text-lg sm:text-xl font-black text-emerald-950 tracking-tight">
            {formatUGX(orderTotal)}
          </span>
        </div>
      </div>

      {/* Coupon Application Box */}
      {showCouponInput && (
        <div className="pt-3 border-t border-slate-100 space-y-2">
          {appliedCoupon ? (
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg text-xs">
              <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                <Tag className="w-3.5 h-3.5 text-emerald-700" />
                <span>Coupon Applied: {appliedCoupon.code}</span>
              </div>
              <button
                onClick={removeCoupon}
                className="text-red-600 hover:text-red-700 font-black text-xs hover:underline"
              >
                Remove
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyCoupon} className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-emerald-800" />
                <span>Have a Promo or Coupon Code?</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCodeInput}
                  onChange={e => setCouponCodeInput(e.target.value.toUpperCase())}
                  placeholder="e.g. WELCOME10, MOMOFEST"
                  className="flex-grow px-3 py-1.5 text-xs uppercase border border-slate-300 rounded-md outline-none focus:border-emerald-600"
                />
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider transition-all"
                >
                  Apply
                </button>
              </div>
              {couponFeedback && (
                <p
                  className={`text-[11px] flex items-center gap-1 font-medium ${
                    couponFeedback.type === 'success' ? 'text-emerald-700' : 'text-red-600'
                  }`}
                >
                  {couponFeedback.type === 'success' ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <AlertCircle className="w-3 h-3" />
                  )}
                  <span>{couponFeedback.message}</span>
                </p>
              )}
            </form>
          )}
        </div>
      )}

      {/* Escrow Guarantee Pill */}
      <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-slate-600 text-xs flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong>CIZ Escrow Protection:</strong> Your funds are held securely until our verified courier delivers your order and you inspect the items.
        </p>
      </div>
    </div>
  );
};
