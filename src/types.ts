export interface Billboard {
  id: string;
  label: string;
  imageUrl: string;
}
export interface Category {
  id: string;
  name: string;
  billboardId: string;
}

export interface Product {
  id: string;
  category: Category;
  name: string;
  description: string;
  size: Size;
  color: Color;
  images: Image[];
  price: number;
  isFeatured: boolean;
  categoryId: string;
  rating?: number;
  sold?: number;
  originalPrice?: number;
  badge?: string;
  inStock?: boolean;
}

export interface Image {
  id: string;
  url: string;
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
