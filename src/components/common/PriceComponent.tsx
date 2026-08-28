import React from 'react';
import { formatUGX } from '../../lib/formatters';

interface PriceComponentProps {
  basePrice: number;
  discountPrice?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDiscountBadge?: boolean;
  className?: string;
}

export const PriceComponent: React.FC<PriceComponentProps> = ({
  basePrice,
  discountPrice,
  size = 'md',
  showDiscountBadge = true,
  className = ''
}) => {
  const hasDiscount = discountPrice !== undefined && discountPrice > 0 && discountPrice < basePrice;
  const currentPrice = hasDiscount ? discountPrice : basePrice;
  const discountPct = hasDiscount ? Math.round(((basePrice - discountPrice!) / basePrice) * 100) : 0;

  const sizeStyles = {
    sm: {
      current: 'text-xs font-bold text-slate-900',
      original: 'text-[10px] text-slate-400 line-through',
      badge: 'text-[9px] px-1 py-0.2'
    },
    md: {
      current: 'text-sm sm:text-base font-black text-emerald-900',
      original: 'text-xs text-slate-400 line-through',
      badge: 'text-[10px] px-1.5 py-0.5'
    },
    lg: {
      current: 'text-lg sm:text-xl font-black text-emerald-950',
      original: 'text-sm text-slate-400 line-through',
      badge: 'text-xs px-2 py-0.5'
    },
    xl: {
      current: 'text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight',
      original: 'text-base text-slate-400 line-through font-normal',
      badge: 'text-xs px-2.5 py-1 font-bold'
    }
  };

  return (
    <div className={`flex items-baseline flex-wrap gap-x-2 gap-y-0.5 ${className}`}>
      <span className={sizeStyles[size].current}>{formatUGX(currentPrice)}</span>
      {hasDiscount && (
        <>
          <span className={sizeStyles[size].original}>{formatUGX(basePrice)}</span>
          {showDiscountBadge && (
            <span
              className={`bg-red-600 text-white font-black rounded uppercase tracking-wider ${sizeStyles[size].badge}`}
            >
              -{discountPct}%
            </span>
          )}
        </>
      )}
    </div>
  );
};
