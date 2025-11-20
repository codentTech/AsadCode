import { useState, useMemo, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllCampaigns,
  filterCampaigns,
  resetFilteredCampaigns,
  resetGetAllCampaigns,
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
  const { isLoading: isApplying } = useSelector((state) => state.campaigns.applyToCampaign);

  const [showFullBrief, setShowFullBrief] = useState(false);
  const [briefCampaign, setBriefCampaign] = useState(null);
  const [showApplication, setShowApplication] = useState(false);
  const [applicationCampaign, setApplicationCampaign] = useState(null);
  const [applicationPitch, setApplicationPitch] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [selectedNiche, setSelectedNiche] = useState("all");

  const campaignsData =
    filteredCampaignsData?.data !== undefined ? filteredCampaignsData.data : allCampaignsData?.data;
  const isLoading = filteredCampaignsLoading || allCampaignsLoading;

  const getCompensationType = (campaign) => {
    if (campaign.creator_fixed_price) return "Paid";
    if (campaign.commission_percentage) return "Commission";
    if (campaign.product_value) return "Gifted";
    return "Paid";
  };

  const getCompensationTypeKey = (campaign) => {
    if (campaign.creator_fixed_price) return "fixed";
    if (campaign.commission_percentage) return "commission";
    if (campaign.product_value) return "gifted";
    return "fixed";
  };

  const getCompensationAmount = (campaign) => {
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
  };

  const getCompensationValue = (campaign) => {
    if (campaign.creator_fixed_price) return campaign.creator_fixed_price;
    if (campaign.suggested_max) return campaign.suggested_max;
    if (campaign.product_value) return campaign.product_value;
    return 0;
  };

  const transformedCampaigns = useMemo(() => {
    if (!campaignsData?.campaigns) return [];

    return campaignsData.campaigns.map((campaign) => ({
      id: campaign.id,
      brandLogo: campaign.created_by?.brand_profile?.brand_logo_url || "🏢",
      brandName: campaign.created_by?.brand_profile?.brand_name || "Unknown Brand",
      title: campaign.campaign_title,
      type: campaign.campaign_type,
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
      campaign_type: campaign.campaign_type,
      compensation_type: getCompensationTypeKey(campaign),
      required_platforms: campaign.required_platforms || [],
      min_combined_followers: campaign.min_combined_followers,
      remote: campaign.remote,
      creator_country: campaign.creator_country,
      creator_city: campaign.creator_city,
      niches: campaign.niches || [],
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

  const sortedCampaigns = transformedCampaigns;

  useEffect(() => {
    if (!campaignsData) {
      dispatch(
        filterCampaigns({
          page: 1,
          limit: 10,
          sort: sortBy,
        })
      );
    }
  }, [dispatch, campaignsData, sortBy]);

  const handleNicheChange = useCallback(
    (niche) => {
      const nicheValue = typeof niche === "object" ? niche.value : niche;
      setSelectedNiche(nicheValue);

      if (nicheValue === "all") {
        dispatch(resetFilteredCampaigns());
        dispatch(getAllCampaigns({ page: 1, limit: 10, sort: sortBy }));
        return;
      }

      dispatch(
        filterCampaigns({
          page: 1,
          limit: 10,
          niches: nicheValue,
          sort: sortBy,
        })
      );
    },
    [dispatch, sortBy]
  );

  const handleSortChange = useCallback(
    (newSortBy) => {
      const sortValue = typeof newSortBy === "object" ? newSortBy.value : newSortBy;
      setSortBy(sortValue);

      dispatch(
        filterCampaigns({
          page: 1,
          limit: 10,
          niches: selectedNiche !== "all" ? selectedNiche : undefined,
          sort: sortValue,
        })
      );
    },
    [dispatch, selectedNiche]
  );

  const clearAllFilters = useCallback(() => {
    setSelectedNiche("all");
    setSortBy("latest");
    dispatch(resetFilteredCampaigns());
    dispatch(getAllCampaigns({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleOpenBrief = useCallback((campaign) => {
    setBriefCampaign(campaign);
    setShowFullBrief(true);
  }, []);

  const handleOpenApplication = useCallback((campaign) => {
    setApplicationCampaign(campaign);
    setShowApplication(true);
  }, []);

  const closeBrief = useCallback(() => {
    setShowFullBrief(false);
    setBriefCampaign(null);
  }, []);

  const closeApplication = useCallback(() => {
    setShowApplication(false);
    setApplicationCampaign(null);
    setApplicationPitch("");
  }, []);

  const handleApply = useCallback(() => {
    if (!applicationCampaign) return;

    dispatch(
      applyToCampaign({
        campaignId: applicationCampaign.id,
        pitch: applicationPitch.trim(),
      })
    )
      .unwrap()
      .then(() => {
        closeApplication();

        if (selectedNiche === "all") {
          dispatch(resetGetAllCampaigns());
          dispatch(resetFilteredCampaigns());
          dispatch(getAllCampaigns({ page: 1, limit: 10, sort: sortBy }));
        } else {
          dispatch(resetFilteredCampaigns());
          dispatch(resetGetAllCampaigns());
          dispatch(
            filterCampaigns({
              page: 1,
              limit: 10,
              sort: sortBy,
              niches: selectedNiche,
            })
          );
        }
      });
  }, [applicationCampaign, applicationPitch, closeApplication, dispatch, selectedNiche, sortBy]);

  return {
    campaigns: transformedCampaigns,
    sortedCampaigns,
    isLoading,
    sortBy,
    handleSortChange,
    selectedNiche,
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
    filteredCampaignsData,
  };
}
