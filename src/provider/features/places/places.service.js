import api from "@/common/utils/api";

const GOOGLE_AUTOCOMPLETE_MAX_INCLUDED_REGION_CODES = 15;

const autocompletePlaces = async ({
  input,
  languageCode = "en",
  includedRegionCodes,
  includedPrimaryTypes,
  sessionToken,
}) => {
  if (!input?.trim()) return [];

  const payload = {
    input: input.trim(),
    languageCode,
    includedPrimaryTypes,
    sessionToken,
  };

  if (
    Array.isArray(includedRegionCodes) &&
    includedRegionCodes.length > 0 &&
    includedRegionCodes.length <= GOOGLE_AUTOCOMPLETE_MAX_INCLUDED_REGION_CODES
  ) {
    payload.includedRegionCodes = includedRegionCodes
      .filter(Boolean)
      .map((code) => String(code).toUpperCase());
  }

  const { data } = await api({ "x-skip-toast": "true" }).post("/auth/places/autocomplete", payload);
  return Array.isArray(data?.data) ? data.data : [];
};

const fetchPlaceDetails = async (placeId, languageCode = "en") => {
  if (!placeId) return null;

  const { data } = await api({ "x-skip-toast": "true" }).get("/auth/places/details", {
    params: { placeId, languageCode },
  });

  return data?.data || null;
};

const placesService = {
  autocompletePlaces,
  fetchPlaceDetails,
};

export default placesService;
