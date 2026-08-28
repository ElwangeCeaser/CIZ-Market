import React from 'react';
import { LucideIcon, PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = PackageOpen,
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-10 sm:p-14 text-center max-w-lg mx-auto shadow-2xs ${className}`}>
      <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base sm:text-lg font-black text-slate-900">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-500 mt-1.5 mb-6 max-w-sm mx-auto leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white text-xs sm:text-sm font-black px-6 py-2.5 rounded-lg uppercase tracking-wider transition-all shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
