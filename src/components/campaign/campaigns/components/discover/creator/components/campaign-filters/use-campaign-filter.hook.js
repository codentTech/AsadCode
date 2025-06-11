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
  return {
    filters,
    setFilters,
    expandedFilters,
    toggleFilter,
    resetFilters,
    handlePlatformChange,
  };
}

export default useCampaignFilter;
