'use client';

// components/catalogue/FilterBar.tsx

import { useState } from 'react';
import type { CatalogueFilters } from '@/types/product';

interface FilterBarProps {
  filters: CatalogueFilters;
  onFilterChange: (key: keyof CatalogueFilters, value: string | number) => void;
  totalCount: number;
}

const CATEGORIES = [
  { value: 'all', label: 'Tout' },
  { value: 'femme', label: 'Femme' },
  { value: 'homme', label: 'Homme' },
  { value: 'accessoires', label: 'Accessoires' },
];

const STYLES = [
  { value: 'all', label: 'Tous styles' },
  { value: 'casual', label: 'Casual' },
  { value: 'business', label: 'Business' },
  { value: 'soiree', label: 'Soirée' },
  { value: 'streetwear', label: 'Streetwear' },
  { value: 'sport', label: 'Sport' },
];

const CAPACITIES = [
  { value: 'all', label: 'Toutes' },
  { value: 10, label: '10 pts · Essentiel' },
  { value: 20, label: '20 pts · Premium' },
  { value: 30, label: '30 pts · Luxe' },
];

const SIZES_FEMME = ['XS', 'S', 'M', 'L', 'XL', '36', '38', '40', '42'];
const SIZES_HOMME = ['XS', 'S', 'M', 'L', 'XL', '44', '46', '48', '50', '52'];

export default function FilterBar({ filters, onFilterChange, totalCount }: FilterBarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    style: true,
    size: false,
    capacity: true,
  });

  const toggle = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const sizes = filters.category === 'homme' ? SIZES_HOMME : SIZES_FEMME;

  return (
    <aside className="w-56 shrink-0 sticky top-24 self-start">
      {/* Header */}
      <div className="mb-6">
        <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-neutral-500 mb-0.5">
          Catalogue
        </p>
        <p className="font-display text-2xl font-light text-neutral-100">
          {totalCount} <span className="text-neutral-500">pièces</span>
        </p>
      </div>

      {/* Séparateur */}
      <div className="w-8 h-px bg-amber-400/50 mb-6" />

      <div className="flex flex-col gap-6">
        {/* Catégorie */}
        <FilterSection
          label="Catégorie"
          expanded={expandedSections.category}
          onToggle={() => toggle('category')}
        >
          <div className="flex flex-col gap-1 mt-3">
            {CATEGORIES.map((cat) => (
              <FilterOption
                key={cat.value}
                label={cat.label}
                active={filters.category === cat.value}
                onClick={() => onFilterChange('category', cat.value)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Style */}
        <FilterSection
          label="Style"
          expanded={expandedSections.style}
          onToggle={() => toggle('style')}
        >
          <div className="flex flex-col gap-1 mt-3">
            {STYLES.map((s) => (
              <FilterOption
                key={s.value}
                label={s.label}
                active={filters.style === s.value}
                onClick={() => onFilterChange('style', s.value)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Taille */}
        <FilterSection
          label="Taille"
          expanded={expandedSections.size}
          onToggle={() => toggle('size')}
        >
          <div className="flex flex-wrap gap-1.5 mt-3">
            <button
              onClick={() => onFilterChange('size', 'all')}
              className={`
                text-[10px] font-sans tracking-wider uppercase px-2.5 py-1.5 border transition-all
                ${filters.size === 'all'
                  ? 'border-amber-400 text-amber-400 bg-amber-400/10'
                  : 'border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-neutral-300'
                }
              `}
            >
              Toutes
            </button>
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => onFilterChange('size', s)}
                className={`
                  text-[10px] font-sans tracking-wider uppercase px-2.5 py-1.5 border transition-all
                  ${filters.size === s
                    ? 'border-amber-400 text-amber-400 bg-amber-400/10'
                    : 'border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-neutral-300'
                  }
                `}
              >
                {s}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Capacité */}
        <FilterSection
          label="Capacité"
          expanded={expandedSections.capacity}
          onToggle={() => toggle('capacity')}
        >
          <div className="flex flex-col gap-1 mt-3">
            {CAPACITIES.map((c) => (
              <FilterOption
                key={String(c.value)}
                label={c.label}
                active={filters.capacity === c.value}
                onClick={() => onFilterChange('capacity', c.value)}
              />
            ))}
          </div>
        </FilterSection>
      </div>

      {/* Reset */}
      <button
        onClick={() => {
          onFilterChange('category', 'all');
          onFilterChange('style', 'all');
          onFilterChange('size', 'all');
          onFilterChange('capacity', 'all');
        }}
        className="mt-8 text-[10px] font-sans tracking-[0.15em] uppercase text-neutral-600 hover:text-amber-400 transition-colors underline underline-offset-4"
      >
        Réinitialiser
      </button>
    </aside>
  );
}

// ── Sub-components ─────────────────────────────────────────

function FilterSection({
  label,
  expanded,
  onToggle,
  children,
}: {
  label: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full group"
      >
        <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-neutral-400 group-hover:text-neutral-200 transition-colors">
          {label}
        </span>
        <span className={`text-neutral-600 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-96' : 'max-h-0'}`}
      >
        {children}
      </div>
    </div>
  );
}

function FilterOption({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 text-left py-1 transition-all group
        ${active ? 'text-amber-400' : 'text-neutral-500 hover:text-neutral-200'}
      `}
    >
      <span
        className={`
          w-1 h-1 rounded-full shrink-0 transition-all
          ${active ? 'bg-amber-400 w-3' : 'bg-neutral-700 group-hover:bg-neutral-500'}
        `}
      />
      <span className="font-sans text-xs tracking-wider">{label}</span>
    </button>
  );
}
