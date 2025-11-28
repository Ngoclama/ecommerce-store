"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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

  return (
    <div className="space-y-2 mb-6">
      <Label className="text-sm font-light text-black uppercase tracking-wide">Sắp xếp theo</Label>
      <Select value={currentSort} onValueChange={onSortChange}>
        <SelectTrigger className="w-full rounded-none border-gray-300 focus:border-black">
          <SelectValue placeholder="Sắp xếp" />
        </SelectTrigger>
        <SelectContent className="rounded-none border-gray-300">
          <SelectItem value="newest">Mới nhất</SelectItem>
          <SelectItem value="oldest">Cũ nhất</SelectItem>
          <SelectItem value="price-asc">Giá: Thấp đến Cao</SelectItem>
          <SelectItem value="price-desc">Giá: Cao đến Thấp</SelectItem>
          <SelectItem value="name-asc">Tên: A-Z</SelectItem>
          <SelectItem value="name-desc">Tên: Z-A</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortFilter;

