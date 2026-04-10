'use server';

import { createClient } from '@supabase/supabase-js';
import type { Product, CatalogueFilters } from '@/types/product';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getProducts(filters?: Partial<CatalogueFilters>): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('*')
    .eq('status', 'available')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (filters?.category && filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }
  if (filters?.style && filters.style !== 'all') {
    query = query.eq('style', filters.style);
  }
  if (filters?.size && filters.size !== 'all') {
    query = query.contains('sizes', [filters.size]);
  }
  if (filters?.capacity && filters.capacity !== 'all') {
    query = query.eq('capacity_cost', filters.capacity);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erreur Supabase getProducts:', error);
    return [];
  }

  return (data as Product[]) || [];
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erreur Supabase getProductById:', error);
    return null;
  }

  return data as Product;
}
