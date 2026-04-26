'use client';

import { useState } from 'react';
import { useCart } from '@/store/useCart';
import type { Product } from '@/types/product';

export default function AddToDressingButton({ product }: { product: Product }) {
  const { addItem, items } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes.length === 1 ? product.sizes[0] : null
  );
  
  const isAlreadyInCart = items.some(item => item.id === product.id);

  const handleAdd = () => {
    if (!selectedSize) return;
    const result = addItem(product);
    
    if (!result.success) {
      alert(result.message); // On pourra faire un joli toast plus tard
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Sélecteur de taille (ton code existant...) */}
      
      <button
        onClick={handleAdd}
        disabled={!selectedSize || isAlreadyInCart}
        className={`
          w-full py-4 font-sans text-[11px] tracking-[0.25em] uppercase font-medium transition-all
          ${isAlreadyInCart 
            ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' 
            : 'bg-white text-black hover:bg-amber-400'}
        `}
      >
        {isAlreadyInCart ? 'Dans le dressing' : 'Ajouter au dressing'}
      </button>
    </div>
  );
}