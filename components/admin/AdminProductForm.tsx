'use client';

// components/admin/AdminProductForm.tsx

import { useState, useTransition } from 'react';
import { createProduct } from '@/app/admin/produits/actions';

const SIZES_FEMME = ['XS', 'S', 'M', 'L', 'XL', '34', '36', '38', '40', '42', '44', 'TU'];
const SIZES_HOMME = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '44', '46', '48', '50', '52', 'TU'];

const STYLES = ['casual', 'business', 'soiree', 'sport', 'streetwear'];

const initialState = {
  name: '',
  brand: '',
  description: '',
  category: 'femme' as 'femme' | 'homme' | 'accessoires',
  style: 'casual',
  sizes: [] as string[],
  capacity_cost: 10 as 10 | 20 | 30,
  image_url: '',
  color: '',
  material: '',
  is_featured: false,
};

export default function AdminProductForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  const set = (key: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleSize = (s: string) => {
    set(
      'sizes',
      form.sizes.includes(s) ? form.sizes.filter((x) => x !== s) : [...form.sizes, s]
    );
  };

  const handleSubmit = () => {
    if (!form.name || !form.brand || form.sizes.length === 0) {
      setStatus('error');
      setMessage('Nom, marque et au moins une taille sont obligatoires.');
      return;
    }

    startTransition(async () => {
      const result = await createProduct(form);
      if (result.error) {
        setStatus('error');
        setMessage(result.error);
      } else {
        setStatus('success');
        setMessage(`"${form.name}" ajouté avec succès.`);
        setForm(initialState);
        setTimeout(() => setStatus('idle'), 4000);
      }
    });
  };

  const sizes = form.category === 'homme' ? SIZES_HOMME : SIZES_FEMME;

  return (
    <div className="space-y-8">

      {/* Status banner */}
      {status !== 'idle' && (
        <div
          className={`px-4 py-3 text-sm font-sans border ${
            status === 'success'
              ? 'border-green-800 bg-green-950/40 text-green-400'
              : 'border-red-900 bg-red-950/40 text-red-400'
          }`}
        >
          {message}
        </div>
      )}

      {/* Section : Infos de base */}
      <FormSection label="Informations de base">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nom de la pièce *">
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Ex: Manteau Cachemire Long"
              className={inputCls}
            />
          </Field>
          <Field label="Marque *">
            <input
              type="text"
              value={form.brand}
              onChange={(e) => set('brand', e.target.value)}
              placeholder="Ex: Sandro"
              className={inputCls}
            />
          </Field>
        </div>
        <Field label="Description">
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Description courte de la pièce…"
            rows={3}
            className={inputCls + ' resize-none'}
          />
        </Field>
      </FormSection>

      {/* Section : Catégorie & Style */}
      <FormSection label="Catégorie & Style">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Catégorie *">
            <div className="flex gap-2">
              {(['femme', 'homme', 'accessoires'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => { set('category', cat); set('sizes', []); }}
                  className={toggleBtnCls(form.category === cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Style">
            <select
              value={form.style}
              onChange={(e) => set('style', e.target.value)}
              className={inputCls}
            >
              {STYLES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </FormSection>

      {/* Section : Tailles */}
      <FormSection label="Tailles disponibles *">
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleSize(s)}
              className={toggleBtnCls(form.sizes.includes(s))}
            >
              {s}
            </button>
          ))}
        </div>
        {form.sizes.length > 0 && (
          <p className="text-[10px] font-sans tracking-wider text-neutral-500 mt-2">
            Sélectionnées : {form.sizes.join(', ')}
          </p>
        )}
      </FormSection>

      {/* Section : Capacité */}
      <FormSection label="Capacité (coût en points)">
        <div className="flex gap-3">
          {([10, 20, 30] as const).map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => set('capacity_cost', val)}
              className={`flex flex-col items-center gap-2 px-6 py-4 border transition-all ${
                form.capacity_cost === val
                  ? 'border-amber-400/60 bg-amber-400/5 text-amber-400'
                  : 'border-neutral-800 text-neutral-500 hover:border-neutral-700'
              }`}
            >
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={`w-2 h-2 rounded-full ${i <= val / 10 ? 'bg-amber-400' : 'bg-neutral-800'}`}
                  />
                ))}
              </div>
              <span className="font-sans text-[10px] tracking-widest uppercase">
                {val === 10 ? 'Essentiel' : val === 20 ? 'Premium' : 'Luxe'}
              </span>
              <span className="font-sans text-xs">{val} pts</span>
            </button>
          ))}
        </div>
      </FormSection>

      {/* Section : Média */}
      <FormSection label="Image & Détails">
        <Field label="URL de l'image">
          <input
            type="url"
            value={form.image_url}
            onChange={(e) => set('image_url', e.target.value)}
            placeholder="https://images.unsplash.com/…"
            className={inputCls}
          />
        </Field>
        {form.image_url && (
          <div className="mt-3 w-24 aspect-[3/4] overflow-hidden bg-neutral-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.image_url} alt="preview" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Field label="Couleur">
            <input
              type="text"
              value={form.color}
              onChange={(e) => set('color', e.target.value)}
              placeholder="Ex: Camel"
              className={inputCls}
            />
          </Field>
          <Field label="Matière">
            <input
              type="text"
              value={form.material}
              onChange={(e) => set('material', e.target.value)}
              placeholder="Ex: Cachemire 100%"
              className={inputCls}
            />
          </Field>
        </div>
      </FormSection>

      {/* Section : Options */}
      <FormSection label="Options">
        <label className="flex items-center gap-3 cursor-pointer group">
          <button
            type="button"
            onClick={() => set('is_featured', !form.is_featured)}
            className={`w-10 h-5 rounded-full transition-colors relative ${
              form.is_featured ? 'bg-amber-400' : 'bg-neutral-800'
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                form.is_featured ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
          <span className="font-sans text-sm text-neutral-400 group-hover:text-neutral-200 transition-colors">
            Pièce mise en avant <span className="text-neutral-600">(badge "Sélection")</span>
          </span>
        </label>
      </FormSection>

      {/* Submit */}
      <div className="pt-4 border-t border-neutral-900">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className={`
            px-10 py-4 font-sans text-[11px] tracking-[0.25em] uppercase font-medium transition-all
            ${isPending
              ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
              : 'bg-white text-black hover:bg-amber-400'
            }
          `}
        >
          {isPending ? 'Enregistrement…' : 'Ajouter au catalogue'}
        </button>
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────

const inputCls = `
  w-full bg-neutral-900 border border-neutral-800 text-neutral-100
  font-sans text-sm px-3 py-2.5
  focus:outline-none focus:border-amber-400/50
  placeholder:text-neutral-700
  transition-colors
`;

const toggleBtnCls = (active: boolean) => `
  px-3 py-2 border font-sans text-xs tracking-wider uppercase transition-all
  ${active
    ? 'border-amber-400/60 bg-amber-400/10 text-amber-400'
    : 'border-neutral-800 text-neutral-600 hover:border-neutral-600 hover:text-neutral-300'
  }
`;

function FormSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-neutral-500">
          {label}
        </span>
        <div className="flex-1 h-px bg-neutral-900" />
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-neutral-600">
        {label}
      </label>
      {children}
    </div>
  );
}
