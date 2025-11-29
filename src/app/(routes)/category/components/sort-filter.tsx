"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { ArrowUpDown, Sparkles } from "lucide-react";

const SortFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "newest";

  const onSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    router.push(`?${params.toString()}`);
  };

  const sortOptions = [
    { value: "newest", label: "Mới nhất", icon: Sparkles },
    { value: "oldest", label: "Cũ nhất", icon: ArrowUpDown },
    { value: "price-asc", label: "Giá: Thấp → Cao", icon: ArrowUpDown },
    { value: "price-desc", label: "Giá: Cao → Thấp", icon: ArrowUpDown },
    { value: "name-asc", label: "Tên: A → Z", icon: ArrowUpDown },
    { value: "name-desc", label: "Tên: Z → A", icon: ArrowUpDown },
  ];

  const currentOption = sortOptions.find((opt) => opt.value === currentSort);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8 pb-8 border-b border-gray-200"
    >
      <div className="flex items-center gap-2 mb-5 mt-15">
        <ArrowUpDown className="w-4 h-4 text-black" />
        <h3 className="text-sm font-light text-black uppercase tracking-wider">
          Sắp xếp theo
        </h3>
      </div>

      <Select value={currentSort} onValueChange={onSortChange}>
        <SelectTrigger className="w-full rounded-none border-gray-300 focus:border-black bg-white hover:bg-gray-50 transition-colors h-11 font-light text-sm uppercase tracking-wide">
          <div className="flex items-center gap-2">
            {currentOption && (
              <currentOption.icon className="w-4 h-4 text-black" />
            )}
            <SelectValue placeholder="Chọn cách sắp xếp" />
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-none border-gray-300 bg-white">
          {sortOptions.map((option) => {
            const Icon = option.icon;
            return (
              <SelectItem
                key={option.value}
                value={option.value}
                className="font-light text-sm uppercase tracking-wide hover:bg-gray-50 focus:bg-gray-50 cursor-pointer rounded-none"
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </motion.div>
  );
};

export default SortFilter;
