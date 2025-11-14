"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import COUNTRIES from "@/common/constants/countries.constant";

const IP_LOOKUP_ENDPOINT = "https://ipapi.co/json/";

export default function useCountrySelect({ autoDetect = false, onAutoDetect, enabled = true }) {
  const [isDetecting, setIsDetecting] = useState(false);
  const hasAttemptedDetection = useRef(false);

  const options = useMemo(() => {
    return COUNTRIES.map((country) => ({
      label: country.label,
      value: country.code,
      phone: country.phone,
      raw: country,
    }));
  }, []);

  const detectCountry = useCallback(async () => {
    if (!enabled) return;
    setIsDetecting(true);

    try {
      const response = await fetch(IP_LOOKUP_ENDPOINT, { cache: "no-store" });
      if (!response.ok) return;

      const data = await response.json();
      const detectedCode = data?.country_code ? String(data.country_code).toUpperCase() : null;

      if (!detectedCode) return;

      const matchedOption = options.find((option) => option.value === detectedCode);
      if (matchedOption) {
        onAutoDetect?.(matchedOption);
      }
    } catch (error) {
      // Silent failover – IP detection is best-effort only
    } finally {
      setIsDetecting(false);
    }
  }, [enabled, onAutoDetect, options]);

  useEffect(() => {
    if (!autoDetect || hasAttemptedDetection.current) return;
    hasAttemptedDetection.current = true;
    detectCountry();
  }, [autoDetect, detectCountry]);

  return {
    options,
    detectCountry,
    isDetecting,
  };
}
