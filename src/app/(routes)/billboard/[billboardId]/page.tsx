import getBillboard from "@/actions/get-billboard";
import getCategories from "@/actions/get-categories";
import Container from "@/components/ui/container";
import CategoryList from "@/components/category-list";
import { notFound } from "next/navigation";

export const revalidate = 0;
export const dynamic = "force-dynamic";

type Params = Promise<{ billboardId: string }>;

const BillboardPage = async ({ params }: { params: Params }) => {
  const { billboardId } = await params;
  const [billboard, allCategories] = await Promise.all([
    getBillboard(billboardId),
    getCategories(),
  ]);

  if (!billboard) {
    notFound();
  }

  // Lọc categories thuộc về billboard này
  const billboardCategories = allCategories.filter(
    (category) => category.billboardId === billboardId
  );

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <Container>
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-12 md:mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-black dark:text-white mb-3 tracking-wide uppercase">
              {billboard.label}
            </h1>
            <div className="w-20 md:w-24 h-px bg-black dark:bg-white mb-6"></div>
            {billboard.description && (
              <p className="text-gray-600 dark:text-gray-400 mt-6 font-light text-sm md:text-base tracking-wide max-w-2xl">
                {billboard.description}
              </p>
            )}
          </div>

          {billboardCategories.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-light">
                Chưa có danh mục nào trong bộ sưu tập này
              </p>
            </div>
          ) : (
            <CategoryList items={billboardCategories} />
          )}
        </div>
      </Container>
    </div>
  );
};

export default BillboardPage;
