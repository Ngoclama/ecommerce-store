import getCategories from "@/actions/get-categories";
import Container from "@/components/ui/container";
import CategoryList from "@/components/category-list";

export const revalidate = 0;

const CategoriesPage = async () => {
  const categories = await getCategories();

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <Container>
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-12 md:mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-black dark:text-white mb-3 tracking-wide uppercase">
              Bộ sưu tập
            </h1>
            <div className="w-20 md:w-24 h-px bg-black dark:bg-white mb-6"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-6 font-light text-sm md:text-base tracking-wide max-w-2xl">
              Khám phá các danh mục thời trang của chúng tôi
            </p>
          </div>

          {categories.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-light">
                Chưa có danh mục nào
              </p>
            </div>
          ) : (
            <CategoryList items={categories} />
          )}
        </div>
      </Container>
    </div>
  );
};

export default CategoriesPage;

