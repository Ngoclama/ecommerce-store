"use client";

import React from "react";
import {
  getAllShippingZones,
  type ShippingRate,
} from "@/lib/shipping-calculator";
import Currency from "@/components/ui/currency";
import { Truck, Zap } from "lucide-react";

export default function ShippingRatesTable() {
  const zones = getAllShippingZones();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-light uppercase tracking-wider">
          Bảng Phí Vận Chuyển
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Phí ship được tính dựa trên địa chỉ giao hàng và phương thức vận
          chuyển
        </p>
      </div>

      {/* Zones */}
      <div className="space-y-6">
        {zones.map((zone) => (
          <div
            key={zone.zone}
            className="border border-gray-200 dark:border-gray-800 rounded-none overflow-hidden"
          >
            {/* Zone Header */}
            <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
              <h3 className="font-medium text-sm uppercase tracking-wider">
                {zone.zone}
              </h3>
            </div>

            {/* Provinces Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                      Tỉnh/Thành phố
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                      <div className="flex items-center justify-center gap-1">
                        <Truck className="w-4 h-4" />
                        <span>Tiêu chuẩn</span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                      <div className="flex items-center justify-center gap-1">
                        <Zap className="w-4 h-4" />
                        <span>Nhanh</span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                      Miễn phí từ
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                      Thời gian
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {zone.provinces.map((province: ShippingRate) => (
                    <tr
                      key={province.provinceCode}
                      className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {province.provinceName}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-gray-700 dark:text-gray-300">
                        <Currency value={province.standardFee} />
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-gray-700 dark:text-gray-300">
                        <Currency value={province.expressFee} />
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-sm text-xs">
                          <Currency value={province.freeShippingThreshold} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-gray-600 dark:text-gray-400">
                        {province.estimatedDays}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Notes */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-none">
        <h4 className="font-medium text-sm mb-2 text-amber-900 dark:text-amber-100">
          Lưu ý:
        </h4>
        <ul className="text-xs text-amber-800 dark:text-amber-200 space-y-1 list-disc list-inside">
          <li>
            Thời gian giao hàng được tính theo ngày làm việc (không bao gồm Thứ
            7, Chủ nhật và ngày lễ)
          </li>
          <li>
            Phí vận chuyển có thể thay đổi tùy theo trọng lượng và kích thước
            đơn hàng
          </li>
          <li>
            Đơn hàng từ{" "}
            <span className="font-semibold">300.000₫ - 1.000.000₫</span> được
            miễn phí ship (tùy khu vực)
          </li>
          <li>
            Vùng sâu, vùng xa có thể phát sinh thêm phí. Vui lòng liên hệ để
            biết chính xác
          </li>
        </ul>
      </div>
    </div>
  );
}
