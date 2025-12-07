export interface Billboard {
  id: string;
  label: string;
  imageUrl: string;
  description?: string;
  categoryId?: string;
  category?: Category;
}
export interface Category {
  id: string;
  name: string;
  slug?: string;
  imageUrl?: string;
  billboardId?: string;
  billboard?: Billboard;
  parentId?: string | null;
  parent?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  children?: Category[];
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
  inventory?: number;
  createdAt?: string | Date;
  size?: Size;
  color?: Color;
}

export interface CartItem extends Product {
  cartItemId: string;
  quantity: number;
  inventory: number;
  selectedVariant?: ProductVariant;
}

export interface Image {
  id: string;
  url: string;
}

export interface Coupon {
  id: string;
  code: string;
  value: number;
  type: "PERCENT" | "FIXED";
  expiresAt?: string | Date | null;
  createdAt?: string | Date;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  tags?: string[];
  publishedAt?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  categoryId?: string;
}
