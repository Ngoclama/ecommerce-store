"use client";

import { ShoppingCart, X, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useCart from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function NavbarActions() {
  const [isOpen, setIsOpen] = useState(false);
  const cart = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    setIsOpen(false);
    router.push("/cart");
  };

  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="ml-auto flex items-center gap-x-4">
      {/* Cart Icon */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
        aria-label="Open shopping bag"
      >
        <ShoppingCart size={24} />
        {cart.items.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-md">
            {cart.items.length}
          </span>
        )}
      </button>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* BACKDROP */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md"
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(6px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
            />

            {/* DRAWER */}
            <motion.div
              className="fixed bottom-0 right-0 left-0 z-60 bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl border-t border-white/20 dark:border-slate-700 max-w-md mx-auto h-[80%] flex flex-col"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
            >
              {/* HANDLE */}
              <div className="flex justify-center py-3">
                <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
              </div>

              {/* HEADER */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                  Shopping Bag
                </h2>
                <Button
                  variant={"outline"}
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg dark:hover:bg-slate-800 transition"
                >
                  <X size={22} />
                </Button>
              </div>

              {/* BODY */}
              <div className="flex-1 overflow-auto px-6 py-4">
                {cart.items.length === 0 ? (
                  <p className="text-center text-slate-500 dark:text-slate-400">
                    Your bag is empty
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {cart.items.map((item) => (
                      <li
                        key={item.cartItemId}
                        className="flex gap-4 items-center"
                      >
                        {/* Image */}
                        <div className="relative w-20 h-20 flex-shrink-0">
                          {Array.isArray(item.images) &&
                            item.images.length > 0 &&
                            item.images[0]?.url && (
                              <Image
                                src={
                                  item.images?.[0]?.url || "/placeholder.png"
                                }
                                alt={item.name}
                                fill
                                className="object-cover rounded-md"
                              />
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <p className="font-semibold text-black">
                              {item.name}
                            </p>
                            <p className="text-gray-500 text-sm">
                              {item.color?.name ?? ""} | {item.size?.name ?? ""}
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center w-40 border border-gray-300 rounded-lg overflow-hidden mt-2 ">
                            {/* nút - */}
                            <Button
                              variant={"outline"}
                              onClick={() =>
                                cart.decreaseQuantity(item.cartItemId)
                              }
                              className="w-8 h-8 flex justify-center items-center  text-gray-700 hover:bg-gray-100 transition"
                            >
                              -
                              <Minus size={14} />
                            </Button>
                            <Button
                              variant={"outline"}
                              onClick={() =>
                                cart.increaseQuantity(item.cartItemId)
                              }
                              className="w-8 h-8 flex justify-center items-center  text-gray-700 hover:bg-gray-100 transition"
                            >
                              +
                              <Minus size={14} />
                            </Button>

                            {/* input số */}
                            <input
                              type="number"
                              min={0}
                              value={item.quantity === 0 ? "" : item.quantity}
                              onChange={(e) => {
                                const val = e.target.value;

                                if (val === "") {
                                  cart.setQuantity(item.cartItemId, 0);
                                  return;
                                }

                                const num = parseInt(val);
                                if (!isNaN(num) && num >= 0) {
                                  cart.setQuantity(item.cartItemId, num);
                                }
                              }}
                              className="flex-1 h-8 text-center text-sm font-medium outline-none border-none"
                            />

                            {/* nút + */}
                            {/* <Button
                              onClick={() =>
                                cart.increaseQuantity(item.cartItemId)
                              }
                              className="w-8 h-8 flex justify-center items-center border-l border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                            >
                              <Plus size={14} />
                            </Button> */}
                          </div>
                        </div>

                        {/* Price & Remove */}
                        <div className="flex flex-col items-end gap-2">
                          <span className="font-semibold">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(item.price * item.quantity)}
                          </span>
                          <div className="pt-4">
                            <Button
                              variant={"outline"}
                              size="sm"
                              onClick={() => cart.removeItem(item.cartItemId)}
                              className="px-2 py-1 pt-1.5 rounded-lg hover:bg-slate-100 transition"
                            >
                              <X size={14} />
                            </Button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* FOOTER */}
              {cart.items.length > 0 && (
                <div className="border-t border-slate-200 dark:border-slate-800 px-6 py-5 flex flex-col gap-3">
                  <div className="flex justify-between text-lg font-semibold text-slate-900 dark:text-slate-50">
                    <span>Total:</span>
                    <span>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(totalPrice)}
                    </span>{" "}
                  </div>
                  <Button
                    onClick={handleCheckout}
                    className="w-full py-3 rounded-xl font-semibold"
                  >
                    Checkout
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
