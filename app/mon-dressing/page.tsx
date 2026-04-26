'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import CapacityBadge from '@/components/catalogue/CapacityBadge';

interface DressingItem {
  id: string;
  status: string;
  product: {
    name: string;
    brand: string;
    image_url: string;
    capacity_cost: number;
  };
}

export default function MyDressingPage() {
  const [items, setItems] = useState<DressingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadDressing() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // 1. Charger le profil (points)
        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(prof);

        // 2. Charger les pièces actives (via order_items et orders)
        const { data: dressingData } = await supabase
          .from('order_items')
          .select(`
            id,
            product:products (name, brand, image_url, capacity_cost),
            order:orders (status)
          `)
          .filter('order.user_id', 'eq', user.id);

        if (dressingData) {
          const formatted = dressingData.map((d: any) => ({
            id: d.id,
            status: d.order.status,
            product: d.product
          }));
          setItems(formatted);
        }
      }
      setLoading(false);
    }
    loadDressing();
  }, [supabase]);

  if (loading) return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-amber-400 uppercase tracking-widest text-xs">Chargement du dressing...</div>;

  const usedPoints = items.reduce((acc, item) => acc + (item.product.capacity_cost || 0), 0);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 font-display p-8 md:p-16">
      <div className="max-w-screen-xl mx-auto">
        
        {/* Header Profil & Capacité */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
          <div>
            <h1 className="text-3xl font-light uppercase tracking-[0.3em] mb-2">Mon Dressing</h1>
            <p className="text-neutral-500 text-[10px] uppercase tracking-widest">Membre Bêta Privée · Gradora</p>
          </div>

          <div className="w-full md:w-80 space-y-4">
            <div className="flex justify-between text-[10px] uppercase tracking-widest">
              <span>Capacité utilisée</span>
              <span className="text-amber-400">{usedPoints} / {profile?.style_points_total || 50} PTS</span>
            </div>
            <div className="h-1 bg-neutral-900 w-full relative">
              <div 
                className="absolute h-full bg-amber-400 transition-all duration-1000" 
                style={{ width: `${(usedPoints / (profile?.style_points_total || 50)) * 100}%` }}
              />
            </div>
          </div>
        </header>

        {/* Grille des pièces actives */}
        {items.length === 0 ? (
          <div className="py-32 border border-dashed border-neutral-900 text-center">
            <p className="text-neutral-600 uppercase tracking-widest text-xs mb-8">Aucune pièce dans votre dressing actuellement</p>
            <a href="/catalogue" className="bg-white text-black px-10 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-amber-400 transition-colors">
              Parcourir le catalogue
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.map((item) => (
              <div key={item.id} className="group">
                <div className="relative aspect-[3/4] bg-neutral-900 mb-4 overflow-hidden">
                  <Image 
                    src={item.product.image_url} 
                    alt={item.product.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-neutral-950/80 backdrop-blur-md px-3 py-1.5 text-[8px] uppercase tracking-widest border border-neutral-800">
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] text-amber-400 uppercase tracking-widest mb-1">{item.product.brand}</p>
                  <h3 className="text-sm font-light uppercase tracking-wide mb-3">{item.product.name}</h3>
                  <CapacityBadge cost={item.product.capacity_cost as any} size="sm" />
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}