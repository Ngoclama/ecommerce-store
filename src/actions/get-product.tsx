import { Product } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/api/products`;

const getProduct = async (id: string): Promise<Product> => {
  try {
    const res = await fetch(`${URL}/${id}`, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`Failed to fetch product: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export default getProduct;
