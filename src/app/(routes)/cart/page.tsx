import Container from "@/components/ui/container";
import getProducts from "@/actions/get-products";
import CartClient from "./cart-client";

export const revalidate = 0;

const CartPage = async () => {
  // Fetch all products for cart items
  const products = await getProducts({}).catch(() => []);

  return (
    <div className="bg-white min-h-screen py-12">
      <Container>
        <div className="px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-light text-black mb-8 uppercase tracking-wider">
            Cart
          </h1>
          <CartClient products={products} />
        </div>
      </Container>
    </div>
  );
};

export default CartPage;
