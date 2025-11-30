import Container from "@/components/ui/container";
import { Package, Heart, Eye, RotateCcw, HelpCircle, FileText, Shield, Cookie, Ruler, FolderTree } from "lucide-react";
import Link from "next/link";

export default function AccountPage() {
  const menuItems = [
    {
      title: "Đơn hàng của tôi",
      description: "Xem lịch sử đơn hàng",
      icon: Package,
      href: "/account/orders",
    },
    {
      title: "Sản phẩm yêu thích",
      description: "Danh sách yêu thích",
      icon: Heart,
      href: "/wishlist",
    },
    {
      title: "Lịch sử xem sản phẩm",
      description: "Các sản phẩm đã xem",
      icon: Eye,
      href: "/view-history",
    },
    {
      title: "Đổi trả hàng",
      description: "Chính sách đổi trả",
      icon: RotateCcw,
      href: "/returns",
    },
    {
      title: "Trợ giúp & FAQ",
      description: "Câu hỏi thường gặp",
      icon: HelpCircle,
      href: "/help",
    },
    {
      title: "Hướng dẫn chọn size",
      description: "Bảng size và hướng dẫn",
      icon: Ruler,
      href: "/size-guide",
    },
    {
      title: "Bộ sưu tập",
      description: "Xem tất cả danh mục",
      icon: FolderTree,
      href: "/categories",
    },
    {
      title: "Điều khoản dịch vụ",
      description: "Điều khoản sử dụng",
      icon: FileText,
      href: "/terms-of-service",
    },
    {
      title: "Chính sách bảo mật",
      description: "Bảo vệ thông tin",
      icon: Shield,
      href: "/privacy-policy",
    },
    {
      title: "Chính sách cookie",
      description: "Quản lý cookie",
      icon: Cookie,
      href: "/cookie-policy",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-12">
      <Container>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-light text-black dark:text-white mb-2 uppercase tracking-wider">
              Tài khoản của tôi
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-light">
              Quản lý thông tin và đơn hàng của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="group">
                  <div className="bg-white dark:bg-gray-900 rounded-none p-6 border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="p-3 border border-gray-300 dark:border-gray-700 group-hover:border-black dark:group-hover:border-white transition-colors">
                        <Icon className="w-6 h-6 text-black dark:text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-light text-lg text-black dark:text-white mb-1 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition uppercase tracking-wide">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-light">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </Container>
    </div>
  );
}
