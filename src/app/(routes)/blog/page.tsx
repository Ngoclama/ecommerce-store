import getBlogs from "@/actions/get-blogs";
import Container from "@/components/ui/container";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Tag, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { getSafeImageUrl } from "@/lib/image-utils";

export const revalidate = 0;

const BlogPage = async () => {
  const blogsData = await getBlogs({ limit: 12 });

  // Handle both array and object response
  const blogs = Array.isArray(blogsData) ? blogsData : blogsData.data || [];

  return (
    <div className="bg-white dark:bg-gray-900">
      <Container>
        <div className="px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-light uppercase tracking-wider text-black dark:text-white mb-4">
              Blog
            </h1>
            <div className="w-20 md:w-24 h-px bg-black dark:bg-white mx-auto mb-6"></div>
            <p className="text-gray-600 dark:text-gray-400 font-light max-w-2xl mx-auto">
              Khám phá những bài viết mới nhất về thời trang, xu hướng và mẹo
              chăm sóc sản phẩm
            </p>
          </div>

          {/* Blog Grid */}
          {blogs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 dark:text-gray-400 font-light text-lg">
                Chưa có bài viết nào. Vui lòng quay lại sau.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <article
                  key={blog.id}
                  className="group flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-300 overflow-hidden"
                >
                  {/* Featured Image */}
                  {(() => {
                    const safeImageUrl = getSafeImageUrl(blog.featuredImage);
                    return safeImageUrl ? (
                      <Link href={`/blog/${blog.slug}`} className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-700">
                        <Image
                          src={safeImageUrl}
                          alt={blog.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                    ) : null;
                  })()}

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col">
                    {/* Category */}
                    {blog.category && (
                      <Link
                        href={`/category/${blog.category.id}`}
                        className="inline-flex items-center gap-1 text-xs font-light uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-3 transition-colors"
                      >
                        {blog.category.name}
                      </Link>
                    )}

                    {/* Title */}
                    <Link href={`/blog/${blog.slug}`}>
                      <h2 className="text-xl font-light text-black dark:text-white mb-3 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors line-clamp-2">
                        {blog.title}
                      </h2>
                    </Link>

                    {/* Excerpt */}
                    {blog.excerpt && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-light mb-4 line-clamp-3 flex-1">
                        {blog.excerpt}
                      </p>
                    )}

                    {/* Meta Info */}
                    <div className="mt-auto space-y-3">
                      {/* Date */}
                      {blog.publishedAt && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <time dateTime={blog.publishedAt.toString()}>
                            {format(new Date(blog.publishedAt), "dd MMMM yyyy")}
                          </time>
                        </div>
                      )}

                      {/* Tags */}
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2">
                          <Tag className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          {blog.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="text-xs text-gray-500 dark:text-gray-400 font-light"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Read More */}
                      <Link
                        href={`/blog/${blog.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-light uppercase tracking-wider text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition-colors group/link"
                      >
                        Đọc thêm
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default BlogPage;

