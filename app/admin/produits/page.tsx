// app/admin/produits/page.tsx
// Page d'administration pour ajouter / modifier des produits
// Accès : /admin/produits (non protégé pour le MVP — à sécuriser avant prod)

import AdminProductForm from '@/components/admin/AdminProductForm';

export const metadata = {
  title: 'Admin — Gestion produits · Gradora',
};

export default function AdminProduitsPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 font-sans">
      {/* Header */}
      <div className="border-b border-neutral-900 px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-display text-lg font-light tracking-widest uppercase">Gradora</span>
          <span className="text-neutral-700">·</span>
          <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-amber-400">Admin</span>
        </div>
        <a
          href="/catalogue"
          className="text-[10px] font-sans tracking-[0.15em] uppercase text-neutral-600 hover:text-neutral-300 transition-colors"
        >
          ← Voir le catalogue
        </a>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-12">
        <div className="mb-10">
          <p className="text-[10px] font-sans tracking-[0.2em] uppercase text-neutral-600 mb-2">
            Administration
          </p>
          <h1 className="font-display text-3xl font-light text-neutral-100">
            Ajouter une pièce
          </h1>
          <p className="font-sans text-sm text-neutral-500 mt-2">
            Le produit sera immédiatement visible dans le catalogue.
          </p>
        </div>

        <AdminProductForm />
      </div>
    </main>
  );
}
