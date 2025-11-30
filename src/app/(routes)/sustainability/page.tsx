"use client";

import Container from "@/components/ui/container";
import { motion } from "framer-motion";
import { Leaf, Recycle, Droplets, Sun } from "lucide-react";

const sustainabilityItems = [
  {
    icon: Leaf,
    title: "Nguyên liệu bền vững",
    description: "Chúng tôi sử dụng các nguyên liệu có nguồn gốc bền vững, tái chế và thân thiện với môi trường."
  },
  {
    icon: Recycle,
    title: "Tái chế và tái sử dụng",
    description: "Chương trình thu hồi và tái chế sản phẩm cũ, giảm thiểu rác thải và bảo vệ môi trường."
  },
  {
    icon: Droplets,
    title: "Tiết kiệm nước",
    description: "Áp dụng các công nghệ sản xuất tiết kiệm nước, giảm thiểu tác động đến nguồn nước."
  },
  {
    icon: Sun,
    title: "Năng lượng sạch",
    description: "Sử dụng năng lượng tái tạo trong quá trình sản xuất, giảm phát thải carbon."
  }
];

export default function SustainabilityPage() {
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
              Phát triển bền vững
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-light max-w-2xl mx-auto">
              Cam kết của chúng tôi đối với môi trường và tương lai bền vững
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {sustainabilityItems.map((item, index) => {
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
              Mục tiêu bền vững
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400 font-light">
              <p>
                Chúng tôi đặt mục tiêu giảm 50% lượng khí thải carbon vào năm 2030 và đạt mức phát thải ròng bằng 0 vào năm 2050.
              </p>
              <p>
                Tất cả các sản phẩm của chúng tôi đều được sản xuất với các tiêu chuẩn bền vững cao nhất, đảm bảo chất lượng và tính bền vững lâu dài.
              </p>
              <p>
                Chúng tôi hợp tác với các nhà cung cấp có cam kết về môi trường và xã hội, tạo ra một chuỗi cung ứng bền vững và minh bạch.
              </p>
            </div>
          </motion.section>
        </div>
      </Container>
    </div>
  );
}

