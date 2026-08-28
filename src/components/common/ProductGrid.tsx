import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { EmptyState } from './EmptyState';
import { ShoppingBag } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  emptyTitle?: string;
  emptyDescription?: string;
  onResetFilters?: () => void;
  columns?: 'standard' | 'dense' | 'wide';
  className?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  emptyTitle = 'No products found',
  emptyDescription = 'Try adjusting your search query, price filter, or category selection to find available marketplace items.',
  onResetFilters,
  columns = 'standard',
  className = ''
}) => {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={onResetFilters ? 'Reset Filters' : undefined}
        onAction={onResetFilters}
      />
    );
  }

  const columnClasses = {
    standard: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4',
    dense: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3',
    wide: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
  };

  return (
    <div className={`${columnClasses[columns]} ${className}`}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
