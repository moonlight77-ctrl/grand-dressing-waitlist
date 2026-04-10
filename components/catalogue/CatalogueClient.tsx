'use client';

// components/catalogue/CatalogueClient.tsx

import { useState, useMemo, useTransition } from 'react';
import FilterBar from './FilterBar';
import ProductCard from './ProductCard';
import type { Product, CatalogueFilters } from '@/types/product';

interface CatalogueClientProps {
  initialProducts: Product[];
}

export default function CatalogueClient({ initialProducts }: CatalogueClientProps) {
  const [filters, setFilters] = useState<CatalogueFilters>({
    category: 'all',
    style: 'all',
    size: 'all',
    capacity: 'all',
  });
  const [viewMode, setViewMode] = useState<'grid' | 'large'>('grid');
  const [isPending, startTransition] = useTransition();

  const handleFilterChange = (key: keyof CatalogueFilters, value: string | number) => {
    startTransition(() => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    });
  };

  // Client-side filtering (products already fetched)
  const filtered = useMemo(() => {
    return initialProducts.filter((p) => {
      if (filters.category !== 'all' && p.category !== filters.category) return false;
      if (filters.style !== 'all' && p.style !== filters.style) return false;
      if (filters.size !== 'all' && !p.sizes.includes(filters.size as string)) return false;
      if (filters.capacity !== 'all' && p.capacity_cost !== filters.capacity) return false;
      return true;
    });
  }, [initialProducts, filters]);

  return (
    <div className="flex gap-12 items-start">
      {/* Sidebar filters */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        totalCount={filtered.length}
      />

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8">
          <p className="font-sans text-[11px] tracking-[0.15em] text-neutral-500 uppercase">
            {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
            {isPending && <span className="ml-2 text-amber-400/60">…</span>}
          </p>

          {/* View mode toggle */}
          <div className="flex gap-1">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grille serrée"
              className={`p-2 border transition-colors ${viewMode === 'grid' ? 'border-amber-400/40 text-amber-400' : 'border-neutral-800 text-neutral-600 hover:text-neutral-400'}`}
            >
              <GridIcon tight />
            </button>
            <button
              onClick={() => setViewMode('large')}
              aria-label="Grille large"
              className={`p-2 border transition-colors ${viewMode === 'large' ? 'border-amber-400/40 text-amber-400' : 'border-neutral-800 text-neutral-600 hover:text-neutral-400'}`}
            >
              <GridIcon tight={false} />
            </button>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="font-display text-3xl font-light text-neutral-700">Aucune pièce</p>
            <p className="font-sans text-[11px] tracking-widest uppercase text-neutral-600 mt-3">
              Modifiez vos filtres
            </p>
          </div>
        ) : (
          <div
            className={`
              grid gap-x-6 gap-y-10 transition-all
              ${viewMode === 'grid'
                ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                : 'grid-cols-2 md:grid-cols-2 lg:grid-cols-3'
              }
              ${isPending ? 'opacity-60' : 'opacity-100'}
            `}
          >
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GridIcon({ tight }: { tight: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      {tight ? (
        // 4×4 dots
        <>
          {[0, 4, 8, 12].map((cx) =>
            [0, 4, 8, 12].map((cy) => (
              <rect key={`${cx}-${cy}`} x={cx} y={cy} width="2.5" height="2.5" rx="0.5" fill="currentColor" />
            ))
          )}
        </>
      ) : (
        // 2×2 dots
        <>
          {[0, 8].map((cx) =>
            [0, 8].map((cy) => (
              <rect key={`${cx}-${cy}`} x={cx} y={cy} width="6" height="6" rx="0.5" fill="currentColor" />
            ))
          )}
        </>
      )}
    </svg>
  );
}
