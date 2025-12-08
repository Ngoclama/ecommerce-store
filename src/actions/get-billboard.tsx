import { Billboard } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/api/billboards`;

const getBillboard = async (id: string): Promise<Billboard | null> => {
  try {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error("NEXT_PUBLIC_API_URL is not configured");
      return null;
    }
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
      console.error(
        `Failed to fetch billboard: ${res.status} ${res.statusText}`
      );
      return null;
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching billboard:", error);
    return null;
  }
};

export default getBillboard;
