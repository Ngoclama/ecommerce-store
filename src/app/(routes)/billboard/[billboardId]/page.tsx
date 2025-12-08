import getBillboard from "@/actions/get-billboard";
import getCategories from "@/actions/get-categories";
import { notFound } from "next/navigation";
import BillboardPageClient from "./billboard-page-client";

// Force dynamic rendering to prevent caching issues
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

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
    <BillboardPageClient
      billboard={billboard}
      categories={billboardCategories}
    />
  );
};

export default BillboardPage;
