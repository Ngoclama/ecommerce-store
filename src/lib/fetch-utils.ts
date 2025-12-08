/**
 * Utility functions for fetching data with cache-busting
 * Đảm bảo luôn fetch data mới nhất, đặc biệt quan trọng ở production
 */

/**
 * Thêm timestamp vào URL để bypass cache
 */
export function addCacheBuster(url: string): string {
  const separator = url.includes("?") ? "&" : "?";
  const timestamp = Date.now();
  return `${url}${separator}_t=${timestamp}`;
}

/**
 * Fetch options với cache disabled
 */
export const NO_CACHE_OPTIONS: RequestInit = {
  cache: "no-store",
  headers: {
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  },
};

/**
 * Fetch với cache-busting và no-cache headers
 */
export async function fetchWithNoCache(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const urlWithBuster = addCacheBuster(url);

  return fetch(urlWithBuster, {
    ...NO_CACHE_OPTIONS,
    ...options,
    headers: {
      ...NO_CACHE_OPTIONS.headers,
      ...options.headers,
    },
  });
}
