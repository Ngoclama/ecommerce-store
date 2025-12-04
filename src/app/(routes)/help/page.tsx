"use client";

import Container from "@/components/ui/container";
import { motion } from "framer-motion";
import { HelpCircle, ShoppingBag, CreditCard, Truck, Package, RotateCcw } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    category: "Mua hàng",
    icon: ShoppingBag,
    questions: [
      {
        q: "Làm thế nào để đặt hàng?",
        a: "Bạn có thể đặt hàng trực tuyến trên website của chúng tôi. Chọn sản phẩm, thêm vào giỏ hàng, điền thông tin giao hàng và thanh toán."
      },
      {
        q: "Tôi có thể đặt hàng qua điện thoại không?",
        a: "Có, bạn có thể gọi hotline của chúng tôi để đặt hàng. Nhân viên sẽ hỗ trợ bạn chọn sản phẩm và xử lý đơn hàng."
      },
      {
        q: "Làm sao để biết sản phẩm còn hàng?",
        a: "Trạng thái tồn kho được hiển thị trên trang sản phẩm. Nếu sản phẩm hết hàng, bạn có thể đăng ký nhận thông báo khi có hàng trở lại."
      }
    ]
  },
  {
    category: "Thanh toán",
    icon: CreditCard,
    questions: [
      {
        q: "Các phương thức thanh toán nào được chấp nhận?",
        a: "Chúng tôi chấp nhận thanh toán bằng thẻ tín dụng, thẻ ghi nợ, ví điện tử, chuyển khoản ngân hàng và thanh toán khi nhận hàng (COD)."
      },
      {
        q: "Thanh toán có an toàn không?",
        a: "Có, chúng tôi sử dụng công nghệ mã hóa SSL để bảo vệ thông tin thanh toán của bạn. Tất cả giao dịch đều được xử lý an toàn."
      },
      {
        q: "Khi nào tôi sẽ được hoàn tiền?",
        a: "Thời gian hoàn tiền thường mất 7-14 ngày làm việc tùy theo ngân hàng của bạn sau khi chúng tôi xác nhận đơn hàng được trả lại."
      }
    ]
  },
  {
    category: "Vận chuyển",
    icon: Truck,
    questions: [
      {
        q: "Phí vận chuyển là bao nhiêu?",
        a: "Phí vận chuyển phụ thuộc vào địa chỉ giao hàng và phương thức vận chuyển bạn chọn. Chúng tôi có chương trình miễn phí vận chuyển cho đơn hàng trên 500.000đ."
      },
      {
        q: "Thời gian giao hàng là bao lâu?",
        a: "Thời gian giao hàng từ 2-5 ngày làm việc tùy theo khu vực. Đối với các khu vực xa, thời gian có thể lên đến 7 ngày làm việc."
      },
      {
        q: "Tôi có thể theo dõi đơn hàng không?",
        a: "Có, sau khi đơn hàng được xử lý, bạn sẽ nhận được mã vận đơn qua email và có thể theo dõi trạng thái đơn hàng trên website."
      }
    ]
  },
  {
    category: "Đổi trả",
    icon: RotateCcw,
    questions: [
      {
        q: "Tôi có thể đổi trả hàng trong bao lâu?",
        a: "Bạn có thể đổi trả hàng trong vòng 30 ngày kể từ ngày nhận hàng với điều kiện sản phẩm còn nguyên tem, nhãn mác và chưa qua sử dụng."
      },
      {
        q: "Chi phí đổi trả do ai chịu?",
        a: "Chi phí vận chuyển đổi trả do khách hàng chịu trách nhiệm, trừ trường hợp sản phẩm bị lỗi từ phía chúng tôi."
      },
      {
        q: "Tôi có thể đổi size không?",
        a: "Có, bạn có thể đổi size trong vòng 30 ngày với điều kiện sản phẩm còn nguyên vẹn và có size thay thế."
      }
    ]
  }
];

export default function HelpPage() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

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
              Trợ giúp & FAQ
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-light">
              Câu hỏi thường gặp và hướng dẫn sử dụng
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((category, categoryIndex) => {
              const Icon = category.icon;
              const isCategoryOpen = openCategory === category.category;
              
              return (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                >
                  <button
                    onClick={() => setOpenCategory(isCategoryOpen ? null : category.category)}
                    className="w-full p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Icon className="w-6 h-6 text-black dark:text-white" />
                      <h2 className="text-xl font-light text-black dark:text-white uppercase tracking-wider">
                        {category.category}
                      </h2>
                    </div>
                    <span className="text-black dark:text-white">
                      {isCategoryOpen ? "−" : "+"}
                    </span>
                  </button>
                  
                  {isCategoryOpen && (
                    <div className="border-t border-gray-200 dark:border-gray-800">
                      {category.questions.map((faq, qIndex) => {
                        const isQuestionOpen = openQuestion === `${category.category}-${qIndex}`;
                        return (
                          <div key={qIndex} className="border-b border-gray-200 dark:border-gray-800 last:border-b-0">
                            <button
                              onClick={() => setOpenQuestion(isQuestionOpen ? null : `${category.category}-${qIndex}`)}
                              className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                              <span className="text-sm font-light text-black dark:text-white flex-1">
                                {faq.q}
                              </span>
                              <span className="text-black dark:text-white ml-4">
                                {isQuestionOpen ? "−" : "+"}
                              </span>
                            </button>
                            {isQuestionOpen && (
                              <div className="p-4 pt-0">
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-light">
                                  {faq.a}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8"
          >
            <h2 className="text-2xl font-light text-black dark:text-white mb-4 uppercase tracking-wider">
              Vẫn cần hỗ trợ?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 font-light mb-4">
              Nếu bạn không tìm thấy câu trả lời, vui lòng liên hệ với chúng tôi
            </p>
            <a
              href="/contact"
              className="inline-block border border-gray-400 dark:border-gray-500 px-6 py-3 text-sm font-light uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:bg-gray-900 dark:hover:bg-gray-900 hover:border-gray-900 dark:hover:border-gray-900 hover:text-white hover:shadow-md hover:shadow-gray-400/20 transition-all duration-300 ease-in-out hover:scale-[1.01] active:scale-[0.99]"
            >
              Liên hệ chúng tôi
            </a>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}

