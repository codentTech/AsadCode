"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import COUNTRIES from "@/common/constants/countries.constant";
import MAJOR_WORLD_CITIES from "@/common/constants/cities-fallback.constant";

const GEONAMES_ENDPOINT = "https://secure.geonames.org/searchJSON";
const GEO_USERNAME = process.env.NEXT_PUBLIC_GEONAMES_USERNAME;

const countryNameLookup = COUNTRIES.reduce((acc, country) => {
  acc[country.code] = country.label;
  return acc;
}, {});

const normalizeFallbackCities = (cities, searchTerm, allowedCountryCodes) => {
  const normalizedTerm = searchTerm.trim().toLowerCase();
  const allowedSet = Array.isArray(allowedCountryCodes)
    ? new Set(allowedCountryCodes.filter(Boolean).map((code) => String(code).toUpperCase()))
    : null;

  return cities
    .filter((city) => {
      if (!city?.name) return false;
      if (
        allowedSet &&
        allowedSet.size &&
        !allowedSet.has(String(city.countryCode).toUpperCase())
      ) {
        return false;
      }
      return city.name.toLowerCase().includes(normalizedTerm);
    })
    .map((city) => {
      const countryName = countryNameLookup[city.countryCode] || city.countryCode;
      const secondary = city.region ? `${city.region}, ${countryName}` : countryName;
      return {
        value: `${city.name}-${city.countryCode}`,
        label: `${city.name}, ${secondary}`,
        cityName: city.name,
        countryCode: city.countryCode,
        region: city.region || "",
        latitude: city.latitude ?? null,
        longitude: city.longitude ?? null,
        geonameId: null,
      };
    });
};

const normalizeGeoNamesCities = (geonames = []) => {
  return geonames.map((entry) => {
    const countryCode = entry.countryCode || entry.countryId;
    const countryName = entry.countryName || countryNameLookup[countryCode] || countryCode;
    const adminName = entry.adminName1?.length ? entry.adminName1 : "";
    const suffix = adminName ? `${adminName}, ${countryName}` : countryName;

    return {
      value: entry.geonameId,
      label: `${entry.name}, ${suffix}`,
      cityName: entry.name,
      countryCode,
      region: adminName,
      latitude: entry.lat ? Number(entry.lat) : null,
      longitude: entry.lng ? Number(entry.lng) : null,
      geonameId: entry.geonameId,
    };
  });
};

export default function useCitySelect({ countryCode, countryCodes = [] }) {
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNetworkFallback, setHasNetworkFallback] = useState(false);
  const latestQueryRef = useRef({ term: "", countryCode: "" });

  const normalizedAllowedCodes = useMemo(() => {
    const codes = [];
    if (countryCode) {
      codes.push(String(countryCode).toUpperCase());
    }
    if (Array.isArray(countryCodes)) {
      countryCodes.filter(Boolean).forEach((code) => {
        const normalized = String(code).toUpperCase();
        if (!codes.includes(normalized)) {
          codes.push(normalized);
        }
      });
    }
    return codes;
  }, [countryCode, countryCodes]);

  const clearOptions = useCallback(() => {
    setOptions([]);
  }, []);

  const searchCities = useCallback(
    async (rawTerm) => {
      const term = rawTerm?.trim() ?? "";

      const effectiveCodes = normalizedAllowedCodes;
      const effectiveCountryCode =
        effectiveCodes.length === 1
          ? effectiveCodes[0]
          : countryCode
            ? String(countryCode).toUpperCase()
            : "";

      latestQueryRef.current = {
        term,
        countryCode: effectiveCountryCode,
      };

      if (term.length < 2) {
        clearOptions();
        return;
      }

      if (!GEO_USERNAME) {
        const fallbackResults = normalizeFallbackCities(
          MAJOR_WORLD_CITIES,
          term,
          effectiveCodes
        ).slice(0, 15);
        setOptions(fallbackResults);
        setHasNetworkFallback(true);
        return;
      }

      setIsLoading(true);

      const params = new URLSearchParams({
        name_startsWith: term,
        maxRows: "20",
        featureClass: "P",
        username: GEO_USERNAME,
        orderby: "relevance",
      });

      if (effectiveCountryCode) {
        params.append("country", effectiveCountryCode);
      }

      try {
        const response = await fetch(`${GEONAMES_ENDPOINT}?${params.toString()}`);
        if (!response.ok) {
          throw new Error(`GeoNames responded with status ${response.status}`);
        }

        const data = await response.json();
        const normalized = normalizeGeoNamesCities(data?.geonames || []).filter((city) => {
          if (!normalizedAllowedCodes.length) return true;
          return normalizedAllowedCodes.includes(String(city.countryCode).toUpperCase());
        });

        // Only update if this response is the latest query
        if (
          latestQueryRef.current.term === term &&
          latestQueryRef.current.countryCode === effectiveCountryCode
        ) {
          if (!normalized.length) {
            const fallbackResults = normalizeFallbackCities(
              MAJOR_WORLD_CITIES,
              term,
              normalizedAllowedCodes
            ).slice(0, 15);
            setOptions(fallbackResults);
            setHasNetworkFallback(true);
          } else {
            setOptions(normalized);
            setHasNetworkFallback(false);
          }
        }
      } catch (error) {
        const fallbackResults = normalizeFallbackCities(
          MAJOR_WORLD_CITIES,
          term,
          normalizedAllowedCodes
        ).slice(0, 15);
        setOptions(fallbackResults);
        setHasNetworkFallback(true);
      } finally {
        setIsLoading(false);
      }
    },
    [clearOptions, normalizedAllowedCodes]
  );

  const resolvedOptions = useMemo(() => options, [options]);

  return {
    options: resolvedOptions,
    isLoading,
    searchCities,
    clearOptions,
    hasNetworkFallback,
    allowedCountryCodes: normalizedAllowedCodes,
  };
}
