"use client";

import { useState, useEffect, useCallback } from "react";

export interface Province {
  code: string;
  name: string;
}

export interface District {
  code: string;
  name: string;
  province_code: string;
}

export interface Ward {
  code: string;
  name: string;
  district_code: string;
}

const API_BASE_URL = "https://provinces.open-api.vn/api";

export const useVietnamAddress = () => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState({
    provinces: false,
    districts: false,
    wards: false,
  });

  
  const fetchProvinces = useCallback(async () => {
    setLoading((prev) => ({ ...prev, provinces: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/p/`);
      if (!response.ok) throw new Error("Failed to fetch provinces");
      const data = await response.json();
      
      const formattedProvinces = data.map((item: Record<string, unknown>) => ({
        code: item.code || item.codeName || String(item.code),
        name: item.name || item.name_with_type || "",
      }));
      if (process.env.NODE_ENV === "development") {
        console.log(
          "[useVietnamAddress] Provinces loaded:",
          formattedProvinces.length
        );
      }
      setProvinces(formattedProvinces);
    } catch (error) {
      console.error("[useVietnamAddress] Error fetching provinces:", error);
      setProvinces([]);
    } finally {
      setLoading((prev) => ({ ...prev, provinces: false }));
    }
  }, []);

  
  const fetchDistricts = useCallback(async (provinceCode: string) => {
    if (!provinceCode) {
      setDistricts([]);
      setWards([]);
      return;
    }

    setLoading((prev) => ({ ...prev, districts: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/p/${provinceCode}?depth=2`);
      if (!response.ok) throw new Error("Failed to fetch districts");
      const data = await response.json();
      
      const districtsList = (data.districts || []).map(
        (item: Record<string, unknown>) => ({
          code: item.code || item.codeName || String(item.code),
          name: item.name || item.name_with_type || "",
          province_code: provinceCode,
        })
      );
      if (process.env.NODE_ENV === "development") {
        console.log(
          "[useVietnamAddress] Districts loaded:",
          districtsList.length
        );
      }
      setDistricts(districtsList);
      
      setWards([]);
    } catch (error) {
      console.error("[useVietnamAddress] Error fetching districts:", error);
      setDistricts([]);
      setWards([]);
    } finally {
      setLoading((prev) => ({ ...prev, districts: false }));
    }
  }, []);

  
  const fetchWards = useCallback(async (districtCode: string) => {
    if (!districtCode) {
      setWards([]);
      return;
    }

    setLoading((prev) => ({ ...prev, wards: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/d/${districtCode}?depth=2`);
      if (!response.ok) throw new Error("Failed to fetch wards");
      const data = await response.json();
      
      const wardsList = (data.wards || []).map(
        (item: Record<string, unknown>) => ({
          code: item.code || item.codeName || String(item.code),
          name: item.name || item.name_with_type || "",
          district_code: districtCode,
        })
      );
      if (process.env.NODE_ENV === "development") {
        console.log("[useVietnamAddress] Wards loaded:", wardsList.length);
      }
      setWards(wardsList);
    } catch (error) {
      console.error("[useVietnamAddress] Error fetching wards:", error);
      setWards([]);
    } finally {
      setLoading((prev) => ({ ...prev, wards: false }));
    }
  }, []);

  // Load provinces on mount
  useEffect(() => {
    fetchProvinces();
  }, [fetchProvinces]);

  return {
    provinces,
    districts,
    wards,
    loading,
    fetchDistricts,
    fetchWards,
    fetchProvinces,
  };
};
