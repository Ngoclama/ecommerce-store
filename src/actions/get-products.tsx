import { Product } from "@/types";
import { color } from "framer-motion";
import qs from "query-string";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

interface Query {
  categoryId?: string;
  colorId?: string;
  sizeId?: string;
  isFeatured?: boolean;
}

const getProduct = async (query: Query): Promise<Product[]> => {
  const url = qs.stringifyUrl({
    url: URL,
    query: {
      colorId: query.colorId,
      sizeId: query.sizeId,
      isFeatured: query.isFeatured,
      categoryId: query.categoryId,
    },
  });

  const res = await fetch(URL);

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  const data = await res.json();
  console.log("Product API JSON:", data);

  return data;
};

export default getProduct;
