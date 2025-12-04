"use client";

import { Search, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ className }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setSearch(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  const handleClear = () => {
    setSearch("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative w-full", className)}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Tìm kiếm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-8 pr-8 h-9 border-0 rounded-none bg-transparent focus-visible:ring-0 text-sm font-light"
        />
        <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        {search && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 hover:text-black rounded-none"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
