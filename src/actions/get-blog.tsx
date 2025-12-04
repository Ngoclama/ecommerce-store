import { BlogPost } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/api/blog`;

const getBlog = async (slug: string): Promise<BlogPost> => {
  try {
    const res = await fetch(`${URL}/${slug}`, { cache: "no-store" });

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

