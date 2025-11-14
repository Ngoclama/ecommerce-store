import { Product } from "@/types";
import NoResult from "./ui/result";
import ProductCard from "./ui/product-card";

interface ProductListProps {
  title: string;
  items: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ title, items }) => {
  return (
    <div className="space-y-8 p-4 sm:p-8">
      <h1 className="font-bold text-3xl">{title}</h1>
      {items.length === 0 && <NoResult />}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-col-4 gap-4">
        {items.map((item) => (
          <ProductCard key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
