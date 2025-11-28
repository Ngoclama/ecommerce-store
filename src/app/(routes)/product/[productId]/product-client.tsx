"use client";

import { useEffect } from "react";
import { Product } from "@/types";

interface ProductClientProps {
  product: Product;
}

const ProductClient: React.FC<ProductClientProps> = ({ product }) => {
  useEffect(() => {
    // Save to recently viewed
    const stored = localStorage.getItem("recentlyViewed");
    const viewed = stored ? JSON.parse(stored) : [];
    
    // Remove if exists
    const filtered = viewed.filter((p: Product) => p.id !== product.id);
    
    // Add to front
    const updated = [product, ...filtered].slice(0, 20);
    localStorage.setItem("recentlyViewed", JSON.stringify(updated));
  }, [product]);

  return null;
};

export default ProductClient;

