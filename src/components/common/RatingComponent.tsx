import React from 'react';
import { Star } from 'lucide-react';

interface RatingComponentProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export const RatingComponent: React.FC<RatingComponentProps> = ({
  rating,
  reviewCount,
  size = 'md',
  showCount = true,
  interactive = false,
  onRatingChange,
  className = ''
}) => {
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-5 h-5'
  };

  const textSizes = {
    sm: 'text-[11px]',
    md: 'text-xs',
    lg: 'text-sm font-bold'
  };

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map(star => {
          const isFilled = star <= Math.round(rating);
          return (
            <button
              key={star}
              type={interactive ? 'button' : undefined}
              disabled={!interactive}
              onClick={() => interactive && onRatingChange && onRatingChange(star)}
              className={`p-0.5 ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
            >
              <Star
                className={`${iconSizes[size]} ${
                  isFilled
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-slate-300 fill-slate-100'
                }`}
              />
            </button>
          );
        })}
      </div>

      <span className={`font-semibold text-slate-700 ${textSizes[size]}`}>
        {rating.toFixed(1)}
      </span>

      {showCount && reviewCount !== undefined && (
        <span className={`text-slate-400 ${textSizes[size]}`}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
};
