import { Product } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/api/products`;

const getProduct = async (id: string): Promise<Product> => {
  try {
    // Add timestamp to bypass cache in production
    const timestamp = Date.now();
    const urlWithTimestamp = `${URL}/${id}?_t=${timestamp}`;

    const res = await fetch(urlWithTimestamp, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    });

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
