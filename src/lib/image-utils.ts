/**
 * Kiểm tra xem URL có phải là URL ảnh hợp lệ không
 */
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;

  try {
    const urlObj = new URL(url);
    // Kiểm tra nếu là Google redirect URL (chứa /url?sa=)
    if (urlObj.pathname === "/url" && urlObj.searchParams.has("url")) {
      return false; // Đây là redirect URL, không phải URL ảnh trực tiếp
    }

    // Kiểm tra extension ảnh
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".svg",
      ".bmp",
    ];
    const pathname = urlObj.pathname.toLowerCase();
    const hasImageExtension = imageExtensions.some((ext) =>
      pathname.endsWith(ext)
    );

    // Kiểm tra nếu có query params nhưng không có extension ảnh
    if (urlObj.search && !hasImageExtension) {
      // Có thể là redirect URL
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Lấy URL ảnh thực từ Google redirect URL
 */
export function extractImageUrlFromGoogleRedirect(url: string): string | null {
  try {
    const urlObj = new URL(url);
    if (urlObj.pathname === "/url" && urlObj.searchParams.has("url")) {
      const realUrl = urlObj.searchParams.get("url");
      if (realUrl) {
        return decodeURIComponent(realUrl);
      }
    }
  } catch {}
  return null;
}

/**
 * Lấy URL ảnh an toàn, với fallback
 */
export function getSafeImageUrl(
  url: string | null | undefined,
  fallback?: string
): string | null {
  if (!url) return fallback || null;

  // Thử extract từ Google redirect
  const extracted = extractImageUrlFromGoogleRedirect(url);
  if (extracted && isValidImageUrl(extracted)) {
    return extracted;
  }

  // Kiểm tra URL gốc
  if (isValidImageUrl(url)) {
    return url;
  }

  // Trả về fallback hoặc null
  return fallback || null;
}
