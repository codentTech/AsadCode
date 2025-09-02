import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  filterCampaigns,
  getAllCampaigns,
  resetFilteredCampaigns,
} from "@/provider/features/campaigns/campaigns.slice";

function useCampaignFilter() {
  const dispatch = useDispatch();
  const { isLoading, isError, message } = useSelector((state) => state.campaigns.filterCampaigns);

  const [filters, setFilters] = useState({
    campaignType: "",
    platforms: [],
    compensationType: "",
    location: "Remote",
    minPayment: 0,
    recentlyPosted: false,
  });

  const [expandedFilters, setExpandedFilters] = useState({
    type: true,
    platform: true,
    compensation: true,
    location: true,
    payment: true,
    recent: true,
  });

  const toggleFilter = (section) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const resetFilters = () => {
    setFilters({
      campaignType: "",
      platforms: [],
      compensationType: "",
      location: "Remote",
      minPayment: 0,
      recentlyPosted: false,
    });
    // Reset to show all campaigns without filters
    // First clear the filtered campaigns state
    dispatch(resetFilteredCampaigns());
    // Then load all campaigns
    dispatch(getAllCampaigns({ page: 1, limit: 10 }));
  };

  const applyFilters = () => {
    // Transform frontend filters to backend API format
    const apiFilters = {
      page: 1,
      limit: 10,
      search: "",
      niches: [],
      compensation_type: filters.compensationType?.value || filters.compensationType || undefined,
      min_followers: "",
      platforms: filters.platforms.length > 0 ? filters.platforms : undefined,
      is_remote:
        filters.location === "Remote" ? true : filters.location === "In-Person" ? false : undefined,
      country:
        filters.location && filters.location !== "Remote" && filters.location !== "In-Person"
          ? filters.location.value || filters.location
          : undefined,
      city: undefined,
      age_range: undefined,
      gender: undefined,
      language: undefined,
    };

    // Add campaign type filter if selected
    if (filters.campaignType && filters.campaignType.value) {
      apiFilters.campaign_type = filters.campaignType.value;
    }

    // Add minimum payment filter if set
    if (filters.minPayment > 0) {
      apiFilters.min_payment = filters.minPayment;
    }

    // Add recently posted filter if enabled
    if (filters.recentlyPosted) {
      apiFilters.recently_posted = "true";
    }

    // Remove undefined values
    Object.keys(apiFilters).forEach((key) => {
      if (apiFilters[key] === undefined) {
        delete apiFilters[key];
      }
    });

    // Dispatch filter action
    dispatch(filterCampaigns(apiFilters));
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some((value) =>
      Array.isArray(value)
        ? value.length > 0
        : typeof value === "string"
          ? value.trim() !== ""
          : typeof value === "number"
            ? value > 0
            : Boolean(value)
    );
  };

  // Load initial campaigns when component mounts
  useEffect(() => {
    dispatch(getAllCampaigns({ page: 1, limit: 10 }));
  }, [dispatch]);

  return {
    filters,
    setFilters,
    expandedFilters,
    toggleFilter,
    resetFilters,
    applyFilters,
    hasActiveFilters,
    isLoading,
    isError,
    message,
  };
}

export default useCampaignFilter;
