import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  closeCampaignListing,
  extendApplicationDeadline,
  getAllBrandCampaigns,
  getAppliedCreators,
} from "@/provider/features/campaigns/campaigns.slice";
import { isCampaignListingOpen } from "@/common/utils/campaign-listing.util";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import { getBrandIndividualCollaborations } from "@/provider/features/invitation/invitation.slice";
import {
  getAllShortlists,
  addUserToShortlist,
} from "@/provider/features/shortlist/shortlist.slice";
import { avatar } from "@/common/constants/auth.constant";
import { formatCreatorLocation } from "@/common/utils/creator-location.util";
import { applyLivePipelineUrgency, resolveCreatorUrgency } from "@/common/utils/creator-urgency.util";
import { buildConnectedPlatformsFromCreatorUser } from "@/common/utils/creator-platforms.utils";
import useUrgencyTick from "@/common/hooks/use-urgency-tick.hook";
import { VISIBLE_APPLICATIONS_SORT_OPTIONS } from "@/common/constants/applications-sort.constant";
import {
  filterCreatorsByName,
  isInvitedCreatorRow,
  partitionPinnedInvitedCreators,
  sortApplicationsCreators,
} from "@/common/utils/campaign.utils";
import { setBrandCampaignMultiCreatorMode } from "@/provider/features/campaign-context/campaign-context.slice";
import {
  getTodayHtmlDateInputValue,
  isHtmlDateInputOnOrAfterToday,
  isValidHtmlDateInputValue,
  toHtmlDateInputValue,
} from "@/common/utils/date.utils";

function useCreatorSpendAnalysis({
  selectedCampaign,
  appliedCreatorsData,
  appliedCreatorsLoading,
  onCreatorSelect,
  filters,
  onCampaignSelect,
  onFilterChange,
  onFiltersReplace,
  onClearFilters,
  fetchIndividualCollaborations: fetchFromHook,
  onClearCreator,
  applicationsSubTab = "applications",
  displayCreators = [],
}) {
  const backendSortOptions = useMemo(() => VISIBLE_APPLICATIONS_SORT_OPTIONS, []);
  const dispatch = useDispatch();
  const urgencyTick = useUrgencyTick();
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
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [showCloseListingModal, setShowCloseListingModal] = useState(false);
  const [confirmCloseCampaignId, setConfirmCloseCampaignId] = useState(null);
  const closeListingSubmittedRef = useRef(false);
  const [showExtendDeadlineModal, setShowExtendDeadlineModal] = useState(false);
  const [extendDeadlineCampaignId, setExtendDeadlineCampaignId] = useState(null);
  const [extendDeadlineValue, setExtendDeadlineValue] = useState("");
  const [extendDeadlineError, setExtendDeadlineError] = useState("");
  const extendDeadlineSubmittedRef = useRef(false);
  const [creatorNameSearch, setCreatorNameSearch] = useState("");

  const { isLoading: isClosingListing, isSuccess: isCloseListingSuccess } = useSelector(
    (state) => state.campaigns.closeCampaignListing || {}
  );
  const { isLoading: isExtendingDeadline, isSuccess: isExtendDeadlineSuccess } = useSelector(
    (state) => state.campaigns.extendApplicationDeadline || {}
  );

  useEffect(() => {
    setCreatorNameSearch("");
  }, [selectedCampaign?.id, applicationsSubTab]);

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

  const sortedIndividualCollaborations = useMemo(() => {
    if (!individualCollaborations.length) return [];
    urgencyTick;
    const withLiveUrgency = individualCollaborations.map(applyLivePipelineUrgency);
    return sortApplicationsCreators(withLiveUrgency, filters?.sort || "urgency");
  }, [individualCollaborations, filters?.sort, urgencyTick]);

  const sortedAppliedCreators = useMemo(() => {
    const rows = Array.isArray(displayCreators) ? displayCreators : [];
    if (!rows.length) return [];
    urgencyTick;
    return sortApplicationsCreators(rows, filters?.sort || "newest");
  }, [displayCreators, filters?.sort, urgencyTick]);

  const { pinnedAppliedCreators, unpinnedAppliedCreators } = useMemo(() => {
    const filtered = filterCreatorsByName(sortedAppliedCreators, creatorNameSearch);
    const { pinned, unpinned } = partitionPinnedInvitedCreators(filtered);
    return {
      pinnedAppliedCreators: pinned,
      unpinnedAppliedCreators: unpinned,
    };
  }, [sortedAppliedCreators, creatorNameSearch]);

  const { pinnedIndividualCreators, unpinnedIndividualCreators } = useMemo(() => {
    const filtered = filterCreatorsByName(sortedIndividualCollaborations, creatorNameSearch);
    const { pinned, unpinned } = partitionPinnedInvitedCreators(filtered);
    return {
      pinnedIndividualCreators: pinned,
      unpinnedIndividualCreators: unpinned,
    };
  }, [sortedIndividualCollaborations, creatorNameSearch]);

  const handleCreatorNameSearchChange = useCallback((event) => {
    setCreatorNameSearch(event?.target?.value ?? "");
  }, []);

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
    const appliedDate = data.applied_at || data.created_at;
    const connectedPlatforms = buildConnectedPlatformsFromCreatorUser(creatorData);
    const urgency = resolveCreatorUrgency(data);

    return {
      id: creatorData?.id,
      name: `${creatorData?.first_name || ""} ${creatorData?.last_name || ""}`.trim(),
      profileImage: profile?.profile_photo_url || avatar,
      pipeline: data.pipeline,
      urgencyLabel: urgency.label,
      urgencyTier: urgency.tier,
      age: creatorData?.date_of_birth
        ? Math.floor(
            (new Date() - new Date(creatorData.date_of_birth)) / (365.25 * 24 * 60 * 60 * 1000)
          )
        : "N/A",
      location:
        formatCreatorLocation({
          city: creatorData?.city,
          country: creatorData?.country,
          state: creatorData?.state,
          stateShort: creatorData?.state_short,
        }) || "Location not specified",
      rating: parseFloat(profile?.rating) || 0,
      reviewCount: profile?.review_count || 0,
      followers: Object.values(connectedPlatforms.platformStats).reduce(
        (sum, stat) => sum + (stat.followers || 0),
        0,
      ),
      platforms: connectedPlatforms.platformList,
      platformStats: connectedPlatforms.platformStats,
      hasConnectedSocialAccounts: connectedPlatforms.hasConnectedSocialAccounts,
      mediaKitUrl: profile?.media_kit_url || null,
      portfolioImages: profile?.mini_profile_pictures || [],
      niches: profile?.categories || [],
      applicationMessage: (data.pitch || data.custom_message)?.trim() || "",
      isInvited: isInvitedCreatorRow(data),
      appliedDate: appliedDate ? new Date(appliedDate).toLocaleDateString() : "",
      sourceRow: data,
    };
  };

  const handleCampaignChange = (opt) => {
    const id = opt?.value;
    const campaign = campaignsData?.data?.find((c) => c.id === id);
    if (campaign) {
      const isIndividual = campaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;
      dispatch(setBrandCampaignMultiCreatorMode(!isIndividual));
    }
    if (onClearCreator) {
      onClearCreator();
    }
    if (onCampaignSelect && campaign) onCampaignSelect(campaign);
  };

  const sortValue = useMemo(() => {
    if (filters?.sort) {
      return {
        value: filters.sort,
        label:
          backendSortOptions.find((opt) => opt.value === filters.sort)?.label ||
          VISIBLE_APPLICATIONS_SORT_OPTIONS.find((opt) => opt.value === filters.sort)?.label,
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

  const handleFollowerRangeChange = (field, value) => {
    if (field === "minFollowers") {
      onFilterChange && onFilterChange("min_followers", value);
      return;
    }
    if (field === "minFollowersTo") {
      onFilterChange && onFilterChange("max_followers", value);
    }
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
    if (onFiltersReplace) {
      onFiltersReplace(updatedFilters);
      return;
    }
    if (onFilterChange) {
      Object.keys(updatedFilters).forEach((key) => {
        onFilterChange(key, updatedFilters[key]);
      });
    }
  };

  const handleAudienceFiltersChange = (updatedAudienceFilters) => {
    if (onFiltersReplace) {
      onFiltersReplace({ ...filters, ...updatedAudienceFilters });
      return;
    }
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

  const showCloseListingMenu = Boolean(
    isMultiCreator &&
      selectedCampaign?.id &&
      (selectedCampaign.collaboration_type || COLLABORATION_TYPE.MULTI_CREATOR) ===
        COLLABORATION_TYPE.MULTI_CREATOR
  );

  const handleMenuOpen = useCallback((event) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenuAnchorEl(null);
  }, []);

  const handleRequestCloseListing = useCallback(() => {
    if (!selectedCampaign?.id) return;
    setConfirmCloseCampaignId(selectedCampaign.id);
    setShowCloseListingModal(true);
    handleMenuClose();
  }, [selectedCampaign?.id, handleMenuClose]);

  const handleCancelCloseListing = useCallback(() => {
    closeListingSubmittedRef.current = false;
    setShowCloseListingModal(false);
    setConfirmCloseCampaignId(null);
  }, []);

  const handleConfirmCloseListing = useCallback(() => {
    if (!confirmCloseCampaignId) return;
    closeListingSubmittedRef.current = true;
    dispatch(closeCampaignListing(confirmCloseCampaignId));
  }, [confirmCloseCampaignId, dispatch]);

  const handleRequestExtendDeadline = useCallback(() => {
    if (!selectedCampaign?.id) return;
    const currentDeadline = toHtmlDateInputValue(selectedCampaign.application_deadline);
    const today = getTodayHtmlDateInputValue();
    setExtendDeadlineCampaignId(selectedCampaign.id);
    setExtendDeadlineValue(currentDeadline && currentDeadline >= today ? currentDeadline : today);
    setExtendDeadlineError("");
    setShowExtendDeadlineModal(true);
    handleMenuClose();
  }, [selectedCampaign?.id, selectedCampaign?.application_deadline, handleMenuClose]);

  const handleCancelExtendDeadline = useCallback(() => {
    extendDeadlineSubmittedRef.current = false;
    setShowExtendDeadlineModal(false);
    setExtendDeadlineCampaignId(null);
    setExtendDeadlineValue("");
    setExtendDeadlineError("");
  }, []);

  const handleExtendDeadlineChange = useCallback((event) => {
    setExtendDeadlineValue(event?.target?.value || "");
    setExtendDeadlineError("");
  }, []);

  const handleConfirmExtendDeadline = useCallback(() => {
    if (!extendDeadlineCampaignId) return;
    if (!isValidHtmlDateInputValue(extendDeadlineValue)) {
      setExtendDeadlineError("Enter a valid date");
      return;
    }
    if (!isHtmlDateInputOnOrAfterToday(extendDeadlineValue)) {
      setExtendDeadlineError("Deadline must be today or a future date");
      return;
    }
    extendDeadlineSubmittedRef.current = true;
    dispatch(
      extendApplicationDeadline({
        campaignId: extendDeadlineCampaignId,
        applicationDeadline: extendDeadlineValue,
      })
    );
  }, [extendDeadlineCampaignId, extendDeadlineValue, dispatch]);

  useEffect(() => {
    if (
      !showCloseListingModal ||
      isClosingListing ||
      !isCloseListingSuccess ||
      !closeListingSubmittedRef.current
    ) {
      return;
    }
    closeListingSubmittedRef.current = false;
    setShowCloseListingModal(false);
    const closedCampaignId = confirmCloseCampaignId;
    setConfirmCloseCampaignId(null);

    if (closedCampaignId && onCampaignSelect && campaignsData?.data) {
      const updatedCampaign = campaignsData.data.find(
        (campaign) => campaign.id === closedCampaignId
      );
      if (updatedCampaign) {
        onCampaignSelect(updatedCampaign);
      }
    }
  }, [
    showCloseListingModal,
    isClosingListing,
    isCloseListingSuccess,
    confirmCloseCampaignId,
    onCampaignSelect,
    campaignsData?.data,
  ]);

  useEffect(() => {
    if (
      !showExtendDeadlineModal ||
      isExtendingDeadline ||
      !isExtendDeadlineSuccess ||
      !extendDeadlineSubmittedRef.current
    ) {
      return;
    }
    extendDeadlineSubmittedRef.current = false;
    setShowExtendDeadlineModal(false);
    const extendedCampaignId = extendDeadlineCampaignId;
    setExtendDeadlineCampaignId(null);
    setExtendDeadlineValue("");
    setExtendDeadlineError("");

    if (extendedCampaignId && onCampaignSelect && campaignsData?.data) {
      const updatedCampaign = campaignsData.data.find(
        (campaign) => campaign.id === extendedCampaignId
      );
      if (updatedCampaign) {
        onCampaignSelect(updatedCampaign);
      }
    }
  }, [
    showExtendDeadlineModal,
    isExtendingDeadline,
    isExtendDeadlineSuccess,
    extendDeadlineCampaignId,
    onCampaignSelect,
    campaignsData?.data,
  ]);

  const campaignToClose = useMemo(() => {
    if (!confirmCloseCampaignId) return null;
    return (
      campaignsData?.data?.find((campaign) => campaign.id === confirmCloseCampaignId) ||
      (selectedCampaign?.id === confirmCloseCampaignId ? selectedCampaign : null)
    );
  }, [confirmCloseCampaignId, campaignsData?.data, selectedCampaign]);

  const campaignToExtendDeadline = useMemo(() => {
    if (!extendDeadlineCampaignId) return null;
    return (
      campaignsData?.data?.find((campaign) => campaign.id === extendDeadlineCampaignId) ||
      (selectedCampaign?.id === extendDeadlineCampaignId ? selectedCampaign : null)
    );
  }, [extendDeadlineCampaignId, campaignsData?.data, selectedCampaign]);

  const isSelectedCampaignListingOpen = isCampaignListingOpen(selectedCampaign);

  return {
    showFilterModal,
    setShowFilterModal,
    filterType,
    setFilterType,
    isMultiCreator,
    isSwitchingMode,
    individualCollaborations: sortedIndividualCollaborations,
    sortedAppliedCreators,
    pinnedAppliedCreators,
    unpinnedAppliedCreators,
    pinnedIndividualCreators,
    unpinnedIndividualCreators,
    creatorNameSearch,
    handleCreatorNameSearchChange,
    applicationsSubTab,
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
    handleFollowerRangeChange,
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
    showCloseListingMenu,
    isSelectedCampaignListingOpen,
    isClosingListing,
    menuAnchorEl,
    showCloseListingModal,
    campaignToClose,
    handleMenuOpen,
    handleMenuClose,
    handleRequestCloseListing,
    handleCancelCloseListing,
    handleConfirmCloseListing,
    showExtendDeadlineModal,
    campaignToExtendDeadline,
    extendDeadlineValue,
    extendDeadlineError,
    isExtendingDeadline,
    handleRequestExtendDeadline,
    handleCancelExtendDeadline,
    handleExtendDeadlineChange,
    handleConfirmExtendDeadline,
  };
}

export default useCreatorSpendAnalysis;
