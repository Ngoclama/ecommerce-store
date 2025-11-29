"use client";

import { Color, Size } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface FilterProps {
  data: (Size | Color)[];
  name: string;
  valueKey: string;
}

const Filter = ({ data, name, valueKey }: FilterProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedValue = searchParams.get(valueKey);

  const onClick = (id: string) => {
    const current = qs.parse(searchParams.toString());
    const query = {
      ...current,
      [valueKey]: id,
    };

    if (current[valueKey] === id) {
      query[valueKey] = null;
    }

    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true }
    );
    router.push(url);
  };

  // Check if this is a color filter
  const isColorFilter = valueKey === "colorId";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8 pb-8 border-b border-gray-200 last:border-0"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-light text-black uppercase tracking-wider">
          {name}
        </h3>
        {selectedValue && (
          <button
            onClick={() => onClick(selectedValue)}
            className="text-xs text-gray-500 hover:text-black transition-colors font-light uppercase tracking-wide flex items-center gap-1"
            aria-label="Xóa bộ lọc"
          >
            <X className="w-3 h-3" />
            Xóa
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2.5">
        {data.map((filter) => {
          const isSelected = selectedValue === filter.id;

          if (isColorFilter && "value" in filter) {
            // Color filter with color preview
            return (
              <motion.button
                key={filter.id}
                onClick={() => onClick(filter.id)}
                className={cn(
                  "relative group flex items-center gap-2 px-4 py-2.5 border transition-all duration-300 font-light text-xs uppercase tracking-wide",
                  isSelected
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-300 hover:border-black"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label={`Chọn màu ${filter.name}`}
              >
                <div
                  className={cn(
                    "w-4 h-4 border border-gray-300",
                    isSelected && "border-white"
                  )}
                  style={{ backgroundColor: filter.value }}
                />
                <span className="whitespace-nowrap">{filter.name}</span>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border border-black"
                  />
                )}
              </motion.button>
            );
          }

          // Size or other filter
          return (
            <motion.button
              key={filter.id}
              onClick={() => onClick(filter.id)}
              className={cn(
                "px-5 py-2.5 border transition-all duration-300 font-light text-xs uppercase tracking-wide whitespace-nowrap",
                isSelected
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-gray-300 hover:border-black hover:bg-gray-50"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label={`Chọn ${filter.name}`}
            >
              {filter.name}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Filter;
