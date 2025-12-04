"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Tag, ArrowLeft, ArrowRight, BookOpen, Sparkles, Share2 } from "lucide-react";
import { format } from "date-fns";
import { getSafeImageUrl } from "@/lib/image-utils";
import { BlogPost } from "@/types";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface BlogDetailClientProps {
  blog: BlogPost;
  relatedBlogs: BlogPost[];
}

const BlogDetailClient: React.FC<BlogDetailClientProps> = ({ blog, relatedBlogs }) => {
  const headerRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const relatedRef = useRef(null);

  const isHeaderInView = useInView(headerRef, { once: true, amount: 0.2 });
  const isImageInView = useInView(imageRef, { once: true, amount: 0.3 });
  const isContentInView = useInView(contentRef, { once: true, amount: 0.1 });
  const isRelatedInView = useInView(relatedRef, { once: true, amount: 0.2 });

  const safeImageUrl = getSafeImageUrl(blog.featuredImage);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
      {/* Back Button - Luxury Style */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 md:mb-12"
      >
        <Link
          href="/blog"
          className="inline-flex items-center gap-3 px-4 py-2 border-2 border-neutral-200 dark:border-neutral-800 rounded-sm bg-white dark:bg-gray-900 hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-gray-800 transition-all duration-300 group"
        >
          <motion.div
            whileHover={{ x: -4 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowLeft className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
          </motion.div>
          <span className="text-xs font-light uppercase tracking-[0.15em] text-neutral-900 dark:text-neutral-100">
            Quay lại Blog
          </span>
        </Link>
      </motion.div>

      {/* Article */}
      <article className="max-w-5xl mx-auto">
        {/* Header - Luxury Style */}
        <motion.header
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="mb-12 md:mb-16"
        >
          {/* Category Badge */}
          {blog.category && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isHeaderInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6"
            >
              <Link
                href={`/category/${blog.category.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 border-2 border-neutral-900 dark:border-neutral-100 rounded-sm text-xs font-light uppercase tracking-[0.15em] text-white dark:text-neutral-900 hover:scale-105 transition-transform duration-300"
              >
                <Tag className="w-3.5 h-3.5" />
                {blog.category.name}
              </Link>
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-neutral-900 dark:text-neutral-100 leading-[1.1] tracking-tight uppercase mb-8"
          >
            {blog.title}
          </motion.h1>

          {/* Gradient Divider */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={isHeaderInView ? { opacity: 1, width: "100%" } : { opacity: 0, width: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-px bg-gradient-to-r from-neutral-900 via-neutral-400 to-transparent dark:from-neutral-100 dark:via-neutral-600 mb-8"
          />

          {/* Meta Info - Luxury Style */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center gap-6 text-sm"
          >
            {blog.publishedAt && (
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 font-light">
                <Calendar className="w-4 h-4" />
                <time dateTime={blog.publishedAt.toString()}>
                  {format(new Date(blog.publishedAt), "dd MMMM yyyy")}
                </time>
              </div>
            )}

            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="w-4 h-4 text-neutral-400 dark:text-neutral-600" />
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-sm text-xs font-light text-neutral-600 dark:text-neutral-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </motion.header>

        {/* Featured Image - Luxury Style */}
        {safeImageUrl && (
          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isImageInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative aspect-video mb-12 md:mb-16 overflow-hidden rounded-sm border-2 border-neutral-200 dark:border-neutral-800 shadow-xl"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={safeImageUrl}
                alt={blog.title}
                fill
                sizes="(max-width: 768px) 100vw, 1280px"
                className="object-cover"
                priority
              />
            </motion.div>
          </motion.div>
        )}

        {/* Content - Luxury Style */}
        <motion.div
          ref={contentRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isContentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="prose prose-lg dark:prose-invert max-w-none mb-12 md:mb-16 blog-content"
          dangerouslySetInnerHTML={{ __html: blog.content || "" }}
        />

        {/* Footer - Luxury Style */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={isContentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="border-t-2 border-neutral-200 dark:border-neutral-800 pt-8 mt-12"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-3 px-6 py-3 border-2 border-neutral-200 dark:border-neutral-800 rounded-sm bg-white dark:bg-gray-900 hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-gray-800 transition-all duration-300 group"
          >
            <motion.div
              whileHover={{ x: -4 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowLeft className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
            </motion.div>
            <span className="text-sm font-light uppercase tracking-[0.15em] text-neutral-900 dark:text-neutral-100">
              Xem tất cả bài viết
            </span>
          </Link>
        </motion.footer>
      </article>

      {/* Related Blogs - Luxury Style */}
      {relatedBlogs.length > 0 && (
        <motion.section
          ref={relatedRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isRelatedInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="mt-20 md:mt-32"
        >
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isRelatedInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 md:mb-16"
          >
            <div className="flex items-center gap-4 mb-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="p-2 rounded-sm bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 border-2 border-neutral-900 dark:border-neutral-100"
              >
                <Sparkles className="w-5 h-5 text-white dark:text-neutral-900" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-neutral-900 dark:text-neutral-100 uppercase tracking-tight">
                Bài viết liên quan
              </h2>
            </div>
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={isRelatedInView ? { opacity: 1, width: "100%" } : { opacity: 0, width: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-px bg-gradient-to-r from-neutral-900 via-neutral-400 to-transparent dark:from-neutral-100 dark:via-neutral-600 max-w-2xl"
            />
          </motion.div>

          {/* Related Blogs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {relatedBlogs.map((relatedBlog, index) => (
              <RelatedBlogCard key={relatedBlog.id} blog={relatedBlog} index={index} />
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
};

interface RelatedBlogCardProps {
  blog: BlogPost;
  index: number;
}

const RelatedBlogCard: React.FC<RelatedBlogCardProps> = ({ blog, index }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.2 });
  const safeImageUrl = getSafeImageUrl(blog.featuredImage);

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group flex flex-col bg-white dark:bg-gray-900 border-2 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 rounded-sm overflow-hidden transition-all duration-500 shadow-lg hover:shadow-2xl"
    >
      {/* Featured Image */}
      {safeImageUrl ? (
        <Link href={`/blog/${blog.slug}`} className="relative aspect-video overflow-hidden bg-neutral-100 dark:bg-neutral-900">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={safeImageUrl}
              alt={blog.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Link>
      ) : (
        <div className="relative aspect-video bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 flex items-center justify-center">
          <BookOpen className="w-12 h-12 text-neutral-400 dark:text-neutral-600" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 p-6 md:p-8 flex flex-col">
        {/* Category */}
        {blog.category && (
          <Link
            href={`/category/${blog.category.id}`}
            className="inline-flex items-center gap-2 text-xs font-light uppercase tracking-[0.15em] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 mb-4 transition-colors duration-300"
          >
            <Tag className="w-3.5 h-3.5" />
            {blog.category.name}
          </Link>
        )}

        {/* Title */}
        <Link href={`/blog/${blog.slug}`}>
          <motion.h3
            whileHover={{ x: 4 }}
            className="text-xl md:text-2xl font-light text-neutral-900 dark:text-neutral-100 mb-4 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors duration-300 line-clamp-2 leading-tight tracking-tight"
          >
            {blog.title}
          </motion.h3>
        </Link>

        {/* Excerpt */}
        {blog.excerpt && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light mb-6 line-clamp-3 flex-1 leading-relaxed">
            {blog.excerpt}
          </p>
        )}

        {/* Read More */}
        <Link
          href={`/blog/${blog.slug}`}
          className="inline-flex items-center gap-2 text-sm font-light uppercase tracking-[0.15em] text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors duration-300 group/link mt-auto"
        >
          Đọc thêm
          <motion.div
            whileHover={{ x: 4 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </Link>
      </div>
    </motion.article>
  );
};

export default BlogDetailClient;

