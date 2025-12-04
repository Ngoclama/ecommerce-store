"use client";

import React from "react";
import { motion } from "framer-motion";
import Gallery from "@/components/gallery";
import Info from "@/components/info";
import ProductList from "@/components/product-list";
import ReviewsSection from "@/components/reviews-section";
import RecentlyViewed from "@/components/recently-viewed";
import { Product } from "@/types";

interface ProductPageClientProps {
  product: Product;
  suggestProducts: Product[];
}

const ProductPageClient: React.FC<ProductPageClientProps> = ({
  product,
  suggestProducts,
}) => {
  return (
    <>
      {/* Main Product Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-16 mb-24"
      >
        {/* Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Gallery
            images={product.images}
            discountPercent={
              product.originalPrice &&
              product.price &&
              product.originalPrice > product.price
                ? Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) *
                      100
                  )
                : 0
            }
          />
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="px-4 mt-12 sm:mt-16 sm:px-0 lg:mt-0"
        >
          <Info data={product} />
        </motion.div>
      </motion.div>

      {/* Reviews Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="mt-24 px-4 sm:px-6 lg:px-8"
      >
        <ReviewsSection
          productId={product.id}
          storeId={(product as any).storeId}
          averageRating={product.rating || 0}
          totalReviews={0}
        />
      </motion.div>

      {/* Recently Viewed */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-24 px-4 sm:px-6 lg:px-8"
      >
        <RecentlyViewed currentProductId={product.id} />
      </motion.div>

      {/* Related Products - Luxury Style */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-32 px-4 sm:px-6 lg:px-8"
      >
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
            className="h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700 mb-8"
          />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-light text-neutral-900 dark:text-neutral-100 mb-4 tracking-tight uppercase"
          >
            Sản phẩm liên quan
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-sm text-neutral-600 dark:text-neutral-400 font-light tracking-wide"
          >
            Khám phá thêm các sản phẩm tương tự
          </motion.p>
        </div>
        <ProductList
          title=""
          items={suggestProducts
            .filter((p) => p.id !== product.id)
            .slice(0, 8)}
        />
      </motion.div>
    </>
  );
};

export default ProductPageClient;

