"use client";

import Container from "@/components/ui/container";
import { motion } from "framer-motion";
import { Ruler } from "lucide-react";

export default function SizeGuidePage() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-12">
      <Container>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-light text-black dark:text-white mb-2 uppercase tracking-wider">
              Hướng dẫn chọn size
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-light">
              Hướng dẫn cách đo và chọn size phù hợp
            </p>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 mb-8"
          >
            <h2 className="text-2xl font-light text-black dark:text-white mb-4 uppercase tracking-wider">
              Cách đo size
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-light text-black dark:text-white mb-2">Vòng ngực</h3>
                <p className="text-gray-600 dark:text-gray-400 font-light">
                  Đo vòng ngực tại điểm rộng nhất, đặt thước dây ngang qua ngực và vòng ra sau lưng. Giữ thước dây nằm ngang và không quá chặt.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-light text-black dark:text-white mb-2">Vòng eo</h3>
                <p className="text-gray-600 dark:text-gray-400 font-light">
                  Đo vòng eo tại điểm nhỏ nhất của eo, thường là trên rốn khoảng 2-3cm. Giữ thước dây vừa phải, không quá chặt.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-light text-black dark:text-white mb-2">Vòng mông</h3>
                <p className="text-gray-600 dark:text-gray-400 font-light">
                  Đo vòng mông tại điểm rộng nhất của mông. Đảm bảo thước dây nằm ngang và vừa khít.
                </p>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 mb-8"
          >
            <h2 className="text-2xl font-light text-black dark:text-white mb-4 uppercase tracking-wider">
              Bảng size nữ
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <th className="p-3 text-sm font-light text-black dark:text-white uppercase tracking-wider">Size</th>
                    <th className="p-3 text-sm font-light text-black dark:text-white uppercase tracking-wider">Vòng ngực (cm)</th>
                    <th className="p-3 text-sm font-light text-black dark:text-white uppercase tracking-wider">Vòng eo (cm)</th>
                    <th className="p-3 text-sm font-light text-black dark:text-white uppercase tracking-wider">Vòng mông (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { size: "XS", chest: "80-84", waist: "60-64", hip: "88-92" },
                    { size: "S", chest: "84-88", waist: "64-68", hip: "92-96" },
                    { size: "M", chest: "88-92", waist: "68-72", hip: "96-100" },
                    { size: "L", chest: "92-96", waist: "72-76", hip: "100-104" },
                    { size: "XL", chest: "96-100", waist: "76-80", hip: "104-108" },
                  ].map((row) => (
                    <tr key={row.size} className="border-b border-gray-200 dark:border-gray-800">
                      <td className="p-3 text-sm font-light text-black dark:text-white">{row.size}</td>
                      <td className="p-3 text-sm font-light text-gray-600 dark:text-gray-400">{row.chest}</td>
                      <td className="p-3 text-sm font-light text-gray-600 dark:text-gray-400">{row.waist}</td>
                      <td className="p-3 text-sm font-light text-gray-600 dark:text-gray-400">{row.hip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8"
          >
            <h2 className="text-2xl font-light text-black dark:text-white mb-4 uppercase tracking-wider">
              Lưu ý
            </h2>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400 font-light">
              <li>• Nên đo vào buổi sáng khi cơ thể ở trạng thái tự nhiên nhất</li>
              <li>• Đo khi mặc đồ lót hoặc quần áo mỏng</li>
              <li>• Nếu số đo của bạn nằm giữa hai size, nên chọn size lớn hơn</li>
              <li>• Kích thước có thể khác nhau tùy theo kiểu dáng và chất liệu</li>
              <li>• Nếu cần hỗ trợ, vui lòng liên hệ với chúng tôi</li>
            </ul>
          </motion.section>
        </div>
      </Container>
    </div>
  );
}

