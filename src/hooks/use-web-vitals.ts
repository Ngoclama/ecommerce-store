"use client";

import { useEffect } from "react";

/**
 * Monitor Core Web Vitals
 */
export function useWebVitals() {
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log("LCP:", entry.startTime);
      }
    });

    observer.observe({ entryTypes: ["largest-contentful-paint"] });

    const interactionObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log("INP:", (entry as any).duration);
      }
    });

    interactionObserver.observe({
      entryTypes: ["first-input", "interaction"],
    });

    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if ((entry as any).hadRecentInput) continue;
        clsValue += (entry as any).value;
        console.log("CLS:", clsValue);
      }
    });

    clsObserver.observe({ entryTypes: ["layout-shift"] });

    return () => {
      observer.disconnect();
      interactionObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);
}

export function useRenderPerformance(componentName: string) {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      console.log(
        `[${componentName}] Render time: ${(endTime - startTime).toFixed(2)}ms`
      );
    };
  }, [componentName]);
}

export async function measureApiCall<T>(
  url: string,
  fetcher: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();

  try {
    const result = await fetcher();
    const endTime = performance.now();

    console.log(`[API] ${url} took ${(endTime - startTime).toFixed(2)}ms`);

    return result;
  } catch (error) {
    const endTime = performance.now();
    console.error(
      `[API] ${url} failed after ${(endTime - startTime).toFixed(2)}ms`,
      error
    );
    throw error;
  }
}
