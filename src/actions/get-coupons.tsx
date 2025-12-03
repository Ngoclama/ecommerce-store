import { Coupon } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/api/coupons`;

const getCoupons = async (): Promise<Coupon[]> => {
  try {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error("NEXT_PUBLIC_API_URL is not configured");
      return [];
    }
    const res = await fetch(URL, { cache: "no-store" });
    if (!res.ok) {
      console.error(`Failed to fetch coupons: ${res.status} ${res.statusText}`);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return [];
  }
};

export default getCoupons;
