"use client";

import { cn } from "@/lib/utils";
import { Category } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

interface MainNavProps {
  data: Category[] | [];
}

const MainNav: React.FC<MainNavProps> = ({ data }) => {
  const pathname = usePathname();

  const routes = data.slice(0, 8).map((route) => ({
    href: `/category/${route.id}`,
    label: route.name,
    active: pathname === `/category/${route.id}`,
  }));

  if (routes.length === 0) return null;

  return (
    <nav className="flex items-center gap-6 md:gap-8 overflow-x-auto scrollbar-hide">
      {routes.map((route, index) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "relative text-xs md:text-sm font-light text-black dark:text-white uppercase tracking-wide",
            "hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300",
            "whitespace-nowrap shrink-0",
            route.active && "text-black dark:text-white"
          )}
        >
          {route.label}
          {route.active && (
            <motion.span
              layoutId="activeNav"
              className="absolute -bottom-1 left-0 right-0 h-px bg-black dark:bg-white"
              initial={false}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
            />
          )}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;
