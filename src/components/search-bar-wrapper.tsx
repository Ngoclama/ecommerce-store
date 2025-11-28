"use client";

import { Suspense } from "react";
import SearchBar from "./search-bar";

const SearchBarWrapper = () => {
  return (
    <Suspense
      fallback={
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full pl-10 pr-10 h-10 border border-gray-300 rounded-none font-light bg-white"
            disabled
          />
        </div>
      }
    >
      <SearchBar />
    </Suspense>
  );
};

export default SearchBarWrapper;
