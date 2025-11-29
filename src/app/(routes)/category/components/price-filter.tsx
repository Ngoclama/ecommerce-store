"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const PriceFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);
  const [isActive, setIsActive] = useState(!!(minPrice || maxPrice));

  useEffect(() => {
    setLocalMinPrice(minPrice);
    setLocalMaxPrice(maxPrice);
    setIsActive(!!(minPrice || maxPrice));
  }, [minPrice, maxPrice]);

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (localMinPrice) {
      params.set("minPrice", localMinPrice);
    } else {
      params.delete("minPrice");
    }

    if (localMaxPrice) {
      params.set("maxPrice", localMaxPrice);
    } else {
      params.delete("maxPrice");
    }

    router.push(`?${params.toString()}`);
  };

  const handleClear = () => {
    setLocalMinPrice("");
    setLocalMaxPrice("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("minPrice");
    params.delete("maxPrice");
    router.push(`?${params.toString()}`);
  };

  const formatPrice = (value: string) => {
    if (!value) return "";
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setLocalMinPrice(value);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setLocalMaxPrice(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8 pb-8 border-b border-gray-200"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-black" />
          <h3 className="text-sm font-light text-black uppercase tracking-wider">
            Khoảng giá
          </h3>
        </div>
        {isActive && (
          <button
            onClick={handleClear}
            className="text-xs text-gray-500 hover:text-black transition-colors font-light uppercase tracking-wide flex items-center gap-1"
            aria-label="Xóa bộ lọc giá"
          >
            <X className="w-3 h-3" />
            Xóa
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs font-light text-gray-600 uppercase tracking-wide mb-2">
              Từ (VNĐ)
            </label>
        <Input
              type="text"
              placeholder="0"
              value={formatPrice(localMinPrice)}
              onChange={handleMinPriceChange}
              className={cn(
                "w-full rounded-none border-gray-300 focus:border-black bg-white font-light text-sm h-11 transition-colors",
                isActive && localMinPrice && "border-black"
              )}
            />
          </div>
          <div className="flex items-end pb-7">
            <span className="text-gray-400">—</span>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-light text-gray-600 uppercase tracking-wide mb-2">
              Đến (VNĐ)
            </label>
        <Input
              type="text"
              placeholder="Không giới hạn"
              value={formatPrice(localMaxPrice)}
              onChange={handleMaxPriceChange}
              className={cn(
                "w-full rounded-none border-gray-300 focus:border-black bg-white font-light text-sm h-11 transition-colors",
                isActive && localMaxPrice && "border-black"
              )}
        />
      </div>
        </div>

      <div className="flex gap-2">
        <Button
          onClick={handleApply}
            className={cn(
              "flex-1 rounded-none bg-black text-white hover:bg-gray-900 font-light text-xs uppercase tracking-wide h-10 transition-all duration-300 flex items-center justify-center gap-2",
              isActive && "bg-gray-900"
            )}
          >
            <Check className="w-4 h-4" />
          Áp dụng
        </Button>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
            >
          <Button
            onClick={handleClear}
            variant="outline"
                className="rounded-none border-gray-300 hover:border-black hover:bg-gray-50 font-light text-xs uppercase tracking-wide h-10 px-4 transition-all duration-300"
          >
                <X className="w-4 h-4 mr-1" />
            Xóa
          </Button>
            </motion.div>
        )}
        </div>

        {/* Quick Price Ranges */}
        <div className="pt-2">
          <p className="text-xs font-light text-gray-500 uppercase tracking-wide mb-3">
            Khoảng giá nhanh
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { min: "0", max: "500000", label: "Dưới 500K" },
              { min: "500000", max: "1000000", label: "500K - 1M" },
              { min: "1000000", max: "2000000", label: "1M - 2M" },
              { min: "2000000", max: "", label: "Trên 2M" },
            ].map((range) => (
              <button
                key={range.label}
                onClick={() => {
                  setLocalMinPrice(range.min);
                  setLocalMaxPrice(range.max);
                }}
                className="px-4 py-2 border border-gray-300 hover:border-black hover:bg-gray-50 bg-white text-black font-light text-xs uppercase tracking-wide transition-all duration-300"
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PriceFilter;
