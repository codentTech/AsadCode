import { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllCampaigns,
  filterCampaigns,
  resetFilteredCampaigns,
} from "@/provider/features/campaigns/campaigns.slice";

export function useCampaignFeed() {
  const dispatch = useDispatch();
  const { data: allCampaignsData, isLoading: allCampaignsLoading } = useSelector(
    (state) => state.campaigns.getAllCampaigns
  );
  const { data: filteredCampaignsData, isLoading: filteredCampaignsLoading } = useSelector(
    (state) => state.campaigns.filterCampaigns
  );

  const [showFullBrief, setShowFullBrief] = useState(false);
  const [briefCampaign, setBriefCampaign] = useState(null);
  const [showApplication, setShowApplication] = useState(false);
  const [applicationCampaign, setApplicationCampaign] = useState(null);
  const [applicationPitch, setApplicationPitch] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const [selectedNiche, setSelectedNiche] = useState("all");

  // Determine which data to use (filtered or all campaigns)
  const campaignsData = filteredCampaignsData?.data || allCampaignsData?.data;
  const isLoading = filteredCampaignsLoading || allCampaignsLoading;
  const isFiltering = filteredCampaignsLoading;

  // Handle niche filter change
  const handleNicheChange = (niche) => {
    // Extract value if niche is an object (from Niche component)
    const nicheValue = typeof niche === "object" ? niche.value : niche;

    setSelectedNiche(nicheValue);

    if (nicheValue === "all") {
      // Reset to show all campaigns without filters
      // First clear the filtered campaigns state
      dispatch(resetFilteredCampaigns());
      // Then load all campaigns
      dispatch(getAllCampaigns({ page: 1, limit: 10, sort: sortBy }));
    } else {
      // Apply niche filter
      const filters = {
        page: 1,
        limit: 10,
        niches: nicheValue,
        sort: sortBy, // Include sort parameter
      };
      dispatch(filterCampaigns(filters));
    }
  };

  // Handle sort change
  const handleSortChange = (newSortBy) => {
    // Extract value if newSortBy is an object (from SimpleSelect)
    const sortValue = typeof newSortBy === "object" ? newSortBy.value : newSortBy;

    setSortBy(sortValue);

    // Always use filterCampaigns to ensure sort parameter is sent
    const currentFilters = {
      page: 1,
      limit: 10,
      niches: selectedNiche !== "all" ? selectedNiche : undefined,
      sort: sortValue,
    };
    dispatch(filterCampaigns(currentFilters));
  };

  // Clear all filters and reset to default state
  const clearAllFilters = () => {
    setSelectedNiche("all");
    setSortBy("latest");
    // Reset to show all campaigns without filters
    // First clear the filtered campaigns state
    dispatch(resetFilteredCampaigns());
    // Then load all campaigns
    dispatch(getAllCampaigns({ page: 1, limit: 10 }));
  };

  // Transform backend campaign data to frontend format
  const transformedCampaigns = useMemo(() => {
    if (!campaignsData?.campaigns) return [];

    return campaignsData.campaigns.map((campaign) => ({
      id: campaign.id,
      brandLogo: campaign.brand?.profile_image || "🏢",
      brandName: campaign.brand?.company_name || campaign.brand?.first_name || "Unknown Brand",
      title: campaign.campaign_title,
      type: campaign.campaign_type || "Sponsored Post",
      compensation:
        campaign.compensation_type === "fixed"
          ? "Paid"
          : campaign.compensation_type === "commission"
            ? "Commission"
            : campaign.compensation_type === "gifted"
              ? "Gifted"
              : "Paid",
      compensationAmount:
        campaign.compensation_type === "fixed"
          ? `$${campaign.fixed_price || campaign.suggested_min || 0}`
          : campaign.compensation_type === "commission"
            ? `${campaign.commission_percentage || 0}% Commission`
            : campaign.compensation_type === "gifted"
              ? `Product ($${campaign.product_value || 0} value)`
              : "$0",
      compensationValue:
        campaign.compensation_type === "fixed"
          ? campaign.fixed_price || campaign.suggested_min || 0
          : campaign.compensation_type === "commission"
            ? campaign.suggested_max || 1000
            : campaign.compensation_type === "gifted"
              ? campaign.product_value || 0
              : 0,
      deliverables: campaign.deliverables || [],
      niche: campaign.niches?.[0] || "General",
      location: campaign.is_remote ? "Remote" : campaign.location_details || "In-Person",
      locationMandatory: campaign.in_person_required,
      locationPreferred: !campaign.in_person_required && campaign.location_details,
      productImage: campaign.campaign_image || "📦",
      language: campaign.creator_language || "English",
      followerMin: `${campaign.min_combined_followers || 0} Combined`,
      description:
        campaign.short_description || campaign.long_description || "No description available",
      brief: campaign.long_description || campaign.short_description || "No brief available",
      postedDate: campaign.published_at
        ? new Date(campaign.published_at)
        : new Date(campaign.created_at),
      // Backend fields for filtering
      campaign_type: campaign.campaign_type,
      compensation_type: campaign.compensation_type,
      required_platforms: campaign.required_platforms || [],
      min_combined_followers: campaign.min_combined_followers,
      is_remote: campaign.is_remote,
      creator_country: campaign.creator_country,
      creator_city: campaign.creator_city,
      niches: campaign.niches || [],
    }));
  }, [campaignsData]);

  // Use campaigns directly since backend handles sorting
  const sortedCampaigns = transformedCampaigns;

  // Load campaigns when component mounts
  useEffect(() => {
    if (!campaignsData) {
      // Use filterCampaigns to ensure sort parameter is always included
      dispatch(
        filterCampaigns({
          page: 1,
          limit: 10,
          sort: sortBy,
        })
      );
    }
  }, [dispatch, campaignsData, sortBy]);

  const handleOpenBrief = (campaign) => {
    setBriefCampaign(campaign);
    setShowFullBrief(true);
  };

  const handleOpenApplication = (campaign) => {
    setApplicationCampaign(campaign);
    setShowApplication(true);
  };

  const closeBrief = () => {
    setShowFullBrief(false);
    setBriefCampaign(null);
  };

  const closeApplication = () => {
    setShowApplication(false);
    setApplicationCampaign(null);
    setApplicationPitch("");
  };

  return {
    campaigns: transformedCampaigns,
    sortedCampaigns,
    isLoading,
    isFiltering,
    sortBy,
    setSortBy,
    handleSortChange,
    selectedNiche,
    setSelectedNiche,
    handleNicheChange,
    clearAllFilters,
    showFullBrief,
    briefCampaign,
    showApplication,
    applicationCampaign,
    applicationPitch,
    setApplicationPitch,
    handleOpenBrief,
    handleOpenApplication,
    closeBrief,
    closeApplication,
    dispatch,
    filteredCampaignsData,
  };
}
