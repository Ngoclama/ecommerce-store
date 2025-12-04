import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product, CartItem } from "@/types";
import { toast } from "sonner";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

// Cấu hình axios để gửi credentials (cookies) với mọi request
axios.defaults.withCredentials = true;

// --- Wishlist Types & Logic ---
interface WishlistState {
  wishlistItems: string[];
  isItemInWishlist: (id: string) => boolean;
  toggleWishlist: (productId: string) => void;
  setWishlist: (productIds: string[]) => void;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
}

// --- Cart Types & Logic (Corrected Signatures) ---
interface CartState {
  items: CartItem[];
  addItem: (data: Product, quantity?: number) => void;
  removeItem: (cartItemId: string) => void;
  removeAll: () => void;
  setQuantity: (cartItemId: string, newQuantity: number) => void;
  getQuantity: (cartItemId: string) => number;
  increaseQuantity: (cartItemId: string) => void;
  decreaseQuantity: (cartItemId: string) => void;
}

type CartStore = CartState & WishlistState;

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      // --- Cart State & Actions ---
      items: [],

      addItem: (data: Product, quantity = 1) => {
        const currentItems = get().items;

        // 1. Check if a duplicate *variant* exists
        const existingItem = currentItems.find(
          (item) =>
            item.id === data.id &&
            item.size?.id === data.size?.id &&
            item.color?.id === data.color?.id
        );

        // Default inventory to 999 if not provided (safe assumption for a featured product)
        const inventory = data.inventory ?? 999;

        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;

          // 2. Check stock when adding more
          if (newQuantity > inventory) {
            toast.error(
              `Chỉ còn ${inventory} sản phẩm trong kho. Bạn đã có ${existingItem.quantity} trong giỏ.`
            );
            return;
          }

          // 3. Update quantity of existing item
          set({
            items: currentItems.map((item) =>
              item.cartItemId === existingItem.cartItemId
                ? { ...item, quantity: newQuantity }
                : item
            ),
          });
          toast.success(`Đã tăng số lượng lên ${newQuantity}.`);
        } else {
          // 4. Add new item (assign unique ID and inventory snapshot)
          const newItem: CartItem = {
            ...data,
            cartItemId: uuidv4(),
            quantity: quantity,
            inventory: inventory,
          } as CartItem;

          set({ items: [...currentItems, newItem] });
          toast.success("Đã thêm vào giỏ hàng.", { description: data.name });
        }
      },

      removeItem: (cartItemId: string) => {
        set({
          items: get().items.filter((item) => item.cartItemId !== cartItemId),
        });
        toast.success("Đã xóa khỏi giỏ hàng.");
      },

      removeAll: () => {
        set({ items: [] });
        toast.success("Đã xóa tất cả sản phẩm khỏi giỏ hàng.");
      },

      setQuantity: (cartItemId: string, newQuantity: number) => {
        const item = get().items.find((i) => i.cartItemId === cartItemId);
        if (!item) return;

        const safeQuantity = Math.max(0, newQuantity);
        const inventory = item.inventory;

        // 1. Check stock limit
        if (safeQuantity > inventory) {
          toast.error(`Chỉ còn ${inventory} sản phẩm trong kho.`);
          return;
        }

        // 2. Remove if quantity is 0
        if (safeQuantity === 0) {
          get().removeItem(cartItemId);
          return;
        }

        // 3. Update quantity
        set({
          items: get().items.map((i) =>
            i.cartItemId === cartItemId ? { ...i, quantity: safeQuantity } : i
          ),
        });
      },

      updateQuantity: (id: string, newQuantity: number) => {
        const item = get().items.find((i) => i.id === id);
        if (item) {
          get().setQuantity(item.cartItemId, newQuantity);
        }
      },

      getQuantity: (cartItemId: string) => {
        return (
          get().items.find((item) => item.cartItemId === cartItemId)
            ?.quantity || 0
        );
      },

      increaseQuantity: (cartItemId: string) => {
        const item = get().items.find((i) => i.cartItemId === cartItemId);
        if (item) {
          get().setQuantity(cartItemId, item.quantity + 1);
        }
      },

      decreaseQuantity: (cartItemId: string) => {
        const item = get().items.find((i) => i.cartItemId === cartItemId);
        if (item) {
          get().setQuantity(cartItemId, item.quantity - 1);
        }
      },

      // --- Wishlist State & Actions ---
      wishlistItems: [],
      isItemInWishlist: (id: string) => get().wishlistItems.includes(id),
      setWishlist: (productIds: string[]) => {
        // Remove duplicates using Set
        const uniqueProductIds = Array.from(new Set(productIds));
        set({ wishlistItems: uniqueProductIds });
      },

      addToWishlist: (productId: string) => {
        const current = get().wishlistItems;
        if (!current.includes(productId)) {
          set({ wishlistItems: [...current, productId] });
        }
      },

      removeFromWishlist: (productId: string) => {
        set({
          wishlistItems: get().wishlistItems.filter((id) => id !== productId),
        });
      },

      toggleWishlist: async (productId: string) => {
        const isCurrentlyInList = get().isItemInWishlist(productId);
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`;

        // Optimistic UI Update
        const previousWishlist = get().wishlistItems;
        if (isCurrentlyInList) {
          set({
            wishlistItems: previousWishlist.filter((id) => id !== productId),
          });
          toast.info("Đã xóa khỏi danh sách yêu thích.");
        } else {
          set({ wishlistItems: [...previousWishlist, productId] });
          toast.success("Đã thêm vào danh sách yêu thích!");
        }

        try {
          const response = await axios.post(
            url,
            {
              productId: productId,
              action: isCurrentlyInList ? "remove" : "add",
            },
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (
            response.data &&
            typeof response.data === "object" &&
            "success" in response.data &&
            !response.data.success
          ) {
            throw new Error(
              ("message" in response.data &&
                typeof response.data.message === "string" &&
                response.data.message) ||
                "Failed to update wishlist"
            );
          }
        } catch (error: any) {
          set({ wishlistItems: previousWishlist });

          console.error("[WISHLIST_TOGGLE_ERROR]", error);

          if (error.response?.status === 401) {
            toast.error("Vui lòng đăng nhập để thêm vào danh sách yêu thích.");
          } else if (
            error.response?.status === 404 &&
            error.response?.data?.message?.includes("User not found")
          ) {
            toast.error(
              "Tài khoản chưa được kích hoạt. Vui lòng liên hệ admin."
            );
          } else if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else if (error.message) {
            toast.error(error.message);
          } else {
            toast.error(
              "Không thể cập nhật danh sách yêu thích. Vui lòng thử lại."
            );
          }
        }
      },
    }),
    {
      name: "ecommerce-cart-wishlist-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;
