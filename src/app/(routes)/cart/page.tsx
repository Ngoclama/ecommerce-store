import Container from "@/components/ui/container";
import CartClient from "./cart-client";
import getCoupons from "@/actions/get-coupons";
import { Coupon } from "@/types";

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
    <div className="bg-white min-h-screen py-12 md:py-16">
      <Container>
        <div className="px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-8 md:mb-12 uppercase tracking-tight">
            Giỏ hàng
          </h1>
          <CartClient coupons={coupons} />
        </div>
      </Container>
    </div>
  );
};

export default CartPage;
