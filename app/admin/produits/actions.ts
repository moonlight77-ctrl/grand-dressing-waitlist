'use server';

import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// Client service role — bypass RLS, uniquement pour les mutations admin
function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Vérification que l'utilisateur connecté est bien admin
async function isAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient(); // Pour l'auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // UTILISE LE SERVICE ROLE CLIENT ICI (celui qui bypass le RLS)
    const adminClient = getServiceClient(); 
    
    const { data: profile, error } = await adminClient
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Erreur isAdmin:', error);
      return false;
    }

    return profile?.is_admin === true;
  } catch (e) {
    return false;
  }
}
// ── Récupérer tous les produits ──
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
  if (!(await isAdmin())) return { success: false, message: 'Non autorisé.' };
  const supabase = getServiceClient();

  const sizes = (formData.get('sizes') as string)
    .split(',').map((s) => s.trim()).filter(Boolean);

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

  if (error) { console.error('createProduct:', error); return { success: false, message: error.message }; }
  revalidatePath('/admin/produits');
  revalidatePath('/catalogue');
  return { success: true };
}

// ── Modifier un produit ──
export async function updateProduct(id: string, formData: FormData) {
  if (!(await isAdmin())) return { success: false, message: 'Non autorisé.' };
  const supabase = getServiceClient();

  const sizes = (formData.get('sizes') as string)
    .split(',').map((s) => s.trim()).filter(Boolean);

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

  }).eq('id', id);

  if (error) { console.error('updateProduct:', error); return { success: false, message: error.message }; }
  revalidatePath('/admin/produits');
  revalidatePath('/catalogue');
  revalidatePath(`/catalogue/${id}`);
  return { success: true };
}

// ── Supprimer un produit ──
export async function deleteProduct(id: string) {
  if (!(await isAdmin())) return { success: false, message: 'Non autorisé.' };
  const supabase = getServiceClient();

  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) { console.error('deleteProduct:', error); return { success: false, message: error.message }; }
  revalidatePath('/admin/produits');
  revalidatePath('/catalogue');
  return { success: true };
}

// ── Upload image vers Supabase Storage ──
export async function uploadProductImage(file: File): Promise<string | null> {
  if (!(await isAdmin())) return null;
  const supabase = getServiceClient();

  const ext = file.name.split('.').pop();
  const filename = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from('product-images')
    .upload(filename, file, { contentType: file.type, upsert: false });

  if (error) { console.error('uploadProductImage:', error); return null; }

  const { data } = supabase.storage.from('product-images').getPublicUrl(filename);
  return data.publicUrl;
}