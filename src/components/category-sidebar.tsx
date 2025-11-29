"use client";

import { Category, Product } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { X, ChevronRight, Menu, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useState, useEffect, useMemo } from "react";
import getProducts from "@/actions/get-products";
import Image from "next/image";

interface CategorySidebarProps {
  categories: Category[];
}

interface TreeNode extends Category {
  level: number;
  children?: TreeNode[];
  hasChildren?: boolean;
}

interface CategoryTreeListProps {
  nodes: TreeNode[];
  expandedIds: Set<string>;
  categoryProducts: Map<string, Product[]>;
  loadingCategories: Set<string>;
  onToggleExpand: (category: TreeNode) => void;
  onCategoryClick: (category: TreeNode) => void;
  pathname: string;
  setIsOpen: (open: boolean) => void;
}

const CategoryTreeList: React.FC<CategoryTreeListProps> = ({
  nodes,
  expandedIds,
  categoryProducts,
  loadingCategories,
  onToggleExpand,
  onCategoryClick,
  pathname,
  setIsOpen,
}) => {
  return (
    <ul className="space-y-1">
      {nodes.map((category) => {
        const isActive = pathname === `/category/${category.id}`;
        const hasCategoryChildren = category.hasChildren || false;
        const isExpanded = expandedIds.has(category.id);
        const indentLevel = category.level || 0;
        const products = categoryProducts.get(category.id) || [];
        const isLoading = loadingCategories.has(category.id);
        const hasProducts = products.length > 0;

        return (
          <li key={category.id}>
            {/* Category Item */}
            <div className="flex items-center">
              {/* Indentation */}
              <div
                className="shrink-0"
                style={{ width: `${indentLevel * 20}px` }}
              />
              {/* Expand/Collapse Button */}
              {(hasCategoryChildren || !hasCategoryChildren) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleExpand(category);
                  }}
                  className="p-1 hover:bg-gray-100 transition-colors shrink-0"
                >
                  {isExpanded ? (
                    <ChevronDown size={16} className="text-gray-400" />
                  ) : (
                    <ChevronRight size={16} className="text-gray-400" />
                  )}
                </button>
              )}
              {/* Category Button */}
              <button
                onClick={() => onCategoryClick(category)}
                className={cn(
                  "flex-1 flex items-center justify-between px-4 py-3 text-sm font-light tracking-wide transition-colors",
                  isActive
                    ? "bg-black text-white"
                    : "text-black hover:bg-gray-50"
                )}
              >
                <span className="uppercase">{category.name}</span>
              </button>
            </div>

            {/* Children Categories and/or Products */}
            {isExpanded && (
              <div>
                {/* Child Categories */}
                {hasCategoryChildren && category.children && (
                  <CategoryTreeList
                    nodes={category.children}
                    expandedIds={expandedIds}
                    categoryProducts={categoryProducts}
                    loadingCategories={loadingCategories}
                    onToggleExpand={onToggleExpand}
                    onCategoryClick={onCategoryClick}
                    pathname={pathname}
                    setIsOpen={setIsOpen}
                  />
                )}

                {/* Products - Show for all categories (parent or leaf) */}
                <div
                  style={{
                    marginLeft: `${(indentLevel + 1) * 20 + 24}px`,
                  }}
                >
                  {isLoading ? (
                    <div className="px-4 py-3">
                      <p className="text-xs text-gray-500 font-light">
                        Đang tải...
                      </p>
                    </div>
                  ) : hasProducts ? (
                    <ul className="space-y-1 mt-1">
                      {products.map((product) => (
                        <li key={product.id}>
                          <Link
                            href={`/product/${product.id}`}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors group"
                          >
                            <div className="relative w-12 h-12 bg-gray-100 shrink-0">
                              <Image
                                src={
                                  product.images?.[0]?.url || "/placeholder.svg"
                                }
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-light text-black line-clamp-1 group-hover:text-gray-600">
                                {product.name}
                              </h4>
                              <p className="text-xs text-gray-500 font-light mt-0.5">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(Number(product.price))}
                              </p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : !isLoading ? (
                    <div className="px-4 py-3">
                      <p className="text-xs text-gray-400 font-light">
                        Chưa có sản phẩm
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

const CategorySidebar: React.FC<CategorySidebarProps> = ({ categories }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [categoryProducts, setCategoryProducts] = useState<
    Map<string, Product[]>
  >(new Map());
  const [loadingCategories, setLoadingCategories] = useState<Set<string>>(
    new Set()
  );
  const pathname = usePathname();

  // Build category tree
  const categoryTree = useMemo(() => {
    const categoryMap = new Map<string, TreeNode>();
    const roots: TreeNode[] = [];

    // First pass: create all nodes
    categories.forEach((cat) => {
      categoryMap.set(cat.id, {
        ...cat,
        level: 0,
        children: [],
        hasChildren: false,
      });
    });

    // Second pass: build tree structure
    categories.forEach((cat) => {
      const node = categoryMap.get(cat.id)!;
      if (cat.parentId && cat.parentId.trim() !== "") {
        const parent = categoryMap.get(cat.parentId);
        if (parent) {
          node.level = parent.level + 1;
          parent.children = parent.children || [];
          parent.children.push(node);
          parent.hasChildren = true;
        } else {
          // Parent not found, treat as root
          roots.push(node);
        }
      } else {
        // No parent, it's a root
        roots.push(node);
      }
    });

    // Sort each level alphabetically
    const sortTree = (nodes: TreeNode[]): TreeNode[] => {
      return nodes
        .map((node) => ({
          ...node,
          children: node.children ? sortTree(node.children) : [],
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
    };

    return sortTree(roots);
  }, [categories]);

  // Flatten tree for display
  const flattenedCategories = useMemo(() => {
    const result: TreeNode[] = [];

    const traverse = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        result.push(node);
        if (
          expandedIds.has(node.id) &&
          node.children &&
          node.children.length > 0
        ) {
          traverse(node.children);
        }
      });
    };

    traverse(categoryTree);
    return result;
  }, [categoryTree, expandedIds]);

  const toggleExpand = async (category: TreeNode) => {
    const categoryId = category.id;
    const hasCategoryChildren = category.hasChildren || false;

    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);

        // Always fetch products when expanding, even if category has children
        // This allows parent categories to show their own products too
        if (!categoryProducts.has(categoryId)) {
          fetchCategoryProducts(categoryId);
        }
      }
      return newSet;
    });
  };

  const fetchCategoryProducts = async (categoryId: string) => {
    setLoadingCategories((prev) => new Set(prev).add(categoryId));
    try {
      // Fetch products with higher limit for category sidebar
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        console.error(
          "[CATEGORY_PRODUCTS] NEXT_PUBLIC_API_URL is not configured"
        );
        return;
      }

      const baseUrl = apiUrl.replace(/\/$/, "");
      const url = `${baseUrl}/api/products?categoryId=${categoryId}&limit=100`;

      const res = await fetch(url, {
        cache: "no-store",
      });

      if (!res.ok) {
        console.error(
          "Failed to fetch category products:",
          res.status,
          res.statusText
        );
        setCategoryProducts((prev) => {
          const newMap = new Map(prev);
          newMap.set(categoryId, []);
          return newMap;
        });
        return;
      }

      const data = await res.json();

      // Handle pagination response format
      let products: Product[] = [];
      if (Array.isArray(data)) {
        products = data;
      } else if (data.products && Array.isArray(data.products)) {
        products = data.products;
      } else if (data.data && Array.isArray(data.data)) {
        products = data.data;
      }

      if (process.env.NODE_ENV === "development") {
        console.log(`[CATEGORY_PRODUCTS] Category ${categoryId}:`, {
          productsCount: products.length,
          responseFormat: Array.isArray(data)
            ? "array"
            : data.products
            ? "pagination"
            : "unknown",
        });
      }

      setCategoryProducts((prev) => {
        const newMap = new Map(prev);
        newMap.set(categoryId, products);
        return newMap;
      });
    } catch (error) {
      console.error("Error fetching category products:", error);
      setCategoryProducts((prev) => {
        const newMap = new Map(prev);
        newMap.set(categoryId, []);
        return newMap;
      });
    } finally {
      setLoadingCategories((prev) => {
        const newSet = new Set(prev);
        newSet.delete(categoryId);
        return newSet;
      });
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

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
              Danh mục sản phẩm
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsOpen(false);
                setExpandedIds(new Set());
                setCategoryProducts(new Map());
              }}
              className="bg-white hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5 text-black" />
            </Button>
          </div>
        </SheetHeader>

        <div className="overflow-y-auto h-[calc(100vh-80px)]">
          <nav className="py-4">
            {categoryTree && categoryTree.length > 0 ? (
              <CategoryTreeList
                nodes={categoryTree}
                expandedIds={expandedIds}
                categoryProducts={categoryProducts}
                loadingCategories={loadingCategories}
                onToggleExpand={toggleExpand}
                onCategoryClick={(category) => {
                  // Navigate to category page or handle click
                  window.location.href = `/category/${category.id}`;
                }}
                pathname={pathname}
                setIsOpen={setIsOpen}
              />
            ) : (
              <div className="px-6 py-8 text-center">
                <p className="text-gray-500 text-sm font-light">
                  Chưa có danh mục nào
                </p>
              </div>
            )}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CategorySidebar;
