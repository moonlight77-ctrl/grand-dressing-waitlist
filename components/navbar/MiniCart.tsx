'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, X, Trash2 } from 'lucide-react';
import { useCart } from '@/store/useCart';

export default function MiniCart() {
  const { items, removeItem, getTotalPoints, maxPoints } = useCart();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const cartCount = items.length;
  const totalPoints = getTotalPoints();

  // Fermer si clic en dehors
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* ── Icône sac — clic direct → /panier ── */}
      <button
        onClick={() => router.push('/panier')}
        className="relative p-2 text-neutral-400 hover:text-white transition-colors"
        aria-label="Aller au panier"
      >
        <ShoppingBag strokeWidth={1.5} size={22} />
        {cartCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-amber-400 text-neutral-950 text-[9px] font-bold rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      {/* ── Dropdown ── */}
      <div
        className={`
          absolute top-full right-0 mt-2 w-96 bg-white text-black z-[60] shadow-2xl
          transition-all duration-300 origin-top-right
          ${open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <h3 className="font-display text-sm uppercase tracking-[0.2em]">
              Mon Dressing
            </h3>
            <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-sans">
              ({cartCount} pièce{cartCount > 1 ? 's' : ''})
            </span>
          </div>
          <button onClick={() => setOpen(false)} className="text-neutral-300 hover:text-black transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Barre capacité */}
        <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-500 font-sans">
              Capacité de dressing
            </span>
            <span className="text-[10px] font-bold font-sans">
              {totalPoints} <span className="text-neutral-400 font-normal">/ {maxPoints} pts</span>
            </span>
          </div>
          <div className="h-0.5 bg-neutral-200 overflow-hidden">
            <div
              className="h-full bg-amber-400 transition-all duration-500"
              style={{ width: `${Math.min((totalPoints / maxPoints) * 100, 100)}%` }}
            />
          </div>
          {/* Dots décoratifs */}
          <div className="flex gap-1 mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                  totalPoints >= (i + 1) * 10 ? 'bg-amber-400' : 'bg-neutral-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Liste des articles */}
        <div className="max-h-80 overflow-y-auto">
          {cartCount === 0 ? (
            <div className="px-6 py-12 text-center">
              <ShoppingBag size={32} strokeWidth={1} className="mx-auto text-neutral-200 mb-4" />
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-sans">
                Votre dressing est vide
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 px-6 py-4 group/item hover:bg-neutral-50 transition-colors">
                  {/* Image */}
                  <div className="w-14 h-18 bg-neutral-100 flex-shrink-0 overflow-hidden" style={{ height: '72px' }}>
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-tight leading-tight line-clamp-2 font-sans">
                          {item.name}
                        </p>
                        <p className="text-[9px] text-neutral-400 uppercase tracking-wider mt-1 font-sans">
                          {item.brand}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-neutral-300 hover:text-red-400 transition-colors flex-shrink-0 opacity-0 group-hover/item:opacity-100"
                        aria-label="Retirer du dressing"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Capacité badge */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="flex gap-0.5">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${
                              i <= (item.capacity_cost || 0) / 10 ? 'bg-amber-400' : 'bg-neutral-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-sans">
                        {item.capacity_cost} pts de dressing
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer CTA */}
        {cartCount > 0 && (
          <div className="px-6 py-5 border-t border-neutral-100 space-y-3">
            <Link
              href="/panier"
              onClick={() => setOpen(false)}
              className="block w-full py-4 bg-neutral-950 text-white text-[10px] uppercase font-bold tracking-[0.25em] text-center hover:bg-amber-400 hover:text-black transition-colors duration-300 font-sans"
            >
              Valider le dressing
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="block w-full text-center text-[9px] uppercase tracking-widest text-neutral-400 hover:text-black transition-colors font-sans"
            >
              Continuer à choisir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}