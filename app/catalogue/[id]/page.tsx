// app/catalogue/[id]/page.tsx

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductById, getProducts } from '../actions';
import CapacityBadge from '@/components/catalogue/CapacityBadge';
import AddToDressingButton from '@/components/catalogue/AddToDressingButton';

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ id: p.id }));
}

interface Props {
  params: { id: string };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  const fallbackImage = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800';

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 font-display selection:bg-amber-200/30">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-900">
        <div className="max-w-screen-xl mx-auto px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-light tracking-[0.2em] uppercase hover:text-amber-400 transition-colors">
            Gradora
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/catalogue" className="font-sans text-[10px] tracking-[0.2em] uppercase text-amber-400">
              Catalogue
            </Link>
            <Link href="/dressing" className="font-sans text-[10px] tracking-[0.2em] uppercase text-neutral-500 hover:text-neutral-200 transition-colors">
              Mon dressing
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-screen-xl mx-auto px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-sans text-[10px] tracking-[0.15em] uppercase text-neutral-600 mb-10">
          <Link href="/" className="hover:text-neutral-400">Accueil</Link>
          <span>·</span>
          <Link href="/catalogue" className="hover:text-neutral-400">Catalogue</Link>
          <span>·</span>
          <span className="text-neutral-400 capitalize">{product.category}</span>
          <span>·</span>
          <span className="text-neutral-300">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image */}
          <div className="relative aspect-[3/4] bg-neutral-900 overflow-hidden">
            <Image
              src={product.image_url || fallbackImage}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.is_featured && (
              <div className="absolute top-4 left-4 bg-amber-400 text-black text-[9px] font-sans font-semibold tracking-[0.15em] uppercase px-2.5 py-1">
                Sélection
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center py-4">
            <CapacityBadge cost={product.capacity_cost as 10 | 20 | 30} />

            <div className="mt-4 mb-2">
              <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-neutral-500">
                {product.brand}
              </p>
              <h1 className="font-display text-4xl font-light text-neutral-100 leading-tight mt-1">
                {product.name}
              </h1>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-neutral-600 capitalize">
                {product.category}
              </span>
              {product.style && (
                <>
                  <span className="w-1 h-1 rounded-full bg-neutral-800" />
                  <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-neutral-600 capitalize">
                    {product.style}
                  </span>
                </>
              )}
            </div>

            {/* Separateur */}
            <div className="w-12 h-px bg-amber-400/30 mb-8" />

            {/* Description */}
            {product.description && (
              <p className="font-sans text-sm text-neutral-400 leading-relaxed mb-8">
                {product.description}
              </p>
            )}

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {product.color && (
                <div>
                  <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-neutral-700 mb-1">Couleur</p>
                  <p className="font-sans text-sm text-neutral-300">{product.color}</p>
                </div>
              )}
              {product.material && (
                <div>
                  <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-neutral-700 mb-1">Matière</p>
                  <p className="font-sans text-sm text-neutral-300">{product.material}</p>
                </div>
              )}
            </div>

            {/* CTA client */}
            <AddToDressingButton product={product} />

            {/* Capacity info */}
            <div className="mt-6 p-4 border border-neutral-900 bg-neutral-900/30">
              <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-neutral-600 mb-2">
                Coût en capacité
              </p>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className={`w-3 h-3 rounded-full ${i <= product.capacity_cost / 10 ? 'bg-amber-400' : 'bg-neutral-800'}`}
                    />
                  ))}
                </div>
                <p className="font-sans text-sm text-neutral-300">
                  <span className="text-amber-400 font-medium">{product.capacity_cost} points</span>
                  {' '}sur votre abonnement mensuel
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}