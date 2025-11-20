"use client";

import { useCallback, useMemo, useState } from "react";
import COUNTRIES from "@/common/constants/countries.constant";
import MAJOR_WORLD_CITIES from "@/common/constants/cities-fallback.constant";
import { autocompletePlaces, fetchPlaceDetails } from "@/common/utils/places-api-new";

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
        placeId: null,
      };
    });
};

const FALLBACK_LIMIT = 15;

export default function useCitySelect({ countryCode, countryCodes = [] }) {
  const [options, setOptions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

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

  const fallbackSearch = useCallback(
    (term) =>
      normalizeFallbackCities(MAJOR_WORLD_CITIES, term, normalizedAllowedCodes).slice(
        0,
        FALLBACK_LIMIT
      ),
    [normalizedAllowedCodes]
  );

  const searchCities = useCallback(
    async (rawTerm) => {
      const term = rawTerm?.trim() ?? "";

      if (term.length < 2) {
        setOptions([]);
        return;
      }

      const localResults = fallbackSearch(term);
      setOptions(localResults);

      setIsSearching(true);

      try {
        const suggestions = await autocompletePlaces({
          input: term,
          includedPrimaryTypes: ["locality"],
          includedRegionCodes: normalizedAllowedCodes,
          languageCode: process.env.NEXT_PUBLIC_GOOGLE_PLACES_LANGUAGE || "en",
        });

        const normalized = suggestions
          .map((suggestion) => {
            const prediction = suggestion?.placePrediction;
            if (!prediction?.placeId) return null;

            const mainText =
              prediction?.structuredFormat?.mainText?.text || prediction?.text?.text || "";
            const secondary =
              prediction?.structuredFormat?.secondaryText?.text ||
              prediction?.text?.secondaryText ||
              "";
            const label = secondary ? `${mainText}, ${secondary}` : mainText;

            return {
              label,
              value: prediction.placeId,
              placeId: prediction.placeId,
              cityName: mainText,
            };
          })
          .filter(Boolean);

        if (!normalized.length) {
          setOptions(localResults);
        } else {
          const deduped = [...normalized, ...localResults].filter(
            (option, index, arr) => index === arr.findIndex((item) => item.label === option.label)
          );
          setOptions(deduped.slice(0, FALLBACK_LIMIT));
        }
      } catch (error) {
        setOptions(localResults);
      } finally {
        setIsSearching(false);
      }
    },
    [fallbackSearch, normalizedAllowedCodes]
  );

  const resolveCityDetails = useCallback(async (option) => {
    if (!option) return null;

    if (!option.placeId) {
      return {
        cityName: option.cityName || option.label,
        countryCode: option.countryCode || "",
        region: option.region || "",
        latitude: option.latitude ?? null,
        longitude: option.longitude ?? null,
        geonameId: option.geonameId || null,
      };
    }

    try {
      const place = await fetchPlaceDetails(option.placeId);

      if (!place) {
        return {
          cityName: option.cityName || option.label,
          countryCode: option.countryCode || "",
          region: option.region || "",
        };
      }

      const components = place.addressComponents || [];
      const cityComponent =
        components.find((component) => component.types?.includes("locality")) ||
        components.find((component) => component.types?.includes("postal_town")) ||
        components.find((component) => component.types?.includes("administrative_area_level_1"));
      const countryComponent = components.find((component) => component.types?.includes("country"));
      const regionComponent = components.find((component) =>
        component.types?.includes("administrative_area_level_1")
      );

      return {
        cityName: cityComponent?.longText || place.displayName?.text || option.label,
        countryCode: countryComponent?.shortText || "",
        region: regionComponent?.longText || "",
        latitude: place.location?.latitude ?? null,
        longitude: place.location?.longitude ?? null,
        placeId: option.placeId,
      };
    } catch (error) {
      return {
        cityName: option.cityName || option.label,
        countryCode: option.countryCode || "",
        region: option.region || "",
      };
    }
  }, []);

  return {
    options,
    isLoading: isSearching,
    searchCities,
    resolveCityDetails,
  };
}
