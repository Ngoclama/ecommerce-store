"use client";

import { useState } from "react";
import { X, Ruler } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { cn } from "@/lib/utils";

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
          className="gap-2 bg-black dark:bg-white text-white dark:text-black border-black dark:border-white hover:bg-gray-900 dark:hover:bg-gray-100 rounded-none w-full"
        >
          <Ruler className="w-4 h-4" />
          <span className="text-xs font-light uppercase tracking-wider">
            HƯỚNG DẪN CHỌN SIZE
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-none border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-xl text-black dark:text-white font-light uppercase tracking-wide">
            Hướng dẫn chọn size
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Gender Toggle */}
          <div className="flex gap-2">
            <Button
              variant={selectedGender === "women" ? "default" : "outline"}
              onClick={() => setSelectedGender("women")}
              className={cn(
                "flex-1 rounded-none text-xs font-light uppercase tracking-wider",
                selectedGender === "women"
                  ? "bg-black dark:bg-white text-white dark:text-black"
                  : "border-gray-300 dark:border-gray-700 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
              )}
            >
              Nữ
            </Button>
            <Button
              variant={selectedGender === "men" ? "default" : "outline"}
              onClick={() => setSelectedGender("men")}
              className={cn(
                "flex-1 rounded-none text-xs font-light uppercase tracking-wider",
                selectedGender === "men"
                  ? "bg-black dark:bg-white text-white dark:text-black"
                  : "border-gray-300 dark:border-gray-700 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
              )}
            >
              Nam
            </Button>
          </div>

          {/* Size Chart Table */}
          <div className="border border-gray-300 dark:border-gray-700 overflow-hidden rounded-none">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white">
                <tr>
                  {headers.map((header) => (
                    <th
                      key={header}
                      className="px-4 py-3 text-left font-light uppercase tracking-wide text-xs"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentChart.map((row, index) => {
                  const pantsRow = row as PantsSizeRow;
                  const shirtRow = row as ShirtSizeRow;

                  return (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}
                    >
                      <td className="px-4 py-3 text-black dark:text-white font-light text-xs">
                        {row.size}
                      </td>
                      {isPants ? (
                        <>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-light text-xs">
                            {pantsRow.waist}
                          </td>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-light text-xs">
                            {pantsRow.hip}
                          </td>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-light text-xs">
                            {pantsRow.length}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-light text-xs">
                            {shirtRow.chest}
                          </td>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-light text-xs">
                            {shirtRow.length}
                          </td>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-light text-xs">
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

          {/* Instructions */}
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-none p-4 space-y-2">
            <h4 className="text-black dark:text-white font-light uppercase tracking-wide text-xs">
              Lưu ý:
            </h4>
            <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside font-light">
              <li>Đo vòng ngực/vòng eo ở vị trí rộng nhất</li>
              <li>Đo chiều dài từ vai đến gấu áo (đối với áo)</li>
              <li>Nếu số đo của bạn ở giữa 2 size, chọn size lớn hơn</li>
              <li>Kích thước có thể sai lệch ±2cm do đặc thù sản phẩm</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SizeGuide;
