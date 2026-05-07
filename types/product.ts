// types/product.ts

export type ProductCategory = 'femme' | 'homme' | 'accessoires';
export type ProductStyle = 'casual' | 'business' | 'soiree' | 'sport' | 'streetwear';
export type ProductStatus = 'available' | 'unavailable' | 'coming_soon';

export interface Product {
  id: string;
  created_at: string;
  name: string;
  brand: string;
  description: string | null;
  category: ProductCategory;
  style: ProductStyle | null;
  sizes: string[];
  capacity_cost: 10 | 20 | 30;
  image_url: string | null;
  images: string[];
  status: ProductStatus;
  color: string | null;
  material: string | null;
  is_featured: boolean;
  is_available: boolean;
  updated_at: string | null;
}

export interface CatalogueFilters {
  category: ProductCategory | 'all';
  style: ProductStyle | 'all';
  size: string | 'all';
  capacity: number | 'all';
}
