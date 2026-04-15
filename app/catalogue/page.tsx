// app/catalogue/page.tsx

import Link from 'next/link';
import { Suspense } from 'react';
import { getProducts } from './actions';
import CatalogueClient from '@/components/catalogue/CatalogueClient';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Catalogue — Gradora',
  description: 'Explorez notre sélection de pièces premium disponibles à la location.',
};

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export default async function CataloguePage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 font-display selection:bg-amber-200/30">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-900">
        <div className="max-w-screen-xl mx-auto px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="font-display text-xl font-light tracking-[0.2em] uppercase hover:text-amber-400 transition-colors"
          >
            Gradora
          </Link>

          <div className="flex items-center gap-8">
            <Link
              href="/catalogue"
              className="font-sans text-[10px] tracking-[0.2em] uppercase text-amber-400 border-b border-amber-400/40 pb-0.5"
            >
              Catalogue
            </Link>
            <Link
              href="/dressing"
              className="font-sans text-[10px] tracking-[0.2em] uppercase text-neutral-500 hover:text-neutral-200 transition-colors"
            >
              Mon dressing
            </Link>
            <Link
              href="/panier"
              className="font-sans text-[10px] tracking-[0.2em] uppercase text-neutral-500 hover:text-neutral-200 transition-colors flex items-center gap-1.5"
            >
              Panier
              {/* Cart badge placeholder */}
              <span className="w-4 h-4 rounded-full bg-amber-400 text-black text-[9px] font-sans font-bold flex items-center justify-center leading-none">
                0
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero banner */}
      <section className="relative overflow-hidden border-b border-neutral-900">
        <div className="max-w-screen-xl mx-auto px-8 py-16">
          <div className="flex items-end justify-between">
            <div>
              {/* Breadcrumb */}
              <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-neutral-600 mb-4 flex items-center gap-2">
                <Link href="/" className="hover:text-neutral-400 transition-colors">Accueil</Link>
                <span>·</span>
                <span className="text-neutral-400">Catalogue</span>
              </p>

              <h1 className="font-display font-light leading-none">
                <span className="block text-3xl md:text-5xl text-neutral-100 tracking-tight">La sélection</span>
                <span className="block text-3xl md:text-5xl text-amber-400/80 tracking-tight mt-1">du moment</span>
              </h1>

              <p className="font-sans text-[11px] tracking-[0.15em] uppercase text-neutral-500 mt-6 max-w-xs leading-relaxed">
                Chaque pièce, choisie pour son caractère. Portez-la, renvoyez-la, recommencez.
              </p>
            </div>

            {/* Capacity explainer */}
            <div className="hidden lg:block border border-neutral-800 p-6 min-w-[220px]">
              <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-neutral-600 mb-4">
                Comment ça marche
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { dots: 1, label: 'Essentiel', pts: '10 pts' },
                  { dots: 2, label: 'Premium', pts: '20 pts' },
                  { dots: 3, label: 'Luxe', pts: '30 pts' },
                ].map(({ dots, label, pts }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="flex gap-0.5">
                      {[1, 2, 3].map((i) => (
                        <span
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${i <= dots ? 'bg-amber-400' : 'bg-neutral-800'}`}
                        />
                      ))}
                    </div>
                    <span className="font-sans text-[10px] text-neutral-400 tracking-wider">{label}</span>
                    <span className="font-sans text-[10px] text-neutral-600 ml-auto">{pts}</span>
                  </div>
                ))}
              </div>
              <p className="font-sans text-[9px] text-neutral-700 mt-4 leading-relaxed">
                Votre abonnement inclut un total de points par mois. Combinez librement.
              </p>
            </div>
          </div>
        </div>

        {/* Decorative line */}
        <div className="absolute bottom-0 left-8 w-16 h-px bg-amber-400/30" />
      </section>

      {/* Main catalogue area */}
      <section className="max-w-screen-xl mx-auto px-8 py-12">
        <Suspense fallback={<CatalogueSkeleton />}>
          <CatalogueClient initialProducts={products} />
        </Suspense>
      </section>

      <Footer />
    </main>
  );
}

// ── Loading skeleton ──────────────────────────────────────

function CatalogueSkeleton() {
  return (
    <div className="flex gap-12">
      {/* Sidebar skeleton */}
      <div className="w-56 shrink-0">
        <div className="h-8 w-24 bg-neutral-900 animate-pulse rounded mb-6" />
        <div className="space-y-3">
          {[60, 80, 50, 70, 55].map((w, i) => (
            <div key={i} className={`h-3 bg-neutral-900 animate-pulse rounded`} style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="aspect-[3/4] bg-neutral-900 animate-pulse" />
            <div className="h-3 w-16 bg-neutral-900 animate-pulse" />
            <div className="h-4 w-32 bg-neutral-900 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
