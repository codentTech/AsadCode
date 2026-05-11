import { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBrandCampaigns,
  getAppliedCreators,
} from "@/provider/features/campaigns/campaigns.slice";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import { getBrandIndividualCollaborations } from "@/provider/features/invitation/invitation.slice";
import {
  getAllShortlists,
  addUserToShortlist,
} from "@/provider/features/shortlist/shortlist.slice";
import { avatar } from "@/common/constants/auth.constant";
import { sortOptions } from "@/common/constants/auth.constant";
import { setBrandCampaignMultiCreatorMode } from "@/provider/features/campaign-context/campaign-context.slice";
import { normalizeActivePhylloPlatforms } from "@/common/utils/creator-platforms.utils";

function useCreatorSpendAnalysis({
  selectedCampaign,
  appliedCreatorsData,
  appliedCreatorsLoading,
  onCreatorSelect,
  filters,
  onCampaignSelect,
  onFilterChange,
  onClearFilters,
  fetchIndividualCollaborations: fetchFromHook,
  onClearCreator,
}) {
  const backendSortOptions = useMemo(
    () => sortOptions.filter((option) => option.value !== "most-expensive"),
    []
  );
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterType, setFilterType] = useState("creator");
  const [isSwitchingMode, setIsSwitchingMode] = useState(false);
  const hasAutoSelected = useRef(false);
  const hasFetchedIndividual = useRef(false);
  const hasRequestedBrandCampaignsRef = useRef(false);
  const hasRequestedShortlistsRef = useRef(false);

  const {
    data: campaignsApiData,
    isLoading: campaignsLoading,
    isSuccess: campaignsSuccess,
  } = useSelector((state) => state.campaigns.getAllBrandCampaigns || {});

  const isMultiCreator = useSelector(
    (state) => state.campaignContext?.isBrandCampaignMultiCreatorMode ?? true
  );

  const campaignsData = useMemo(
    () => ({ data: Array.isArray(campaignsApiData?.data) ? campaignsApiData.data : [] }),
    [campaignsApiData?.data]
  );

  const campaignOptions = useMemo(() => {
    const list = campaignsData?.data || [];
    return list.map((campaign) => ({
      value: campaign.id,
      label: campaign.campaign_title || "Untitled Campaign",
    }));
  }, [campaignsData?.data]);

  useEffect(() => {
    if (campaignsLoading || campaignsSuccess || hasRequestedBrandCampaignsRef.current) return;
    hasRequestedBrandCampaignsRef.current = true;
    dispatch(getAllBrandCampaigns());
  }, [dispatch, campaignsLoading, campaignsSuccess]);

  const { data: individualCollaborationsData, isLoading: individualCollaborationsLoading } =
    useSelector((state) => state.invitation.getBrandIndividualCollaborations || {});

  const { isSuccess: reinstateInvitationSuccess } = useSelector(
    (state) => state.invitation.reinstateInvitation || {}
  );

  const shortlistState = useSelector((state) => state.shortlist || {});
  const shortlistsLoading = shortlistState?.getAllShortlists?.isLoading;

  const [showSaveToShortlistModal, setShowSaveToShortlistModal] = useState(false);
  const [creatorToSave, setCreatorToSave] = useState(null);

  // Fetch shortlists once unless already loaded
  useEffect(() => {
    const shortlistsSuccess = shortlistState?.getAllShortlists?.isSuccess;
    if (shortlistsLoading || shortlistsSuccess || hasRequestedShortlistsRef.current) return;
    hasRequestedShortlistsRef.current = true;
    dispatch(getAllShortlists());
  }, [dispatch, shortlistsLoading, shortlistState?.getAllShortlists?.isSuccess]);

  const individualCollaborations = (individualCollaborationsData?.data || []).filter(
    (invitation) => invitation.status === "PENDING"
  );

  const filteredCampaignOptions = useMemo(() => {
    return campaignOptions.filter((option) => {
      if (!campaignsData?.data) return false;
      const campaign = campaignsData.data.find((c) => c.id === option.value);
      if (!campaign) return false;
      const collaborationType = campaign.collaboration_type || COLLABORATION_TYPE.MULTI_CREATOR;
      return isMultiCreator
        ? collaborationType === COLLABORATION_TYPE.MULTI_CREATOR
        : collaborationType === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;
    });
  }, [campaignOptions, campaignsData?.data, isMultiCreator]);

  const isSelectedCampaignValid =
    selectedCampaign &&
    (isMultiCreator
      ? (selectedCampaign.collaboration_type || COLLABORATION_TYPE.MULTI_CREATOR) ===
        COLLABORATION_TYPE.MULTI_CREATOR
      : selectedCampaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR);

  const selectedCampaignValue = useMemo(() => {
    if (isSelectedCampaignValid && selectedCampaign) {
      return { value: selectedCampaign.id, label: selectedCampaign.campaign_title };
    }
    return null;
  }, [isSelectedCampaignValid, selectedCampaign?.id, selectedCampaign?.campaign_title]);

  const fetchIndividualCollaborations = async () => {
    hasFetchedIndividual.current = true;
    const result = await dispatch(getBrandIndividualCollaborations());

    if (result.payload?.success && result.payload?.data?.length > 0) {
      const collaborations = result.payload.data.filter(
        (invitation) => invitation.status === "PENDING"
      );
      if (collaborations.length > 0) {
        const currentIsIndividual =
          selectedCampaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;
        if (!selectedCampaign || !currentIsIndividual) {
          const firstCollaboration = collaborations[0];
          const syntheticCampaign = {
            id: firstCollaboration.campaign_id || firstCollaboration.campaign?.id,
            collaboration_type: COLLABORATION_TYPE.INDIVIDUAL_CREATOR,
            campaign_title: "Individual Collaboration",
            brand: firstCollaboration.brand,
            created_by: firstCollaboration.brand,
            invitation: firstCollaboration,
          };
          if (onCampaignSelect && syntheticCampaign.id) {
            onCampaignSelect(syntheticCampaign);
          }
        }
      }
    }
    setIsSwitchingMode(false);
  };

  const handleToggleChange = (eventOrValue) => {
    const newIsMultiCreator =
      typeof eventOrValue === "boolean"
        ? eventOrValue
        : (eventOrValue?.target?.checked ?? !isMultiCreator);
    dispatch(setBrandCampaignMultiCreatorMode(newIsMultiCreator));
    setIsSwitchingMode(true);
    hasAutoSelected.current = false;

    if (onClearCreator) {
      onClearCreator();
    }

    if (newIsMultiCreator) {
      hasFetchedIndividual.current = false;
      setIsSwitchingMode(false);
    }

    if (selectedCampaign) {
      const campaignType = selectedCampaign.collaboration_type || COLLABORATION_TYPE.MULTI_CREATOR;
      const shouldReset =
        (newIsMultiCreator && campaignType !== COLLABORATION_TYPE.MULTI_CREATOR) ||
        (!newIsMultiCreator && campaignType !== COLLABORATION_TYPE.INDIVIDUAL_CREATOR);

      if (shouldReset) {
        if (onCampaignSelect) {
          onCampaignSelect(null);
        }
      }
    } else if (!newIsMultiCreator) {
      if (onCampaignSelect) {
        onCampaignSelect(null);
      }
      hasFetchedIndividual.current = false;
      fetchIndividualCollaborations();
    }
  };

  useEffect(() => {
    if (isMultiCreator) {
      hasFetchedIndividual.current = false;
      if (
        !selectedCampaign &&
        !campaignsLoading &&
        filteredCampaignOptions.length > 0 &&
        campaignsData?.data &&
        typeof onCampaignSelect === "function"
      ) {
        const firstCampaign = campaignsData.data.find(
          (c) => c.id === filteredCampaignOptions[0]?.value
        );
        if (firstCampaign) {
          onCampaignSelect(firstCampaign);
          hasAutoSelected.current = true;
        }
      }
    } else {
      const isSelectedIndividual =
        selectedCampaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;
      if (!hasFetchedIndividual.current && !isSelectedIndividual) {
        fetchIndividualCollaborations();
      }
    }
  }, [
    isMultiCreator,
    selectedCampaign?.id,
    filteredCampaignOptions.length,
    campaignsData?.data,
    campaignsLoading,
  ]);

  useEffect(() => {
    if (reinstateInvitationSuccess && !isMultiCreator) {
      hasFetchedIndividual.current = false;
      fetchIndividualCollaborations();
    }
  }, [reinstateInvitationSuccess, isMultiCreator]);

  const handleCreatorPreview = (creator) => {
    if (onCreatorSelect) {
      onCreatorSelect(creator);
    }
  };

  const handleSaveToShortlist = (creator) => {
    setCreatorToSave(creator);
    setShowSaveToShortlistModal(true);
  };

  const confirmSaveToShortlist = async (shortlistId) => {
    if (creatorToSave) {
      const creatorId = creatorToSave.id || creatorToSave.creator?.id;
      if (creatorId) {
        await dispatch(
          addUserToShortlist({
            shortlistId,
            userId: creatorId,
          })
        );
        // Refetch shortlists to get updated counts
        await dispatch(getAllShortlists());
      }
    }
    setShowSaveToShortlistModal(false);
    setCreatorToSave(null);
  };

  const mapCreatorForCard = (data) => {
    const creatorData = data.creator;
    const profile = creatorData?.creator_profile;
    const socialAccounts = creatorData?.social_accounts || [];
    const appliedDate = data.applied_at || data.created_at;
    const { platforms: activePlatforms, platformStats: platformStatsFromAccounts, totalFollowers: totalFromAccounts } =
      normalizeActivePhylloPlatforms(socialAccounts);

    const platforms =
      activePlatforms.length > 0
        ? activePlatforms
        : (profile?.social_platforms || [])
            .map((p) => (typeof p === "object" ? p.platform : p))
            .filter(Boolean)
            .map((p) => String(p).toLowerCase());

    const platformStats =
      Object.keys(platformStatsFromAccounts).length > 0
        ? platformStatsFromAccounts
        : platforms.reduce((acc, platformName) => {
            if (platformName) acc[platformName] = { followers: 0 };
            return acc;
          }, {});

    const followers = totalFromAccounts > 0 ? totalFromAccounts : profile?.total_followers || 0;

    return {
      id: creatorData?.id,
      name: `${creatorData?.first_name || ""} ${creatorData?.last_name || ""}`.trim(),
      profileImage: profile?.profile_photo_url || avatar,
      age: creatorData?.date_of_birth
        ? Math.floor(
            (new Date() - new Date(creatorData.date_of_birth)) / (365.25 * 24 * 60 * 60 * 1000)
          )
        : "N/A",
      location:
        `${creatorData?.city || ""} ${creatorData?.country || ""}`.trim() ||
        "Location not specified",
      rating: parseFloat(profile?.rating) || 0,
      reviewCount: profile?.review_count || 0,
      followers,
      platforms,
      platformStats,
      portfolioImages: profile?.mini_profile_pictures || [],
      niches: profile?.categories || [],
      tagline: data.custom_message || data.pitch || profile?.bio || "",
      appliedDate: appliedDate ? new Date(appliedDate).toLocaleDateString() : "",
    };
  };

  const handleCampaignChange = (opt) => {
    const id = opt?.value;
    const campaign = campaignsData?.data?.find((c) => c.id === id);
    if (campaign) {
      const isIndividual = campaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;
      dispatch(setBrandCampaignMultiCreatorMode(!isIndividual));
    }
    if (onCampaignSelect && campaign) onCampaignSelect(campaign);
  };

  const sortValue = useMemo(() => {
    if (filters?.sort) {
      return {
        value: filters.sort,
        label: backendSortOptions.find((opt) => opt.value === filters.sort)?.label,
      };
    }
    return null;
  }, [filters?.sort, backendSortOptions]);

  const handleSortChange = (option) => {
    const nextSort = option?.value || "newest";

    if (!selectedCampaign && filteredCampaignOptions.length > 0 && campaignsData?.data) {
      const firstCampaign = campaignsData.data.find(
        (campaign) => campaign.id === filteredCampaignOptions[0]?.value
      );
      if (firstCampaign && onCampaignSelect) {
        onCampaignSelect(firstCampaign);
      }
    }

    if (onFilterChange) {
      onFilterChange("sort", nextSort);
    }

    if (
      selectedCampaign?.id &&
      selectedCampaign.collaboration_type !== COLLABORATION_TYPE.INDIVIDUAL_CREATOR
    ) {
      dispatch(
        getAppliedCreators({
          campaignId: selectedCampaign.id,
          filters: { ...filters, sort: nextSort },
        })
      );
    } else if (selectedCampaign?.id && fetchFromHook) {
      fetchFromHook();
    }
  };

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleNicheToggle = (niche) => {
    const current = filters?.niches || [];
    const next = current.includes(niche) ? current.filter((n) => n !== niche) : [...current, niche];
    onFilterChange && onFilterChange("niches", next);
  };

  const handlePlatformToggle = (platform) => {
    const current = filters?.platforms || [];
    const next = current.includes(platform)
      ? current.filter((p) => p !== platform)
      : [...current, platform];
    onFilterChange && onFilterChange("platforms", next);
  };

  const handleFollowerSelect = (minFollowers) => {
    onFilterChange && onFilterChange("min_followers", minFollowers);
  };

  const handleGenderSelect = (gender) => {
    onFilterChange && onFilterChange("gender", gender);
  };

  const handleAgeSelect = (ageRange) => {
    onFilterChange && onFilterChange("ageRange", ageRange);
  };

  const handleLanguageToggle = (language) => {
    const current = filters?.languages || [];
    const next = current.includes(language)
      ? current.filter((l) => l !== language)
      : [...current, language];
    onFilterChange && onFilterChange("languages", next);
  };

  const handleAudienceGenderSelect = (audienceGender) => {
    onFilterChange && onFilterChange("audienceGender", audienceGender);
  };

  const handleAudienceAgeToggle = (ageRange) => {
    const current = filters?.audienceAgeRanges || [];
    const next = current.includes(ageRange)
      ? current.filter((a) => a !== ageRange)
      : [...current, ageRange];
    onFilterChange && onFilterChange("audienceAgeRanges", next);
  };

  const handleAudienceCountryToggle = (country) => {
    const current = filters?.audienceCountries || [];
    const next = current.includes(country)
      ? current.filter((c) => c !== country)
      : [...current, country];
    onFilterChange && onFilterChange("audienceCountries", next);
  };

  const handleFiltersChange = (updatedFilters) => {
    if (onFilterChange) {
      Object.keys(updatedFilters).forEach((key) => {
        onFilterChange(key, updatedFilters[key]);
      });
    }
  };

  const handleAudienceFiltersChange = (updatedAudienceFilters) => {
    if (onFilterChange) {
      Object.keys(updatedAudienceFilters).forEach((key) => {
        onFilterChange(key, updatedAudienceFilters[key]);
      });
    }
  };

  const handleClearAllFilters = () => {
    onClearFilters && onClearFilters();
  };

  const handleApplyFilters = () => {
    setShowFilterModal(false);
  };

  return {
    open,
    handleOpenModal,
    handleCloseModal,
    showFilterModal,
    setShowFilterModal,
    filterType,
    setFilterType,
    isMultiCreator,
    isSwitchingMode,
    individualCollaborations,
    individualCollaborationsLoading,
    campaignsData,
    campaignsLoading,
    filteredCampaignOptions,
    selectedCampaignValue,
    handleToggleChange,
    handleCreatorPreview,
    handleSaveToShortlist,
    confirmSaveToShortlist,
    showSaveToShortlistModal,
    setShowSaveToShortlistModal,
    shortlists: shortlistState.getAllShortlists?.data || [],
    mapCreatorForCard,
    handleCampaignChange,
    handleSortChange,
    sortValue,
    sortOptions: backendSortOptions,
    handleNicheToggle,
    handlePlatformToggle,
    handleFollowerSelect,
    handleGenderSelect,
    handleAgeSelect,
    handleLanguageToggle,
    handleAudienceGenderSelect,
    handleAudienceAgeToggle,
    handleAudienceCountryToggle,
    handleFiltersChange,
    handleAudienceFiltersChange,
    handleClearAllFilters,
    handleApplyFilters,
  };
}

export default useCreatorSpendAnalysis;
