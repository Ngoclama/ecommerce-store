/**
 * Constants - Các hằng số dùng chung trong ứng dụng
 * Thay thế magic strings và hardcoded values
 */


export const API_MESSAGES = {
  
  FETCH_ERROR: "Lỗi khi tải dữ liệu",
  NETWORK_ERROR: "Lỗi kết nối mạng",
  TIMEOUT_ERROR: "Hết thời gian chờ",
  NOT_FOUND: "Không tìm thấy",

  // Cart
  ADD_TO_CART_SUCCESS: "Đã thêm vào giỏ hàng",
  REMOVE_FROM_CART_SUCCESS: "Đã xóa khỏi giỏ hàng",
  CART_EMPTY: "Giỏ hàng trống",

  
  CHECKOUT_SUCCESS: "Đặt hàng thành công",
  CHECKOUT_ERROR: "Lỗi khi đặt hàng",
  PAYMENT_REQUIRED: "Vui lòng chọn phương thức thanh toán",

  // Product
  OUT_OF_STOCK: "Sản phẩm đã hết hàng",
  LOW_STOCK: "Sản phẩm sắp hết",
  SELECT_VARIANT: "Vui lòng chọn size và màu sắc",
} as const;

// ─── PAGINATION ──────────────────────────────────────────────────
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
} as const;


export const TIMEOUT = {
  FETCH: 30000,
  API: 30000,
} as const;


export const CACHE = {
  REVALIDATE_TIME: 60,
  NO_STORE: "no-store",
} as const;

// ─── SHIPPING ─────────────────────────────────────────────────────
export const SHIPPING = {
  FREE_SHIPPING_THRESHOLD: 500000,
  STANDARD_FEE: 30000,
  EXPRESS_FEE: 50000,
} as const;


export const PAYMENT_METHODS = {
  COD: "cod",
  STRIPE: "stripe",
  MOMO: "momo",
  VNPAY: "vnpay",
  QR: "qr",
} as const;


export const ENV = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
  TEST: "test",
} as const;
