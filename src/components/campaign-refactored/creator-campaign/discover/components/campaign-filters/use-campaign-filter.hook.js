import { useCallback, useState } from "react";

export const INITIAL_CAMPAIGN_FILTERS = {
  campaignType: "",
  platforms: [],
  compensationType: "",
  location: "Remote",
  minPayment: 0,
  eligibleOnly: false,
  brandCountry: null,
  brandCity: null,
};

const INITIAL_EXPANDED = {
  type: false,
  platform: false,
  compensation: false,
  location: false,
  payment: false,
  eligibility: false,
  brandLocation: false,
};

export function buildCampaignFilterApiParams(sourceFilters) {
  const apiFilters = {
    compensation_type:
      sourceFilters.compensationType?.value || sourceFilters.compensationType || undefined,
    min_followers: "",
    platforms: sourceFilters.platforms?.length > 0 ? sourceFilters.platforms : undefined,
    country:
      sourceFilters.location &&
      sourceFilters.location !== "Remote" &&
      sourceFilters.location !== "In-Person"
        ? sourceFilters.location.value || sourceFilters.location
        : undefined,
    brand_country: sourceFilters.brandCountry?.countryName || undefined,
    brand_city: sourceFilters.brandCity?.cityName || undefined,
  };

  const campaignType =
    sourceFilters.campaignType?.value || sourceFilters.campaignType || undefined;
  if (campaignType) {
    apiFilters.campaign_type = campaignType;
  }

  if (sourceFilters.minPayment > 0) {
    apiFilters.min_payment = sourceFilters.minPayment;
  }

  Object.keys(apiFilters).forEach((key) => {
    if (apiFilters[key] === undefined) {
      delete apiFilters[key];
    }
  });

  return apiFilters;
}

function useCampaignFilter() {
  const [filters, setFilters] = useState(INITIAL_CAMPAIGN_FILTERS);
  const [expandedFilters, setExpandedFilters] = useState(INITIAL_EXPANDED);

  const toggleFilter = useCallback((section) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_CAMPAIGN_FILTERS);
  }, []);

  const getApiFilters = useCallback(
    (sourceFilters = filters) => buildCampaignFilterApiParams(sourceFilters),
    [filters]
  );

  const hasActiveFilters = useCallback((sourceFilters = filters) => {
    return Object.entries(sourceFilters).some(([key, value]) => {
      if (key === "location") {
        return value && value !== "Remote";
      }
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (typeof value === "string") {
        return value.trim() !== "";
      }
      if (typeof value === "number") {
        return value > 0;
      }
      return Boolean(value);
    });
  }, [filters]);

  return {
    filters,
    setFilters,
    expandedFilters,
    toggleFilter,
    resetFilters,
    getApiFilters,
    hasActiveFilters,
  };
}

export default useCampaignFilter;
