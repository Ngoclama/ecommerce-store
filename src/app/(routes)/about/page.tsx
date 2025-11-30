"use client";

import Container from "@/components/ui/container";
import { motion } from "framer-motion";
import { 
  Award, 
  Users, 
  Heart, 
  Target, 
  Eye, 
  Leaf, 
  TrendingUp,
  Clock,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Youtube
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const values = [
  {
    icon: Heart,
    title: "Khách hàng là trung tâm",
    description: "Chúng tôi đặt khách hàng lên hàng đầu trong mọi quyết định, luôn lắng nghe và phục vụ với tất cả sự tận tâm."
  },
  {
    icon: Award,
    title: "Chất lượng vượt trội",
    description: "Cam kết mang đến những sản phẩm chất lượng cao nhất, được kiểm tra kỹ lưỡng trước khi đến tay khách hàng."
  },
  {
    icon: Leaf,
    title: "Bền vững",
    description: "Tôn trọng môi trường và xã hội, cam kết phát triển bền vững trong mọi hoạt động kinh doanh."
  },
  {
    icon: Users,
    title: "Đổi mới sáng tạo",
    description: "Không ngừng đổi mới và sáng tạo để mang đến những trải nghiệm thời trang độc đáo và hiện đại."
  }
];

const milestones = [
  {
    year: "2020",
    title: "Thành lập",
    description: "Khởi đầu hành trình với tầm nhìn tạo ra thương hiệu thời trang Việt Nam chất lượng cao"
  },
  {
    year: "2021",
    title: "Mở rộng",
    description: "Mở rộng danh mục sản phẩm và phát triển hệ thống bán hàng trực tuyến"
  },
  {
    year: "2022",
    title: "Thành công",
    description: "Đạt được 10.000 khách hàng thân thiết và mở cửa hàng thứ 5 tại TP.HCM"
  },
  {
    year: "2023",
    title: "Phát triển",
    description: "Ra mắt bộ sưu tập bền vững và nhận giải thưởng Thương hiệu thời trang xuất sắc"
  },
  {
    year: "2024",
    title: "Vươn xa",
    description: "Mở rộng thị trường ra toàn quốc và hợp tác với các nhà thiết kế quốc tế"
  }
];

const stats = [
  { number: "50K+", label: "Khách hàng" },
  { number: "100+", label: "Sản phẩm" },
  { number: "15+", label: "Cửa hàng" },
  { number: "98%", label: "Hài lòng" }
];

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-20 md:py-32 border-b border-gray-200 dark:border-gray-800">
        <Container>
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-7xl font-light text-black dark:text-white mb-6 uppercase tracking-wider"
            >
              Về chúng tôi
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-light max-w-2xl mx-auto leading-relaxed"
            >
              Chúng tôi là thương hiệu thời trang Việt Nam với sứ mệnh mang đến những sản phẩm chất lượng cao, 
              phong cách hiện đại và giá trị bền vững cho mọi khách hàng.
            </motion.p>
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-b border-gray-200 dark:border-gray-800">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-light text-black dark:text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-light uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Story Section */}
      <section className="py-20 border-b border-gray-200 dark:border-gray-800">
        <Container>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12 text-center"
            >
              <h2 className="text-3xl md:text-4xl font-light text-black dark:text-white mb-4 uppercase tracking-wider">
                Câu chuyện của chúng tôi
              </h2>
            </motion.div>
            <div className="space-y-6 text-gray-600 dark:text-gray-400 font-light leading-relaxed">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Thành lập vào năm 2020, chúng tôi bắt đầu với một tầm nhìn đơn giản: tạo ra những sản phẩm thời trang 
                chất lượng cao, phù hợp với phong cách sống hiện đại của người Việt Nam. Từ một cửa hàng nhỏ, chúng tôi 
                đã phát triển thành một thương hiệu được yêu thích với hàng nghìn khách hàng trên khắp cả nước.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Chúng tôi tin rằng thời trang không chỉ là về vẻ ngoài, mà còn là về cảm giác tự tin, thoải mái và 
                thể hiện cá tính riêng. Mỗi sản phẩm của chúng tôi được thiết kế và sản xuất với sự chú ý đến từng 
                chi tiết, đảm bảo chất lượng và tính bền vững.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Với cam kết về tính bền vững và trách nhiệm xã hội, chúng tôi không ngừng tìm kiếm các phương pháp sản xuất 
                thân thiện với môi trường và đảm bảo điều kiện làm việc tốt cho tất cả nhân viên và đối tác.
              </motion.p>
            </div>
          </div>
        </Container>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <Container>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12 text-center"
            >
              <h2 className="text-3xl md:text-4xl font-light text-black dark:text-white mb-4 uppercase tracking-wider">
                Giá trị cốt lõi
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-light">
                Những giá trị định hướng mọi hoạt động của chúng tôi
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 border border-gray-300 dark:border-gray-700 shrink-0">
                        <Icon className="w-6 h-6 text-black dark:text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-light text-black dark:text-white mb-2 uppercase tracking-wider">
                          {value.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 border-b border-gray-200 dark:border-gray-800">
        <Container>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <Target className="w-8 h-8 text-black dark:text-white" />
                  <h3 className="text-2xl font-light text-black dark:text-white uppercase tracking-wider">
                    Sứ mệnh
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                  Mang đến những sản phẩm thời trang chất lượng cao, phong cách hiện đại và giá cả hợp lý cho mọi khách hàng. 
                  Chúng tôi cam kết tạo ra giá trị bền vững cho cộng đồng và môi trường thông qua các hoạt động kinh doanh có trách nhiệm.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <Eye className="w-8 h-8 text-black dark:text-white" />
                  <h3 className="text-2xl font-light text-black dark:text-white uppercase tracking-wider">
                    Tầm nhìn
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                  Trở thành thương hiệu thời trang hàng đầu Việt Nam, được công nhận về chất lượng, tính bền vững và 
                  đổi mới sáng tạo. Chúng tôi hướng tới việc mở rộng thị trường quốc tế và trở thành đại diện cho thời trang Việt Nam trên thế giới.
                </p>
              </motion.div>
            </div>
          </div>
        </Container>
      </section>

      {/* Milestones */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <Container>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12 text-center"
            >
              <h2 className="text-3xl md:text-4xl font-light text-black dark:text-white mb-4 uppercase tracking-wider">
                Hành trình phát triển
              </h2>
            </motion.div>
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex gap-6"
                >
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-16 h-16 border-2 border-black dark:border-white flex items-center justify-center">
                      <span className="text-lg font-light text-black dark:text-white">{milestone.year}</span>
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-300 dark:bg-gray-700 mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <h3 className="text-xl font-light text-black dark:text-white mb-2 uppercase tracking-wider">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Contact CTA */}
      <section className="py-20 border-b border-gray-200 dark:border-gray-800">
        <Container>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-light text-black dark:text-white mb-6 uppercase tracking-wider">
                Hãy kết nối với chúng tôi
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-light mb-8 max-w-2xl mx-auto">
                Chúng tôi luôn sẵn sàng lắng nghe ý kiến, phản hồi và câu hỏi của bạn. 
                Hãy liên hệ với chúng tôi để được hỗ trợ tốt nhất.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Phone className="w-5 h-5 text-black dark:text-white" />
                  <span className="font-light">+84 0123456789</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Mail className="w-5 h-5 text-black dark:text-white" />
                  <span className="font-light">info@thoitrang.com</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-5 h-5 text-black dark:text-white" />
                  <span className="font-light">ĐẠI HỌC NGUYỄN TẤT THÀNH - Q12 - TP.HCM</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="border border-black dark:border-white px-8 py-3 text-sm font-light uppercase tracking-wider text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors"
                >
                  Liên hệ ngay
                </Link>
                <Link
                  href="/categories"
                  className="border border-gray-300 dark:border-gray-700 px-8 py-3 text-sm font-light uppercase tracking-wider text-black dark:text-white hover:border-black dark:hover:border-white transition-colors"
                >
                  Xem sản phẩm
                </Link>
              </div>
              <div className="flex items-center justify-center gap-4 mt-8">
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  );
}

