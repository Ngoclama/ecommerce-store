"use client";

import Container from "@/components/ui/container";
import { motion } from "framer-motion";
import { Shield, Heart, Award, Users } from "lucide-react";

const commitments = [
  {
    icon: Shield,
    title: "Chất lượng đảm bảo",
    description: "Chúng tôi cam kết mang đến những sản phẩm chất lượng cao, được kiểm tra kỹ lưỡng trước khi đến tay khách hàng."
  },
  {
    icon: Heart,
    title: "Khách hàng là trung tâm",
    description: "Sự hài lòng của khách hàng là ưu tiên hàng đầu. Chúng tôi luôn lắng nghe và cải thiện dịch vụ dựa trên phản hồi của bạn."
  },
  {
    icon: Award,
    title: "Giá trị bền vững",
    description: "Cam kết tạo ra những sản phẩm bền vững, tôn trọng môi trường và đảm bảo chất lượng lâu dài."
  },
  {
    icon: Users,
    title: "Dịch vụ tận tâm",
    description: "Đội ngũ nhân viên chuyên nghiệp, sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi với thái độ nhiệt tình và tận tâm."
  }
];

export default function CommitmentsPage() {
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
              Cam kết
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-light max-w-2xl mx-auto">
              Những cam kết của chúng tôi đối với khách hàng
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {commitments.map((commitment, index) => {
              const Icon = commitment.icon;
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
                        {commitment.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                        {commitment.description}
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
              Cam kết của chúng tôi
            </h2>
            <ul className="space-y-4 text-gray-600 dark:text-gray-400 font-light">
              <li className="flex items-start gap-3">
                <span className="text-black dark:text-white">•</span>
                <span>Đảm bảo chất lượng sản phẩm 100% như mô tả</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-black dark:text-white">•</span>
                <span>Giao hàng đúng hẹn, đóng gói cẩn thận</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-black dark:text-white">•</span>
                <span>Hỗ trợ đổi trả trong vòng 30 ngày</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-black dark:text-white">•</span>
                <span>Bảo hành sản phẩm theo chính sách</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-black dark:text-white">•</span>
                <span>Bảo mật thông tin khách hàng tuyệt đối</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-black dark:text-white">•</span>
                <span>Dịch vụ khách hàng 24/7</span>
              </li>
            </ul>
          </motion.section>
        </div>
      </Container>
    </div>
  );
}

