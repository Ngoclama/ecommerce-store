

export interface ShippingRate {
  provinceCode: string;
  provinceName: string;
  standardFee: number;
  expressFee: number;
  freeShippingThreshold: number;
  estimatedDays: string;
}

/**
 * Bảng phí ship theo tỉnh/thành
 * Dựa trên API: https://provinces.open-api.vn/api
 */
export const SHIPPING_RATES: ShippingRate[] = [
  // ━━━ KHU VỰC 1: HÀ NỘI & HỒ CHÍ MINH (Nội thành) ━━━
  {
    provinceCode: "01", // Hà Nội
    provinceName: "Thành phố Hà Nội",
    standardFee: 15000,
    expressFee: 25000,
    freeShippingThreshold: 300000,
    estimatedDays: "1-2 ngày",
  },
  {
    provinceCode: "79", // TP.HCM
    provinceName: "Thành phố Hồ Chí Minh",
    standardFee: 15000,
    expressFee: 25000,
    freeShippingThreshold: 300000,
    estimatedDays: "1-2 ngày",
  },

  // ━━━ KHU VỰC 2: ĐỒNG BẰNG BẮC BỘ ━━━
  {
    provinceCode: "31", // Hải Phòng
    provinceName: "Thành phố Hải Phòng",
    standardFee: 25000,
    expressFee: 40000,
    freeShippingThreshold: 400000,
    estimatedDays: "2-3 ngày",
  },
  {
    provinceCode: "33", // Hưng Yên
    provinceName: "Tỉnh Hưng Yên",
    standardFee: 25000,
    expressFee: 40000,
    freeShippingThreshold: 400000,
    estimatedDays: "2-3 ngày",
  },
  {
    provinceCode: "24", // Bắc Ninh
    provinceName: "Tỉnh Bắc Ninh",
    standardFee: 25000,
    expressFee: 40000,
    freeShippingThreshold: 400000,
    estimatedDays: "2-3 ngày",
  },
  {
    provinceCode: "27", // Bắc Giang
    provinceName: "Tỉnh Bắc Giang",
    standardFee: 30000,
    expressFee: 45000,
    freeShippingThreshold: 400000,
    estimatedDays: "2-3 ngày",
  },
  {
    provinceCode: "30", // Hải Dương
    provinceName: "Tỉnh Hải Dương",
    standardFee: 25000,
    expressFee: 40000,
    freeShippingThreshold: 400000,
    estimatedDays: "2-3 ngày",
  },

  // ━━━ KHU VỰC 3: ĐÔNG NAM BỘ ━━━
  {
    provinceCode: "48", // Đà Nẵng
    provinceName: "Thành phố Đà Nẵng",
    standardFee: 30000,
    expressFee: 50000,
    freeShippingThreshold: 500000,
    estimatedDays: "2-3 ngày",
  },
  {
    provinceCode: "74", // Bình Dương
    provinceName: "Tỉnh Bình Dương",
    standardFee: 20000,
    expressFee: 35000,
    freeShippingThreshold: 400000,
    estimatedDays: "1-2 ngày",
  },
  {
    provinceCode: "75", // Đồng Nai
    provinceName: "Tỉnh Đồng Nai",
    standardFee: 20000,
    expressFee: 35000,
    freeShippingThreshold: 400000,
    estimatedDays: "1-2 ngày",
  },
  {
    provinceCode: "72", // Bà Rịa - Vũng Tàu
    provinceName: "Tỉnh Bà Rịa - Vũng Tàu",
    standardFee: 30000,
    expressFee: 50000,
    freeShippingThreshold: 500000,
    estimatedDays: "2-3 ngày",
  },

  // ━━━ KHU VỰC 4: MIỀN TRUNG ━━━
  {
    provinceCode: "36", // Nam Định
    provinceName: "Tỉnh Nam Định",
    standardFee: 35000,
    expressFee: 55000,
    freeShippingThreshold: 500000,
    estimatedDays: "3-4 ngày",
  },
  {
    provinceCode: "38", // Thanh Hóa
    provinceName: "Tỉnh Thanh Hóa",
    standardFee: 40000,
    expressFee: 60000,
    freeShippingThreshold: 500000,
    estimatedDays: "3-4 ngày",
  },
  {
    provinceCode: "40", // Nghệ An
    provinceName: "Tỉnh Nghệ An",
    standardFee: 45000,
    expressFee: 70000,
    freeShippingThreshold: 600000,
    estimatedDays: "4-5 ngày",
  },
  {
    provinceCode: "42", // Hà Tĩnh
    provinceName: "Tỉnh Hà Tĩnh",
    standardFee: 45000,
    expressFee: 70000,
    freeShippingThreshold: 600000,
    estimatedDays: "4-5 ngày",
  },
  {
    provinceCode: "44", // Quảng Bình
    provinceName: "Tỉnh Quảng Bình",
    standardFee: 50000,
    expressFee: 75000,
    freeShippingThreshold: 600000,
    estimatedDays: "4-5 ngày",
  },
  {
    provinceCode: "45", // Quảng Trị
    provinceName: "Tỉnh Quảng Trị",
    standardFee: 50000,
    expressFee: 75000,
    freeShippingThreshold: 600000,
    estimatedDays: "4-5 ngày",
  },
  {
    provinceCode: "46", // Thừa Thiên Huế
    provinceName: "Tỉnh Thừa Thiên Huế",
    standardFee: 40000,
    expressFee: 65000,
    freeShippingThreshold: 500000,
    estimatedDays: "3-4 ngày",
  },
  {
    provinceCode: "49", // Quảng Nam
    provinceName: "Tỉnh Quảng Nam",
    standardFee: 35000,
    expressFee: 55000,
    freeShippingThreshold: 500000,
    estimatedDays: "3-4 ngày",
  },
  {
    provinceCode: "51", // Quảng Ngãi
    provinceName: "Tỉnh Quảng Ngãi",
    standardFee: 40000,
    expressFee: 65000,
    freeShippingThreshold: 500000,
    estimatedDays: "3-4 ngày",
  },

  // ━━━ KHU VỰC 5: TÂY NGUYÊN ━━━
  {
    provinceCode: "62", // Kon Tum
    provinceName: "Tỉnh Kon Tum",
    standardFee: 60000,
    expressFee: 90000,
    freeShippingThreshold: 700000,
    estimatedDays: "5-7 ngày",
  },
  {
    provinceCode: "64", // Gia Lai
    provinceName: "Tỉnh Gia Lai",
    standardFee: 55000,
    expressFee: 85000,
    freeShippingThreshold: 700000,
    estimatedDays: "5-7 ngày",
  },
  {
    provinceCode: "66", // Đắk Lắk
    provinceName: "Tỉnh Đắk Lắk",
    standardFee: 55000,
    expressFee: 85000,
    freeShippingThreshold: 700000,
    estimatedDays: "5-7 ngày",
  },
  {
    provinceCode: "67", // Đắk Nông
    provinceName: "Tỉnh Đắk Nông",
    standardFee: 60000,
    expressFee: 90000,
    freeShippingThreshold: 700000,
    estimatedDays: "5-7 ngày",
  },
  {
    provinceCode: "68", // Lâm Đồng
    provinceName: "Tỉnh Lâm Đồng",
    standardFee: 50000,
    expressFee: 80000,
    freeShippingThreshold: 600000,
    estimatedDays: "4-5 ngày",
  },

  // ━━━ KHU VỰC 6: ĐỒNG BẰNG SÔNG CỬU LONG ━━━
  {
    provinceCode: "92", // Cần Thơ
    provinceName: "Thành phố Cần Thơ",
    standardFee: 35000,
    expressFee: 55000,
    freeShippingThreshold: 500000,
    estimatedDays: "3-4 ngày",
  },
  {
    provinceCode: "80", // Long An
    provinceName: "Tỉnh Long An",
    standardFee: 30000,
    expressFee: 50000,
    freeShippingThreshold: 500000,
    estimatedDays: "2-3 ngày",
  },
  {
    provinceCode: "82", // Tiền Giang
    provinceName: "Tỉnh Tiền Giang",
    standardFee: 35000,
    expressFee: 55000,
    freeShippingThreshold: 500000,
    estimatedDays: "3-4 ngày",
  },
  {
    provinceCode: "83", // Bến Tre
    provinceName: "Tỉnh Bến Tre",
    standardFee: 40000,
    expressFee: 60000,
    freeShippingThreshold: 500000,
    estimatedDays: "3-4 ngày",
  },
  {
    provinceCode: "84", // Trà Vinh
    provinceName: "Tỉnh Trà Vinh",
    standardFee: 40000,
    expressFee: 60000,
    freeShippingThreshold: 500000,
    estimatedDays: "3-4 ngày",
  },
  {
    provinceCode: "86", // Vĩnh Long
    provinceName: "Tỉnh Vĩnh Long",
    standardFee: 40000,
    expressFee: 60000,
    freeShippingThreshold: 500000,
    estimatedDays: "3-4 ngày",
  },
  {
    provinceCode: "87", // Đồng Tháp
    provinceName: "Tỉnh Đồng Tháp",
    standardFee: 40000,
    expressFee: 60000,
    freeShippingThreshold: 500000,
    estimatedDays: "3-4 ngày",
  },
  {
    provinceCode: "89", // An Giang
    provinceName: "Tỉnh An Giang",
    standardFee: 45000,
    expressFee: 70000,
    freeShippingThreshold: 600000,
    estimatedDays: "4-5 ngày",
  },
  {
    provinceCode: "91", // Kiên Giang
    provinceName: "Tỉnh Kiên Giang",
    standardFee: 50000,
    expressFee: 75000,
    freeShippingThreshold: 600000,
    estimatedDays: "4-5 ngày",
  },
  {
    provinceCode: "93", // Hậu Giang
    provinceName: "Tỉnh Hậu Giang",
    standardFee: 40000,
    expressFee: 65000,
    freeShippingThreshold: 500000,
    estimatedDays: "3-4 ngày",
  },
  {
    provinceCode: "94", // Sóc Trăng
    provinceName: "Tỉnh Sóc Trăng",
    standardFee: 45000,
    expressFee: 70000,
    freeShippingThreshold: 600000,
    estimatedDays: "4-5 ngày",
  },
  {
    provinceCode: "95", // Bạc Liêu
    provinceName: "Tỉnh Bạc Liêu",
    standardFee: 50000,
    expressFee: 75000,
    freeShippingThreshold: 600000,
    estimatedDays: "4-5 ngày",
  },
  {
    provinceCode: "96", // Cà Mau
    provinceName: "Tỉnh Cà Mau",
    standardFee: 55000,
    expressFee: 85000,
    freeShippingThreshold: 700000,
    estimatedDays: "5-7 ngày",
  },

  // ━━━ KHU VỰC 7: MIỀN NÚI PHÍA BẮC ━━━
  {
    provinceCode: "04", // Cao Bằng
    provinceName: "Tỉnh Cao Bằng",
    standardFee: 60000,
    expressFee: 95000,
    freeShippingThreshold: 800000,
    estimatedDays: "5-7 ngày",
  },
  {
    provinceCode: "06", // Bắc Kạn
    provinceName: "Tỉnh Bắc Kạn",
    standardFee: 60000,
    expressFee: 95000,
    freeShippingThreshold: 800000,
    estimatedDays: "5-7 ngày",
  },
  {
    provinceCode: "08", // Tuyên Quang
    provinceName: "Tỉnh Tuyên Quang",
    standardFee: 55000,
    expressFee: 85000,
    freeShippingThreshold: 700000,
    estimatedDays: "4-5 ngày",
  },
  {
    provinceCode: "10", // Lào Cai
    provinceName: "Tỉnh Lào Cai",
    standardFee: 65000,
    expressFee: 100000,
    freeShippingThreshold: 800000,
    estimatedDays: "5-7 ngày",
  },
  {
    provinceCode: "11", // Điện Biên
    provinceName: "Tỉnh Điện Biên",
    standardFee: 70000,
    expressFee: 110000,
    freeShippingThreshold: 900000,
    estimatedDays: "6-8 ngày",
  },
  {
    provinceCode: "12", // Lai Châu
    provinceName: "Tỉnh Lai Châu",
    standardFee: 75000,
    expressFee: 120000,
    freeShippingThreshold: 1000000,
    estimatedDays: "6-8 ngày",
  },
  {
    provinceCode: "14", // Sơn La
    provinceName: "Tỉnh Sơn La",
    standardFee: 65000,
    expressFee: 100000,
    freeShippingThreshold: 800000,
    estimatedDays: "5-7 ngày",
  },
  {
    provinceCode: "15", // Yên Bái
    provinceName: "Tỉnh Yên Bái",
    standardFee: 55000,
    expressFee: 85000,
    freeShippingThreshold: 700000,
    estimatedDays: "4-5 ngày",
  },
  {
    provinceCode: "17", // Hòa Bình
    provinceName: "Tỉnh Hòa Bình",
    standardFee: 45000,
    expressFee: 70000,
    freeShippingThreshold: 600000,
    estimatedDays: "3-4 ngày",
  },
  {
    provinceCode: "19", // Thái Nguyên
    provinceName: "Tỉnh Thái Nguyên",
    standardFee: 35000,
    expressFee: 55000,
    freeShippingThreshold: 500000,
    estimatedDays: "2-3 ngày",
  },
  {
    provinceCode: "20", // Lạng Sơn
    provinceName: "Tỉnh Lạng Sơn",
    standardFee: 55000,
    expressFee: 85000,
    freeShippingThreshold: 700000,
    estimatedDays: "4-5 ngày",
  },
  {
    provinceCode: "22", // Quảng Ninh
    provinceName: "Tỉnh Quảng Ninh",
    standardFee: 40000,
    expressFee: 60000,
    freeShippingThreshold: 500000,
    estimatedDays: "3-4 ngày",
  },
  {
    provinceCode: "25", // Phú Thọ
    provinceName: "Tỉnh Phú Thọ",
    standardFee: 40000,
    expressFee: 60000,
    freeShippingThreshold: 500000,
    estimatedDays: "3-4 ngày",
  },
  {
    provinceCode: "26", // Vĩnh Phúc
    provinceName: "Tỉnh Vĩnh Phúc",
    standardFee: 30000,
    expressFee: 45000,
    freeShippingThreshold: 400000,
    estimatedDays: "2-3 ngày",
  },

  // ━━━ KHU VỰC 8: CÁC TỈNH KHÁC (Mặc định) ━━━
];

/**
 * Lấy phí ship mặc định cho các tỉnh chưa cấu hình
 */
export const DEFAULT_SHIPPING_RATE: ShippingRate = {
  provinceCode: "DEFAULT",
  provinceName: "Khu vực khác",
  standardFee: 40000,
  expressFee: 65000,
  freeShippingThreshold: 500000,
  estimatedDays: "3-5 ngày",
};

/**
 * Tìm phí ship theo mã tỉnh
 */
export function getShippingRateByProvinceCode(
  provinceCode: string
): ShippingRate {
  const rate = SHIPPING_RATES.find((r) => r.provinceCode === provinceCode);
  return rate || DEFAULT_SHIPPING_RATE;
}

/**
 * Tìm phí ship theo tên tỉnh (không phân biệt hoa/thường, bỏ dấu)
 */
export function getShippingRateByProvinceName(
  provinceName: string
): ShippingRate {
  const normalizedName = provinceName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const rate = SHIPPING_RATES.find((r) => {
    const normalizedRateName = r.provinceName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return normalizedRateName.includes(normalizedName);
  });

  return rate || DEFAULT_SHIPPING_RATE;
}

/**
 * Tính phí ship thực tế
 * @param provinceCode Mã tỉnh/thành
 * @param shippingMethod "standard" | "express"
 * @param orderSubtotal Tổng tiền đơn hàng (chưa trừ discount)
 * @returns Phí ship thực tế (0 nếu miễn phí)
 */
export function calculateShippingFee(
  provinceCode: string,
  shippingMethod: "standard" | "express",
  orderSubtotal: number
): number {
  const rate = getShippingRateByProvinceCode(provinceCode);

  // Kiểm tra miễn phí ship
  if (orderSubtotal >= rate.freeShippingThreshold) {
    return 0;
  }

  // Trả về phí theo phương thức
  return shippingMethod === "express" ? rate.expressFee : rate.standardFee;
}

/**
 * Tính phí ship với thông tin chi tiết
 */
export interface ShippingCalculation {
  provinceName: string;
  shippingMethod: "standard" | "express";
  originalFee: number;
  actualFee: number;
  isFreeShipping: boolean;
  freeShippingThreshold: number;
  remainingForFreeShipping: number;
  estimatedDays: string;
}

export function calculateShippingWithDetails(
  provinceCode: string,
  shippingMethod: "standard" | "express",
  orderSubtotal: number
): ShippingCalculation {
  const rate = getShippingRateByProvinceCode(provinceCode);
  const originalFee =
    shippingMethod === "express" ? rate.expressFee : rate.standardFee;
  const isFreeShipping = orderSubtotal >= rate.freeShippingThreshold;
  const actualFee = isFreeShipping ? 0 : originalFee;
  const remainingForFreeShipping = Math.max(
    0,
    rate.freeShippingThreshold - orderSubtotal
  );

  return {
    provinceName: rate.provinceName,
    shippingMethod,
    originalFee,
    actualFee,
    isFreeShipping,
    freeShippingThreshold: rate.freeShippingThreshold,
    remainingForFreeShipping,
    estimatedDays: rate.estimatedDays,
  };
}

/**
 * Lấy tất cả các khu vực ship với phí
 */
export function getAllShippingZones(): {
  zone: string;
  provinces: ShippingRate[];
}[] {
  return [
    {
      zone: "Nội thành lớn (HN, HCM)",
      provinces: SHIPPING_RATES.filter((r) =>
        ["01", "79"].includes(r.provinceCode)
      ),
    },
    {
      zone: "Đồng bằng Bắc Bộ",
      provinces: SHIPPING_RATES.filter((r) =>
        ["31", "33", "24", "27", "30"].includes(r.provinceCode)
      ),
    },
    {
      zone: "Đông Nam Bộ",
      provinces: SHIPPING_RATES.filter((r) =>
        ["48", "74", "75", "72"].includes(r.provinceCode)
      ),
    },
    {
      zone: "Miền Trung",
      provinces: SHIPPING_RATES.filter((r) =>
        ["36", "38", "40", "42", "44", "45", "46", "49", "51"].includes(
          r.provinceCode
        )
      ),
    },
    {
      zone: "Tây Nguyên",
      provinces: SHIPPING_RATES.filter((r) =>
        ["62", "64", "66", "67", "68"].includes(r.provinceCode)
      ),
    },
    {
      zone: "Đồng bằng Sông Cửu Long",
      provinces: SHIPPING_RATES.filter((r) =>
        [
          "92",
          "80",
          "82",
          "83",
          "84",
          "86",
          "87",
          "89",
          "91",
          "93",
          "94",
          "95",
          "96",
        ].includes(r.provinceCode)
      ),
    },
    {
      zone: "Miền núi phía Bắc",
      provinces: SHIPPING_RATES.filter((r) =>
        [
          "04",
          "06",
          "08",
          "10",
          "11",
          "12",
          "14",
          "15",
          "17",
          "19",
          "20",
          "22",
          "25",
          "26",
        ].includes(r.provinceCode)
      ),
    },
  ];
}
