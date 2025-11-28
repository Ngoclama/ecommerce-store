"use client";

import { Category, Product } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { X, ChevronRight, Menu, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useState, useEffect } from "react";
import getProducts from "@/actions/get-products";
import Image from "next/image";

interface CategorySidebarProps {
  categories: Category[];
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({ categories }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCategoryClick = async (category: Category) => {
    setSelectedCategory(category);
    setLoading(true);
    try {
      const categoryProducts = await getProducts({ categoryId: category.id });
      setProducts(categoryProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setProducts([]);
  };

  if (!mounted) {
    return (
      <Button
        variant="outline"
        className="bg-white hover:bg-gray-100 text-black border-gray-300 rounded-lg px-3 py-2 flex items-center gap-2 h-10"
        aria-label="Danh mục sản phẩm"
        disabled
      >
        <Menu className="w-5 h-5" />
        <span className="hidden sm:inline text-sm">Danh mục</span>
      </Button>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="bg-transparent hover:bg-transparent text-black border-0 rounded-none px-2 py-2 flex items-center gap-2 h-10"
          aria-label="Menu"
        >
          <Menu className="w-5 h-5" />
          <span className="hidden sm:inline text-xs font-light uppercase tracking-wider">
            Menu
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-80 bg-white border-r border-gray-300 p-0 [&>button]:hidden"
      >
        <SheetHeader className="border-b border-gray-300 px-4 py-3">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg text-black uppercase">
              {selectedCategory ? selectedCategory.name : "Danh mục sản phẩm"}
            </SheetTitle>
            <div className="flex items-center gap-2">
              {selectedCategory && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  className="bg-white hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5 text-black" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsOpen(false);
                  setSelectedCategory(null);
                  setProducts([]);
                }}
                className="bg-white hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-black" />
              </Button>
            </div>
          </div>
        </SheetHeader>

        <div className="overflow-y-auto h-[calc(100vh-80px)]">
          {selectedCategory ? (
            // Products View
            <div className="py-4">
              {loading ? (
                <div className="px-6 py-8 text-center">
                  <p className="text-gray-500 text-sm font-light">
                    Đang tải sản phẩm...
                  </p>
                </div>
              ) : products.length > 0 ? (
                <ul className="space-y-2 px-4">
                  {products.map((product) => (
                    <li key={product.id}>
                      <Link
                        href={`/product/${product.id}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-2 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="relative w-16 h-16 bg-gray-100 shrink-0">
                          <Image
                            src={product.images?.[0]?.url || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-light text-black line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-600 font-light mt-1">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(Number(product.price))}
                          </p>
                        </div>
                        <ChevronRight
                          size={16}
                          className="text-gray-400 shrink-0"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-6 py-8 text-center">
                  <p className="text-gray-500 text-sm font-light">
                    Chưa có sản phẩm nào trong danh mục này
                  </p>
                </div>
              )}
            </div>
          ) : (
            // Categories View
            <nav className="py-4">
              {categories && categories.length > 0 ? (
                <ul className="space-y-1">
                  {categories.map((category) => {
                    const isActive = pathname === `/category/${category.id}`;
                    return (
                      <li key={category.id}>
                        <button
                          onClick={() => handleCategoryClick(category)}
                          className={cn(
                            "w-full flex items-center justify-between px-6 py-3 text-sm font-light tracking-wide transition-colors",
                            isActive
                              ? "bg-black text-white"
                              : "text-black hover:bg-gray-50"
                          )}
                        >
                          <span className="uppercase">{category.name}</span>
                          <ChevronRight
                            size={16}
                            className={cn(
                              isActive ? "text-white" : "text-gray-400"
                            )}
                          />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="px-6 py-8 text-center">
                  <p className="text-gray-500 text-sm font-light">
                    Chưa có danh mục nào
                  </p>
                </div>
              )}
            </nav>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CategorySidebar;
