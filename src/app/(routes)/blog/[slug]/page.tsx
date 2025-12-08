import getBlog from "@/actions/get-blog";
import getBlogs from "@/actions/get-blogs";
import Container from "@/components/ui/container";
import { notFound } from "next/navigation";
import BlogDetailClient from "./blog-detail-client";

// Force dynamic rendering to prevent caching issues
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

const BlogDetailPage = async ({ params }: BlogDetailPageProps) => {
  const { slug } = await params;

  let blog;
  try {
    blog = await getBlog(slug);
  } catch (error) {
    notFound();
  }

  // Get related blogs
  const relatedBlogsData = await getBlogs({
    categoryId: blog.categoryId,
    limit: 3,
  });
  const relatedBlogs = Array.isArray(relatedBlogsData)
    ? relatedBlogsData
    : relatedBlogsData.data || [];
  const filteredRelated = relatedBlogs
    .filter((b) => b.id !== blog.id)
    .slice(0, 3);

  return (
    <div className="bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-gray-900 dark:to-neutral-950 min-h-screen">
      <Container>
        <BlogDetailClient blog={blog} relatedBlogs={filteredRelated} />
      </Container>
    </div>
  );
};

export default BlogDetailPage;
