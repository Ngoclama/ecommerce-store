"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const PriceFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);

  useEffect(() => {
    setLocalMinPrice(minPrice);
    setLocalMaxPrice(maxPrice);
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

  return (
    <div className="space-y-3 mb-6">
      <Label className="text-sm font-light text-black uppercase tracking-wide">
        Khoảng giá (VNĐ)
      </Label>
      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Từ"
          value={localMinPrice}
          onChange={(e) => setLocalMinPrice(e.target.value)}
          className="w-full rounded-none border-gray-300 focus:border-black"
        />
        <Input
          type="number"
          placeholder="Đến"
          value={localMaxPrice}
          onChange={(e) => setLocalMaxPrice(e.target.value)}
          className="w-full rounded-none border-gray-300 focus:border-black"
        />
      </div>
      <div className="flex gap-2">
        <Button
          onClick={handleApply}
          size="sm"
          variant="default"
          className="flex-1 rounded-none"
        >
          Áp dụng
        </Button>
        {(minPrice || maxPrice) && (
          <Button
            onClick={handleClear}
            variant="outline"
            size="sm"
            className="rounded-none"
          >
            Xóa
          </Button>
        )}
      </div>
    </div>
  );
};

export default PriceFilter;
