import Container from "@/components/ui/container";
import { User, Package, Heart, MapPin, CreditCard, Bell } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
  const menuItems = [
    {
      title: "Thông tin tài khoản",
      description: "Quản lý thông tin cá nhân",
      icon: User,
      href: "/account/profile",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Đơn hàng của tôi",
      description: "Xem lịch sử đơn hàng",
      icon: Package,
      href: "/account/orders",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Sản phẩm yêu thích",
      description: "Danh sách yêu thích",
      icon: Heart,
      href: "/wishlist",
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Địa chỉ",
      description: "Quản lý địa chỉ giao hàng",
      icon: MapPin,
      href: "/account/addresses",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Phương thức thanh toán",
      description: "Quản lý thẻ thanh toán",
      icon: CreditCard,
      href: "/account/payments",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Thông báo",
      description: "Cài đặt thông báo",
      icon: Bell,
      href: "/account/notifications",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
  ];

  return (
    <div className="bg-white min-h-screen py-12">
      <Container>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-light text-black mb-2 uppercase tracking-wider">
              Tài khoản của tôi
            </h1>
            <p className="text-gray-600 font-light">
              Quản lý thông tin và đơn hàng của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="group">
                  <div className="bg-white rounded-none p-6 border border-gray-300 hover:border-black transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="p-3 border border-gray-300 group-hover:border-black transition-colors">
                        <Icon className="w-6 h-6 text-black" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-light text-lg text-black mb-1 group-hover:text-gray-600 transition uppercase tracking-wide">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 font-light">
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
