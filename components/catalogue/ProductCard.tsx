'use client';

// components/catalogue/ProductCard.tsx

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import CapacityBadge from './CapacityBadge';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const fallbackImage =
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600';

  return (
    <article
      className="group relative flex flex-col cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); }}
    >
      {/* Image container */}
      <div className="relative overflow-hidden bg-neutral-900 aspect-[3/4]">
        <Image
          src={product.image_url || fallbackImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className={`
            object-cover transition-transform duration-700 ease-out
            ${hovered ? 'scale-105' : 'scale-100'}
          `}
        />

        {/* Gradient overlay */}
        <div
          className={`
            absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent
            transition-opacity duration-300
            ${hovered ? 'opacity-100' : 'opacity-0'}
          `}
        />

        {/* Featured badge */}
        {product.is_featured && (
          <div className="absolute top-3 left-3 bg-amber-400 text-black text-[9px] font-sans font-semibold tracking-[0.15em] uppercase px-2 py-1">
            Sélection
          </div>
        )}

        {/* Hover : size selector */}
        <div
          className={`
            absolute bottom-0 left-0 right-0 p-4
            transition-all duration-300
            ${hovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}
        >
          {/* Sizes */}
          <div className="flex gap-1.5 mb-3 flex-wrap">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={(e) => { e.preventDefault(); setSelectedSize(s === selectedSize ? null : s); }}
                className={`
                  text-[10px] font-sans tracking-wider uppercase px-2 py-1 border transition-all
                  ${selectedSize === s
                    ? 'border-amber-400 text-amber-400 bg-amber-400/10'
                    : 'border-neutral-600 text-neutral-300 hover:border-neutral-400'
                  }
                `}
              >
                {s}
              </button>
            ))}
          </div>

          {/* CTA */}
          <Link
            href={`/catalogue/${product.id}`}
            className="
              block w-full text-center py-2.5 text-[11px] font-sans tracking-[0.2em] uppercase
              bg-white text-black font-medium
              hover:bg-amber-400 transition-colors duration-200
            "
          >
            Voir la pièce
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="pt-3 flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-sans tracking-[0.15em] uppercase text-neutral-500">
              {product.brand}
            </p>
            <h3 className="font-display text-base font-light text-neutral-100 leading-snug mt-0.5">
              {product.name}
            </h3>
          </div>
          <CapacityBadge cost={product.capacity_cost as 10 | 20 | 30} size="sm" />
        </div>

        {product.color && (
          <p className="text-[10px] font-sans text-neutral-600 tracking-wider">
            {product.color} · {product.material}
          </p>
        )}
      </div>
    </article>
  );
}
