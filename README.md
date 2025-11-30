🛒 Ecommerce Store – Tài liệu Hướng Dẫn (Next.js App Router)

Dự án Ecommerce Store là giao diện bán hàng (Storefront) xây dựng bằng Next.js 14 (App Router), tích hợp đầy đủ chức năng mua sắm như xem sản phẩm, giỏ hàng, thanh toán và xử lý đơn hàng.

🚀 1. Bắt đầu chạy dự án
Cài đặt dependencies
npm install
# hoặc
yarn install
# hoặc
pnpm install

Khởi động server phát triển
npm run dev


Mặc định chạy tại:

👉 http://localhost:3001

⚙️ 2. Cấu hình biến môi trường .env

Tạo file .env và thêm:

# --- Authentication (Clerk) ---
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# --- Database ---
DATABASE_URL=

# --- Stripe Payment ---
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# --- Upload (Cloudinary / UploadThing) ---
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# --- API URL ---
NEXT_PUBLIC_API_URL=http://localhost:3001


⚠️ Lưu ý:

API URL trỏ sang server admin (ecommerce-admin).

Tuyệt đối không đưa .env lên GitHub.

🗃️ 3. Cấu trúc thư mục
ecommerce-store/
│
├── app/
│   ├── (routes)/                # Các trang chính
│   │   ├── products/            # Trang sản phẩm
│   │   ├── cart/                # Giỏ hàng
│   │   ├── checkout/            # Thanh toán
│   │   ├── category/            # Lọc theo danh mục
│   │   ├── order/               # Xem đơn hàng
│   │   └── ...
│   │
│   ├── api/                     # API nội bộ (client-side)
│   ├── layout.tsx               # Layout gốc
│   └── page.tsx                 # Trang chủ
│
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── product/                 # Component sản phẩm
│   ├── cart/                    # Component giỏ hàng
│   └── ...
│
├── lib/
│   ├── utils.ts                 # Hàm tiện ích
│   ├── stripe.ts                # Cấu hình Stripe
│   ├── fetcher.ts               # Fetch API helper
│   └── cart.ts                  # Local cart logic
│
├── public/                      # Ảnh, icon
├── styles/                      # Styles global
│
├── prisma/                      # Prisma schema
│   └── schema.prisma
│
├── .env
├── package.json
└── README.md

🧩 4. Tính năng chính của Ecommerce Store
⭐ UI/UX hoàn chỉnh

Trang chủ + banner + danh mục

Danh mục sản phẩm

Tìm kiếm + Lọc

Trang chi tiết sản phẩm

Phóng to ảnh sản phẩm

🛒 Giỏ hàng

Thêm/Xóa/Update sản phẩm

Lưu trong localStorage

Đồng bộ khi thanh toán

💳 Thanh toán

Stripe Checkout

Webhook xác nhận đơn hàng

Lịch sử đơn hàng

⚡ Hiệu năng

Rendering: Server Components + Edge

ISR / SSR linh hoạt

Tối ưu SEO + tốc độ tải nhanh

🔌 5. Kết nối Backend (Admin API)

Dự án store lấy dữ liệu từ:

👉 ecommerce-admin
(sản phẩm, danh mục, màu sắc, đơn hàng…)

Toàn bộ lời gọi API được build trong thư mục:

lib/fetcher.ts


Chỉ cần đổi:

NEXT_PUBLIC_API_URL=http://localhost:3001


hoặc bản Vercel:

NEXT_PUBLIC_API_URL=https://your-admin.vercel.app



❤️ 9. Góp ý & Phát triển thêm
Realtime order tracking
Tích hợp Momo / VNPay
SEO nâng cao (Schema + OG tags)
