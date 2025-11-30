"use client";

import Container from "@/components/ui/container";
import { motion } from "framer-motion";
import { RotateCcw, Clock, Package, CheckCircle } from "lucide-react";

export default function ReturnsPage() {
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
              Đổi trả hàng
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-light">
              Chính sách đổi trả hàng của chúng tôi
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
                Điều kiện đổi trả
              </h2>
              <ul className="space-y-4 text-gray-600 dark:text-gray-400 font-light">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-black dark:text-white mt-0.5 shrink-0" />
                  <span>Sản phẩm phải còn nguyên tem, nhãn mác và chưa qua sử dụng</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-black dark:text-white mt-0.5 shrink-0" />
                  <span>Thời gian đổi trả trong vòng 30 ngày kể từ ngày nhận hàng</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-black dark:text-white mt-0.5 shrink-0" />
                  <span>Sản phẩm phải còn nguyên vẹn, không bị hư hỏng do lỗi khách hàng</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-black dark:text-white mt-0.5 shrink-0" />
                  <span>Yêu cầu đổi trả phải có hóa đơn mua hàng hoặc email xác nhận đơn hàng</span>
                </li>
              </ul>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8"
            >
              <h2 className="text-2xl font-light text-black dark:text-white mb-4 uppercase tracking-wider">
                Quy trình đổi trả
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-10 h-10 border border-gray-300 dark:border-gray-700 shrink-0">
                    <span className="text-black dark:text-white font-light">1</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-light text-black dark:text-white mb-2">Liên hệ với chúng tôi</h3>
                    <p className="text-gray-600 dark:text-gray-400 font-light">
                      Gửi yêu cầu đổi trả qua email hoặc hotline với mã đơn hàng và lý do đổi trả
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-10 h-10 border border-gray-300 dark:border-gray-700 shrink-0">
                    <span className="text-black dark:text-white font-light">2</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-light text-black dark:text-white mb-2">Gửi hàng về</h3>
                    <p className="text-gray-600 dark:text-gray-400 font-light">
                      Đóng gói sản phẩm cẩn thận và gửi về địa chỉ chúng tôi cung cấp
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-10 h-10 border border-gray-300 dark:border-gray-700 shrink-0">
                    <span className="text-black dark:text-white font-light">3</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-light text-black dark:text-white mb-2">Xử lý yêu cầu</h3>
                    <p className="text-gray-600 dark:text-gray-400 font-light">
                      Chúng tôi sẽ kiểm tra và xử lý yêu cầu trong vòng 5-7 ngày làm việc
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-10 h-10 border border-gray-300 dark:border-gray-700 shrink-0">
                    <span className="text-black dark:text-white font-light">4</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-light text-black dark:text-white mb-2">Hoàn tiền/Đổi hàng</h3>
                    <p className="text-gray-600 dark:text-gray-400 font-light">
                      Sau khi xác nhận, chúng tôi sẽ hoàn tiền hoặc gửi sản phẩm thay thế
                    </p>
                  </div>
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
                Lưu ý
              </h2>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400 font-light">
                <li>• Chi phí vận chuyển đổi trả do khách hàng chịu trách nhiệm (trừ trường hợp lỗi từ phía chúng tôi)</li>
                <li>• Sản phẩm đã giảm giá hoặc khuyến mãi không được đổi trả</li>
                <li>• Đồ lót, phụ kiện cá nhân không được đổi trả vì lý do vệ sinh</li>
                <li>• Thời gian hoàn tiền có thể mất 7-14 ngày làm việc tùy theo ngân hàng</li>
              </ul>
            </motion.section>
          </div>
        </div>
      </Container>
    </div>
  );
}

