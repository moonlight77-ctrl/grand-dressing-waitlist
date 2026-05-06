'use client';

import { useCart } from '@/store/useCart';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CartPage() {
  const { items, getTotalPoints, removeItem, clearCart, maxPoints } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  
  const totalPoints = getTotalPoints();

  const handleOrder = async () => {
    setIsSubmitting(true);
    
    // 1. Récupérer l'utilisateur actuel
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/register');
      return;
    }

    // 2. Créer la commande dans Supabase
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{ user_id: user.id, status: 'en_préparation' }])
      .select()
      .single();

    if (orderError) {
      alert("Erreur lors de la validation. Réessayez.");
      setIsSubmitting(false);
      return;
    }

    // 3. Ajouter les items de la commande
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      capacity_cost_at_time: item.capacity_cost
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (!itemsError) {
      clearCart();
      router.push('/mon-dressing?success=true');
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col items-center justify-center font-display p-6">
        <h1 className="text-xl font-light uppercase tracking-[0.3em] mb-8">Votre dressing est vide</h1>
        <Link href="/catalogue" className="border border-neutral-800 px-8 py-4 text-[10px] uppercase tracking-widest hover:border-amber-400 transition-colors">
          Explorer le catalogue
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 font-display p-8 md:p-16">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
        
        {/* Liste des articles (Gauche) */}
        <div className="lg:col-span-2 space-y-12">
          <h1 className="text-2xl font-light uppercase tracking-[0.2em] mb-12 flex items-center gap-4">
            Mon Dressing <span className="text-[10px] text-neutral-500 font-sans tracking-widest">({items.length} pièces)</span>
          </h1>
          
          <div className="divide-y divide-neutral-900 border-t border-neutral-900">
            {items.map((item) => (
              <div key={item.id} className="py-8 flex gap-6 items-center">
                <div className="relative w-24 aspect-[3/4] bg-neutral-900 shrink-0">
                  <Image src={item.image_url || ''} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-amber-400 uppercase tracking-widest mb-1">{item.brand}</p>
                  <h3 className="text-sm font-light uppercase tracking-wide truncate">{item.name}</h3>
                  <p className="text-[10px] text-neutral-500 uppercase mt-2">{item.capacity_cost} CC </p>
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="text-neutral-600 hover:text-red-400 transition-colors"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M12 6L6 12M6 6l6 6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Résumé et Validation (Droite) */}
        <div className="lg:sticky lg:top-16 h-fit bg-neutral-900/30 border border-neutral-900 p-8">
          <h2 className="text-xs uppercase tracking-[0.25em] font-medium mb-8 border-b border-neutral-800 pb-4">
            Résumé de la box
          </h2>
          
          <div className="space-y-6 mb-12">
            <div className="flex justify-between items-end">
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Capacité totale</span>
              <span className="text-sm tracking-widest">{maxPoints} pts</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Utilisée</span>
              <span className="text-sm tracking-widest text-amber-400">{totalPoints} pts</span>
            </div>
            
            {/* Barre de progression */}
            <div className="w-full h-[2px] bg-neutral-800 relative">
              <div 
                className="absolute left-0 top-0 h-full bg-amber-400 transition-all duration-500" 
                style={{ width: `${(totalPoints / maxPoints) * 100}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleOrder}
            disabled={isSubmitting}
            className="w-full bg-white text-black py-5 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-amber-400 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Validation...' : 'Valider ma box'}
          </button>
          
          <p className="mt-6 text-[9px] text-neutral-600 uppercase tracking-widest text-center leading-loose">
            Livraison offerte · Pressing inclus<br/>Micro-assurance Gradora active
          </p>
        </div>

      </div>
    </main>
  );
}