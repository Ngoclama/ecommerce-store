/**
 * API Cache Utilities
 * Cải thiện performance với intelligent caching
 */

interface CacheOptions {
  ttl?: number;
  key?: string;
  revalidate?: number;
}

const CACHE_PREFIX = "api_cache_";
const DEFAULT_TTL = 30000;

/**
 * Get cached data from sessionStorage
 */
export function getCachedData<T>(key: string): T | null {
  if (typeof window === "undefined") return null;

  try {
    const cached = sessionStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!cached) return null;

    const { data, timestamp, ttl } = JSON.parse(cached);
    const age = Date.now() - timestamp;

    if (age < (ttl || DEFAULT_TTL)) {
      return data as T;
    }

    sessionStorage.removeItem(`${CACHE_PREFIX}${key}`);
    return null;
  } catch (error) {
    console.warn("[CACHE] Failed to get cached data:", error);
    return null;
  }
}

/**
 * Set cached data in sessionStorage
 */
export function setCachedData<T>(
  key: string,
  data: T,
  options: CacheOptions = {}
): void {
  if (typeof window === "undefined") return;

  try {
    const cacheData = {
      data,
      timestamp: Date.now(),
      ttl: options.ttl || DEFAULT_TTL,
    };
    sessionStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(cacheData));
  } catch (error) {
    console.warn("[CACHE] Failed to set cached data:", error);
    clearOldCache();
  }
}

/**
 * Clear old cache entries to free up space
 */
function clearOldCache(): void {
  if (typeof window === "undefined") return;

  try {
    const keys = Object.keys(sessionStorage);
    const now = Date.now();

    keys.forEach((key) => {
      if (key.startsWith(CACHE_PREFIX)) {
        try {
          const cached = sessionStorage.getItem(key);
          if (cached) {
            const { timestamp, ttl } = JSON.parse(cached);
            if (now - timestamp > (ttl || DEFAULT_TTL) * 2) {
              sessionStorage.removeItem(key);
            }
          }
        } catch {
          sessionStorage.removeItem(key);
        }
      }
    });
  } catch (error) {
    console.warn("[CACHE] Failed to clear old cache:", error);
  }
}

/**
 * Clear specific cache entry
 */
export function clearCache(key: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(`${CACHE_PREFIX}${key}`);
}

/**
 * Clear all API cache
 */
export function clearAllCache(): void {
  if (typeof window === "undefined") return;

  const keys = Object.keys(sessionStorage);
  keys.forEach((key) => {
    if (key.startsWith(CACHE_PREFIX)) {
      sessionStorage.removeItem(key);
    }
  });
}

/**
 * Enhanced fetch with caching
 */
export async function cachedFetch<T>(
  url: string,
  options: RequestInit & CacheOptions = {}
): Promise<T> {
  const { ttl, key, revalidate, ...fetchOptions } = options;
  const cacheKey = key || url;

  const cached = getCachedData<T>(cacheKey);
  if (cached !== null) {
    if (revalidate) {
      fetch(url, fetchOptions)
        .then((res) => res.json())
        .then((data) => {
          setCachedData(cacheKey, data, { ttl });
        })
        .catch(() => {});
    }
    return cached;
  }

  const response = await fetch(url, fetchOptions);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  setCachedData(cacheKey, data, { ttl });
  return data as T;
}
