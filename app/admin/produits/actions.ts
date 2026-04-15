'use server';

// app/admin/produits/actions.ts

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role pour bypasser RLS en admin
);

export interface CreateProductInput {
  name: string;
  brand: string;
  description: string;
  category: 'femme' | 'homme' | 'accessoires';
  style: string;
  sizes: string[];
  capacity_cost: 10 | 20 | 30;
  image_url: string;
  color: string;
  material: string;
  is_featured: boolean;
}

export async function createProduct(input: CreateProductInput) {
  if (!input.name || !input.brand || !input.category || !input.sizes.length) {
    return { error: 'Champs obligatoires manquants.' };
  }

  const { data, error } = await supabase
    .from('products')
    .insert({
      ...input,
      status: 'available',
    })
    .select()
    .single();

  if (error) {
    console.error('Erreur createProduct:', error);
    return { error: 'Erreur lors de la création du produit.' };
  }

  // Revalider le catalogue
  revalidatePath('/catalogue');

  return { success: true, product: data };
}

export async function getAdminProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data;
}

export async function toggleFeatured(id: string, current: boolean) {
  const { error } = await supabase
    .from('products')
    .update({ is_featured: !current })
    .eq('id', id);

  if (error) return { error: 'Erreur mise à jour.' };
  revalidatePath('/catalogue');
  return { success: true };
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) return { error: 'Erreur suppression.' };
  revalidatePath('/catalogue');
  return { success: true };
}
