import getCategories from "@/actions/get-categories";
import getSizes from "@/actions/get-sizes";
import getColors from "@/actions/get-colors";
import Container from "@/components/ui/container";
import { Suspense } from "react";
import SearchContent from "./search-content";
import { Loader2 } from "lucide-react";

const SearchPage = async () => {
  // Fetch filter options
  const [categories, sizes, colors] = await Promise.all([
    getCategories(),
    getSizes(),
    getColors(),
  ]);

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <Container>
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          }
        >
          <SearchContent
            categories={categories}
            sizes={sizes}
            colors={colors}
          />
        </Suspense>
      </Container>
    </div>
  );
};

export default SearchPage;
