"use client";

import { useState } from "react";
import { Ruler, Info, TrendingUp, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion } from "framer-motion";

interface SizeGuideProps {
  category?: string;
}

type ShirtSizeRow = {
  size: string;
  chest: string;
  length: string;
  shoulder: string;
};

type PantsSizeRow = {
  size: string;
  waist: string;
  hip: string;
  length: string;
};

const SizeGuide: React.FC<SizeGuideProps> = ({ category = "Áo" }) => {
  const [selectedGender, setSelectedGender] = useState<"men" | "women">(
    "women"
  );
  const [activeTab, setActiveTab] = useState<"chart" | "guide">("chart");

  // Size chart data
  const sizeCharts = {
    women: {
      Áo: [
        { size: "XS", chest: "80-84", length: "58", shoulder: "36" },
        { size: "S", chest: "84-88", length: "60", shoulder: "38" },
        { size: "M", chest: "88-92", length: "62", shoulder: "40" },
        { size: "L", chest: "92-96", length: "64", shoulder: "42" },
        { size: "XL", chest: "96-100", length: "66", shoulder: "44" },
      ],
      Quần: [
        { size: "XS", waist: "60-64", hip: "84-88", length: "95" },
        { size: "S", waist: "64-68", hip: "88-92", length: "97" },
        { size: "M", waist: "68-72", hip: "92-96", length: "99" },
        { size: "L", waist: "72-76", hip: "96-100", length: "101" },
        { size: "XL", waist: "76-80", hip: "100-104", length: "103" },
      ],
    },
    men: {
      Áo: [
        { size: "S", chest: "88-92", length: "68", shoulder: "44" },
        { size: "M", chest: "92-96", length: "70", shoulder: "46" },
        { size: "L", chest: "96-100", length: "72", shoulder: "48" },
        { size: "XL", chest: "100-104", length: "74", shoulder: "50" },
        { size: "XXL", chest: "104-108", length: "76", shoulder: "52" },
      ],
      Quần: [
        { size: "S", waist: "70-74", hip: "90-94", length: "100" },
        { size: "M", waist: "74-78", hip: "94-98", length: "102" },
        { size: "L", waist: "78-82", hip: "98-102", length: "104" },
        { size: "XL", waist: "82-86", hip: "102-106", length: "106" },
        { size: "XXL", waist: "86-90", hip: "106-110", length: "108" },
      ],
    },
  };

  const currentChart =
    sizeCharts[selectedGender][category as keyof typeof sizeCharts.women] ||
    sizeCharts[selectedGender]["Áo"];
  const headers =
    category === "Quần"
      ? ["Size", "Vòng eo (cm)", "Vòng mông (cm)", "Dài (cm)"]
      : ["Size", "Vòng ngực (cm)", "Dài (cm)", "Vai (cm)"];

  const isPants = category === "Quần";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="outline"
            className="gap-3 rounded-sm w-full border-2 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 bg-white dark:bg-gray-900 hover:bg-neutral-50 dark:hover:bg-gray-800 transition-all duration-300 group"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Ruler className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
            </motion.div>
            <span className="text-xs font-light uppercase tracking-[0.15em] text-neutral-900 dark:text-neutral-100">
              Hướng dẫn chọn size
            </span>
            <ChevronRight className="w-3 h-3 ml-auto text-neutral-400 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto rounded-sm border-2 border-neutral-200 dark:border-neutral-800 bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-gray-900 dark:to-neutral-950 p-0">
        <DialogHeader className="border-b-2 border-neutral-200 dark:border-neutral-800 px-8 py-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1, type: "spring" }}
              className="p-3 rounded-sm bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 border-2 border-neutral-900 dark:border-neutral-100"
            >
              <Ruler className="w-6 h-6 text-white dark:text-neutral-900" />
            </motion.div>
            <div className="flex-1">
              <DialogTitle className="text-2xl md:text-3xl font-light text-neutral-900 dark:text-neutral-100 uppercase tracking-tight mb-2">
                Hướng dẫn chọn size
              </DialogTitle>
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "100%" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-px bg-gradient-to-r from-neutral-900 via-neutral-400 to-transparent dark:from-neutral-100 dark:via-neutral-600"
              />
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-3 font-light tracking-wide">
                Tìm size hoàn hảo cho bạn với bảng size chi tiết
              </p>
            </div>
          </motion.div>
        </DialogHeader>

        <div className="px-8 py-8 space-y-8">
          {}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex gap-3 p-1.5 bg-neutral-100 dark:bg-neutral-900/50 rounded-sm border-2 border-neutral-200 dark:border-neutral-800"
          >
            <motion.button
              onClick={() => setSelectedGender("women")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex-1 rounded-sm text-xs font-light uppercase tracking-[0.15em] transition-all duration-300 py-3 px-4",
                selectedGender === "women"
                  ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-lg"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50"
              )}
            >
              Nữ
            </motion.button>
            <motion.button
              onClick={() => setSelectedGender("men")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex-1 rounded-sm text-xs font-light uppercase tracking-[0.15em] transition-all duration-300 py-3 px-4",
                selectedGender === "men"
                  ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-lg"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50"
              )}
            >
              Nam
            </motion.button>
          </motion.div>

          {/* Tabs for Chart and Guide - Luxury Style */}
          <Tabs
            value={activeTab}
            onValueChange={(v: string) => setActiveTab(v as "chart" | "guide")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-neutral-100 dark:bg-neutral-900/50 rounded-sm h-12 p-1 border-2 border-neutral-200 dark:border-neutral-800">
              <TabsTrigger
                value="chart"
                className="rounded-sm data-[state=active]:bg-neutral-900 dark:data-[state=active]:bg-neutral-100 data-[state=active]:text-white dark:data-[state=active]:text-neutral-900 data-[state=active]:shadow-lg text-xs uppercase tracking-[0.15em] font-light transition-all duration-300"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Bảng size
              </TabsTrigger>
              <TabsTrigger
                value="guide"
                className="rounded-sm data-[state=active]:bg-neutral-900 dark:data-[state=active]:bg-neutral-100 data-[state=active]:text-white dark:data-[state=active]:text-neutral-900 data-[state=active]:shadow-lg text-xs uppercase tracking-[0.15em] font-light transition-all duration-300"
              >
                <Info className="w-4 h-4 mr-2" />
                Cách đo
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chart" className="mt-8 space-y-8">
              {}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="border-2 border-neutral-200 dark:border-neutral-800 overflow-hidden rounded-sm shadow-xl"
              >
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 dark:from-neutral-100 dark:via-neutral-200 dark:to-neutral-100">
                    <tr>
                      {headers.map((header, index) => (
                        <th
                          key={header}
                          className={cn(
                            "px-6 py-5 text-left font-light uppercase tracking-[0.15em] text-xs text-white dark:text-neutral-900",
                            index === 0 && "rounded-tl-sm"
                          )}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-neutral-200 dark:divide-neutral-800">
                    {currentChart.map((row, index) => {
                      const pantsRow = row as PantsSizeRow;
                      const shirtRow = row as ShirtSizeRow;

                      return (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.4,
                            delay: 0.4 + index * 0.05,
                          }}
                          whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                          className={cn(
                            "transition-colors",
                            index % 2 === 0
                              ? "bg-white dark:bg-gray-900"
                              : "bg-neutral-50/50 dark:bg-neutral-900/50"
                          )}
                        >
                          <td className="px-6 py-5">
                            <motion.span
                              whileHover={{ scale: 1.1 }}
                              className="inline-flex items-center justify-center w-12 h-12 rounded-sm bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 text-white dark:text-neutral-900 font-light text-sm shadow-md border-2 border-neutral-900 dark:border-neutral-100"
                            >
                              {row.size}
                            </motion.span>
                          </td>
                          {isPants ? (
                            <>
                              <td className="px-6 py-5 text-neutral-700 dark:text-neutral-300 font-light text-sm">
                                {pantsRow.waist}
                              </td>
                              <td className="px-6 py-5 text-neutral-700 dark:text-neutral-300 font-light text-sm">
                                {pantsRow.hip}
                              </td>
                              <td className="px-6 py-5 text-neutral-700 dark:text-neutral-300 font-light text-sm">
                                {pantsRow.length}
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="px-6 py-5 text-neutral-700 dark:text-neutral-300 font-light text-sm">
                                {shirtRow.chest}
                              </td>
                              <td className="px-6 py-5 text-neutral-700 dark:text-neutral-300 font-light text-sm">
                                {shirtRow.length}
                              </td>
                              <td className="px-6 py-5 text-neutral-700 dark:text-neutral-300 font-light text-sm">
                                {shirtRow.shoulder}
                              </td>
                            </>
                          )}
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </motion.div>

              {/* Quick Tips - Luxury Style */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="bg-gradient-to-br from-blue-50 to-neutral-50 dark:from-blue-950/20 dark:to-neutral-900/50 border-2 border-blue-200 dark:border-blue-900/30 rounded-sm p-6 shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      whileHover={{ rotate: 5 }}
                      className="p-3 rounded-sm bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-800"
                    >
                      <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </motion.div>
                    <div>
                      <h5 className="text-sm font-light text-neutral-900 dark:text-neutral-100 mb-2 uppercase tracking-wide">
                        Giữa hai size?
                      </h5>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
                        Nếu số đo của bạn nằm giữa hai size, chúng tôi khuyến
                        nghị chọn size lớn hơn để đảm bảo sự thoải mái.
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="bg-gradient-to-br from-amber-50 to-neutral-50 dark:from-amber-950/20 dark:to-neutral-900/50 border-2 border-amber-200 dark:border-amber-900/30 rounded-sm p-6 shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      whileHover={{ rotate: 5 }}
                      className="p-3 rounded-sm bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-200 dark:border-amber-800"
                    >
                      <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </motion.div>
                    <div>
                      <h5 className="text-sm font-light text-neutral-900 dark:text-neutral-100 mb-2 uppercase tracking-wide">
                        Sai số cho phép
                      </h5>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
                        Kích thước có thể sai lệch ±2cm do đặc tính vải và quy
                        trình sản xuất thủ công.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="guide" className="mt-8 space-y-8">
              {/* Size Guide Image - Luxury Style */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative w-full aspect-[16/10] bg-neutral-100 dark:bg-neutral-900 rounded-sm overflow-hidden border-2 border-neutral-200 dark:border-neutral-800 shadow-xl group"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <Image
                    src="/size.jpg"
                    alt="Hướng dẫn đo size"
                    fill
                    className="object-contain transition-transform duration-500"
                    priority
                  />
                </motion.div>
              </motion.div>

              {/* Detailed Instructions - Luxury Style */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white dark:bg-gray-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-sm p-8 shadow-lg"
              >
                <h4 className="text-neutral-900 dark:text-neutral-100 font-light uppercase tracking-[0.15em] text-sm mb-6 flex items-center gap-3">
                  <Ruler className="w-5 h-5" />
                  Hướng dẫn đo chi tiết
                </h4>
                <div className="space-y-6">
                  {[
                    {
                      num: 1,
                      title: "Vòng ngực / Vòng eo",
                      desc: "Đo vòng quanh phần rộng nhất của ngực (đối với áo) hoặc phần nhỏ nhất của eo (đối với quần). Giữ thước đo nằm ngang và vừa khít với cơ thể.",
                    },
                    {
                      num: 2,
                      title: "Chiều dài áo",
                      desc: "Đo từ điểm cao nhất của vai xuống đến điểm bạn muốn áo kết thúc. Đối với áo, thường đo từ vai đến gấu áo.",
                    },
                    {
                      num: 3,
                      title: "Chiều rộng vai",
                      desc: "Đo từ điểm nối vai này đến điểm nối vai kia, đi ngang qua phía sau lưng. Đảm bảo thước đo nằm thẳng.",
                    },
                    {
                      num: 4,
                      title: "Vòng mông (đối với quần)",
                      desc: "Đo vòng quanh phần rộng nhất của mông. Giữ thước đo nằm ngang và không quá chặt hoặc quá lỏng.",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={item.num}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="shrink-0 w-8 h-8 rounded-sm bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 text-white dark:text-neutral-900 flex items-center justify-center text-xs font-light border-2 border-neutral-900 dark:border-neutral-100 shadow-md"
                      >
                        {item.num}
                      </motion.div>
                      <div className="flex-1">
                        <h5 className="text-sm font-light text-neutral-900 dark:text-neutral-100 mb-2 uppercase tracking-wide">
                          {item.title}
                        </h5>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Pro Tips - Luxury Style */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-gradient-to-br from-neutral-50 to-blue-50 dark:from-neutral-900 dark:to-blue-950/20 border-2 border-neutral-200 dark:border-neutral-800 rounded-sm p-8 shadow-lg"
              >
                <h4 className="text-neutral-900 dark:text-neutral-100 font-light uppercase tracking-[0.15em] text-sm mb-6 flex items-center gap-3">
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="inline-flex items-center justify-center w-6 h-6 rounded-sm bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 text-white dark:text-neutral-900 text-xs font-light border-2 border-neutral-900 dark:border-neutral-100"
                  >
                    ✓
                  </motion.span>
                  Mẹo chọn size chính xác
                </h4>
                <ul className="space-y-4">
                  {[
                    "Đo trực tiếp trên cơ thể, không đo qua quần áo dày",
                    "Thước đo nên vừa khít nhưng không quá chặt, bạn có thể đút được 1 ngón tay vào",
                    "Đo vào buổi chiều hoặc tối để có số đo chính xác nhất (cơ thể có thể phồng lên trong ngày)",
                    "Nếu không chắc chắn, hãy liên hệ bộ phận tư vấn để được hỗ trợ chọn size phù hợp",
                  ].map((tip, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                      className="flex items-start gap-3 text-xs text-neutral-700 dark:text-neutral-300"
                    >
                      <ChevronRight className="w-4 h-4 mt-0.5 shrink-0 text-neutral-400 dark:text-neutral-600" />
                      <span className="leading-relaxed font-light">{tip}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </TabsContent>
          </Tabs>

          {/* Contact Support - Luxury Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className=" dark:from-neutral-100 dark:via-neutral-200 dark:to-neutral-100 rounded-sm p-8 shadow-xl border-2 border-neutral-900 dark:border-neutral-100"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h4 className="text-black dark:text-neutral-900 font-light text-base mb-2 uppercase tracking-wide">
                  Cần hỗ trợ thêm?
                </h4>
                <p className="text-black-300 dark:text-neutral-600 text-xs font-light leading-relaxed">
                  Đội ngũ tư vấn của chúng tôi sẵn sàng giúp bạn chọn size hoàn
                  hảo
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="rounded-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 hover: dark:hover:bg-neutral-800 border-2 border-white dark:border-neutral-900 shadow-lg text-xs uppercase tracking-[0.15em] font-light px-6 py-3"
                >
                  Liên hệ tư vấn
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SizeGuide;
