import { create } from "zustand";
import { Product } from "@/types";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

export interface CartItem extends Product {
  cartItemId: string; // id duy nhất trong giỏ
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (data: Product, quantity?: number) => void;
  removeItem: (cartItemId: string) => void;
  removeAll: () => void;
  increaseQuantity: (cartItemId: string) => void;
  decreaseQuantity: (cartItemId: string) => void;
  setQuantity: (cartItemId: string, quantity: number) => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      addItem: (data: Product, quantity = 1) => {
        const existingItem = get().items.find(
          (item) =>
            item.id === data.id &&
            item.size.id === data.size.id &&
            item.color.id === data.color.id
        );

        if (existingItem) {
          set({
            items: get().items.map((item) =>
              item.cartItemId === existingItem.cartItemId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
          toast.success(`Added ${quantity} more to cart.`);
        } else {
          const newItem: CartItem = {
            ...data,
            cartItemId: uuidv4(),
            quantity: quantity,
          };
          set({ items: [...get().items, newItem] });
          toast.success(`Added ${quantity} item(s) to cart.`);
        }
      },
      removeItem: (cartItemId: string) => {
        set({
          items: get().items.filter((item) => item.cartItemId !== cartItemId),
        });
        toast.success("Item removed from cart.");
      },
      removeAll: () => set({ items: [] }),
      increaseQuantity: (cartItemId: string) => {
        set({
          items: get().items.map((item) =>
            item.cartItemId === cartItemId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        });
      },
      setQuantity: (id: string, quantity: number) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.cartItemId === id ? { ...item, quantity } : item
          ),
        })),
      decreaseQuantity: (cartItemId: string) => {
        set({
          items: get().items.map((item) =>
            item.cartItemId === cartItemId
              ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
              : item
          ),
        });
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;
