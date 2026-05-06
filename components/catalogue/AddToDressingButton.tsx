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

  // On détecte si on est sur une fiche produit /catalogue/[id]
  const isProductPage = pathname.startsWith('/catalogue/');

  const handleAdd = () => {
    if (!selectedSize) return;
    const result = addItem(product);

    if (!result.success) {
      alert(result.message);
      return;
    }

    // Feedback visuel
    setAdded(true);

    // Retour automatique uniquement depuis la fiche produit
    if (isProductPage) {
      setTimeout(() => {
        router.push('/catalogue');
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Sélecteur de taille — inchangé */}

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
        {isAlreadyInCart || added ? '✓ Dans le dressing' : 'Ajouter au dressing'}
      </button>

      {added && isProductPage && (
        <p className="text-[9px] text-center text-neutral-500 uppercase tracking-widest animate-pulse">
          Retour au catalogue...
        </p>
      )}
    </div>
  );
}