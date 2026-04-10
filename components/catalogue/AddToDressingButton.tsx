'use client';

// components/catalogue/AddToDressingButton.tsx

import { useState } from 'react';
import type { Product } from '@/types/product';

interface Props {
  product: Product;
}

export default function AddToDressingButton({ product }: Props) {
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes.length === 1 ? product.sizes[0] : null
  );
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!selectedSize) return;
    // TODO: connect to cart/dressing state management
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Size selector */}
      {product.sizes.length > 1 && (
        <div>
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-neutral-600 mb-2">
            Taille
          </p>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`
                  min-w-[44px] h-10 px-3 border font-sans text-xs tracking-wider uppercase transition-all
                  ${selectedSize === s
                    ? 'border-amber-400 text-amber-400 bg-amber-400/10'
                    : 'border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-neutral-200'
                  }
                `}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={handleAdd}
        disabled={!selectedSize}
        className={`
          w-full py-4 font-sans text-[11px] tracking-[0.25em] uppercase font-medium transition-all duration-300
          ${added
            ? 'bg-amber-400 text-black'
            : selectedSize
              ? 'bg-white text-black hover:bg-amber-400'
              : 'bg-neutral-900 text-neutral-700 cursor-not-allowed'
          }
        `}
      >
        {added
          ? '✓ Ajouté au dressing'
          : selectedSize
            ? 'Ajouter au dressing'
            : 'Choisissez une taille'
        }
      </button>
    </div>
  );
}
