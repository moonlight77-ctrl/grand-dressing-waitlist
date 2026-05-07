import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  if (!id) notFound();

  const supabase = await createClient();
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (!order) notFound();

  const items = order.items as Array<{
    name: string;
    brand: string;
    image_url: string;
    capacity_cost: number;
  }>;

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg text-center space-y-10">

        {/* Icône succès */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full border border-amber-400/30 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-amber-400/10 flex items-center justify-center">
              <span className="text-amber-400 text-xl">✓</span>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-3">
            <div className="w-6 h-px bg-amber-400" />
            <span className="text-[9px] uppercase tracking-[0.3em] text-amber-400/70">Prêt confirmé</span>
            <div className="w-6 h-px bg-amber-400" />
          </div>
          <h1 className="font-display text-3xl font-light uppercase tracking-widest">
            C'est lancé !
          </h1>
          <p className="text-neutral-400 text-sm font-sans leading-relaxed">
            Votre sélection a bien été enregistrée. Vous allez recevoir un email de confirmation avec tous les détails.
          </p>
        </div>

        {/* Récap pièces */}
        <div className="border border-neutral-900 p-6 text-left space-y-4">
          <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-500 pb-3 border-b border-neutral-900">
            Votre dressing du mois
          </p>
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-10 h-12 bg-neutral-900 flex-shrink-0 overflow-hidden">
                {item.image_url && (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div>
                <p className="text-[8px] text-amber-400/80 uppercase tracking-widest font-sans">{item.brand}</p>
                <p className="text-xs font-display uppercase tracking-wide">{item.name}</p>
              </div>
              <span className="ml-auto text-[9px] text-neutral-500 font-sans">{item.capacity_cost} pts</span>
            </div>
          ))}
        </div>

        {/* Livraison info */}
        <div className="bg-neutral-900/40 border border-neutral-900 p-5 text-left space-y-2">
          <p className="text-[9px] uppercase tracking-widest text-neutral-500">
            {order.delivery_type === 'delivery' ? '📦 Livraison' : '🤝 Remise en main propre'}
          </p>
          {order.delivery_type === 'delivery' ? (
            <p className="text-xs text-neutral-300 font-sans">
              {order.address_line1}{order.address_line2 ? `, ${order.address_line2}` : ''}<br />
              {order.postal_code} {order.city}
            </p>
          ) : (
            <p className="text-xs text-neutral-300 font-sans">
              Créneau : {order.pickup_slot}
            </p>
          )}
          <p className="text-[9px] text-neutral-600 uppercase tracking-wider pt-1">
            Durée du prêt : 1 mois · Pressing inclus au retour
          </p>
        </div>

        {/* Numéro de commande */}
        <p className="text-[9px] text-neutral-700 uppercase tracking-widest font-sans">
          Référence : {order.id.slice(0, 8).toUpperCase()}
        </p>

        {/* CTA */}
        <div className="flex flex-col gap-3">
          <Link
            href="/mon-dressing"
            className="w-full py-4 bg-white text-black font-sans text-[11px] tracking-[0.25em] uppercase font-bold hover:bg-amber-400 transition-colors text-center"
          >
            Voir mon dressing
          </Link>
          <Link
            href="/catalogue"
            className="text-[9px] uppercase tracking-widest text-neutral-500 hover:text-amber-400 transition-colors"
          >
            Retour au catalogue
          </Link>
        </div>
      </div>
    </main>
  );
}