import { useState, useMemo, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  filterCampaigns,
  applyToCampaign,
} from "@/provider/features/campaigns/campaigns.slice";
import { formatDate } from "@/common/utils/date.utils";
import {
  getCompensationType,
  getCompensationTypeKey,
  getCompensationAmount,
  getCompensationValue,
  formatCreatorFeeForDisplay,
} from "@/common/utils/campaign.utils";

export function useCampaignFeed() {
  const dispatch = useDispatch();
  const PAGE_LIMIT = 10;

  // ===== STATES =====
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
  const [campaignItems, setCampaignItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCampaigns, setTotalCampaigns] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreCampaigns, setHasMoreCampaigns] = useState(false);

  const isLoading = filteredCampaignsLoading && campaignItems.length === 0;

  const fetchCampaigns = useCallback(
    async ({ page = 1, append = false, niche = selectedNiche, sort = sortBy } = {}) => {
      const payload = {
        page,
        limit: PAGE_LIMIT,
        sort,
        niches: niche !== "all" ? niche : undefined,
      };

      const result = await dispatch(filterCampaigns(payload));
      if (!filterCampaigns.fulfilled.match(result)) return;

      const campaignsPayload = result.payload?.data || {};
      const fetchedCampaigns = Array.isArray(campaignsPayload?.campaigns)
        ? campaignsPayload.campaigns
        : [];
      const total = Number(campaignsPayload?.total) || 0;
      const hasReliableTotal = Number.isFinite(total) && total > 0;

      setTotalCampaigns(total);
      setCurrentPage(page);
      setCampaignItems((prev) => {
        const nextItems = append ? [...prev, ...fetchedCampaigns] : fetchedCampaigns;
        setHasMoreCampaigns(
          hasReliableTotal ? nextItems.length < total : fetchedCampaigns.length === PAGE_LIMIT
        );
        return nextItems;
      });
    },
    [dispatch, selectedNiche, sortBy]
  );

  useEffect(() => {
    fetchCampaigns({ page: 1, append: false });
  }, [fetchCampaigns]);

  // ===== COMPUTED VALUES =====
  const transformedCampaigns = useMemo(() => {
    if (!campaignItems?.length) return [];

    return campaignItems.map((campaign) => ({
      ...campaign,
      id: campaign.id,
      brandLogo: campaign.created_by?.brand_profile?.brand_logo_url,
      brandName: campaign.created_by?.brand_profile?.brand_name,
      brandId: campaign.created_by?.id,
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
      creator_fee: formatCreatorFeeForDisplay(campaign),
      suggested_min: campaign.suggested_min,
      suggested_max: campaign.suggested_max,
      creator_fixed_price: campaign.creator_fixed_price,
      product_value: campaign.product_value,
      commission_percentage: campaign.commission_percentage,
      platform_minimums: campaign.platform_minimums,
      hashtags: campaign.hashtags,
      style_guide: campaign.style_guide,
      questions: Array.isArray(campaign.questions) ? campaign.questions : [],
    }));
  }, [campaignItems]);

  const sortedCampaigns = transformedCampaigns;

  // ===== COMMON FUNCTIONS =====
  const handleNicheChange = useCallback(
    (niche) => {
      const nicheValue = typeof niche === "object" ? niche.value : niche;
      const nextNiche = nicheValue === selectedNiche ? "all" : nicheValue;
      setSelectedNiche(nextNiche);
      fetchCampaigns({ page: 1, append: false, niche: nextNiche, sort: sortBy });
    },
    [fetchCampaigns, selectedNiche, sortBy]
  );

  const handleSortChange = useCallback(
    (newSortBy) => {
      const sortValue = typeof newSortBy === "object" ? newSortBy.value : newSortBy;
      setSortBy(sortValue);
      fetchCampaigns({ page: 1, append: false, niche: selectedNiche, sort: sortValue });
    },
    [fetchCampaigns, selectedNiche]
  );

  const clearAllFilters = useCallback(() => {
    setSelectedNiche("all");
    setSortBy("latest");
    fetchCampaigns({ page: 1, append: false, niche: "all", sort: "latest" });
  }, [fetchCampaigns]);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMoreCampaigns) return;
    setIsLoadingMore(true);
    await fetchCampaigns({
      page: currentPage + 1,
      append: true,
      niche: selectedNiche,
      sort: sortBy,
    });
    setIsLoadingMore(false);
  }, [isLoadingMore, hasMoreCampaigns, fetchCampaigns, currentPage, selectedNiche, sortBy]);

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
      .then((result) => {
        if (!applyToCampaign.fulfilled.match(result)) return;
        closeApplication();
        fetchCampaigns({ page: 1, append: false, niche: selectedNiche, sort: sortBy });
      });
  }, [
    applicationCampaign,
    applicationPitch,
    closeApplication,
    dispatch,
    selectedNiche,
    sortBy,
    fetchCampaigns,
  ]);

  return {
    campaigns: transformedCampaigns,
    sortedCampaigns,
    isLoading,
    isLoadingMore,
    hasMoreCampaigns,
    totalCampaigns,
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
    handleLoadMore,
  };
}
