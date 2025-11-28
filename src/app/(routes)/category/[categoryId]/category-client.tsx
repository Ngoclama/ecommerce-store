"use client";

import { Product, Size, Color, Category } from "@/types";
import Billboard from "@/components/billboard";
import Container from "@/components/ui/container";
import ProductCard from "@/components/ui/product-card";
import Filter from "../components/filter";
import MobileFilters from "../components/mobile-filter";
import SortFilter from "../components/sort-filter";
import PriceFilter from "../components/price-filter";
import NoResult from "@/components/ui/result";
import { useMemo } from "react";
import useCart from "@/hooks/use-cart";

interface CategoryClientProps {
  products: Product[];
  sizes: Size[];
  colors: Color[];
  category: Category | null;
  searchParams: {
    colorId?: string;
    sizeId?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

const CategoryClient: React.FC<CategoryClientProps> = ({
  products,
  sizes,
  colors,
  category,
  searchParams,
}) => {
  const { isItemInWishlist, toggleWishlist } = useCart();

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Price filter
    if (searchParams.minPrice) {
      const min = parseFloat(searchParams.minPrice);
      result = result.filter((p) => p.price >= min);
    }
    if (searchParams.maxPrice) {
      const max = parseFloat(searchParams.maxPrice);
      result = result.filter((p) => p.price <= max);
    }

    // Sort
    switch (searchParams.sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "oldest":
        result.sort((a, b) => {
          const aDate = (a as any).createdAt
            ? new Date((a as any).createdAt).getTime()
            : 0;
          const bDate = (b as any).createdAt
            ? new Date((b as any).createdAt).getTime()
            : 0;
          return aDate - bDate;
        });
        break;
      default: // newest
        result.sort((a, b) => {
          const aDate = (a as any).createdAt
            ? new Date((a as any).createdAt).getTime()
            : 0;
          const bDate = (b as any).createdAt
            ? new Date((b as any).createdAt).getTime()
            : 0;
          return bDate - aDate;
        });
    }

    return result;
  }, [products, searchParams]);

  return (
    <div className="bg-white">
      <Container>
        {category?.billboard && <Billboard data={category.billboard} />}
        <div className="px-4 pb-24 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
            {/* Mobile Filters */}
            <div className="lg:hidden mb-4">
              <MobileFilters sizes={sizes} colors={colors} />
            </div>

            {/* Desktop Filters */}
            <div className="hidden lg:block space-y-6">
              <SortFilter />
              <PriceFilter />
              <Filter valueKey="sizeId" name="Kích thước" data={sizes} />
              <Filter valueKey="colorId" name="Màu sắc" data={colors} />
            </div>

            {/* Products Grid - Aigle Style */}
            <div className="mt-6 lg:col-span-4 lg:mt-0">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl md:text-3xl font-light text-black uppercase tracking-wider">
                  {category?.name || "Products"}
                </h2>
                <span className="text-xs font-light text-gray-600">
                  {filteredAndSortedProducts.length} products
                </span>
              </div>

              {filteredAndSortedProducts.length === 0 ? (
                <NoResult />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {filteredAndSortedProducts.map((item) => (
                    <ProductCard
                      key={item.id}
                      data={item}
                      isWishlistActive={isItemInWishlist(item.id)}
                      onToggleFavorite={toggleWishlist}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CategoryClient;
