"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  autocompletePlacesThunk,
  fetchPlaceDetailsThunk,
} from "@/provider/features/places/places.slice";

const FALLBACK_LIMIT = 15;

export default function useStateSelect({ countryCode, countryCodes = [] }) {
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

  const searchStates = useCallback(
    async (rawTerm) => {
      const term = rawTerm?.trim() ?? "";

      if (term.length < 2 || !normalizedAllowedCodes.length) {
        setOptions([]);
        return;
      }

      const seq = ++searchSeqRef.current;
      setIsSearching(true);

      const action = await dispatch(
        autocompletePlacesThunk({
          input: term,
          includedPrimaryTypes: ["administrative_area_level_1"],
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
        setOptions([]);
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
            stateName: mainText,
          };
        })
        .filter(Boolean);

      setOptions(normalized.slice(0, FALLBACK_LIMIT));
    },
    [dispatch, normalizedAllowedCodes]
  );

  const resolveStateDetails = useCallback(
    async (option) => {
      if (!option) return null;

      if (!option.placeId) {
        return {
          stateName: option.stateName || option.label || "",
          stateShort: option.stateShort || "",
        };
      }

      const languageCode = process.env.NEXT_PUBLIC_GOOGLE_PLACES_LANGUAGE || "en";
      const action = await dispatch(
        fetchPlaceDetailsThunk({ placeId: option.placeId, languageCode })
      );

      if (!fetchPlaceDetailsThunk.fulfilled.match(action)) {
        return {
          stateName: option.stateName || option.label || "",
          stateShort: option.stateShort || "",
        };
      }

      const place = action.payload;
      if (!place) {
        return {
          stateName: option.stateName || option.label || "",
          stateShort: option.stateShort || "",
        };
      }

      const regionComponent = place.addressComponents?.find((component) =>
        component.types?.includes("administrative_area_level_1")
      );

      return {
        stateName: regionComponent?.longText || place.displayName?.text || option.stateName || "",
        stateShort: regionComponent?.shortText || "",
        placeId: option.placeId,
      };
    },
    [dispatch]
  );

  return {
    options,
    isLoading: isSearching,
    searchStates,
    resolveStateDetails,
  };
}
