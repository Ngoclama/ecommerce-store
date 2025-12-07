/**
 * Optimized Fetch Utilities
 * Tối ưu hóa fetching với parallel requests, retry logic, và error handling
 */

interface FetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  cacheTTL?: number;
}

const DEFAULT_TIMEOUT = 10000;
const DEFAULT_RETRIES = 2;
const DEFAULT_RETRY_DELAY = 1000;

/**
 * Fetch with timeout
 */
function fetchWithTimeout(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options;

  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    })
      .then((response) => {
        clearTimeout(timeoutId);
        resolve(response);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        if (error.name === "AbortError") {
          reject(new Error(`Request timeout after ${timeout}ms`));
        } else {
          reject(error);
        }
      });
  });
}

/**
 * Fetch with retry logic
 */
export async function fetchWithRetry<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    retries = DEFAULT_RETRIES,
    retryDelay = DEFAULT_RETRY_DELAY,
    ...fetchOptions
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, fetchOptions);

      if (!response.ok) {
        if (response.status >= 400 && response.status < 500) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      let data: unknown;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(
            `Invalid response format: ${contentType || "unknown"}`
          );
        }
      }

      return data as T;
    } catch (error: unknown) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < retries) {
        const delay = retryDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
    }
  }

  throw lastError || new Error("Failed to fetch");
}

/**
 * Parallel fetch multiple URLs
 */
export async function fetchParallel<T>(
  urls: string[],
  options: FetchOptions = {}
): Promise<T[]> {
  const promises = urls.map((url) => fetchWithRetry<T>(url, options));
  return Promise.all(promises);
}

/**
 * Fetch with request deduplication
 */
const pendingRequests = new Map<string, Promise<unknown>>();

export function fetchDeduplicated<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const cacheKey = `${url}_${JSON.stringify(options)}`;

  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey)! as Promise<T>;
  }

  const promise = fetchWithRetry<T>(url, options).finally(() => {
    pendingRequests.delete(cacheKey);
  });

  pendingRequests.set(cacheKey, promise);
  return promise;
}
