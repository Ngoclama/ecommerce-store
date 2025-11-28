import { Category } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/api/categories`;

const getCategory = async (id: string): Promise<Category | null> => {
  try {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error("NEXT_PUBLIC_API_URL is not configured");
      return null;
    }
    const res = await fetch(`${URL}/${id}`, { cache: "no-store" });
    if (!res.ok) {
      console.error(
        `Failed to fetch category: ${res.status} ${res.statusText}`
      );
      return null;
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
};

export default getCategory;
