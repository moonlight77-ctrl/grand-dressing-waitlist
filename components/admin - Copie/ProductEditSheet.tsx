'use client';

import { useState, useRef, useTransition } from 'react';
import { X, Plus, Trash2, Upload, Link as LinkIcon } from 'lucide-react';
import { updateProduct, createProduct } from '@/app/admin/produits/actions';
import type { Product } from '@/types/product';

interface Props {
  product?: Product | null; // null = création
  open: boolean;
  onClose: () => void;
}

const STYLES    = ['Casual', 'Chic', 'Streetwear', 'Soirée', 'Sport', 'Business'];
const CATEGORIES = ['Femme', 'Homme', 'Accessoires'];
const COSTS     = [10, 20, 30] as const;

export default function ProductEditSheet({ product, open, onClose }: Props) {
  const isNew = !product;
  const [isPending, startTransition] = useTransition();
  const [error, setError]   = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [previewUrl, setPreviewUrl] = useState(product?.image_url || '');
  const fileRef = useRef<HTMLInputElement>(null);

  // Tailles — gestion par chips
  const [sizes, setSizes] = useState<string[]>(product?.sizes || []);
  const [sizeInput, setSizeInput] = useState('');
  const [selectedCost, setSelectedCost] = useState<10 | 20 | 30>(product?.capacity_cost ?? 10);

  const addSize = () => {
    const val = sizeInput.trim().toUpperCase();
    if (val && !sizes.includes(val)) setSizes([...sizes, val]);
    setSizeInput('');
  };
  const removeSize = (s: string) => setSizes(sizes.filter((x) => x !== s));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const fd = new FormData(e.currentTarget);
    fd.set('sizes', sizes.join(','));
    fd.set('capacity_cost', String(selectedCost));
    fd.set('image_url', previewUrl);

    startTransition(async () => {
      const result = isNew
        ? await createProduct(fd)
        : await updateProduct(product!.id, fd);

      if (!result.success) {
        setError(result.message || 'Erreur inconnue');
      } else {
        setSuccess(true);
        setTimeout(() => { setSuccess(false); onClose(); }, 900);
      }
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Preview local immédiat
    setPreviewUrl(URL.createObjectURL(file));
    // Upload réel via action (dynamique)
    const { uploadProductImage } = await import('@/app/admin/produits/actions');
    const url = await uploadProductImage(file);
    if (url) setPreviewUrl(url);
  };

  const inputCls = "w-full bg-neutral-900 border border-neutral-800 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-amber-400 outline-none transition-colors rounded-none";
  const labelCls = "block text-[9px] uppercase tracking-[0.25em] text-neutral-500 mb-1.5";

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[70] transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Panel — bottom sheet sur mobile, side panel sur desktop */}
      <div className={`
        fixed z-[80] bg-neutral-950 border-neutral-800 transition-transform duration-400 ease-out overflow-y-auto
        /* Mobile : bottom sheet */
        bottom-0 left-0 right-0 max-h-[92dvh] border-t rounded-t-2xl
        /* Desktop : side panel */
        lg:top-0 lg:bottom-0 lg:left-auto lg:right-0 lg:w-[480px] lg:max-h-none lg:border-t-0 lg:border-l lg:rounded-none
        ${open
          ? 'translate-y-0 lg:translate-x-0'
          : 'translate-y-full lg:translate-y-0 lg:translate-x-full'
        }
      `}>

        {/* Handle mobile */}
        <div className="lg:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-neutral-700 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-900 sticky top-0 bg-neutral-950 z-10">
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-amber-400/70 mb-0.5">
              {isNew ? 'Nouveau produit' : 'Modifier'}
            </p>
            <h2 className="font-display text-lg uppercase tracking-widest text-white">
              {isNew ? 'Ajouter une pièce' : product?.name}
            </h2>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6 pb-32 lg:pb-8">

          {/* Image */}
          <div>
            <label className={labelCls}>Image</label>
            <div className="flex gap-2 mb-3">
              {(['url', 'upload'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setImageMode(mode)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-[9px] uppercase tracking-wider border transition-colors ${
                    imageMode === mode ? 'border-amber-400 text-amber-400' : 'border-neutral-800 text-neutral-500'
                  }`}
                >
                  {mode === 'url' ? <LinkIcon size={10} /> : <Upload size={10} />}
                  {mode === 'url' ? 'URL' : 'Upload'}
                </button>
              ))}
            </div>

            {imageMode === 'url' ? (
              <input
                type="url"
                value={previewUrl}
                onChange={(e) => setPreviewUrl(e.target.value)}
                className={inputCls}
                placeholder="https://images.unsplash.com/..."
              />
            ) : (
              <>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full py-3 border border-dashed border-neutral-700 text-neutral-500 text-[10px] uppercase tracking-widest hover:border-amber-400 hover:text-amber-400 transition-colors"
                >
                  Choisir un fichier
                </button>
              </>
            )}

            {/* Preview */}
            {previewUrl && (
              <div className="mt-3 relative w-20 h-24 bg-neutral-900 overflow-hidden">
                <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Nom + Marque */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Nom *</label>
              <input name="name" required defaultValue={product?.name} className={inputCls} placeholder="Nom de la pièce" />
            </div>
            <div>
              <label className={labelCls}>Marque *</label>
              <input name="brand" required defaultValue={product?.brand} className={inputCls} placeholder="Nike, Zara..." />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              name="description"
              defaultValue={product?.description || ''}
              rows={3}
              className={`${inputCls} resize-none`}
              placeholder="Description de la pièce..."
            />
          </div>

          {/* Couleur + Matière */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Couleur</label>
              <input name="color" defaultValue={product?.color || ''} className={inputCls} placeholder="Noir, Beige..." />
            </div>
            <div>
              <label className={labelCls}>Matière</label>
              <input name="material" defaultValue={product?.material || ''} className={inputCls} placeholder="Coton, Soie..." />
            </div>
          </div>

          {/* Style + Catégorie */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Style</label>
              <select name="style" defaultValue={product?.style || ''} className={inputCls}>
                <option value="">— Choisir —</option>
                {STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Catégorie</label>
              <select name="category" defaultValue={product?.category || ''} className={inputCls}>
                <option value="">— Choisir —</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Tailles — chips */}
          <div>
            <label className={labelCls}>Tailles disponibles</label>
            <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
              {sizes.map((s) => (
                <span
                  key={s}
                  className="flex items-center gap-1.5 bg-neutral-800 text-white text-[10px] uppercase tracking-widest px-3 py-1.5"
                >
                  {s}
                  <button type="button" onClick={() => removeSize(s)} className="text-neutral-500 hover:text-red-400 transition-colors">
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSize(); }}}
                className={`${inputCls} flex-1`}
                placeholder="XS, S, M, L, 38, 42..."
              />
              <button
                type="button"
                onClick={addSize}
                className="px-4 bg-neutral-800 text-white hover:bg-amber-400 hover:text-black transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Capacité de dressing */}
          <div>
            <label className={labelCls}>Capacité de dressing *</label>
            <div className="grid grid-cols-3 gap-3">
              {COSTS.map((cost) => {
                const labels = { 10: 'Essentiel', 20: 'Premium', 30: 'Luxe' };
                return (
                  <button
                    key={cost}
                    type="button"
                    onClick={() => setSelectedCost(cost)}
                    className={`relative cursor-pointer border p-3 text-center transition-colors ${
                      selectedCost === cost
                        ? 'border-amber-400 bg-amber-400/5'
                        : 'border-neutral-800 hover:border-neutral-600'
                    }`}
                  >
                    <div className="flex justify-center gap-0.5 mb-1.5">
                      {[1,2,3].map((i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= cost/10 ? 'bg-amber-400' : 'bg-neutral-700'}`} />
                      ))}
                    </div>
                    <p className="text-[9px] uppercase tracking-widest text-neutral-400">{labels[cost]}</p>
                    <p className="text-[10px] font-bold text-white">{cost} pts</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'status', label: 'Disponible', defaultVal: (product?.status ?? 'available') === 'available' },
              { name: 'is_featured',  label: 'Sélection',  defaultVal: product?.is_featured ?? false },
            ].map(({ name, label, defaultVal }) => (
              <label key={name} className="flex items-center justify-between border border-neutral-800 px-4 py-3 cursor-pointer hover:border-neutral-700 transition-colors">
                <span className="text-[10px] uppercase tracking-widest text-neutral-400">{label}</span>
                <input
                  type="checkbox"
                  name={name}
                  value="true"
                  defaultChecked={defaultVal}
                  className="w-4 h-4 accent-amber-400"
                />
              </label>
            ))}
          </div>

          {/* Feedback */}
          {error && (
            <p className="text-red-400 text-[10px] uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
              {error}
            </p>
          )}

          {/* Submit — sticky en bas */}
          <div className="fixed bottom-0 left-0 right-0 lg:static lg:mt-4 p-4 lg:p-0 bg-neutral-950 border-t border-neutral-900 lg:border-none z-10">
            <button
              type="submit"
              disabled={isPending}
              className={`relative w-full py-4 overflow-hidden group disabled:opacity-50 transition-all ${
                success ? 'bg-amber-400' : ''
              }`}
            >
              {!success && (
                <>
                  <div className="absolute inset-0 bg-white transition-transform duration-500 group-hover:scale-x-0 origin-right" />
                  <div className="absolute inset-0 bg-amber-400 transition-transform duration-500 scale-x-0 group-hover:scale-x-100 origin-left" />
                </>
              )}
              <span className="relative text-black font-sans text-[11px] tracking-[0.3em] uppercase font-bold">
                {isPending ? 'Sauvegarde...' : success ? '✓ Sauvegardé' : isNew ? 'Créer la pièce' : 'Sauvegarder'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}