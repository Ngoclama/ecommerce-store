import getBillboard from "@/actions/get-billboard";
import getProduct from "@/actions/get-products";
import Billboard from "@/components/billboard";
import ProductList from "@/components/product-list";
import Container from "@/components/ui/container";
export const revalidate = 0;
const HomePage = async () => {
  const billboard = await getBillboard("690b9067a626c9f2cd8068e7");
  const products = await getProduct({ isFeatured: true });
  return (
    <Container>
      <div className="flex flex-col items-center justify-center h-full">
        <Billboard data={billboard} />
        <h1 className="text-4xl font-bold"></h1>
      </div>
      <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
        <ProductList title="Featured Products" items={products} />
      </div>
    </Container>
  );
};

export default HomePage;
