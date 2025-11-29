"use client";

import { Category, Size, Color } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";

interface SearchFiltersProps {
  categories: Category[];
  sizes: Size[];
  colors: Color[];
  currentFilters: {
    categoryId?: string;
    sizeId?: string;
    colorId?: string;
  };
  searchQuery: string;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  categories,
  sizes,
  colors,
  currentFilters,
  searchQuery,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1"); // Reset to first page when filter changes
    router.push(`/search?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    router.push(`/search?${params.toString()}`);
  };

  const hasActiveFilters =
    currentFilters.categoryId ||
    currentFilters.sizeId ||
    currentFilters.colorId;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-light text-black uppercase tracking-wider">
          Bộ lọc
        </h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs text-gray-600 hover:text-black h-auto p-0 font-light"
          >
            Xóa tất cả
          </Button>
        )}
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div>
          <h3 className="text-sm font-light text-black mb-3 uppercase tracking-wide">
            Danh mục
          </h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="category"
                  checked={currentFilters.categoryId === category.id}
                  onChange={() =>
                    updateFilter(
                      "categoryId",
                      currentFilters.categoryId === category.id
                        ? null
                        : category.id
                    )
                  }
                  className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                />
                <span className="text-sm font-light text-gray-700 group-hover:text-black transition-colors">
                  {category.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Size Filter */}
      {sizes.length > 0 && (
        <div>
          <h3 className="text-sm font-light text-black mb-3 uppercase tracking-wide">
            Kích thước
          </h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size.id}
                onClick={() =>
                  updateFilter(
                    "sizeId",
                    currentFilters.sizeId === size.id ? null : size.id
                  )
                }
                className={`px-3 py-1.5 text-xs font-light border transition-colors ${
                  currentFilters.sizeId === size.id
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-300 hover:border-black"
                }`}
              >
                {size.name || size.value}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color Filter */}
      {colors.length > 0 && (
        <div>
          <h3 className="text-sm font-light text-black mb-3 uppercase tracking-wide">
            Màu sắc
          </h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color.id}
                onClick={() =>
                  updateFilter(
                    "colorId",
                    currentFilters.colorId === color.id ? null : color.id
                  )
                }
                className={`relative w-10 h-10 border-2 transition-all ${
                  currentFilters.colorId === color.id
                    ? "border-black scale-110"
                    : "border-gray-300 hover:border-gray-500"
                }`}
                style={{
                  backgroundColor: color.value || "#ccc",
                }}
                title={color.name}
              >
                {currentFilters.colorId === color.id && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
