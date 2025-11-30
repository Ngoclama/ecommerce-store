"use client";

import Container from "@/components/ui/container";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";

export default function StoresPage() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-12">
      <Container>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-light text-black dark:text-white mb-2 uppercase tracking-wider">
              Hệ thống cửa hàng
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-light">
              Tìm cửa hàng gần bạn nhất
            </p>
          </motion.div>

          {/* Store Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 mb-8"
          >
            <h2 className="text-2xl font-light text-black dark:text-white mb-6 uppercase tracking-wider">
              Cửa hàng chính
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-black dark:text-white mt-1 shrink-0" />
                <div>
                  <p className="text-sm font-light text-gray-600 dark:text-gray-400 mb-1">
                    Địa chỉ
                  </p>
                  <p className="text-black dark:text-white font-light">
                    59 Võ Thị Thừa, An Phú Đông, Quận 12, TP.HCM
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-black dark:text-white mt-1 shrink-0" />
                <div>
                  <p className="text-sm font-light text-gray-600 dark:text-gray-400 mb-1">
                    Điện thoại
                  </p>
                  <p className="text-black dark:text-white font-light">
                    +84 0123456789
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-black dark:text-white mt-1 shrink-0" />
                <div>
                  <p className="text-sm font-light text-gray-600 dark:text-gray-400 mb-1">
                    Email
                  </p>
                  <p className="text-black dark:text-white font-light">
                    luongngoclam255@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Google Maps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
          >
            <h2 className="text-2xl font-light text-black dark:text-white uppercase tracking-wider mb-6 p-8 pb-0">
              Vị trí trên bản đồ
            </h2>
            <div className="relative w-full h-[450px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m19!1m8!1m3!1d7838.628502931122!2d106.604134!3d10.787226!3m2!1i1024!2i768!4f13.1!4m8!3e0!4m0!4m5!1s0x31752810d208720f%3A0x30f850f6a82af065!2zNTkgVsO1IFRo4buLIFRo4burYSwgQW4gUGjDuiDEkMO0bmcsIFF14bqtbiAxMiwgSOG7kyBDaMOtIE1pbmggNzAwMDAwLCBWaeG7h3QgTmFt!3m2!1d10.8630435!2d106.706093!5e0!3m2!1svi!2sus!4v1764500847790!5m2!1svi!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}

