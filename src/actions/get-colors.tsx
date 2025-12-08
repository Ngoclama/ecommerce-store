import { Color } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/api/colors`;

const getColors = async (): Promise<Color[]> => {
  try {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error("NEXT_PUBLIC_API_URL is not configured");
      return [];
    }
    // Add timestamp to bypass cache in production
    const timestamp = Date.now();
    const urlWithTimestamp = `${URL}?_t=${timestamp}`;

    const res = await fetch(urlWithTimestamp, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    });
    if (!res.ok) {
      console.error(`Failed to fetch colors: ${res.status} ${res.statusText}`);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error("Error fetching colors:", error);
    return [];
  }
};

export default getColors;
