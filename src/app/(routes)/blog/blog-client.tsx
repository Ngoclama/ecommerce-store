"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Tag, ArrowRight, Sparkles, BookOpen, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { getSafeImageUrl } from "@/lib/image-utils";
import { BlogPost } from "@/types";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface BlogPageClientProps {
  blogs: BlogPost[];
}

const BlogPageClient: React.FC<BlogPageClientProps> = ({ blogs }) => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, amount: 0.3 });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
      {/* Luxury Header Section */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 30 }}
        animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16 md:mb-20"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isHeaderInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
          className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 border-2 border-neutral-900 dark:border-neutral-100 rounded-sm mb-6"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <BookOpen className="w-5 h-5 text-white dark:text-neutral-900" />
          </motion.div>
          <span className="text-xs font-light text-white dark:text-neutral-900 uppercase tracking-[0.2em]">
            Blog
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-neutral-900 dark:text-neutral-100 leading-[1.1] tracking-tight uppercase mb-6"
        >
          Khám phá thế giới
          <br />
          <span className="text-neutral-600 dark:text-neutral-400">thời trang</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={isHeaderInView ? { opacity: 1, width: "100%" } : { opacity: 0, width: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="h-px bg-gradient-to-r from-transparent via-neutral-900 to-transparent dark:from-transparent dark:via-neutral-100 dark:to-transparent max-w-2xl mx-auto mb-6"
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 font-light max-w-2xl mx-auto leading-relaxed tracking-wide"
        >
          Khám phá những bài viết mới nhất về thời trang, xu hướng và mẹo chăm sóc sản phẩm
        </motion.p>
      </motion.div>

      {/* Blog Grid */}
      {blogs.length === 0 ? (
        <LuxuryEmptyState />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {blogs.map((blog, index) => (
            <BlogCard key={blog.id} blog={blog} index={index} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

interface BlogCardProps {
  blog: BlogPost;
  index: number;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, index }) => {
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
              priority={index < 3}
            />
          </motion.div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Category Badge */}
          {blog.category && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border-2 border-white dark:border-neutral-800 rounded-sm text-xs font-light uppercase tracking-[0.15em] text-neutral-900 dark:text-neutral-100">
                {blog.category.name}
              </span>
            </motion.div>
          )}
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
          <motion.h2
            whileHover={{ x: 4 }}
            className="text-xl md:text-2xl font-light text-neutral-900 dark:text-neutral-100 mb-4 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors duration-300 line-clamp-2 leading-tight tracking-tight"
          >
            {blog.title}
          </motion.h2>
        </Link>

        {/* Excerpt */}
        {blog.excerpt && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light mb-6 line-clamp-3 flex-1 leading-relaxed">
            {blog.excerpt}
          </p>
        )}

        {/* Meta Info */}
        <div className="mt-auto space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          {/* Date */}
          {blog.publishedAt && (
            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 font-light">
              <Calendar className="w-4 h-4" />
              <time dateTime={blog.publishedAt.toString()}>
                {format(new Date(blog.publishedAt), "dd MMMM yyyy")}
              </time>
            </div>
          )}

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-600" />
              {blog.tags.slice(0, 3).map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="text-xs text-neutral-500 dark:text-neutral-400 font-light px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-sm border border-neutral-200 dark:border-neutral-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Read More */}
          <Link
            href={`/blog/${blog.slug}`}
            className="inline-flex items-center gap-2 text-sm font-light uppercase tracking-[0.15em] text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors duration-300 group/link"
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
      </div>
    </motion.article>
  );
};

const LuxuryEmptyState: React.FC = () => {
  const emptyRef = useRef(null);
  const isInView = useInView(emptyRef, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={emptyRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8 }}
      className="text-center py-20 md:py-32"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
        className="inline-flex items-center justify-center w-24 h-24 rounded-sm bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 border-2 border-neutral-900 dark:border-neutral-100 mb-8"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <BookOpen className="w-12 h-12 text-white dark:text-neutral-900" />
        </motion.div>
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-2xl md:text-3xl font-light text-neutral-900 dark:text-neutral-100 uppercase tracking-tight mb-4"
      >
        Chưa có bài viết nào
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 font-light max-w-md mx-auto leading-relaxed"
      >
        Vui lòng quay lại sau để xem những bài viết mới nhất về thời trang và xu hướng
      </motion.p>
    </motion.div>
  );
};

export default BlogPageClient;

