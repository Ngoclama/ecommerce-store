import { Size } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/api/sizes`;

const getSizes = async (): Promise<Size[]> => {
  try {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error("NEXT_PUBLIC_API_URL is not configured");
      return [];
    }
    const res = await fetch(URL, { cache: "no-store" });
    if (!res.ok) {
      console.error(`Failed to fetch sizes: ${res.status} ${res.statusText}`);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error("Error fetching sizes:", error);
    return [];
  }
};

export default getSizes;
