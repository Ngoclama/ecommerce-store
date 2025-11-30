"use client";

import Container from "@/components/ui/container";
import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
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
              Chính sách bảo mật
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
                1. Thông tin chúng tôi thu thập
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-4">
                Chúng tôi thu thập các loại thông tin sau:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 font-light ml-4">
                <li>Thông tin cá nhân: tên, email, số điện thoại, địa chỉ</li>
                <li>Thông tin thanh toán: số thẻ, thông tin tài khoản ngân hàng</li>
                <li>Thông tin sử dụng: lịch sử mua hàng, sở thích, hành vi duyệt web</li>
                <li>Thông tin kỹ thuật: địa chỉ IP, loại trình duyệt, thiết bị</li>
              </ul>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8"
            >
              <h2 className="text-2xl font-light text-black dark:text-white mb-4 uppercase tracking-wider">
                2. Cách chúng tôi sử dụng thông tin
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-4">
                Chúng tôi sử dụng thông tin của bạn để:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 font-light ml-4">
                <li>Xử lý và hoàn thành đơn hàng của bạn</li>
                <li>Cung cấp dịch vụ khách hàng và hỗ trợ</li>
                <li>Gửi thông tin về sản phẩm mới và khuyến mãi</li>
                <li>Cải thiện trải nghiệm mua sắm của bạn</li>
                <li>Phân tích và nghiên cứu thị trường</li>
                <li>Bảo vệ chống gian lận và lạm dụng</li>
              </ul>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8"
            >
              <h2 className="text-2xl font-light text-black dark:text-white mb-4 uppercase tracking-wider">
                3. Bảo mật thông tin
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                Chúng tôi sử dụng các biện pháp bảo mật tiên tiến để bảo vệ thông tin của bạn, bao gồm mã hóa SSL/TLS cho tất cả các giao dịch, lưu trữ an toàn trong cơ sở dữ liệu được mã hóa, và giới hạn quyền truy cập chỉ cho nhân viên có thẩm quyền.
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8"
            >
              <h2 className="text-2xl font-light text-black dark:text-white mb-4 uppercase tracking-wider">
                4. Chia sẻ thông tin
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-4">
                Chúng tôi không bán thông tin cá nhân của bạn. Chúng tôi có thể chia sẻ thông tin với:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 font-light ml-4">
                <li>Nhà cung cấp dịch vụ: để xử lý thanh toán, vận chuyển, và các dịch vụ khác</li>
                <li>Đối tác marketing: chỉ khi bạn đã đồng ý</li>
                <li>Cơ quan pháp luật: khi được yêu cầu bởi pháp luật</li>
              </ul>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8"
            >
              <h2 className="text-2xl font-light text-black dark:text-white mb-4 uppercase tracking-wider">
                5. Quyền của bạn
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-4">
                Bạn có quyền:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 font-light ml-4">
                <li>Truy cập và xem thông tin cá nhân của bạn</li>
                <li>Yêu cầu sửa đổi hoặc xóa thông tin</li>
                <li>Từ chối nhận email marketing</li>
                <li>Yêu cầu xuất dữ liệu của bạn</li>
              </ul>
            </motion.section>
          </div>
        </div>
      </Container>
    </div>
  );
}

