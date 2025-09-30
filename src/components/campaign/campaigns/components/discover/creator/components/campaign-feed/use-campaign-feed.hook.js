import { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllCampaigns,
  filterCampaigns,
  resetFilteredCampaigns,
  applyToCampaign,
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

  // Get apply to campaign state
  const {
    isLoading: isApplying,
    isSuccess: applySuccess,
    isError: applyError,
  } = useSelector((state) => state.campaigns.applyToCampaign);

  // Determine which data to use (filtered or all campaigns)
  const campaignsData = filteredCampaignsData?.data || allCampaignsData?.data;
  const isLoading = filteredCampaignsLoading || allCampaignsLoading;
  const isFiltering = filteredCampaignsLoading;

  // Handle success/error notifications for apply to campaign
  useEffect(() => {
    if (applySuccess) {
      // Success notification is handled by the API interceptor
      console.log("Application submitted successfully!");
    }
  }, [applySuccess]);

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
      brandLogo: campaign.created_by?.brand_profile?.brand_logo_url || "🏢",
      brandName: campaign.created_by?.brand_profile?.brand_name || "Unknown Brand",
      title: campaign.campaign_title,
      type: campaign.campaign_type || "SPONSORED_POST",
      compensation: getCompensationType(campaign),
      compensationAmount: getCompensationAmount(campaign),
      compensationValue: getCompensationValue(campaign),
      deliverables: campaign.deliverables || [],
      niche: campaign.niches,
      location: campaign.remote ? "Remote" : "In-Person",
      locationMandatory: campaign.in_person_required,
      locationPreferred:
        !campaign.in_person_required && (campaign.creator_country || campaign.creator_city),
      productImage: campaign.campaign_image || "📦",
      language: campaign.creator_language || "English",
      followerMin: `${campaign.min_combined_followers || 0} Combined`,
      description:
        campaign.short_description || campaign.long_description || "No description available",
      brief: campaign.long_description || campaign.short_description || "No brief available",
      postedDate: campaign.created_at ? new Date(campaign.created_at) : new Date(),
      // Backend fields for filtering
      campaign_type: campaign.campaign_type,
      compensation_type: getCompensationTypeKey(campaign),
      required_platforms: campaign.required_platforms || [],
      min_combined_followers: campaign.min_combined_followers,
      remote: campaign.remote,
      creator_country: campaign.creator_country,
      creator_city: campaign.creator_city,
      niches: campaign.niches || [],
      // Additional fields for brief modal
      creator_gender: campaign.creator_gender,
      min_age: campaign.min_age,
      max_age: campaign.max_age,
      campaign_deadline: campaign.campaign_deadline,
      budget: campaign.budget,
      suggested_min: campaign.suggested_min,
      suggested_max: campaign.suggested_max,
      creator_fixed_price: campaign.creator_fixed_price,
      product_value: campaign.product_value,
      commission_percentage: campaign.commission_percentage,
      platform_minimums: campaign.platform_minimums,
      hashtags: campaign.hashtags,
      do_donts: campaign.do_donts,
      style_guide: campaign.style_guide,
      questions: campaign.questions,
    }));
  }, [campaignsData]);

  // Helper functions for compensation
  function getCompensationType(campaign) {
    if (campaign.creator_fixed_price) return "Paid";
    if (campaign.commission_percentage) return "Commission";
    if (campaign.product_value) return "Gifted";
    return "Paid";
  }

  function getCompensationTypeKey(campaign) {
    if (campaign.creator_fixed_price) return "fixed";
    if (campaign.commission_percentage) return "commission";
    if (campaign.product_value) return "gifted";
    return "fixed";
  }

  function getCompensationAmount(campaign) {
    if (campaign.creator_fixed_price) {
      return `$${campaign.creator_fixed_price}`;
    }
    if (campaign.commission_percentage) {
      return `${campaign.commission_percentage}% Commission`;
    }
    if (campaign.product_value) {
      return `Product ($${campaign.product_value} value)`;
    }
    if (campaign.suggested_min && campaign.suggested_max) {
      return `$${campaign.suggested_min} - $${campaign.suggested_max}`;
    }
    return "$0";
  }

  function getCompensationValue(campaign) {
    if (campaign.creator_fixed_price) return campaign.creator_fixed_price;
    if (campaign.suggested_max) return campaign.suggested_max;
    if (campaign.product_value) return campaign.product_value;
    return 0;
  }

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

  const handleApply = async () => {
    if (!applicationCampaign || !applicationPitch.trim()) {
      return;
    }

    try {
      const result = await dispatch(
        applyToCampaign({
          campaignId: applicationCampaign.id,
          pitch: applicationPitch.trim(),
        })
      ).unwrap();

      // Close modal and reset on success
      closeApplication();

      // Show success message (the API will handle the notification)
      console.log("Successfully applied to campaign:", result);
    } catch (error) {
      console.error("Failed to apply to campaign:", error);
      // Error notification is handled by the API interceptor
    }
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
    handleApply,
    isApplying,
    applySuccess,
    applyError,
    dispatch,
    filteredCampaignsData,
  };
}
