export interface Billboard {
  id: string;
  label: string;
  imageUrl: string;
  categoryId?: string;
  category?: Category;
}
export interface Category {
  id: string;
  name: string;
  slug?: string;
  billboardId?: string;
  billboard?: Billboard;
  parentId?: string | null;
  parent?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface Size {
  id: string;
  name: string;
  value: string;
}

export interface Color {
  id: string;
  name: string;
  value: string;
}

export interface Material {
  id: string;
  name: string;
  value?: string;
}

export interface ProductVariant {
  id: string;
  sku?: string;
  inventory: number;
  price?: number;
  lowStockThreshold?: number;
  size: Size;
  color: Color;
  material?: Material;
}

export interface Product {
  id: string;
  category: Category;
  name: string;
  description?: string;
  slug?: string;
  price: number;
  compareAtPrice?: number;
  isFeatured: boolean;
  categoryId: string;
  images: Image[];
  variants?: ProductVariant[];
  material?: Material;
  gender?: string;
  rating?: number;
  sold?: number;
  originalPrice?: number;
  badge?: string;
  inStock?: boolean;
  inventory?: number; // For backward compatibility
  createdAt?: string | Date; // For sorting
  // Legacy fields for backward compatibility
  size?: Size;
  color?: Color;
}

export interface CartItem extends Product {
  cartItemId: string; // Unique ID for cart item instance
  quantity: number;
  inventory: number; // Inventory snapshot for the cart item
  selectedVariant?: ProductVariant; // Selected variant when adding to cart
}

export interface Image {
  id: string;
  url: string;
}
