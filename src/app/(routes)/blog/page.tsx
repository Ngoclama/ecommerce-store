import getBlogs from "@/actions/get-blogs";
import Container from "@/components/ui/container";
import BlogPageClient from "./blog-client";

export const revalidate = 0;

const BlogPage = async () => {
  const blogsData = await getBlogs({ limit: 12 });

  // Handle both array and object response
  const blogs = Array.isArray(blogsData) ? blogsData : blogsData.data || [];

  return (
    <div className="bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-gray-900 dark:to-neutral-950 min-h-screen">
      <Container>
        <BlogPageClient blogs={blogs} />
      </Container>
    </div>
  );
};

export default BlogPage;
