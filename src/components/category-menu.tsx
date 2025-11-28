"use client";

import { Category } from "@/types";
import CategorySidebar from "./category-sidebar";

interface CategoryMenuProps {
  categories: Category[];
}

const CategoryMenu: React.FC<CategoryMenuProps> = ({ categories }) => {
  return (
    <div className="flex items-center">
      <CategorySidebar categories={categories || []} />
      <span className="ml-3 text-sm tracking-wider uppercase text-neutral-200 hidden sm:inline">
        Danh mục sản phẩm
      </span>
    </div>
  );
};

export default CategoryMenu;
