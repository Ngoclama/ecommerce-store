# E-Commerce Storefront

Customer-facing storefront application cho nền tảng thương mại điện tử đa cửa hàng. Ứng dụng được xây dựng với Next.js 15, React 19, và tích hợp với Admin Panel qua REST API.

## 📋 Mục lục

- [Tổng quan](#tổng-quan)
- [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
- [Tính năng chính](#tính-năng-chính)
- [Cài đặt](#cài-đặt)
- [Cấu hình](#cấu-hình)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Hướng dẫn sử dụng](#hướng-dẫn-sử-dụng)
- [State Management](#state-management)
- [Development](#development)

## 🎯 Tổng quan

Storefront là ứng dụng frontend cho phép khách hàng duyệt sản phẩm, mua sắm, quản lý giỏ hàng, và thực hiện thanh toán. Ứng dụng được tối ưu hóa cho trải nghiệm người dùng với animations mượt mà, responsive design, và performance cao.

### Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: TailwindCSS 4
- **UI Components**: Radix UI, shadcn/ui
- **State Management**: Zustand
- **Form Handling**: React Hook Form
- **Animations**: Framer Motion
- **Image Carousel**: Swiper
- **Authentication**: Clerk
- **HTTP Client**: Axios
- **Notifications**: Sonner, React Hot Toast

## 🏗️ Kiến trúc hệ thống

### Sơ đồ tổng quan

```
┌─────────────────────────────────────────────────────────────┐
│                    E-Commerce Platform                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐         ┌──────────────────┐          │
│  │   Storefront     │         │   Admin Panel    │          │
│  │   (Port 3001)    │◄───────►│   (Port 3000)    │          │
│  └────────┬─────────┘         └────────┬─────────┘          │
│           │                            │                     │
│           │  REST API                  │                     │
│           │  /api/products             │                     │
│           │  /api/categories           │                     │
│           │  /api/orders               │                     │
│           │  ...                       │                     │
│           │                            │                     │
│           ▼                            ▼                     │
│  ┌─────────────────────────────────────────────┐            │
│  │         Next.js API Routes (Proxy)          │            │
│  │  /api/orders (proxy to admin)               │            │
│  │  /api/coupons (proxy to admin)              │            │
│  └──────────────────┬──────────────────────────┘            │
│                     │                                         │
│           ┌─────────┴─────────┐                              │
│           ▼                   ▼                              │
│  ┌──────────────┐    ┌──────────────┐                       │
│  │   MongoDB    │    │    Clerk     │                       │
│  │  (via Admin) │    │  (Auth)      │                       │
│  └──────────────┘    └──────────────┘                       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Action (Storefront)
    │
    ▼
Client Component
    │
    ▼
Server Action / API Route
    │
    ▼
Admin API (NEXT_PUBLIC_API_URL)
    │
    ▼
MongoDB (via Admin)
    │
    ▼
Response → Storefront → UI Update
```

### Client-Side State Management

```
┌─────────────────────────────────────┐
│         Zustand Stores              │
├─────────────────────────────────────┤
│  • Cart Store (localStorage)        │
│    - items: CartItem[]              │
│    - addItem, removeItem            │
│    - updateQuantity                 │
│                                     │
│  • Wishlist Store (localStorage)    │
│    - wishlistItems: string[]        │
│    - toggleWishlist                 │
│    - sync with server               │
│                                     │
│  • Theme Store                      │
│    - theme: 'light' | 'dark'        │
│                                     │
│  • Cart Animation Context           │
│    - animation state                │
└─────────────────────────────────────┘
```

## ✨ Tính năng chính

### 1. Trang chủ (Homepage)
- **Billboard Carousel**: Hiển thị banner quảng cáo với animations
- **Featured Products**: Sản phẩm nổi bật
- **Category List**: Danh sách danh mục với hình ảnh
- **Latest Products**: Sản phẩm mới nhất
- **Top Sellers**: Sản phẩm bán chạy
- **Newsletter**: Đăng ký nhận tin tức

### 2. Duyệt sản phẩm (Product Browsing)
- **Product Listing**: Grid/List view với pagination
- **Category Filtering**: Lọc theo danh mục
- **Advanced Filters**:
  - Lọc theo màu sắc
  - Lọc theo kích thước
  - Lọc theo giá (price range)
  - Sắp xếp (sort by price, name, date)
- **Search**: Tìm kiếm sản phẩm với autocomplete
- **Product Card**: Hiển thị sản phẩm với hover effects

### 3. Chi tiết sản phẩm (Product Detail)
- **Image Gallery**: 
  - Multiple images với zoom
  - Swiper carousel
  - Thumbnail navigation
- **Variant Selection**:
  - Chọn Size
  - Chọn Color
  - Chọn Material (nếu có)
  - Hiển thị inventory status
- **Product Information**:
  - Tên, mô tả, giá
  - SKU, availability
  - Size guide
- **Reviews Section**:
  - Xem reviews với ratings
  - Upload review với hình ảnh/video
  - Admin responses
- **Related Products**: Sản phẩm liên quan

### 4. Giỏ hàng (Shopping Cart)
- **Cart Management**:
  - Thêm/sửa/xóa sản phẩm
  - Cập nhật số lượng
  - Persistent cart (localStorage)
- **Cart Animation**: Animation khi thêm vào giỏ
- **Cart Summary**: 
  - Tổng tiền
  - Shipping cost
  - Discount (nếu có coupon)
  - Total

### 5. Thanh toán (Checkout)
- **3-Step Checkout Process**:
  1. **Shipping Information**:
     - Địa chỉ giao hàng
     - Vietnam address selector (Province → District → Ward)
     - Phone number
  2. **Payment Method**:
     - Cash on Delivery (COD)
     - VNPay
     - MoMo
     - Stripe
     - QR Code
  3. **Order Confirmation**:
     - Review order
     - Apply coupon
     - Confirm và place order
- **Address Management**: Lưu và quản lý địa chỉ
- **Coupon System**: Áp dụng mã giảm giá

### 6. Tài khoản người dùng (User Account)
- **Profile Management**: 
  - Xem và chỉnh sửa thông tin
  - Upload avatar
- **Order History**: 
  - Xem danh sách đơn hàng
  - Chi tiết đơn hàng
  - Track order status
  - Cancel order (nếu được phép)
- **Address Book**: Quản lý địa chỉ giao hàng

### 7. Wishlist (Danh sách yêu thích)
- **Wishlist Management**:
  - Thêm/xóa sản phẩm
  - Sync với server (nếu đã đăng nhập)
  - Persistent (localStorage cho guest)
- **Wishlist Page**: Xem tất cả sản phẩm yêu thích

### 8. Tìm kiếm (Search)
- **Search Bar**: 
  - Autocomplete suggestions
  - Real-time search
  - Search filters
- **Search Results**: 
  - Pagination
  - Filter options
  - Sort options

### 9. Blog
- **Blog Listing**: Danh sách bài viết
- **Blog Detail**: Chi tiết bài viết với rich content
- **Blog Categories**: Lọc theo category

### 10. Các trang khác
- **About**: Giới thiệu
- **Contact**: Liên hệ
- **Size Guide**: Hướng dẫn chọn size
- **Returns**: Chính sách đổi trả
- **Privacy Policy**: Chính sách bảo mật
- **Terms of Service**: Điều khoản sử dụng
- **Cookie Policy**: Chính sách cookie

### 11. UI/UX Features
- **Dark/Light Mode**: Toggle theme
- **Responsive Design**: Mobile-first approach
- **Animations**: Framer Motion animations
- **Loading States**: Skeleton loaders
- **Error Handling**: User-friendly error messages
- **Recently Viewed**: Lưu lịch sử xem sản phẩm
- **Floating Buttons**: Quick actions (cart, wishlist)

## 🚀 Cài đặt

### Yêu cầu

- Node.js 18+
- Admin Panel đang chạy (port 3000)
- Clerk account (for authentication)
- npm hoặc yarn

### Bước 1: Clone repository

```bash
git clone https://github.com/Ngoclama/ecommerce-store.git
cd ecommerce-store
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

### Bước 3: Cấu hình environment variables

Tạo file `.env.local` trong thư mục root:

```env
# Admin API URL (required)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Frontend URL
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3001
```

### Bước 4: Chạy development server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:3001`

**Lưu ý**: Đảm bảo Admin Panel đang chạy tại `http://localhost:3000` trước khi start storefront.

## ⚙️ Cấu hình

### API Configuration

Storefront kết nối với Admin Panel qua `NEXT_PUBLIC_API_URL`. Tất cả API calls được thực hiện qua:

1. **Server Actions** (`src/actions/`): Fetch data từ admin API
2. **API Routes** (`src/app/api/`): Proxy routes cho một số endpoints

### Authentication

Sử dụng Clerk cho authentication:
- Sign in/Sign up pages
- User profile management
- Protected routes
- Session management

### State Management

**Zustand Stores:**
- `use-cart.ts`: Cart và wishlist state (persisted to localStorage)
- `use-wishlist.ts`: Wishlist sync với server
- Theme state: Dark/light mode

### Image Optimization

- Next.js Image component với optimization
- Lazy loading
- Responsive images
- Placeholder blur

## 📁 Cấu trúc dự án

```
store/
├── public/                     # Static files
│   ├── logo.png
│   └── ...
├── src/
│   ├── actions/                # Server actions
│   │   ├── get-products.tsx
│   │   ├── get-categories.tsx
│   │   ├── get-product.tsx
│   │   └── ...
│   ├── app/
│   │   ├── (auth)/            # Auth pages
│   │   │   └── (routes)/
│   │   │       ├── sign-in/
│   │   │       └── sign-up/
│   │   ├── (routes)/          # Public routes
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── products/      # Product listing
│   │   │   ├── product/       # Product detail
│   │   │   ├── category/      # Category page
│   │   │   ├── cart/          # Shopping cart
│   │   │   ├── checkout/      # Checkout
│   │   │   ├── account/       # User account
│   │   │   ├── wishlist/      # Wishlist
│   │   │   ├── search/        # Search
│   │   │   ├── blog/          # Blog
│   │   │   └── ...
│   │   ├── api/               # API routes (proxy)
│   │   │   ├── orders/
│   │   │   ├── coupons/
│   │   │   └── ...
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── main-header.tsx    # Header với navbar
│   │   ├── footer.tsx         # Footer
│   │   ├── product-card.tsx   # Product card component
│   │   ├── product-list.tsx   # Product listing
│   │   ├── billboard-carousel.tsx
│   │   ├── category-list.tsx
│   │   ├── gallery/           # Image gallery
│   │   ├── reviews-section.tsx
│   │   └── ...
│   ├── hooks/
│   │   ├── use-cart.ts        # Cart & wishlist store
│   │   ├── use-wishlist.ts    # Wishlist sync
│   │   ├── use-auth.ts        # Auth utilities
│   │   ├── use-vietnam-address.ts
│   │   └── ...
│   ├── contexts/
│   │   ├── cart-animation-context.tsx
│   │   └── theme-provider.tsx
│   ├── lib/
│   │   ├── utils.ts           # Utility functions
│   │   ├── constants.ts       # Constants
│   │   ├── vietnam-address.ts # Vietnam address data
│   │   └── ...
│   └── types.ts               # TypeScript types
├── package.json
└── tailwind.config.ts
```

## 📖 Hướng dẫn sử dụng

### Duyệt sản phẩm

1. Truy cập trang chủ hoặc `/products`
2. Sử dụng filters để lọc sản phẩm:
   - Chọn category
   - Chọn màu sắc, kích thước
   - Điều chỉnh khoảng giá
   - Sắp xếp theo tiêu chí
3. Click vào sản phẩm để xem chi tiết

### Thêm vào giỏ hàng

1. Chọn sản phẩm
2. Chọn variant (Size, Color, Material)
3. Chọn số lượng
4. Click "Add to Cart"
5. Sản phẩm sẽ được thêm vào giỏ với animation

### Thanh toán

1. Vào giỏ hàng (`/cart`)
2. Kiểm tra sản phẩm và số lượng
3. Click "Checkout"
4. **Bước 1**: Nhập thông tin giao hàng
   - Chọn tỉnh/thành phố
   - Chọn quận/huyện
   - Chọn phường/xã
   - Nhập địa chỉ chi tiết
   - Nhập số điện thoại
5. **Bước 2**: Chọn phương thức thanh toán
   - COD, VNPay, MoMo, Stripe, QR
6. **Bước 3**: Xem lại đơn hàng và xác nhận
   - Áp dụng coupon (nếu có)
   - Xác nhận đơn hàng

### Quản lý Wishlist

1. Click icon heart trên product card
2. Sản phẩm sẽ được thêm vào wishlist
3. Vào `/wishlist` để xem tất cả
4. Click lại icon heart để xóa

### Tìm kiếm

1. Sử dụng search bar ở header
2. Gõ từ khóa
3. Xem suggestions (nếu có)
4. Enter để xem kết quả
5. Sử dụng filters để refine kết quả

## 🔄 State Management

### Cart Store

```typescript
import useCart from "@/hooks/use-cart";

const { items, addItem, removeItem, setQuantity } = useCart();

// Add to cart
addItem(product, quantity);

// Remove from cart
removeItem(cartItemId);

// Update quantity
setQuantity(cartItemId, newQuantity);
```

### Wishlist Store

```typescript
import { useWishlist } from "@/hooks/use-wishlist";

const { toggleWishlist, isInWishlist } = useWishlist();

// Toggle wishlist
toggleWishlist(productId);

// Check if in wishlist
const isLiked = isInWishlist(productId);
```

### Cart Persistence

Cart được lưu vào `localStorage` tự động:
- Persist giữa các sessions
- Sync với server khi user đăng nhập
- Merge cart khi login

## 💻 Development

### Scripts

```bash
# Development
npm run dev              # Start dev server

# Build
npm run build            # Production build
npm start                # Start production server

# Lint
npm run lint             # Run ESLint
```

### Development Patterns

#### Server Actions

```typescript
// src/actions/get-products.tsx
import { Product } from "@/types";

export async function getProducts(params?: {
  categoryId?: string;
  colorId?: string;
  sizeId?: string;
  isFeatured?: boolean;
}): Promise<Product[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
    console.error("NEXT_PUBLIC_API_URL is not configured");
    return [];
  }

  const url = `${apiUrl}/api/products`;
  // ... fetch logic
}
```

#### Client Components

```typescript
"use client";

import { useState, useEffect } from "react";
import useCart from "@/hooks/use-cart";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  
  const handleAddToCart = () => {
    addItem(product);
  };
  
  return (
    // ... JSX
  );
}
```

### API Integration

Tất cả API calls đến Admin Panel:

```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Example: Fetch products
const response = await fetch(`${apiUrl}/api/products`);
const products = await response.json();
```

### Error Handling

```typescript
try {
  const data = await fetchData();
} catch (error) {
  console.error("Error:", error);
  toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
}
```

### Performance Optimization

- **Image Optimization**: Next.js Image với lazy loading
- **Code Splitting**: Automatic với Next.js
- **Caching**: API response caching
- **Debouncing**: Search input debouncing
- **Memoization**: React.memo cho components

## 🎨 UI Components

### Product Card

```typescript
<ProductCard
  data={product}
  isWishlistActive={isInWishlist(product.id)}
  onToggleFavorite={() => toggleWishlist(product.id)}
/>
```

### Gallery

```typescript
<Gallery images={product.images} />
```

### Filters

```typescript
<Filter
  valueKey="colorId"
  name="Colors"
  data={colors}
/>
```

## 🔐 Authentication Flow

```
User clicks "Sign In"
    │
    ▼
Clerk Sign In Page
    │
    ▼
Redirect to callback
    │
    ▼
Sync user data with server
    │
    ▼
Merge cart (if guest cart exists)
    │
    ▼
Redirect to intended page
```

## 📱 Responsive Design

- **Mobile First**: Designed for mobile devices first
- **Breakpoints**:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- **Touch Optimized**: Large touch targets
- **Mobile Navigation**: Hamburger menu

## 🚨 Common Issues

### API Connection Error

**Problem**: `NEXT_PUBLIC_API_URL is not configured`

**Solution**: 
1. Tạo file `.env.local`
2. Thêm `NEXT_PUBLIC_API_URL=http://localhost:3000`
3. Restart dev server

### Cart Not Persisting

**Problem**: Cart items disappear after refresh

**Solution**: 
- Check localStorage permissions
- Ensure Zustand persist middleware is working
- Check browser console for errors

### Images Not Loading

**Problem**: Images return 404

**Solution**:
- Check `next.config.ts` for image domains
- Ensure image URLs are correct
- Check CORS settings on admin API

## 📝 Notes

- Storefront là client-side application, không có database riêng
- Tất cả data được fetch từ Admin Panel API
- Cart và wishlist được lưu trong localStorage
- Authentication được handle bởi Clerk
- Payment redirects được handle qua payment providers

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🔗 Links

- **Repository**: https://github.com/Ngoclama/ecommerce-store.git
- **Live Demo**: ecommerce-store-henna-nine.vercel.app
- **Admin Panel**: https://github.com/Ngoclama/ecommerce-admin.git

---

**Made with ❤️ by Ngoclama**

