'use client';

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
  
  const [isFilterOpen, setIsFilterOpen] = useState(false); // État pour le tiroir mobile
  const [isPending, startTransition] = useTransition();

  const handleFilterChange = (key: keyof CatalogueFilters, value: string | number) => {
    startTransition(() => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    });
  };

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
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
      
      {/* BARRE DE CONTRÔLE MOBILE */}
      <div className="lg:hidden w-full flex justify-between items-center py-4 border-b border-neutral-900 mb-4">
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase border border-neutral-800 px-5 py-2.5 active:bg-white active:text-black transition-all"
        >
          <span>Filtrer</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h10M4 18h7" />
          </svg>
        </button>
        <p className="font-sans text-[10px] tracking-[0.15em] text-neutral-500 uppercase">
          {filtered.length} pièces
        </p>
      </div>

      {/* SIDEBAR / DRAWER MOBILE */}
      <aside className={`
        fixed inset-0 z-[100] bg-neutral-950 p-8 transform transition-transform duration-300 ease-in-out
        lg:relative lg:inset-auto lg:z-0 lg:p-0 lg:translate-x-0 lg:block lg:w-64 lg:shrink-0
        ${isFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-10 lg:hidden">
            <span className="font-display text-xl tracking-widest uppercase">Filtres</span>
            <button 
              onClick={() => setIsFilterOpen(false)}
              className="p-2 text-neutral-500 hover:text-white"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            totalCount={filtered.length}
          />
          
          <button 
            onClick={() => setIsFilterOpen(false)}
            className="mt-auto lg:hidden w-full py-4 bg-amber-400 text-black font-sans text-[11px] tracking-[0.2em] uppercase font-bold"
          >
            Afficher les résultats
          </button>
        </div>
      </aside>

      {/* GRILLE DE PRODUITS */}
      <main className="flex-1 min-w-0 w-full">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-display text-2xl font-light text-neutral-700 uppercase tracking-tighter">Aucune pièce trouvée</p>
            <button 
              onClick={() => setFilters({category:'all', style:'all', size:'all', capacity:'all'})}
              className="text-amber-400 text-[10px] tracking-widest uppercase mt-4 underline underline-offset-4"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className={`
            grid gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 transition-opacity duration-300
            grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
            ${isPending ? 'opacity-40' : 'opacity-100'}
          `}>
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}