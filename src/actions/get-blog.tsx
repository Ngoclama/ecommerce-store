import { BlogPost } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/api/blog`;

const getBlog = async (slug: string): Promise<BlogPost> => {
  try {
    // Add timestamp to bypass cache in production
    const timestamp = Date.now();
    const urlWithTimestamp = `${URL}/${slug}?_t=${timestamp}`;

    const res = await fetch(urlWithTimestamp, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch blog: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching blog:", error);
    throw error;
  }
};

export default getBlog;
