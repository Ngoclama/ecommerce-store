import getBlog from "@/actions/get-blog";
import getBlogs from "@/actions/get-blogs";
import Container from "@/components/ui/container";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Tag, ArrowLeft, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { getSafeImageUrl } from "@/lib/image-utils";

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
  const filteredRelated = relatedBlogs.filter((b) => b.id !== blog.id).slice(0, 3);

  return (
    <div className="bg-white dark:bg-gray-900">
      <Container>
        <div className="px-4 sm:px-6 lg:px-8 py-16">
          {/* Back Button */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-light uppercase tracking-wider text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại Blog
          </Link>

          {/* Article */}
          <article className="max-w-4xl mx-auto">
            {/* Header */}
            <header className="mb-8">
              {/* Category */}
              {blog.category && (
                <Link
                  href={`/category/${blog.category.id}`}
                  className="inline-flex items-center gap-1 text-xs font-light uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4 transition-colors"
                >
                  {blog.category.name}
                </Link>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light uppercase tracking-wider text-black dark:text-white mb-6">
                {blog.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                {blog.publishedAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={blog.publishedAt.toString()}>
                      {format(new Date(blog.publishedAt), "dd MMMM yyyy")}
                    </time>
                  </div>
                )}

                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag className="w-4 h-4" />
                    {blog.tags.map((tag, index) => (
                      <span key={index} className="font-light">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </header>

            {/* Featured Image */}
            {(() => {
              const safeImageUrl = getSafeImageUrl(blog.featuredImage);
              return safeImageUrl ? (
                <div className="relative aspect-video mb-12 overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <Image
                    src={safeImageUrl}
                    alt={blog.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 896px"
                    className="object-cover"
                    priority
                  />
                </div>
              ) : null;
            })()}

            {/* Content */}
            <div
              className="prose prose-lg dark:prose-invert max-w-none mb-12 blog-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Footer */}
            <footer className="border-t border-gray-200 dark:border-gray-800 pt-8 mt-12">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-light uppercase tracking-wider text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Xem tất cả bài viết
              </Link>
            </footer>
          </article>

          {/* Related Blogs */}
          {filteredRelated.length > 0 && (
            <section className="mt-20">
              <h2 className="text-2xl md:text-3xl font-light uppercase tracking-wider text-black dark:text-white mb-8">
                Bài viết liên quan
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {filteredRelated.map((relatedBlog) => (
                  <Link
                    key={relatedBlog.id}
                    href={`/blog/${relatedBlog.slug}`}
                    className="group flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-300 overflow-hidden"
                  >
                    {(() => {
                      const safeImageUrl = getSafeImageUrl(relatedBlog.featuredImage);
                      return safeImageUrl ? (
                        <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-700">
                          <Image
                            src={safeImageUrl}
                            alt={relatedBlog.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : null;
                    })()}
                    <div className="p-6 flex flex-col flex-1">
                      {relatedBlog.category && (
                        <span className="text-xs font-light uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                          {relatedBlog.category.name}
                        </span>
                      )}
                      <h3 className="text-lg font-light text-black dark:text-white mb-3 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors line-clamp-2">
                        {relatedBlog.title}
                      </h3>
                      {relatedBlog.excerpt && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-light line-clamp-2 flex-1 mb-4">
                          {relatedBlog.excerpt}
                        </p>
                      )}
                      <div className="inline-flex items-center gap-2 text-sm font-light uppercase tracking-wider text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition-colors group/link">
                        Đọc thêm
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </Container>
    </div>
  );
};

export default BlogDetailPage;

