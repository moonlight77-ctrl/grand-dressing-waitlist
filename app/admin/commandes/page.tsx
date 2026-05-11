import { createClient } from '@/lib/supabase/server';
import { updateOrderStatus } from '@/app/admin/commandes/actions';
import { redirect } from 'next/navigation';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:   { label: 'En attente',  color: 'bg-neutral-700 text-neutral-300' },
  confirmed: { label: 'Confirmée',   color: 'bg-blue-900 text-blue-300' },
  shipped:   { label: 'Expédiée',    color: 'bg-amber-900 text-amber-300' },
  active:    { label: 'En cours',    color: 'bg-green-900 text-green-300' },
  returned:  { label: 'Retournée',   color: 'bg-neutral-800 text-neutral-500' },
  cancelled: { label: 'Annulée',     color: 'bg-red-900 text-red-400' },
};

const NEXT_STATUS: Record<string, string[]> = {
  pending:   ['confirmed', 'cancelled'],
  confirmed: ['shipped'],
  shipped:   ['active'],
  active:    ['returned'],
  returned:  [],
  cancelled: [],
};

export default async function AdminCommandesPage() {
  const supabase = await createClient();

  // Vérif admin basique — à remplacer par un vrai check de rôle
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: orders } = await supabase
    .from('orders')
    .select(`*, profiles(full_name)`)
    .order('created_at', { ascending: false });

  const pendingCount = orders?.filter((o) => o.status === 'pending').length || 0;

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 px-8 py-12">
      <div className="max-w-screen-xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-4 h-px bg-amber-400" />
            <span className="text-[9px] uppercase tracking-[0.3em] text-amber-400/70">Administration</span>
          </div>
          <div className="flex items-end justify-between">
            <h1 className="font-display text-3xl font-light uppercase tracking-widest">
              Commandes
            </h1>
            {pendingCount > 0 && (
              <span className="bg-amber-400 text-black text-[9px] font-bold uppercase tracking-widest px-3 py-1.5">
                {pendingCount} en attente
              </span>
            )}
          </div>
        </div>

        {/* Filtres statuts */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {Object.entries(STATUS_LABELS).map(([key, { label, color }]) => {
            const count = orders?.filter((o) => o.status === key).length || 0;
            return (
              <span key={key} className={`text-[9px] uppercase tracking-widest px-3 py-1.5 font-sans ${color}`}>
                {label} ({count})
              </span>
            );
          })}
        </div>

        {/* Table des commandes */}
        {!orders?.length ? (
          <p className="text-neutral-600 text-sm font-sans">Aucune commande pour l'instant.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const items = order.items as Array<{ name: string; brand: string; image_url: string; capacity_cost: number }>;
              const statusInfo = STATUS_LABELS[order.status] || STATUS_LABELS.pending;
              const nextActions = NEXT_STATUS[order.status] || [];

              return (
                <div key={order.id} className="border border-neutral-900 p-6 hover:border-neutral-800 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">

                    {/* Infos commande */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="font-sans text-[10px] text-neutral-500 uppercase tracking-widest">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                        <span className={`text-[9px] uppercase tracking-widest px-2 py-1 font-sans ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                        <span className="text-[9px] text-neutral-600 font-sans">
                          {new Date(order.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </div>

                      {/* Influenceuse */}
                      <div>
                        <p className="text-sm font-display uppercase tracking-wide">
                          {order.first_name} {order.last_name}
                        </p>
                        <p className="text-[9px] text-neutral-500 font-sans mt-0.5">
                          {order.profiles?.full_name && `@${order.profiles.full_name} · `}
                          {order.phone}
                        </p>
                      </div>

                      {/* Livraison */}
                      <div className="text-[9px] text-neutral-500 uppercase tracking-wider font-sans">
                        {order.delivery_type === 'delivery'
                          ? `📦 ${order.address_line1}, ${order.postal_code} ${order.city}`
                          : `🤝 Remise main propre · ${order.pickup_slot}`}
                      </div>

                      {/* Pièces */}
                      <div className="flex gap-3 flex-wrap">
                        {items.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 bg-neutral-900 px-3 py-2">
                            {item.image_url && (
                              <img src={item.image_url} alt={item.name} className="w-6 h-8 object-cover" />
                            )}
                            <div>
                              <p className="text-[8px] text-amber-400/80 uppercase tracking-wider">{item.brand}</p>
                              <p className="text-[9px] font-sans text-neutral-300">{item.name}</p>
                            </div>
                            <span className="text-[8px] text-neutral-600 ml-1">{item.capacity_cost}pts</span>
                          </div>
                        ))}
                      </div>

                      {order.note && (
                        <p className="text-[9px] text-neutral-500 italic font-sans border-l-2 border-neutral-800 pl-3">
                          "{order.note}"
                        </p>
                      )}
                    </div>

                    {/* Capacité + Actions */}
                    <div className="flex flex-col gap-4 lg:items-end">
                      <div className="text-right">
                        <p className="text-[9px] uppercase tracking-widest text-neutral-500 font-sans">Capacité</p>
                        <p className="text-lg font-display text-white">{order.total_capacity_cost} <span className="text-xs text-neutral-600">/ 50 pts</span></p>
                      </div>

                      {/* Boutons d'action */}
                      {nextActions.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {nextActions.map((nextStatus) => {
                            const info = STATUS_LABELS[nextStatus];
                            return (
                              <form key={nextStatus} action={async () => {
                                'use server';
                                await updateOrderStatus(order.id, nextStatus as any);
                              }}>
                                <button
                                  type="submit"
                                  className={`px-4 py-2 text-[9px] uppercase tracking-widest font-bold transition-colors font-sans ${
                                    nextStatus === 'cancelled'
                                      ? 'border border-red-900 text-red-500 hover:bg-red-900/30'
                                      : 'bg-white text-black hover:bg-amber-400'
                                  }`}
                                >
                                  → {info.label}
                                </button>
                              </form>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}