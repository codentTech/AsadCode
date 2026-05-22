"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import COUNTRIES from "@/common/constants/countries.constant";
import MAJOR_WORLD_CITIES from "@/common/constants/cities-fallback.constant";
import {
  autocompletePlacesThunk,
  fetchPlaceDetailsThunk,
} from "@/provider/features/places/places.slice";

const countryNameLookup = COUNTRIES.reduce((acc, country) => {
  acc[country.code] = country.label;
  return acc;
}, {});

const matchesStateRegion = (cityRegion, stateName, stateShort) => {
  const region = String(cityRegion || "").trim().toLowerCase();
  if (!region) return false;
  const name = String(stateName || "").trim().toLowerCase();
  const short = String(stateShort || "").trim().toLowerCase();
  if (name && region === name) return true;
  if (short && region === short) return true;
  if (name && region.includes(name)) return true;
  if (short && region.includes(short)) return true;
  return false;
};

const normalizeFallbackCities = (
  cities,
  searchTerm,
  allowedCountryCodes,
  stateName,
  stateShort
) => {
  const normalizedTerm = searchTerm.trim().toLowerCase();
  const allowedSet = Array.isArray(allowedCountryCodes)
    ? new Set(allowedCountryCodes.filter(Boolean).map((code) => String(code).toUpperCase()))
    : null;
  const hasStateFilter = Boolean(stateName || stateShort);

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
      if (hasStateFilter && !matchesStateRegion(city.region, stateName, stateShort)) {
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

export default function useCitySelect({
  countryCode,
  countryCodes = [],
  stateName = "",
  stateShort = "",
}) {
  const dispatch = useDispatch();
  const [options, setOptions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchSeqRef = useRef(0);

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
      normalizeFallbackCities(
        MAJOR_WORLD_CITIES,
        term,
        normalizedAllowedCodes,
        stateName,
        stateShort
      ).slice(0, FALLBACK_LIMIT),
    [normalizedAllowedCodes, stateName, stateShort]
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

      const seq = ++searchSeqRef.current;
      setIsSearching(true);

      const placesInput =
        stateName || stateShort ? `${term}, ${stateName || stateShort}`.trim() : term;

      const action = await dispatch(
        autocompletePlacesThunk({
          input: placesInput,
          includedPrimaryTypes: ["locality"],
          includedRegionCodes: normalizedAllowedCodes,
          languageCode: process.env.NEXT_PUBLIC_GOOGLE_PLACES_LANGUAGE || "en",
        })
      );

      if (seq !== searchSeqRef.current) {
        setIsSearching(false);
        return;
      }

      setIsSearching(false);

      if (!autocompletePlacesThunk.fulfilled.match(action)) {
        setOptions(localResults);
        return;
      }

      const suggestions = action.payload;
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
    },
    [dispatch, fallbackSearch, normalizedAllowedCodes, stateName, stateShort]
  );

  const resolveCityDetails = useCallback(
    async (option) => {
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

      const languageCode = process.env.NEXT_PUBLIC_GOOGLE_PLACES_LANGUAGE || "en";
      const action = await dispatch(
        fetchPlaceDetailsThunk({ placeId: option.placeId, languageCode })
      );

      if (!fetchPlaceDetailsThunk.fulfilled.match(action)) {
        return {
          cityName: option.cityName || option.label,
          countryCode: option.countryCode || "",
          region: option.region || "",
        };
      }

      const place = action.payload;

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
    },
    [dispatch]
  );

  return {
    options,
    isLoading: isSearching,
    searchCities,
    resolveCityDetails,
  };
}
