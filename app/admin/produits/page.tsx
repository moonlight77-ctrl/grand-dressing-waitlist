'use client';

import { useState, useTransition, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Search, AlertTriangle } from 'lucide-react';
import { getAdminProducts, deleteProduct } from '@/app/admin/produits/actions';
import ProductEditSheet from '@/components/admin/ProductEditSheet';
import CapacityBadge from '@/components/catalogue/CapacityBadge';
import type { Product } from '@/types/product';

export default function AdminProduitsPage() {
  const [products, setProducts]       = useState<Product[]>([]);
  const [filtered, setFiltered]       = useState<Product[]>([]);
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [editProduct, setEditProduct] = useState<Product | null | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isPending, startTransition]  = useTransition();

  // Charger les produits
  useEffect(() => {
    getAdminProducts().then((data) => {
      setProducts(data as Product[]);
      setFiltered(data as Product[]);
    });
  }, []);

  // Filtres
  useEffect(() => {
    let result = products;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      );
    }
    if (statusFilter === 'available')   result = result.filter((p) => p.status === 'available');
    if (statusFilter === 'unavailable') result = result.filter((p) => p.status !== 'available');
    setFiltered(result);
  }, [search, statusFilter, products]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      await deleteProduct(deleteTarget.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    });
  };

  const handleSaved = async () => {
    const data = await getAdminProducts();
    setProducts(data as Product[]);
  };

  const available   = products.filter((p) => p.status === 'available').length;
  const unavailable = products.filter((p) => p.status !== 'available').length;

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 px-4 md:px-8 py-10">
      <div className="max-w-screen-xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-4 h-px bg-amber-400" />
              <span className="text-[9px] uppercase tracking-[0.3em] text-amber-400/70">Administration</span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-light uppercase tracking-widest">
              Catalogue
            </h1>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1 font-sans">
              {products.length} pièces · {available} disponibles · {unavailable} indisponibles
            </p>
          </div>
          <button
            onClick={() => setEditProduct(null)}
            className="flex items-center gap-2 bg-white text-black px-5 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-amber-400 transition-colors self-start sm:self-auto"
          >
            <Plus size={14} />
            Ajouter une pièce
          </button>
        </div>

        {/* Barre de recherche + filtres */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom ou marque..."
              className="w-full bg-neutral-900 border border-neutral-800 pl-10 pr-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-amber-400 outline-none transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'available', 'unavailable'] as const).map((f) => {
              const labels = { all: 'Tous', available: 'Disponibles', unavailable: 'Indisponibles' };
              return (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-4 py-3 text-[9px] uppercase tracking-widest font-sans border transition-colors whitespace-nowrap ${
                    statusFilter === f
                      ? 'border-amber-400 text-amber-400 bg-amber-400/5'
                      : 'border-neutral-800 text-neutral-500 hover:border-neutral-600'
                  }`}
                >
                  {labels[f]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grille produits */}
        {filtered.length === 0 ? (
          <p className="text-neutral-600 text-sm font-sans text-center py-20">
            {search ? 'Aucun résultat pour cette recherche.' : 'Aucun produit.'}
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((product) => (
              <div key={product.id} className="relative group flex flex-col">

                {/* Image */}
                <div className="relative aspect-[3/4] bg-neutral-900 overflow-hidden">
                  <Image
                    src={product.image_url || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Overlay actions au hover */}
                  <div className={`absolute inset-0 bg-black/60 flex items-center justify-center gap-3 transition-opacity duration-200 opacity-0 group-hover:opacity-100`}>
                    <button
                      onClick={() => setEditProduct(product)}
                      className="w-10 h-10 bg-white text-black flex items-center justify-center hover:bg-amber-400 transition-colors"
                      title="Modifier"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(product)}
                      className="w-10 h-10 bg-neutral-900 text-white flex items-center justify-center hover:bg-red-600 transition-colors border border-neutral-700"
                      title="Supprimer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {/* Badges */}
                  {product.is_featured && (
                    <span className="absolute top-0 left-0 bg-amber-400 text-black text-[8px] font-bold uppercase tracking-wider px-2 py-1">
                      Sélection
                    </span>
                  )}
                  {product.status !== 'available' && (
                    <span className="absolute top-0 right-0 bg-neutral-800 text-neutral-400 text-[8px] font-bold uppercase tracking-wider px-2 py-1">
                      Indispo
                    </span>
                  )}
                </div>

                {/* Infos */}
                <div className="pt-3 flex flex-col gap-1">
                  <p className="text-[8px] text-amber-400/80 uppercase tracking-widest font-sans">{product.brand}</p>
                  <p className="text-xs font-display uppercase tracking-wide leading-tight text-neutral-100 line-clamp-2">
                    {product.name}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <CapacityBadge cost={product.capacity_cost as any} size="sm" />
                    <span className="text-[8px] text-neutral-600 font-sans uppercase tracking-wider">
                      {(product.sizes || []).join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Panel d'édition */}
      <ProductEditSheet
        product={editProduct}
        open={editProduct !== undefined}
        onClose={() => { setEditProduct(undefined); handleSaved(); }}
      />

      {/* Modal confirmation suppression */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-sm p-6 space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-red-950 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={18} className="text-red-400" />
              </div>
              <div>
                <p className="text-sm font-display uppercase tracking-wide text-white">
                  Supprimer cette pièce ?
                </p>
                <p className="text-[10px] text-neutral-500 font-sans mt-1">
                  {deleteTarget.name} · {deleteTarget.brand}
                </p>
                <p className="text-[9px] text-red-400/70 font-sans mt-2 uppercase tracking-wider">
                  Action irréversible
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 border border-neutral-700 text-neutral-400 text-[10px] uppercase tracking-widest hover:border-neutral-500 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 py-3 bg-red-600 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-red-500 transition-colors disabled:opacity-50"
              >
                {isPending ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}