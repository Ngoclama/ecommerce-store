"use client";

import { ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function NavbarActions() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="ml-auto flex items-center gap-x-4">
      <button
        onClick={() => setIsOpen(true)}
        className="
          relative p-2 text-slate-700 dark:text-slate-200 
          hover:bg-slate-200 dark:hover:bg-slate-800 
          rounded-lg transition-colors
        "
        aria-label="Open shopping bag"
      >
        <ShoppingCart size={24} />
        <span
          className="
            absolute -top-1 -right-1 w-5 h-5 
            bg-red-500 text-white text-xs 
            rounded-full flex items-center justify-center 
            font-semibold shadow-md
          "
        >
          0
        </span>
      </button>

      {/* iPhone Quick Action Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* BACKDROP */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md"
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(6px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
            />

            {/* DRAWER */}
            <motion.div
              className="
                fixed bottom-0 right-0 left-0 z-50 
                bg-white dark:bg-slate-900 
                rounded-t-3xl shadow-2xl border-t border-slate-200 dark:border-slate-700
                max-w-sm ml-auto mr-0 h-[85%]
              "
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 25,
              }}
            >
              {/* HANDLE BAR */}
              <div className="flex justify-center py-3">
                <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
              </div>

              {/* HEADER */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                  Shopping Bag
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <X size={22} />
                </button>
              </div>

              {/* BODY */}
              <div className="flex-1 overflow-auto px-6 py-6">
                <p className="text-center text-slate-500 dark:text-slate-400">
                  Your bag is empty
                </p>
              </div>

              {/* FOOTER */}
              <div className="border-t border-slate-200 dark:border-slate-800 px-6 py-5">
                <button
                  onClick={() => setIsOpen(false)}
                  className="
                    w-full bg-slate-900 dark:bg-slate-50 
                    text-white dark:text-slate-900 py-3 rounded-xl font-semibold 
                    hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors
                  "
                >
                  Continue shopping
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
