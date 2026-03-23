"use client";

import api from "@/common/utils/api";

const createPlacesClient = () => api({ "x-skip-toast": "true" });

export async function autocompletePlaces({
  input,
  languageCode = "en",
  includedRegionCodes,
  includedPrimaryTypes,
  sessionToken,
}) {
  if (!input?.trim()) return [];

  try {
    const payload = {
      input: input.trim(),
      languageCode,
      includedRegionCodes,
      includedPrimaryTypes,
      sessionToken,
    };

    const { data } = await createPlacesClient().post("/auth/places/autocomplete", payload);

    return Array.isArray(data?.data) ? data.data : [];
  } catch (error) {
    return [];
  }
}

export async function fetchPlaceDetails(placeId, languageCode = "en") {
  if (!placeId) return null;

  try {
    const { data } = await createPlacesClient().get("/auth/places/details", {
      params: { placeId, languageCode },
    });

    return data?.data || null;
  } catch (error) {
    return null;
  }
}
