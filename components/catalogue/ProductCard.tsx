'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CapacityBadge from './CapacityBadge';
import { useCart } from '@/store/useCart';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [addedSize, setAddedSize] = useState<string | null>(null);
  const { addItem, items } = useCart();
  const router = useRouter();
  const fallbackImage = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600';

  const isInCart = items.some((item) => item.id === product.id);
  const sizes: string[] = product.sizes || [];

  const handleSizeClick = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInCart) return;

    // On force la taille sélectionnée puis on ajoute
    const result = addItem({ ...product, sizes: [size] });

    if (result.success) {
      setAddedSize(size);
      setTimeout(() => setAddedSize(null), 1800);
    } else {
      // Capacité insuffisante — on fait flasher la card en rouge brièvement
      const el = document.getElementById(`card-${product.id}`);
      el?.classList.add('ring-1', 'ring-red-500/50');
      setTimeout(() => el?.classList.remove('ring-1', 'ring-red-500/50'), 800);
    }
  };

  return (
    <article
      id={`card-${product.id}`}
      className="relative flex flex-col transition-all duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── IMAGE CONTAINER ── */}
      <Link href={`/catalogue/${product.id}`} className="block">
        <div className="relative overflow-hidden bg-neutral-900 aspect-[3/4]">
          <Image
            src={product.image_url || fallbackImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            className={`object-cover transition-transform duration-1000 ease-out ${
              hovered ? 'scale-105' : 'scale-100'
            }`}
          />

          {/* Badge sélection */}
          {product.is_featured && (
            <div className="absolute top-0 left-0 bg-amber-400 text-black text-[8px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 z-10">
              Sélection
            </div>
          )}

          {/* Badge "Dans le dressing" */}
          {isInCart && (
            <div className="absolute top-0 right-0 bg-amber-400 text-black text-[8px] font-bold tracking-[0.15em] uppercase px-3 py-1.5 z-10">
              ✓ Dans le dressing
            </div>
          )}

          {/* ── OVERLAY HOVER (desktop) ── */}
          <div
            className={`hidden lg:flex absolute inset-0 flex-col justify-between p-5 transition-all duration-300 ${
              hovered ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)' }}
          >
            {/* Haut — bouton voir la pièce */}
            <div className="flex justify-end">
              <span className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-[8px] tracking-[0.2em] uppercase px-3 py-1.5">
                Voir la pièce →
              </span>
            </div>

            {/* Bas — sélecteur de tailles */}
            {!isInCart && sizes.length > 0 && (
              <div
                className={`transition-all duration-300 ${
                  hovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
                style={{ transitionDelay: hovered ? '80ms' : '0ms' }}
              >
                <p className="text-[8px] uppercase tracking-[0.25em] text-neutral-400 mb-2">
                  Ajout rapide
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={(e) => handleSizeClick(e, size)}
                      className={`
                        min-w-[36px] h-8 px-2 text-[9px] font-bold uppercase tracking-wider
                        border transition-all duration-200 font-sans
                        ${addedSize === size
                          ? 'bg-amber-400 border-amber-400 text-black scale-95'
                          : 'bg-black/60 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-black hover:border-white'
                        }
                      `}
                    >
                      {addedSize === size ? '✓' : size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Si déjà dans le panier */}
            {isInCart && (
              <p className="text-[9px] uppercase tracking-widest text-amber-400 font-sans">
                ✓ Déjà dans votre dressing
              </p>
            )}
          </div>
        </div>
      </Link>

      {/* ── INFOS PRODUIT ── */}
      <Link href={`/catalogue/${product.id}`} className="pt-4 flex flex-col gap-1.5">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <p className="text-[9px] font-sans tracking-[0.2em] uppercase text-amber-400/90 mb-0.5">
              {product.brand}
            </p>
            <h3 className="font-display text-sm md:text-base font-light text-neutral-100 leading-tight uppercase tracking-wide">
              {product.name}
            </h3>
          </div>
          <div className="shrink-0 pt-1">
            <CapacityBadge cost={product.capacity_cost as any} size="sm" />
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-sans text-neutral-500 tracking-wider">
          <span>{product.color}</span>
          <span className="w-1 h-1 rounded-full bg-neutral-800" />
          <span>{product.material}</span>
        </div>
      </Link>
    </article>
  );
}