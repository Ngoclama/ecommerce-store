"use client";

import Container from "@/components/ui/container";
import { motion } from "framer-motion";

export default function CookiePolicyPage() {
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
              Chính sách cookie
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
                Cookie là gì?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                Cookie là các tệp văn bản nhỏ được lưu trữ trên thiết bị của bạn khi bạn truy cập website. Chúng giúp website ghi nhớ thông tin về chuyến thăm của bạn, giúp bạn dễ dàng quay lại và sử dụng website hiệu quả hơn.
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8"
            >
              <h2 className="text-2xl font-light text-black dark:text-white mb-4 uppercase tracking-wider">
                Các loại cookie chúng tôi sử dụng
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-light text-black dark:text-white mb-2">Cookie cần thiết</h3>
                  <p className="text-gray-600 dark:text-gray-400 font-light">
                    Những cookie này cần thiết để website hoạt động. Chúng cho phép các chức năng cơ bản như điều hướng trang và truy cập các khu vực an toàn của website.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-light text-black dark:text-white mb-2">Cookie hiệu suất</h3>
                  <p className="text-gray-600 dark:text-gray-400 font-light">
                    Những cookie này giúp chúng tôi hiểu cách khách truy cập tương tác với website bằng cách thu thập và báo cáo thông tin ẩn danh.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-light text-black dark:text-white mb-2">Cookie chức năng</h3>
                  <p className="text-gray-600 dark:text-gray-400 font-light">
                    Những cookie này cho phép website ghi nhớ các lựa chọn bạn đã thực hiện (như tên người dùng, ngôn ngữ) và cung cấp các tính năng được cải thiện, cá nhân hóa.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-light text-black dark:text-white mb-2">Cookie quảng cáo</h3>
                  <p className="text-gray-600 dark:text-gray-400 font-light">
                    Những cookie này được sử dụng để hiển thị quảng cáo phù hợp với bạn và sở thích của bạn. Chúng cũng được sử dụng để giới hạn số lần bạn thấy quảng cáo.
                  </p>
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8"
            >
              <h2 className="text-2xl font-light text-black dark:text-white mb-4 uppercase tracking-wider">
                Quản lý cookie
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-4">
                Bạn có thể kiểm soát và/hoặc xóa cookie như bạn muốn. Bạn có thể xóa tất cả cookie đã có trên máy tính của mình và bạn có thể thiết lập hầu hết các trình duyệt để ngăn chúng được đặt. Tuy nhiên, nếu bạn làm điều này, bạn có thể phải điều chỉnh thủ công một số tùy chọn mỗi khi bạn truy cập một trang web và một số dịch vụ và chức năng có thể không hoạt động.
              </p>
              <p className="text-gray-600 dark:text-gray-400 font-light">
                Bạn có thể quản lý cookie thông qua cài đặt trình duyệt của mình. Mỗi trình duyệt có cách quản lý cookie khác nhau, vui lòng tham khảo hướng dẫn của trình duyệt bạn đang sử dụng.
              </p>
            </motion.section>
          </div>
        </div>
      </Container>
    </div>
  );
}

