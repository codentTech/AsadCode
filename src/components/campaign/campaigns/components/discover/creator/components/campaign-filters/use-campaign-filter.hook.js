import { useState } from "react";

function useCampaignFilter() {
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
  };

  const handlePlatformChange = (platform) => {
    setFilters((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const applyFilters = () => {
    // Apply filter logic here
    console.log("Applying filters:", filters);
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

  return {
    filters,
    setFilters,
    expandedFilters,
    toggleFilter,
    resetFilters,
    handlePlatformChange,
    applyFilters,
    hasActiveFilters,
  };
}

export default useCampaignFilter;
