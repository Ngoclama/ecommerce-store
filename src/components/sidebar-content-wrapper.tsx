"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function SidebarContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize state from localStorage if available, otherwise default to false (closed)
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebarOpen");
      return saved !== null ? saved === "true" : false;
    }
    return false;
  });

  useEffect(() => {
    // Listen for sidebar toggle events
    const handleToggle = (e: CustomEvent) => {
      setSidebarOpen(e.detail.isOpen);
    };

    window.addEventListener("sidebar-toggle", handleToggle as EventListener);

    return () => {
      window.removeEventListener(
        "sidebar-toggle",
        handleToggle as EventListener
      );
    };
  }, []);

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-out",
        sidebarOpen ? "lg:ml-64" : "lg:ml-6"
      )}
      style={{ willChange: "margin-left" }}
    >
      {children}
    </div>
  );
}

