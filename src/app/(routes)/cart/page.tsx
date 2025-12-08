import Container from "@/components/ui/container";
import CartClient from "./cart-client";
import getCoupons from "@/actions/get-coupons";
import { Coupon } from "@/types";

// Force dynamic rendering to prevent caching issues
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

const CartPage = async () => {
  // Fetch coupons with error handling
  let coupons: Coupon[] = [];
  try {
    coupons = await getCoupons();
  } catch (error) {
    console.error("Failed to load coupons:", error);
    // Continue with empty coupons array
  }

  return (
    <div className="bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-gray-900 dark:to-neutral-950 min-h-screen">
      <Container>
        <CartClient coupons={coupons} />
      </Container>
    </div>
  );
};

export default CartPage;
