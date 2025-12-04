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
        <Button
          variant="outline"
          className="gap-2 rounded-none w-full border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300 group"
        >
          <Ruler className="w-4 h-4 text-slate-700 dark:text-slate-300 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-light uppercase tracking-wider text-slate-900 dark:text-slate-100">
            HƯỚNG DẪN CHỌN SIZE
          </span>
          <ChevronRight className="w-3 h-3 ml-auto text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto rounded-none border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/50 p-0">
        <DialogHeader className="border-b border-slate-200 dark:border-slate-800 px-6 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-none bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
              <Ruler className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </div>
            <div>
              <DialogTitle className="text-xl text-slate-900 dark:text-white font-light uppercase tracking-wide">
                Hướng dẫn chọn size chính xác
              </DialogTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-light">
                Tìm size hoàn hảo cho bạn với bảng size chi tiết
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-6 space-y-6">
          {/* Gender Toggle */}
          <div className="flex gap-3 p-1 bg-slate-100/80 dark:bg-slate-800/50 rounded-none border border-slate-200 dark:border-slate-700">
            <Button
              variant={selectedGender === "women" ? "default" : "ghost"}
              onClick={() => setSelectedGender("women")}
              className={cn(
                "flex-1 rounded-none text-xs font-medium uppercase tracking-wider transition-all duration-300",
                selectedGender === "women"
                  ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-lg"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
              )}
            >
              <span className="relative">
                Nữ
                {selectedGender === "women" && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white dark:bg-slate-900"></span>
                )}
              </span>
            </Button>
            <Button
              variant={selectedGender === "men" ? "default" : "ghost"}
              onClick={() => setSelectedGender("men")}
              className={cn(
                "flex-1 rounded-none text-xs font-medium uppercase tracking-wider transition-all duration-300",
                selectedGender === "men"
                  ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-lg"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
              )}
            >
              <span className="relative">
                Nam
                {selectedGender === "men" && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white dark:bg-slate-900"></span>
                )}
              </span>
            </Button>
          </div>

          {/* Tabs for Chart and Guide */}
          <Tabs
            value={activeTab}
            onValueChange={(v: string) => setActiveTab(v as "chart" | "guide")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-slate-100/80 dark:bg-slate-800/50 rounded-none h-11 p-1 border border-slate-200 dark:border-slate-700">
              <TabsTrigger
                value="chart"
                className="rounded-none data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm text-xs uppercase tracking-wider font-medium transition-all"
              >
                <TrendingUp className="w-3.5 h-3.5 mr-2" />
                Bảng size
              </TabsTrigger>
              <TabsTrigger
                value="guide"
                className="rounded-none data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm text-xs uppercase tracking-wider font-medium transition-all"
              >
                <Info className="w-3.5 h-3.5 mr-2" />
                Cách đo
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chart" className="mt-6 space-y-6">
              {/* Size Chart Table */}
              <div className="border border-slate-200 dark:border-slate-700 overflow-hidden rounded-none shadow-lg">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-700">
                    <tr>
                      {headers.map((header, index) => (
                        <th
                          key={header}
                          className={cn(
                            "px-6 py-4 text-left font-medium uppercase tracking-wide text-xs text-white",
                            index === 0 && "rounded-tl-none"
                          )}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {currentChart.map((row, index) => {
                      const pantsRow = row as PantsSizeRow;
                      const shirtRow = row as ShirtSizeRow;

                      return (
                        <tr
                          key={index}
                          className={cn(
                            "transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50",
                            index % 2 === 0
                              ? "bg-white dark:bg-slate-900"
                              : "bg-slate-50/50 dark:bg-slate-800/30"
                          )}
                        >
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-none bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 text-slate-900 dark:text-white font-semibold text-sm shadow-sm">
                              {row.size}
                            </span>
                          </td>
                          {isPants ? (
                            <>
                              <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium text-sm">
                                {pantsRow.waist}
                              </td>
                              <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium text-sm">
                                {pantsRow.hip}
                              </td>
                              <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium text-sm">
                                {pantsRow.length}
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium text-sm">
                                {shirtRow.chest}
                              </td>
                              <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium text-sm">
                                {shirtRow.length}
                              </td>
                              <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium text-sm">
                                {shirtRow.shoulder}
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Quick Tips */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-slate-50 dark:from-slate-800 dark:to-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded-none p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-none bg-blue-100 dark:bg-blue-900/30 mt-0.5">
                      <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5">
                        Giữa hai size?
                      </h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        Nếu số đo của bạn nằm giữa hai size, chúng tôi khuyến
                        nghị chọn size lớn hơn để đảm bảo sự thoải mái.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-slate-50 dark:from-slate-800 dark:to-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-none p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-none bg-amber-100 dark:bg-amber-900/30 mt-0.5">
                      <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5">
                        Sai số cho phép
                      </h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        Kích thước có thể sai lệch ±2cm do đặc tính vải và quy
                        trình sản xuất thủ công.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="guide" className="mt-6 space-y-6">
              {/* Size Guide Image */}
              <div className="relative w-full aspect-[16/10] bg-slate-100 dark:bg-slate-800 rounded-none overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg">
                <Image
                  src="/size.jpg"
                  alt="Hướng dẫn đo size"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Detailed Instructions */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-none p-6 shadow-sm">
                <h4 className="text-slate-900 dark:text-white font-semibold uppercase tracking-wide text-sm mb-4 flex items-center gap-2">
                  <Ruler className="w-4 h-4" />
                  Hướng dẫn đo chi tiết
                </h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                        Vòng ngực / Vòng eo
                      </h5>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Đo vòng quanh phần rộng nhất của ngực (đối với áo) hoặc
                        phần nhỏ nhất của eo (đối với quần). Giữ thước đo nằm
                        ngang và vừa khít với cơ thể.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                        Chiều dài áo
                      </h5>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Đo từ điểm cao nhất của vai xuống đến điểm bạn muốn áo
                        kết thúc. Đối với áo, thường đo từ vai đến gấu áo.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                        Chiều rộng vai
                      </h5>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Đo từ điểm nối vai này đến điểm nối vai kia, đi ngang
                        qua phía sau lưng. Đảm bảo thước đo nằm thẳng.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center text-xs font-bold">
                      4
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                        Vòng mông (đối với quần)
                      </h5>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Đo vòng quanh phần rộng nhất của mông. Giữ thước đo nằm
                        ngang và không quá chặt hoặc quá lỏng.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pro Tips */}
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950/20 border border-slate-200 dark:border-slate-700 rounded-none p-5 shadow-sm">
                <h4 className="text-slate-900 dark:text-white font-semibold uppercase tracking-wide text-sm mb-3 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs">
                    ✓
                  </span>
                  Mẹo chọn size chính xác
                </h4>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <ChevronRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-slate-400" />
                    <span className="leading-relaxed">
                      Đo trực tiếp trên cơ thể, không đo qua quần áo dày
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <ChevronRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-slate-400" />
                    <span className="leading-relaxed">
                      Thước đo nên vừa khít nhưng không quá chặt, bạn có thể đút
                      được 1 ngón tay vào
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <ChevronRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-slate-400" />
                    <span className="leading-relaxed">
                      Đo vào buổi chiều hoặc tối để có số đo chính xác nhất (cơ
                      thể có thể phồng lên trong ngày)
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <ChevronRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-slate-400" />
                    <span className="leading-relaxed">
                      Nếu không chắc chắn, hãy liên hệ bộ phận tư vấn để được hỗ
                      trợ chọn size phù hợp
                    </span>
                  </li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>

          {/* Contact Support */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-700 rounded-none p-5 shadow-lg">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-white font-semibold text-sm mb-1">
                  Cần hỗ trợ thêm?
                </h4>
                <p className="text-slate-300 text-xs">
                  Đội ngũ tư vấn của chúng tôi sẵn sàng giúp bạn chọn size hoàn
                  hảo
                </p>
              </div>
              <Button
                variant="outline"
                className="rounded-none bg-white dark:bg-slate-100 text-slate-900 dark:text-slate-900 hover:bg-slate-100 dark:hover:bg-white border-0 shadow-sm text-xs uppercase tracking-wider font-medium"
              >
                Liên hệ tư vấn
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SizeGuide;
