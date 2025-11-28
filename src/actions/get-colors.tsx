import { Color } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/api/colors`;

const getColors = async (): Promise<Color[]> => {
  try {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error("NEXT_PUBLIC_API_URL is not configured");
      return [];
    }
    const res = await fetch(URL, { cache: "no-store" });
    if (!res.ok) {
      console.error(
        `Failed to fetch colors: ${res.status} ${res.statusText}`
      );
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : (data.data || []);
  } catch (error) {
    console.error("Error fetching colors:", error);
    return [];
  }
};

export default getColors;
