import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * API Route để revalidate cache khi có thay đổi từ admin
 * Admin sẽ gọi endpoint này sau khi tạo/cập nhật/xóa sản phẩm hoặc blog
 */
export async function POST(req: NextRequest) {
  try {
    // Kiểm tra secret token để bảo mật
    const authHeader = req.headers.get("authorization");
    const secretToken = process.env.REVALIDATE_SECRET_TOKEN;

    if (secretToken && authHeader !== `Bearer ${secretToken}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { type, path, tag } = body;

    // Revalidate theo path
    if (path) {
      if (Array.isArray(path)) {
        path.forEach((p: string) => {
          revalidatePath(p, "page");
        });
      } else {
        revalidatePath(path, "page");
      }
    }

    // Revalidate theo tag
    if (tag) {
      if (Array.isArray(tag)) {
        tag.forEach((t: string) => {
          revalidateTag(t, "max");
        });
      } else {
        revalidateTag(tag, "max");
      }
    }

    // Revalidate các path mặc định dựa trên type
    if (type === "product") {
      revalidatePath("/", "page");
      revalidatePath("/products", "page");
      revalidatePath("/products/new", "page");
      revalidatePath("/products/featured", "page");
      revalidatePath("/products/bestsellers", "page");
      revalidateTag("products", "max");
      revalidateTag("categories", "max");
    } else if (type === "blog") {
      revalidatePath("/", "page");
      revalidatePath("/blog", "page");
      revalidateTag("blogs", "max");
    } else if (type === "category") {
      revalidatePath("/", "page");
      revalidatePath("/categories", "page");
      revalidateTag("categories", "max");
      revalidateTag("products", "max");
    } else if (type === "billboard") {
      revalidatePath("/", "page");
      revalidateTag("billboards", "max");
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      type,
      paths:
        path ||
        (type === "product"
          ? ["/", "/products"]
          : type === "blog"
          ? ["/", "/blog"]
          : ["/"]),
    });
  } catch (error: any) {
    console.error("[REVALIDATE] Error:", error);
    return NextResponse.json(
      { error: "Error revalidating", message: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint để test
export async function GET() {
  return NextResponse.json({
    message: "Revalidate API is working",
    timestamp: Date.now(),
  });
}
