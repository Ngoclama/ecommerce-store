import getCategory from "@/actions/get-category";
import getColors from "@/actions/get-colors";
import getProducts from "@/actions/get-products";
import getSizes from "@/actions/get-sizes";
import Billboard from "@/components/billboard";
import Container from "@/components/ui/container";
import ProductCard from "@/components/ui/product-card";
import Filter from "../components/filter";
import MobileFilters from "../components/mobile-filter";
import SortFilter from "../components/sort-filter";
import PriceFilter from "../components/price-filter";
import NoResult from "@/components/ui/result";
import CategoryClient from "./category-client";

export const revalidate = 0;

type Params = Promise<{ categoryId: string }>;
type SearchParams = Promise<{
  colorId?: string;
  sizeId?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
}>;

const CategoryPage = async ({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) => {
    const { categoryId } = await params;
    const { colorId, sizeId } = await searchParams;
  const products = await getProducts({
    categoryId: categoryId,
    colorId: colorId,
    sizeId: sizeId,
  });
    const sizes = await getSizes();
    const colors = await getColors();
  const category = await getCategory(categoryId);

    return ( 
    <CategoryClient
      products={products}
      sizes={sizes}
      colors={colors}
      category={category}
      searchParams={await searchParams}
    />
    );
};

export default CategoryPage;
