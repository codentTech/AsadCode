import { useState, useMemo, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllCampaigns,
  filterCampaigns,
  resetFilteredCampaigns,
  resetGetAllCampaigns,
  applyToCampaign,
} from "@/provider/features/campaigns/campaigns.slice";
import { formatDate } from "@/common/utils/date.utils";
import {
  getCompensationType,
  getCompensationTypeKey,
  getCompensationAmount,
  getCompensationValue,
} from "@/common/utils/campaign.utils";

export function useCampaignFeed() {
  const dispatch = useDispatch();

  // ===== STATES =====
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

  // ===== LIFECYCLE METHODS =====
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

  // ===== COMPUTED VALUES =====
  const transformedCampaigns = useMemo(() => {
    if (!campaignsData?.campaigns) return [];

    return campaignsData.campaigns.map((campaign) => ({
      ...campaign,
      id: campaign.id,
      brandLogo: campaign.created_by?.brand_profile?.brand_logo_url,
      brandName: campaign.created_by?.brand_profile?.brand_name,
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
      productImage: campaign.campaign_image,
      language: campaign.creator_language,
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
      application_deadline: formatDate(campaign.application_deadline),
      budget: campaign.budget,
      suggested_min: campaign.suggested_min,
      suggested_max: campaign.suggested_max,
      creator_fixed_price: campaign.creator_fixed_price,
      product_value: campaign.product_value,
      commission_percentage: campaign.commission_percentage,
      platform_minimums: campaign.platform_minimums,
      hashtags: campaign.hashtags,
      style_guide: campaign.style_guide,
      questions: campaign.questions,
    }));
  }, [campaignsData]);

  const sortedCampaigns = transformedCampaigns;

  // ===== COMMON FUNCTIONS =====
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
