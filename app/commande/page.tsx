'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/store/useCart';
import { submitOrder, type OrderFormData } from '@/app/commande/actions';
import CapacityBadge from '@/components/catalogue/CapacityBadge';

const PICKUP_SLOTS = [
  'Lundi 10h–13h',
  'Lundi 14h–18h',
  'Mercredi 10h–13h',
  'Mercredi 14h–18h',
  'Samedi 10h–13h',
  'Samedi 14h–18h',
];

export default function CommandePage() {
  const { items, getTotalPoints, maxPoints, clearCart } = useCart();
  const router = useRouter();
  const totalPoints = getTotalPoints();

  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    postal_code: '',
    city: '',
    pickup_slot: '',
    note: '',
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    setError(null);

    const formData: OrderFormData = { ...form, delivery_type: deliveryType };
    const result = await submitOrder(formData, items);

    if (!result.success) {
      setError(result.message || 'Une erreur est survenue.');
      setLoading(false);
      return;
    }

    clearCart();
    router.push(`/commande/confirmation?id=${result.orderId}`);
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-neutral-950 flex items-center justify-center px-6">
        <div className="text-center space-y-4">
          <p className="font-display text-2xl font-light tracking-widest uppercase text-white">Dressing vide</p>
          <Link href="/catalogue" className="inline-block text-[10px] uppercase tracking-widest text-amber-400 underline underline-offset-4">
            Retour au catalogue
          </Link>
        </div>
      </main>
    );
  }

  const inputClass = "w-full bg-transparent border-b border-neutral-800 pb-3 pt-1 text-sm text-white placeholder:text-neutral-700 focus:border-amber-400 outline-none transition-colors duration-300";
  const labelClass = "block text-[9px] uppercase tracking-[0.25em] text-neutral-500 mb-1";

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 px-6 py-16">
      <div className="max-w-screen-lg mx-auto">

        {/* Header */}
        <div className="mb-12">
          <Link href="/panier" className="text-[9px] uppercase tracking-widest text-neutral-600 hover:text-amber-400 transition-colors mb-6 inline-block">
            ← Retour au panier
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-4 h-px bg-amber-400" />
            <span className="text-[9px] uppercase tracking-[0.3em] text-amber-400/70">Validation</span>
          </div>
          <h1 className="font-display text-3xl font-light uppercase tracking-widest">
            Finaliser le prêt
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16">

          {/* ── Formulaire ── */}
          <form onSubmit={handleSubmit} className="space-y-10">

            {/* Identité */}
            <section>
              <h2 className="font-display text-sm uppercase tracking-[0.25em] text-white mb-6 pb-3 border-b border-neutral-900">
                Vos informations
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Prénom</label>
                  <input type="text" required value={form.first_name} onChange={set('first_name')} className={inputClass} placeholder="Marie" />
                </div>
                <div>
                  <label className={labelClass}>Nom</label>
                  <input type="text" required value={form.last_name} onChange={set('last_name')} className={inputClass} placeholder="Dupont" />
                </div>
              </div>
              <div className="mt-6">
                <label className={labelClass}>Téléphone</label>
                <input type="tel" value={form.phone} onChange={set('phone')} className={inputClass} placeholder="06 00 00 00 00" />
              </div>
            </section>

            {/* Type de livraison */}
            <section>
              <h2 className="font-display text-sm uppercase tracking-[0.25em] text-white mb-6 pb-3 border-b border-neutral-900">
                Mode de réception
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {(['delivery', 'pickup'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setDeliveryType(type)}
                    className={`py-5 px-4 border text-left transition-all duration-200 ${
                      deliveryType === type
                        ? 'border-amber-400 bg-amber-400/5'
                        : 'border-neutral-800 hover:border-neutral-600'
                    }`}
                  >
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${deliveryType === type ? 'text-amber-400' : 'text-white'}`}>
                      {type === 'delivery' ? '📦 Livraison' : '🤝 point relais'}
                    </p>
                    <p className="text-[9px] text-neutral-500 uppercase tracking-wider">
                      {type === 'delivery' ? 'À la adresse · 48-72h' : 'Pas encore · disponible'}
                    </p>
                  </button>
                ))}
              </div>

              {/* Champs livraison */}
              {deliveryType === 'delivery' && (
                <div className="space-y-6">
                  <div>
                    <label className={labelClass}>Adresse</label>
                    <input type="text" required value={form.address_line1} onChange={set('address_line1')} className={inputClass} placeholder="12 rue de la Paix" />
                  </div>
                  <div>
                    <label className={labelClass}>Complément (optionnel)</label>
                    <input type="text" value={form.address_line2} onChange={set('address_line2')} className={inputClass} placeholder="Appartement, étage..." />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>Code postal</label>
                      <input type="text" required value={form.postal_code} onChange={set('postal_code')} className={inputClass} placeholder="75001" />
                    </div>
                    <div>
                      <label className={labelClass}>Ville</label>
                      <input type="text" required value={form.city} onChange={set('city')} className={inputClass} placeholder="Paris" />
                    </div>
                  </div>
                </div>
              )}

              {/* Créneau pickup */}
              {deliveryType === 'pickup' && (
                <div>
                  <label className={labelClass}>Créneau souhaité</label>
                  <select
                    required
                    value={form.pickup_slot}
                    onChange={set('pickup_slot')}
                    className="w-full bg-neutral-900 border border-neutral-800 px-4 py-3 text-sm text-white focus:border-amber-400 outline-none transition-colors"
                  >
                    <option value="">Choisir un créneau</option>
                    {PICKUP_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                  <p className="mt-2 text-[9px] text-neutral-600 uppercase tracking-wider">
                    Zone Paris intra-muros · Adresse confirmée par email
                  </p>
                </div>
              )}
            </section>

            {/* Note */}
            <section>
              <h2 className="font-display text-sm uppercase tracking-[0.25em] text-white mb-6 pb-3 border-b border-neutral-900">
                Note (optionnel)
              </h2>
              <textarea
                value={form.note}
                onChange={set('note')}
                rows={3}
                className="w-full bg-transparent border-b border-neutral-800 pb-3 pt-1 text-sm text-white placeholder:text-neutral-700 focus:border-amber-400 outline-none transition-colors resize-none"
                placeholder="Pointure, préférences de taille, instructions particulières..."
              />
            </section>

            {error && (
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-red-500 flex-shrink-0" />
                <p className="text-red-400 text-[10px] uppercase tracking-wider">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="relative w-full py-5 overflow-hidden group disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-white transition-transform duration-500 group-hover:scale-x-0 origin-right" />
              <div className="absolute inset-0 bg-amber-400 transition-transform duration-500 scale-x-0 group-hover:scale-x-100 origin-left" />
              <span className="relative text-black font-sans text-[11px] tracking-[0.3em] uppercase font-bold">
                {loading ? 'Confirmation...' : 'Confirmer le prêt'}
              </span>
            </button>
          </form>

          {/* ── Récap commande ── */}
          <aside className="lg:sticky lg:top-28 self-start space-y-6">
            <div className="border border-neutral-900 p-6">
              <h3 className="font-display text-sm uppercase tracking-widest mb-6 pb-4 border-b border-neutral-900">
                Votre sélection
              </h3>

              <div className="space-y-5 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-14 flex-shrink-0 aspect-[3/4] bg-neutral-900 overflow-hidden">
                      {item.image_url && (
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] text-amber-400/80 uppercase tracking-wider font-sans">{item.brand}</p>
                      <p className="text-xs font-display uppercase tracking-wide leading-tight mt-0.5">{item.name}</p>
                      <div className="mt-2">
                        <CapacityBadge cost={item.capacity_cost as any} size="sm" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Barre capacité */}
              <div className="pt-4 border-t border-neutral-900 space-y-3">
                <div className="flex justify-between text-[9px] uppercase tracking-widest">
                  <span className="text-neutral-500">Capacité utilisée</span>
                  <span className="text-white font-bold">{totalPoints} / {maxPoints} pts</span>
                </div>
                <div className="h-0.5 bg-neutral-800">
                  <div
                    className="h-full bg-amber-400 transition-all duration-500"
                    style={{ width: `${(totalPoints / maxPoints) * 100}%` }}
                  />
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full ${totalPoints >= (i + 1) * 10 ? 'bg-amber-400' : 'bg-neutral-800'}`} />
                  ))}
                </div>
              </div>
            </div>

            <p className="text-[9px] text-neutral-600 uppercase tracking-wider leading-relaxed text-center">
              Durée du prêt : 1 mois · Pressing inclus au retour · Aucun paiement requis
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}