"use client";

import Container from "@/components/ui/container";
import { motion } from "framer-motion";

export default function TermsOfServicePage() {
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
              Điều khoản dịch vụ
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-light">
              Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}
            </p>
          </motion.div>

          <div className="space-y-8">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8"
            >
              <h2 className="text-2xl font-light text-black dark:text-white mb-4 uppercase tracking-wider">
                1. Chấp nhận điều khoản
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                Bằng việc truy cập và sử dụng website này, bạn đồng ý tuân thủ
                và bị ràng buộc bởi các điều khoản và điều kiện sử dụng được nêu
                trong tài liệu này. Nếu bạn không đồng ý với bất kỳ phần nào của
                các điều khoản này, bạn không được phép sử dụng dịch vụ của
                chúng tôi.
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8"
            >
              <h2 className="text-2xl font-light text-black dark:text-white mb-4 uppercase tracking-wider">
                2. Sử dụng dịch vụ
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-4">
                Bạn được phép sử dụng website của chúng tôi cho mục đích mua sắm
                cá nhân và hợp pháp. Bạn không được phép:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 font-light ml-4">
                <li>Sử dụng website cho bất kỳ mục đích bất hợp pháp nào</li>
                <li>
                  Thực hiện bất kỳ hành động nào có thể làm hỏng, vô hiệu hóa
                  hoặc gây quá tải cho website
                </li>
                <li>
                  Cố gắng truy cập trái phép vào bất kỳ phần nào của website
                </li>
                <li>
                  Sử dụng robot, spider hoặc các công cụ tự động khác để truy
                  cập website
                </li>
              </ul>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8"
            >
              <h2 className="text-2xl font-light text-black dark:text-white mb-4 uppercase tracking-wider">
                3. Đơn hàng và thanh toán
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-4">
                Khi bạn đặt hàng trên website của chúng tôi:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 font-light ml-4">
                <li>
                  Bạn xác nhận rằng tất cả thông tin bạn cung cấp là chính xác
                  và đầy đủ
                </li>
                <li>
                  Bạn chịu trách nhiệm thanh toán cho tất cả các đơn hàng được
                  đặt từ tài khoản của bạn
                </li>
                <li>
                  Chúng tôi có quyền từ chối hoặc hủy bất kỳ đơn hàng nào vì bất
                  kỳ lý do nào
                </li>
                <li>Giá cả có thể thay đổi mà không cần thông báo trước</li>
              </ul>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8"
            >
              <h2 className="text-2xl font-light text-black dark:text-white mb-4 uppercase tracking-wider">
                4. Sở hữu trí tuệ
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                Tất cả nội dung trên website này, bao gồm nhưng không giới hạn ở
                văn bản, đồ họa, logo, hình ảnh, và phần mềm, là tài sản của
                chúng tôi hoặc được cấp phép cho chúng tôi và được bảo vệ bởi
                luật bản quyền và các luật sở hữu trí tuệ khác.
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8"
            >
              <h2 className="text-2xl font-light text-black dark:text-white mb-4 uppercase tracking-wider">
                5. Giới hạn trách nhiệm
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                Chúng tôi không chịu trách nhiệm cho bất kỳ thiệt hại trực tiếp,
                gián tiếp, ngẫu nhiên, đặc biệt hoặc hậu quả nào phát sinh từ
                việc sử dụng hoặc không thể sử dụng website hoặc dịch vụ của
                chúng tôi.
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8"
            >
              <h2 className="text-2xl font-light text-black dark:text-white mb-4 uppercase tracking-wider">
                6. Thay đổi điều khoản
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                Chúng tôi có quyền sửa đổi các điều khoản này bất cứ lúc nào.
                Việc bạn tiếp tục sử dụng website sau khi các điều khoản được
                sửa đổi có nghĩa là bạn chấp nhận các điều khoản mới.
              </p>
            </motion.section>
          </div>
        </div>
      </Container>
    </div>
  );
}
