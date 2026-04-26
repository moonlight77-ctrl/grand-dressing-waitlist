import { getProductById } from '../actions';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import CapacityBadge from '@/components/catalogue/CapacityBadge';
import AddToDressingButton from '@/components/catalogue/AddToDressingButton';
import Footer from '@/components/Footer';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  return (
    <main className="min-h-screen bg-neutral-950">
      <section className="max-w-screen-xl mx-auto px-8 py-12 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Galerie Image */}
          <div className="relative aspect-[3/4] bg-neutral-900 overflow-hidden group">
            <Image
              src={product.image_url || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'}
              alt={product.name}
              fill
              priority
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            {product.is_featured && (
              <span className="absolute top-6 left-6 bg-amber-400 text-black text-[9px] font-bold uppercase tracking-[0.2em] px-4 py-2">
                Pièce d'exception
              </span>
            )}
          </div>

          {/* Infos Produit */}
          <div className="flex flex-col">
            <div className="mb-10 border-b border-neutral-900 pb-10">
              <p className="text-amber-400 text-xs uppercase tracking-[0.3em] mb-4">{product.brand}</p>
              <h1 className="text-3xl md:text-5xl font-light uppercase tracking-wider leading-tight mb-6">
                {product.name}
              </h1>
              <div className="flex items-center gap-6">
                <CapacityBadge cost={product.capacity_cost as any} />
                <span className="text-neutral-500 text-[10px] uppercase tracking-widest border-l border-neutral-800 pl-6">
                  {product.color} — {product.material}
                </span>
              </div>
            </div>

            <div className="space-y-8 mb-12">
              <p className="text-neutral-400 text-sm leading-relaxed font-sans max-w-md">
                {product.description}
              </p>
              
              <div className="bg-neutral-900/30 p-6 border border-neutral-900">
                <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2 italic">Note du styliste :</p>
                <p className="text-xs text-neutral-300">Cette pièce s'inscrit parfaitement dans un look {product.style}.</p>
              </div>
            </div>

            {/* Le bouton intelligent que nous avons créé */}
            <div className="mt-auto">
              <AddToDressingButton product={product} />
              <p className="mt-4 text-[9px] text-center text-neutral-600 uppercase tracking-widest">
                Livraison estimée : 48-72h · Pressing inclus
              </p>
            </div>
          </div>

        </div>
      </section>
      <Footer />
    </main>
  );
}