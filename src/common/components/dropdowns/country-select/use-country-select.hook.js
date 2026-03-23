"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import COUNTRIES from "@/common/constants/countries.constant";
import { autocompletePlaces, fetchPlaceDetails } from "@/common/utils/places-api-new";

const IP_LOOKUP_ENDPOINT = "https://ip-api.com/json/?fields=status,countryCode";
const DEFAULT_RESULTS_LIMIT = 12;

const formatCountryOption = (country) => ({
  label: country.label,
  value: country.code,
  countryCode: country.code,
  countryName: country.label,
  phoneCode: country.phone,
  placeId: null,
});

export default function useCountrySelect({
  autoDetect = false,
  onAutoDetect,
  enabled = true,
  hasInitialValue = false,
}) {
  const [options, setOptions] = useState(
    COUNTRIES.slice(0, DEFAULT_RESULTS_LIMIT).map(formatCountryOption)
  );
  const [isDetecting, setIsDetecting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const hasAttemptedDetection = useRef(false);
  const hasManualOverride = useRef(false);
  const fallbackCountries = useMemo(() => COUNTRIES.map(formatCountryOption), []);

  const fallbackSearch = useCallback(
    (term) => {
      const normalized = term.trim().toLowerCase();
      if (!normalized) {
        setOptions(fallbackCountries.slice(0, DEFAULT_RESULTS_LIMIT));
        return;
      }

      const filtered = fallbackCountries
        .filter((country) => country.label.toLowerCase().includes(normalized))
        .slice(0, DEFAULT_RESULTS_LIMIT);
      setOptions(filtered);
    },
    [fallbackCountries]
  );

  const searchCountries = useCallback(
    async (term) => {
      const query = term.trim();
      hasManualOverride.current = true;

      const hydrateFallback = () => {
        if (!query) {
          setOptions(fallbackCountries.slice(0, DEFAULT_RESULTS_LIMIT));
        } else {
          fallbackSearch(query);
        }
      };

      if (!query) {
        hydrateFallback();
        return;
      }

      // Always present an immediate result set so the list never feels "stuck"
      hydrateFallback();

      setIsSearching(true);

      try {
        const suggestions = await autocompletePlaces({
          input: query,
          includedPrimaryTypes: ["country"],
          languageCode: process.env.NEXT_PUBLIC_GOOGLE_PLACES_LANGUAGE || "en",
        });

        const normalized = suggestions
          .map((suggestion) => {
            const prediction = suggestion?.placePrediction;
            if (!prediction?.placeId) return null;

            const mainText =
              prediction?.structuredFormat?.mainText?.text || prediction?.text?.text || "";
            const secondaryText =
              prediction?.structuredFormat?.secondaryText?.text ||
              prediction?.text?.secondaryText ||
              "";
            const label = secondaryText ? `${mainText}, ${secondaryText}` : mainText;

            return {
              label: label || mainText || secondaryText || "",
              value: prediction.placeId,
              placeId: prediction.placeId,
              countryName: mainText || secondaryText || "",
            };
          })
          .filter(Boolean);

        if (normalized.length) {
          setOptions(normalized);
        }
      } catch (error) {
        hydrateFallback();
      } finally {
        setIsSearching(false);
      }
    },
    [autocompletePlaces, fallbackCountries, fallbackSearch]
  );

  const resolveCountryDetails = useCallback(
    async (option) => {
      if (!option) return null;
      hasManualOverride.current = true;

      if (!option.placeId) {
        const match =
          option.countryCode && option.countryName
            ? option
            : fallbackCountries.find((country) => country.countryCode === option.countryCode);

        if (!match) {
          return {
            countryName: option.countryName || option.label,
            countryCode: option.countryCode || "",
            phoneCode: option.phoneCode || "",
          };
        }

        return {
          countryName: match.countryName || option.countryName || option.label,
          countryCode: match.countryCode,
          phoneCode: match.phoneCode,
        };
      }

      try {
        const place = await fetchPlaceDetails(option.placeId);

        if (!place) {
          return {
            countryName: option.countryName || option.label,
            countryCode: "",
            phoneCode: "",
          };
        }

        const countryComponent = place.addressComponents?.find((component) =>
          component.types?.includes("country")
        );
        const countryCode = countryComponent?.shortText || "";
        const countryMeta = COUNTRIES.find((country) => country.code === countryCode);

        return {
          countryName:
            countryMeta?.label ||
            countryComponent?.longText ||
            place.displayName?.text ||
            option.countryName ||
            option.label,
          countryCode,
          phoneCode: countryMeta?.phone || "",
          location: place.location
            ? {
                lat: place.location.latitude,
                lng: place.location.longitude,
              }
            : null,
          placeId: option.placeId,
        };
      } catch (error) {
        return {
          countryName: option.countryName || option.label,
          countryCode: "",
          phoneCode: "",
        };
      }
    },
    [fallbackCountries]
  );

  const detectCountry = useCallback(async () => {
    if (!enabled || hasManualOverride.current) return;
    setIsDetecting(true);

    try {
      const fetchWithTimeout = async (url, timeoutMs = 2000) => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), timeoutMs);
        try {
          const response = await fetch(url, { cache: "no-store", signal: controller.signal });
          if (!response.ok) return null;
          const data = await response.json();
          return data;
        } catch (err) {
          return null;
        } finally {
          clearTimeout(timeout);
        }
      };

      let detectedCode = null;

      const countryIsData = await fetchWithTimeout("https://api.country.is/");
      if (countryIsData?.country) {
        detectedCode = String(countryIsData.country).toUpperCase();
      }

      if (!detectedCode) {
        const ipApiData = await fetchWithTimeout(IP_LOOKUP_ENDPOINT);
        if (ipApiData?.status === "success" && ipApiData.countryCode) {
          detectedCode = String(ipApiData.countryCode).toUpperCase();
        }
      }

      if (!detectedCode || hasManualOverride.current) return;

      const matchedOption = fallbackCountries.find((option) => option.countryCode === detectedCode);
      if (matchedOption) {
        onAutoDetect?.(matchedOption);
      }
    } catch (error) {
      // Silent failover – IP detection is best-effort only
    } finally {
      setIsDetecting(false);
    }
  }, [enabled, fallbackCountries, onAutoDetect]);

  useEffect(() => {
    if (
      !autoDetect ||
      hasAttemptedDetection.current ||
      hasManualOverride.current ||
      hasInitialValue
    ) {
      return;
    }
    hasAttemptedDetection.current = true;
    detectCountry();
  }, [autoDetect, detectCountry, hasInitialValue]);

  const markManualOverride = useCallback(() => {
    hasManualOverride.current = true;
  }, []);

  return {
    options,
    searchCountries,
    resolveCountryDetails,
    isDetecting,
    isSearching,
    markManualOverride,
  };
}
