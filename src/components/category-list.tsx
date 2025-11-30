"use client";

import { Category } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CategoryListProps {
  items: Category[];
}

const CategoryList: React.FC<CategoryListProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Link
            href={`/category/${item.id}`}
            className={cn(
              "group block bg-white p-4 text-center",
              "hover:opacity-80 transition-opacity duration-300"
            )}
          >
            {item.billboard && (
              <div className="relative aspect-square mx-auto mb-3">
                <Image
                  src={item.billboard.imageUrl || "/placeholder.png"}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-opacity duration-500 group-hover:opacity-90"
                />
              </div>
            )}
            <h3 className="text-xs font-light text-black uppercase tracking-wider">
              {item.name}
            </h3>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default CategoryList;
