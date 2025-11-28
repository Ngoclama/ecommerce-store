"use client";

import { Settings, MessageCircle, Gift } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const FloatingButtons = () => {
  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-2">
      {/* Support Button - Aigle Style */}
      <Button
        size="icon"
        className={cn(
          "w-12 h-12 rounded-none bg-white hover:bg-gray-100 text-black border border-black",
          "transition-all"
        )}
        aria-label="Support"
      >
        <Settings className="w-5 h-5" />
      </Button>

      {/* Messenger Chat Button - Aigle Style */}
      <Button
        size="icon"
        className={cn(
          "w-12 h-12 rounded-none bg-white hover:bg-gray-100 text-black border border-black",
          "transition-all"
        )}
        aria-label="Contact us"
        onClick={() => {
          // Có thể mở Messenger hoặc chat widget
          window.open("https://m.me/your-page", "_blank");
        }}
      >
        <MessageCircle className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default FloatingButtons;
