'use client';

import { useState } from 'react';
import { useCart } from '@/store/useCart';
import { useRouter, usePathname } from 'next/navigation';
import type { Product } from '@/types/product';

export default function AddToDressingButton({ product }: { product: Product }) {
  const { addItem, items } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes.length === 1 ? product.sizes[0] : null
  );
  const [added, setAdded] = useState(false);

  const isAlreadyInCart = items.some(item => item.id === product.id);
  const isProductPage = pathname.startsWith('/catalogue/');

  const handleAdd = () => {
    if (!selectedSize) return;
    
    // Si tu as besoin de passer la taille sélectionnée au panier, 
    // tu pourras faire : addItem({ ...product, selectedSize }) si ton store le gère.
    const result = addItem(product);

    if (!result.success) {
      alert(result.message);
      return;
    }

    setAdded(true);

    if (isProductPage) {
      setTimeout(() => {
        router.push('/catalogue');
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* --- SÉLECTEUR DE TAILLE INTERACTIF --- */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-[10px] uppercase tracking-widest text-neutral-400">
            Sélectionner une taille :
          </p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`
                    min-w-[48px] px-3 py-2.5 text-xs font-sans uppercase tracking-wider border transition-all duration-200
                    ${isSelected 
                      ? 'border-amber-400 bg-amber-400/10 text-amber-400 font-medium' 
                      : 'border-neutral-800 text-neutral-300 hover:border-neutral-500'}
                  `}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {/* -------------------------------------- */}

      <button
        onClick={handleAdd}
        disabled={!selectedSize || isAlreadyInCart}
        className={`
          w-full py-4 font-sans text-[11px] tracking-[0.25em] uppercase font-medium transition-all duration-300
          ${isAlreadyInCart || added
            ? 'bg-amber-400 text-black cursor-not-allowed'
            : !selectedSize
              ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
              : 'bg-white text-black hover:bg-amber-400'}
        `}
      >
        {isAlreadyInCart || added 
          ? '✓ Dans le dressing' 
          : !selectedSize 
            ? 'Choisir une taille' 
            : 'Ajouter au dressing'}
      </button>

      {added && isProductPage && (
        <p className="text-[9px] text-center text-neutral-500 uppercase tracking-widest animate-pulse">
          Retour au catalogue...
        </p>
      )}
    </div>
  );
}