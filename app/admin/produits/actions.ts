'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';



// ── Vérification admin sans redirect (pour appels client-side) ──
async function checkAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data: profile } = await supabase
    .from('profiles').select('is_admin').eq('id', user.id).single();
  return profile?.is_admin === true;
}

// ── Récupérer tous les produits ──
// Pas de requireAdmin ici — redirect() dans un useEffect côté client throw silencieusement
export async function getAdminProducts() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getAdminProducts error:', error);
    return [];
  }
  return data;
}

// ── Créer un produit ──
export async function createProduct(formData: FormData) {
  const supabase = await createClient();
  if (!(await checkAdmin(supabase))) return { success: false, message: 'Non autorisé.' };

  const sizes = (formData.get('sizes') as string)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const { error } = await supabase.from('products').insert([{
    name:          formData.get('name') as string,
    brand:         formData.get('brand') as string,
    description:   formData.get('description') as string,
    color:         formData.get('color') as string,
    material:      formData.get('material') as string,
    style:         formData.get('style') as string,
    category:      formData.get('category') as string,
    sizes,
    capacity_cost: Number(formData.get('capacity_cost')),
    image_url:     (formData.get('image_url') as string) || null,
    is_featured:   formData.get('is_featured') === 'true',
    status:        formData.get('status') === 'true' ? 'available' : 'unavailable',
  }]);

  if (error) return { success: false, message: error.message };
  revalidatePath('/admin/produits');
  revalidatePath('/catalogue');
  return { success: true };
}

// ── Modifier un produit ──
export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient();
  if (!(await checkAdmin(supabase))) return { success: false, message: 'Non autorisé.' };

  const sizes = (formData.get('sizes') as string)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const { error } = await supabase.from('products').update({
    name:          formData.get('name') as string,
    brand:         formData.get('brand') as string,
    description:   formData.get('description') as string,
    color:         formData.get('color') as string,
    material:      formData.get('material') as string,
    style:         formData.get('style') as string,
    category:      formData.get('category') as string,
    sizes,
    capacity_cost: Number(formData.get('capacity_cost')),
    image_url:     (formData.get('image_url') as string) || null,
    is_featured:   formData.get('is_featured') === 'true',
    status:        formData.get('status') === 'true' ? 'available' : 'unavailable',
    updated_at:    new Date().toISOString(),
  }).eq('id', id);

  if (error) return { success: false, message: error.message };
  revalidatePath('/admin/produits');
  revalidatePath('/catalogue');
  revalidatePath(`/catalogue/${id}`);
  return { success: true };
}

// ── Supprimer un produit ──
export async function deleteProduct(id: string) {
  const supabase = await createClient();

  // Vérif manuelle sans redirect() — évite le throw dans startTransition côté client
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: 'Non authentifié.' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) return { success: false, message: 'Non autorisé.' };

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) return { success: false, message: error.message };
  revalidatePath('/admin/produits');
  revalidatePath('/catalogue');
  return { success: true };
}

// ── Upload image vers Supabase Storage ──
export async function uploadProductImage(file: File): Promise<string | null> {
  const supabase = await createClient();
  if (!(await checkAdmin(supabase))) return null;

  const ext = file.name.split('.').pop();
  const filename = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from('product-images')
    .upload(filename, file, { contentType: file.type, upsert: false });

  if (error) return null;

  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(filename);

  return data.publicUrl;
}