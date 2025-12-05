/**
 * API Cache Utilities
 * Cải thiện performance với intelligent caching
 */

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  key?: string;
  revalidate?: number; // Revalidate after this time
}

const CACHE_PREFIX = "api_cache_";
const DEFAULT_TTL = 30000; // 30 seconds

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

    // Check if cache is still valid
    if (age < (ttl || DEFAULT_TTL)) {
      return data as T;
    }

    // Cache expired, remove it
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
    // Handle quota exceeded or other storage errors
    console.warn("[CACHE] Failed to set cached data:", error);
    // Try to clear old cache entries
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
              // Cache is 2x TTL old, remove it
              sessionStorage.removeItem(key);
            }
          }
        } catch {
          // Invalid cache entry, remove it
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

  // Try to get from cache first
  const cached = getCachedData<T>(cacheKey);
  if (cached !== null) {
    // If revalidate is set, fetch in background
    if (revalidate) {
      fetch(url, fetchOptions)
        .then((res) => res.json())
        .then((data) => {
          setCachedData(cacheKey, data, { ttl });
        })
        .catch(() => {
          // Silent fail for background refresh
        });
    }
    return cached;
  }

  // Fetch from network
  const response = await fetch(url, fetchOptions);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  setCachedData(cacheKey, data, { ttl });
  return data as T;
}
