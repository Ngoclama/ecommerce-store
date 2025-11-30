"use client";

import Container from "@/components/ui/container";
import { motion } from "framer-motion";
import { Lightbulb, Scissors, Droplets, Sparkles } from "lucide-react";

const knowHowItems = [
  {
    icon: Scissors,
    title: "Chất liệu cao cấp",
    description: "Chúng tôi sử dụng các loại vải cao cấp được chọn lọc kỹ lưỡng, đảm bảo độ bền và sự thoải mái tối đa cho người mặc."
  },
  {
    icon: Droplets,
    title: "Công nghệ chống thấm",
    description: "Áp dụng công nghệ xử lý chống thấm nước tiên tiến, giúp bảo vệ bạn khỏi các điều kiện thời tiết khắc nghiệt."
  },
  {
    icon: Sparkles,
    title: "Thiết kế tinh tế",
    description: "Mỗi sản phẩm được thiết kế với sự chú ý đến từng chi tiết nhỏ, tạo nên phong cách thời trang độc đáo và sang trọng."
  },
  {
    icon: Lightbulb,
    title: "Bền vững",
    description: "Chúng tôi cam kết sử dụng các phương pháp sản xuất bền vững, tôn trọng môi trường và đảm bảo chất lượng lâu dài."
  }
];

export default function KnowHowPage() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-12">
      <Container>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-light text-black dark:text-white mb-2 uppercase tracking-wider">
              Bí quyết
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-light max-w-2xl mx-auto">
              Khám phá những bí quyết và công nghệ đằng sau mỗi sản phẩm của chúng tôi
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {knowHowItems.map((item, index) => {
              const Icon = item.icon;
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
                        {item.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8"
          >
            <h2 className="text-2xl font-light text-black dark:text-white mb-4 uppercase tracking-wider">
              Quy trình sản xuất
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex items-center justify-center w-10 h-10 border border-gray-300 dark:border-gray-700 shrink-0">
                  <span className="text-black dark:text-white font-light">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-light text-black dark:text-white mb-2">Chọn lọc nguyên liệu</h3>
                  <p className="text-gray-600 dark:text-gray-400 font-light">
                    Chúng tôi chọn lọc kỹ lưỡng từng loại vải, đảm bảo chất lượng và tính bền vững
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center justify-center w-10 h-10 border border-gray-300 dark:border-gray-700 shrink-0">
                  <span className="text-black dark:text-white font-light">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-light text-black dark:text-white mb-2">Thiết kế và phát triển</h3>
                  <p className="text-gray-600 dark:text-gray-400 font-light">
                    Đội ngũ thiết kế của chúng tôi tạo ra những mẫu thiết kế độc đáo và thời trang
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center justify-center w-10 h-10 border border-gray-300 dark:border-gray-700 shrink-0">
                  <span className="text-black dark:text-white font-light">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-light text-black dark:text-white mb-2">Sản xuất thủ công</h3>
                  <p className="text-gray-600 dark:text-gray-400 font-light">
                    Mỗi sản phẩm được chế tác bởi những nghệ nhân lành nghề với sự chú ý đến từng chi tiết
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center justify-center w-10 h-10 border border-gray-300 dark:border-gray-700 shrink-0">
                  <span className="text-black dark:text-white font-light">4</span>
                </div>
                <div>
                  <h3 className="text-lg font-light text-black dark:text-white mb-2">Kiểm tra chất lượng</h3>
                  <p className="text-gray-600 dark:text-gray-400 font-light">
                    Mỗi sản phẩm đều trải qua quy trình kiểm tra chất lượng nghiêm ngặt trước khi đến tay khách hàng
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </Container>
    </div>
  );
}

