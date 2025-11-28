import Container from "@/components/ui/container";
import { User, Mail, Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  return (
    <div className="bg-white min-h-screen py-12">
      <Container>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-light text-black mb-2 uppercase tracking-wider">
              Thông tin tài khoản
            </h1>
            <p className="text-gray-600 font-light">Quản lý thông tin cá nhân của bạn</p>
          </div>

          <div className="bg-white rounded-none p-8 border border-gray-300">
            <div className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
                <div className="w-24 h-24 bg-gray-100 rounded-none flex items-center justify-center border border-gray-300">
                  <User className="w-12 h-12 text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-light text-black mb-1 uppercase tracking-wide">
                    Nguyễn Văn A
                  </h3>
                  <p className="text-gray-600 font-light">Khách hàng</p>
                </div>
                <Button variant="outline" className="ml-auto rounded-none">
                  Đổi ảnh đại diện
                </Button>
              </div>

              {/* Form Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="fullName"
                    className="flex items-center gap-2 mb-2 text-sm font-light text-gray-700"
                  >
                    <User className="w-4 h-4" />
                    Họ và tên
                  </Label>
                  <Input id="fullName" defaultValue="Nguyễn Văn A" className="rounded-none border-gray-300 focus:border-black" />
                </div>
                <div>
                  <Label
                    htmlFor="email"
                    className="flex items-center gap-2 mb-2 text-sm font-light text-gray-700"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="user@example.com"
                    className="rounded-none border-gray-300 focus:border-black"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="phone"
                    className="flex items-center gap-2 mb-2 text-sm font-light text-gray-700"
                  >
                    <Phone className="w-4 h-4" />
                    Số điện thoại
                  </Label>
                  <Input id="phone" defaultValue="0901234567" className="rounded-none border-gray-300 focus:border-black" />
                </div>
                <div>
                  <Label
                    htmlFor="birthday"
                    className="flex items-center gap-2 mb-2 text-sm font-light text-gray-700"
                  >
                    <Calendar className="w-4 h-4" />
                    Ngày sinh
                  </Label>
                  <Input id="birthday" type="date" className="rounded-none border-gray-300 focus:border-black" />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <Button variant="default" className="rounded-none px-8">
                  Lưu thay đổi
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
