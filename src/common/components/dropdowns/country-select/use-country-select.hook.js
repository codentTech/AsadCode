"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import COUNTRIES from "@/common/constants/countries.constant";
import {
  DEFAULT_RESULTS_LIMIT,
  IP_LOOKUP_ENDPOINT,
} from "@/common/constants/genaric.constant";
import {
  autocompletePlacesThunk,
  fetchPlaceDetailsThunk,
} from "@/provider/features/places/places.slice";

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
  const dispatch = useDispatch();
  const [options, setOptions] = useState(
    COUNTRIES.slice(0, DEFAULT_RESULTS_LIMIT).map(formatCountryOption)
  );
  const [isDetecting, setIsDetecting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const hasAttemptedDetection = useRef(false);
  const hasManualOverride = useRef(false);
  const searchSeqRef = useRef(0);
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

      hydrateFallback();

      const seq = ++searchSeqRef.current;
      setIsSearching(true);

      const action = await dispatch(
        autocompletePlacesThunk({
          input: query,
          includedPrimaryTypes: ["country"],
          languageCode: process.env.NEXT_PUBLIC_GOOGLE_PLACES_LANGUAGE || "en",
        })
      );

      if (seq !== searchSeqRef.current) {
        setIsSearching(false);
        return;
      }

      setIsSearching(false);

      if (!autocompletePlacesThunk.fulfilled.match(action)) {
        hydrateFallback();
        return;
      }

      const suggestions = action.payload;
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
    },
    [dispatch, fallbackCountries, fallbackSearch]
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

      const languageCode = process.env.NEXT_PUBLIC_GOOGLE_PLACES_LANGUAGE || "en";
      const action = await dispatch(
        fetchPlaceDetailsThunk({ placeId: option.placeId, languageCode })
      );

      if (!fetchPlaceDetailsThunk.fulfilled.match(action)) {
        return {
          countryName: option.countryName || option.label,
          countryCode: "",
          phoneCode: "",
        };
      }

      const place = action.payload;

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
    },
    [dispatch, fallbackCountries]
  );

  const detectCountry = useCallback(async () => {
    if (!enabled || hasManualOverride.current) return;
    setIsDetecting(true);

    const fetchWithTimeout = async (url, timeoutMs = 2000) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);
      const response = await fetch(url, { cache: "no-store", signal: controller.signal })
        .finally(() => clearTimeout(timeout))
        .catch(() => null);
      if (!response?.ok) return null;
      return response.json().catch(() => null);
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

    if (!detectedCode || hasManualOverride.current) {
      setIsDetecting(false);
      return;
    }

    const matchedOption = fallbackCountries.find((option) => option.countryCode === detectedCode);
    if (matchedOption) {
      onAutoDetect?.(matchedOption);
    }

    setIsDetecting(false);
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
