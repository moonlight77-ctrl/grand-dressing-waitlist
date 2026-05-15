'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import CapacityBadge from '@/components/catalogue/CapacityBadge';

interface OrderItem {
  id: string;
  name: string;
  brand: string;
  image_url: string | null;
  capacity_cost: number;
}

interface Order {
  id: string;
  status: string;
  created_at: string;
  items: OrderItem[];
  total_capacity_cost: number;
  delivery_type: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:   { label: 'En attente',  color: 'text-neutral-400 border-neutral-700' },
  confirmed: { label: 'Confirmée',   color: 'text-blue-400 border-blue-800' },
  shipped:   { label: 'En route',    color: 'text-amber-400 border-amber-800' },
  active:    { label: 'En cours',    color: 'text-green-400 border-green-800' },
  returned:  { label: 'Retournée',   color: 'text-neutral-600 border-neutral-800' },
  cancelled: { label: 'Annulée',     color: 'text-red-400 border-red-900' },
};

export default function MyDressingPage() {
  const [orders, setOrders]   = useState<Order[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      // Profil
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(prof);

      // Commandes actives (pas retournées ni annulées)
      const { data: ordersData } = await supabase
        .from('orders')
        .select('id, status, created_at, items, total_capacity_cost, delivery_type')
        .eq('user_id', user.id)
        .not('status', 'in', '(returned,cancelled)')
        .order('created_at', { ascending: false });

      setOrders((ordersData || []) as Order[]);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-amber-400 uppercase tracking-widest text-xs">
        Chargement du dressing...
      </div>
    );
  }

  // Toutes les pièces actives (orders non retournées)
  const activeItems = orders
    .filter((o) => o.status === 'active' || o.status === 'shipped' || o.status === 'confirmed' || o.status === 'pending')
    .flatMap((o) => o.items.map((item) => ({ ...item, orderStatus: o.status, orderId: o.id })));

  const usedPoints = activeItems.reduce((acc, item) => acc + (item.capacity_cost || 0), 0);
  const totalPoints = profile?.style_points_total || 50;

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 font-display p-8 md:p-16">
      <div className="max-w-screen-xl mx-auto">

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-4 h-px bg-amber-400" />
              <span className="text-[9px] uppercase tracking-[0.3em] text-amber-400/70">Espace membre</span>
            </div>
            <h1 className="text-3xl font-light uppercase tracking-[0.3em]">Mon Dressing</h1>
            <p className="text-neutral-500 text-[10px] uppercase tracking-widest mt-1">
              Membre Bêta Privée · Gradora
            </p>
          </div>

          {/* Capacité */}
          <div className="w-full md:w-72 space-y-3">
            <div className="flex justify-between text-[9px] uppercase tracking-widest">
              <span className="text-neutral-500">Capacité de dressing</span>
              <span className="text-amber-400 font-bold">{usedPoints} / {totalPoints} pts</span>
            </div>
            <div className="h-0.5 bg-neutral-800 w-full relative">
              <div
                className="absolute h-full bg-amber-400 transition-all duration-700"
                style={{ width: `${Math.min((usedPoints / totalPoints) * 100, 100)}%` }}
              />
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full ${usedPoints >= (i + 1) * 10 ? 'bg-amber-400' : 'bg-neutral-800'}`} />
              ))}
            </div>
          </div>
        </header>

        {/* Pièces actives */}
        {activeItems.length === 0 ? (
          <div className="py-32 border border-dashed border-neutral-900 text-center space-y-6">
            <p className="text-neutral-600 uppercase tracking-widest text-xs">
              Aucune pièce dans votre dressing actuellement
            </p>
            <Link
              href="/catalogue"
              className="inline-block bg-white text-black px-10 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-amber-400 transition-colors"
            >
              Parcourir le catalogue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
            {activeItems.map((item, i) => {
              const statusInfo = STATUS_LABELS[item.orderStatus] || STATUS_LABELS.pending;
              return (
                <div key={`${item.id}-${i}`} className="group">
                  <div className="relative aspect-[3/4] bg-neutral-900 mb-4 overflow-hidden">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-800" />
                    )}
                    <div className="absolute top-3 left-3">
                      <span className={`bg-neutral-950/80 backdrop-blur-sm px-2.5 py-1 text-[8px] uppercase tracking-widest border ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] text-amber-400/80 uppercase tracking-widest mb-1 font-sans">{item.brand}</p>
                    <h3 className="text-sm font-light uppercase tracking-wide mb-2 leading-tight">{item.name}</h3>
                    <CapacityBadge cost={item.capacity_cost as any} size="sm" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Historique commandes */}
        {orders.length > 0 && (
          <div className="border-t border-neutral-900 pt-12">
            <h2 className="font-display text-sm uppercase tracking-[0.25em] text-neutral-400 mb-6">
              Historique des prêts
            </h2>
            <div className="space-y-3">
              {orders.map((order) => {
                const statusInfo = STATUS_LABELS[order.status] || STATUS_LABELS.pending;
                return (
                  <div key={order.id} className="flex items-center justify-between border border-neutral-900 px-5 py-4 hover:border-neutral-800 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className={`text-[9px] uppercase tracking-widest border px-2 py-1 font-sans ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                      <span className="text-[9px] text-neutral-500 font-sans uppercase tracking-wider">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span className="text-[9px] text-neutral-600 font-sans">
                        {new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <span className="text-[9px] text-neutral-500 font-sans">
                      {order.items?.length || 0} pièce{(order.items?.length || 0) > 1 ? 's' : ''} · {order.total_capacity_cost} pts
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}