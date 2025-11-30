"use client";

import Container from "@/components/ui/container";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success(
      "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể."
    );
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Hotline",
      content: "+84 0123456789",
      description: "Thứ 2 - Chủ nhật: 8:00 - 22:00",
    },
    {
      icon: Mail,
      title: "Email",
      content: "luongngoclam255@gmail.com",
      description: "Phản hồi trong vòng 24h",
    },
    {
      icon: MapPin,
      title: "Địa chỉ",
      content: "CS1: ĐẠI HỌC NGUYỄN TẤT THÀNH",
      description: "Q12 - TP.HCM",
    },
    {
      icon: Clock,
      title: "Giờ làm việc",
      content: "Thứ 2 - Chủ nhật",
      description: "8:00 - 22:00",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pt-8 pb-16">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black dark:text-white uppercase tracking-wider mb-4">
              Liên hệ với chúng tôi
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-light max-w-2xl mx-auto">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy để lại thông
              tin, chúng tôi sẽ phản hồi trong thời gian sớm nhất.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
            {/* Contact Information */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h2 className="text-xl md:text-2xl font-light text-black dark:text-white uppercase tracking-wider mb-6">
                  Thông tin liên hệ
                </h2>
              </motion.div>

              <div className="space-y-4">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <motion.div
                      key={info.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                      className="flex gap-4 p-4 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                    >
                      <div className="shrink-0">
                        <div className="w-12 h-12 flex items-center justify-center border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
                          <Icon className="w-5 h-5 text-black dark:text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-light text-black dark:text-white uppercase tracking-wider mb-1">
                          {info.title}
                        </h3>
                        <p className="text-sm text-gray-900 dark:text-gray-100 font-light mb-1">
                          {info.content}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-light">
                          {info.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h2 className="text-xl md:text-2xl font-light text-black dark:text-white uppercase tracking-wider mb-6">
                  Gửi tin nhắn
                </h2>
              </motion.div>

              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs font-light text-black dark:text-white uppercase tracking-wider mb-2"
                    >
                      Họ và tên *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="rounded-none border-b border-gray-300 dark:border-gray-700 bg-transparent focus-visible:ring-0 focus-visible:border-black dark:focus-visible:border-white"
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-light text-black dark:text-white uppercase tracking-wider mb-2"
                    >
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="rounded-none border-b border-gray-300 dark:border-gray-700 bg-transparent focus-visible:ring-0 focus-visible:border-black dark:focus-visible:border-white"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs font-light text-black dark:text-white uppercase tracking-wider mb-2"
                    >
                      Số điện thoại
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="rounded-none border-b border-gray-300 dark:border-gray-700 bg-transparent focus-visible:ring-0 focus-visible:border-black dark:focus-visible:border-white"
                      placeholder="+84 0123456789"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-xs font-light text-black dark:text-white uppercase tracking-wider mb-2"
                    >
                      Chủ đề *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="rounded-none border-b border-gray-300 dark:border-gray-700 bg-transparent focus-visible:ring-0 focus-visible:border-black dark:focus-visible:border-white"
                      placeholder="Chủ đề liên hệ"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs font-light text-black dark:text-white uppercase tracking-wider mb-2"
                  >
                    Tin nhắn *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="rounded-none border-b border-gray-300 dark:border-gray-700 bg-transparent focus-visible:ring-0 focus-visible:border-black dark:focus-visible:border-white resize-none"
                    placeholder="Nhập tin nhắn của bạn..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-8 py-6 rounded-none uppercase tracking-wider font-light"
                  variant="default"
                >
                  {isSubmitting ? (
                    "Đang gửi..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Gửi tin nhắn
                    </>
                  )}
                </Button>
              </motion.form>
            </div>
          </div>

          {/* Google Maps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 md:mt-16"
          >
            <h2 className="text-xl md:text-2xl font-light text-black dark:text-white uppercase tracking-wider mb-6">
              Vị trí của chúng tôi
            </h2>
            <div className="w-full overflow-hidden border border-gray-200 dark:border-gray-800">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m19!1m8!1m3!1d7838.628502931122!2d106.604134!3d10.787226!3m2!1i1024!2i768!4f13.1!4m8!3e0!4m0!4m5!1s0x31752810d208720f%3A0x30f850f6a82af065!2zNTkgVsO1IFRo4buLIFRo4burYSwgQW4gUGjDuiDEkMO0bmcsIFF14bqtbiAxMiwgSOG7kyBDaMOtIE1pbmggNzAwMDAwLCBWaeG7h3QgTmFt!3m2!1d10.8630435!2d106.706093!5e0!3m2!1svi!2sus!4v1764500847790!5m2!1svi!2sus"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
}
