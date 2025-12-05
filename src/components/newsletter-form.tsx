"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function NewsletterForm() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Use requestAnimationFrame to defer setState
    requestAnimationFrame(() => {
      setMounted(true);
    });
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-md mx-auto flex gap-2">
        <div className="flex-1 h-9 bg-gray-100 animate-pulse border-b border-gray-300" />
        <div className="w-24 h-9 bg-gray-100 animate-pulse border-b border-gray-300" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto flex gap-2">
      <Input
        type="email"
        placeholder="Email"
        className="flex-1 h-9 border-0 border-b border-gray-300 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-black text-sm font-light"
      />
      <Button
        variant="outline"
        className="px-6 py-2 h-9 rounded-none border-b border-gray-300 hover:border-black text-xs font-light uppercase tracking-wider"
      >
        Sign up
      </Button>
    </div>
  );
}
