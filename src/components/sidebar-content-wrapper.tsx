"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function SidebarContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Get initial state from localStorage
    const saved = localStorage.getItem("sidebarOpen");
    if (saved !== null) {
      setSidebarOpen(saved === "true");
    }

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

