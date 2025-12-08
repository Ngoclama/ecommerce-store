import { BlogPost } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/api/blog`;

interface GetBlogsParams {
  categoryId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

interface GetBlogsResponse {
  success: boolean;
  data: BlogPost[];
  pagination?: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

const getBlogs = async (
  params?: GetBlogsParams
): Promise<GetBlogsResponse | BlogPost[]> => {
  try {
    const searchParams = new URLSearchParams();

    if (params?.categoryId) {
      searchParams.append("categoryId", params.categoryId);
    }
    if (params?.search) {
      searchParams.append("q", params.search);
    }
    if (params?.page) {
      searchParams.append("page", params.page.toString());
    }
    if (params?.limit) {
      searchParams.append("limit", params.limit.toString());
    }

    // Add timestamp to bypass cache in production
    const timestamp = Date.now();
    const queryString = searchParams.toString();
    const separator = queryString ? "&" : "?";
    const urlWithTimestamp = `${URL}${
      queryString ? `?${queryString}` : ""
    }${separator}_t=${timestamp}`;

    const res = await fetch(urlWithTimestamp, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch blogs: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

export default getBlogs;
