'use client';

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
  const fallbackImage = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600';

  return (
    <Link href={`/catalogue/${product.id}`} className="group block">
      <article
        className="relative flex flex-col"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* IMAGE CONTAINER */}
        <div className="relative overflow-hidden bg-neutral-900 aspect-[3/4]">
          <Image
            src={product.image_url || fallbackImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            className={`
              object-cover transition-transform duration-1000 ease-out
              ${hovered ? 'scale-105' : 'scale-100'}
            `}
          />

          {/* BADGE DE SÉLECTION (Ex: Featured) */}
          {product.is_featured && (
            <div className="absolute top-0 left-0 bg-amber-400 text-black text-[8px] font-bold tracking-[0.2em] uppercase px-3 py-1.5">
              Sélection
            </div>
          )}

          {/* OVERLAY AU SURVOL (Optionnel pour Desktop) */}
          <div className={`
            hidden lg:flex absolute inset-0 bg-black/20 transition-opacity duration-300 items-end p-6
            ${hovered ? 'opacity-100' : 'opacity-0'}
          `}>
             <span className="w-full text-center py-3 bg-white text-black text-[10px] tracking-[0.2em] uppercase font-medium">
               Voir la pièce
             </span>
          </div>
        </div>

        {/* INFORMATIONS PRODUIT (Toujours visible sous l'image) */}
        <div className="pt-4 flex flex-col gap-1.5">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <p className="text-[9px] font-sans tracking-[0.2em] uppercase text-amber-400/90 mb-0.5">
                {product.brand}
              </p>
              <h3 className="font-display text-sm md:text-base font-light text-neutral-100 leading-tight uppercase tracking-wide">
                {product.name}
              </h3>
            </div>
            
            {/* On passe en taille 'sm' pour mobile */}
            <div className="shrink-0 pt-1">
              <CapacityBadge cost={product.capacity_cost as any} size="sm" />
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-sans text-neutral-500 tracking-wider">
            <span>{product.color}</span>
            <span className="w-1 h-1 rounded-full bg-neutral-800" />
            <span>{product.material}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}