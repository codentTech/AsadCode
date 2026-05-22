import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createContract,
  getAppliedCreators,
  rejectCreator,
  sendContract,
  getAllBrandCampaigns,
} from "@/provider/features/campaigns/campaigns.slice";
import {
  getBrandIndividualCollaborations,
  rejectInvitation,
} from "@/provider/features/invitation/invitation.slice";
import { setSelectedCampaign as setSelectedCampaignContext } from "@/provider/features/campaign-context/campaign-context.slice";
import useMessageThread from "@/components/campaign-refactored/shared/message-thread-modal/use-message-thread.hook";
import { avatar } from "@/common/constants/auth.constant";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import { getUser } from "@/common/utils/users.util";
import { isMobileViewport } from "@/common/utils/viewport.utils";

const normalizeAppliedCreatorsFilters = (filters = {}) => {
  const normalized = { ...filters };

  // UI aliases -> backend dto keys
  if (normalized.minFollowers !== undefined && normalized.min_followers === undefined) {
    normalized.min_followers = normalized.minFollowers;
  }
  if (normalized.maxFollowers !== undefined && normalized.max_followers === undefined) {
    normalized.max_followers = normalized.maxFollowers;
  }
  if (normalized.minRating !== undefined && normalized.min_rating === undefined) {
    normalized.min_rating = normalized.minRating;
  }
  if (normalized.maxRating !== undefined && normalized.max_rating === undefined) {
    normalized.max_rating = normalized.maxRating;
  }

  // Remove UI-only keys not accepted by backend dto
  delete normalized.minFollowers;
  delete normalized.maxFollowers;
  delete normalized.minRating;
  delete normalized.maxRating;
  if (normalized.state_short != null && normalized.stateShort === undefined) {
    normalized.stateShort = normalized.state_short;
  }
  delete normalized.state_short;

  delete normalized.country_code;
  delete normalized.city_country_code;
  delete normalized.audienceCountryCode;
  delete normalized.audienceCityCountryCode;

  if (Array.isArray(normalized.statuses) && normalized.statuses.length > 0) {
    normalized.status = normalized.statuses.join(",");
    delete normalized.statuses;
  }

  return normalized;
};

const APPLICATIONS_LIST_STATUSES = ["PENDING", "NEGOTIATIONS"];

function useBrandApplications() {
  const dispatch = useDispatch();
  const hasRestoredFromContext = useRef(false);
  const lastRestoredCampaignIdRef = useRef(null);
  const hasRequestedBrandCampaignsRef = useRef(false);

  const { selectedCampaignId } = useSelector((state) => state.campaignContext || {});
  const {
    data: campaignsData,
    isLoading: campaignsLoading,
    isSuccess: campaignsSuccess,
  } = useSelector((state) => state.campaigns.getAllBrandCampaigns || {});

  const {
    data: appliedCreatorsData,
    isLoading: appliedCreatorsLoading,
    isSuccess: appliedCreatorsSuccess,
  } = useSelector((state) => state.campaigns.getAppliedCreators || {});
  const { isSuccess: rejectSuccess } = useSelector((state) => state.campaigns.rejectCreator || {});
  const { data: individualCollaborationsData, isLoading: individualCollaborationsLoading } =
    useSelector((state) => state.invitation.getBrandIndividualCollaborations || {});
  const { isSuccess: rejectInvitationSuccess } = useSelector(
    (state) => state.invitation.rejectInvitation || {}
  );

  const { isSuccess: reinstateInvitationSuccess } = useSelector(
    (state) => state.invitation.reinstateInvitation || {}
  );
  const { messages: allMessages } = useSelector((state) => state.chat);
  const {
    isLoading: createContractLoading,
    isSuccess: createContractSuccess,
    isError: createContractError,
  } = useSelector((state) => state.campaigns.createContract || {});
  const {
    isLoading: sendContractLoading,
    isSuccess: sendContractSuccess,
    isError: sendContractError,
  } = useSelector((state) => state.campaigns.sendContract || {});

  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [mobilePane, setMobilePane] = useState("list");
  const autoSelectedForCampaignRef = useRef(null);
  const refreshTimeoutRef = useRef(null);
  const [hireModalOpen, setHireModalOpen] = useState(false);
  const [hireCreatorData, setHireCreatorData] = useState(null);
  const [selectedCampaignForHire, setSelectedCampaignForHire] = useState(null);
  const [showRejectConfirmation, setShowRejectConfirmation] = useState(false);

  const individualCollaborations = (individualCollaborationsData?.data || []).filter(
    (invitation) => invitation.status === "PENDING"
  );
  const [filters, setFilters] = useState({
    min_followers: "",
    max_followers: "",
    min_rating: "",
    max_rating: "",
    countries: [],
    city: "",
    state: "",
    state_short: "",
    niches: [],
    platforms: [],
    status: APPLICATIONS_LIST_STATUSES.join(","),
    excludeStatus: "HIRED",
    sort: "newest",
  });

  const fetchIndividualCollaborations = useCallback(async () => {
    dispatch(getBrandIndividualCollaborations());
  }, [dispatch]);

  useEffect(() => {
    if (campaignsLoading || campaignsSuccess || hasRequestedBrandCampaignsRef.current) return;
    hasRequestedBrandCampaignsRef.current = true;
    dispatch(getAllBrandCampaigns());
  }, [dispatch, campaignsLoading, campaignsSuccess]);

  useEffect(() => {
    if (selectedCampaignId !== lastRestoredCampaignIdRef.current) {
      hasRestoredFromContext.current = false;
    }
  }, [selectedCampaignId]);

  useEffect(() => {
    if (
      campaignsSuccess &&
      campaignsData?.data &&
      selectedCampaignId &&
      !hasRestoredFromContext.current
    ) {
      const campaigns = Array.isArray(campaignsData.data) ? campaignsData.data : [];
      const restoredCampaign = campaigns.find((c) => c.id === selectedCampaignId);
      if (restoredCampaign) {
        setSelectedCampaign(restoredCampaign);
        hasRestoredFromContext.current = true;
        lastRestoredCampaignIdRef.current = selectedCampaignId;

        if (restoredCampaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR) {
          fetchIndividualCollaborations();
        } else {
          dispatch(
            getAppliedCreators({
              campaignId: restoredCampaign.id,
              filters: filters,
            })
          );
        }
      }
    } else if (!selectedCampaignId) {
      lastRestoredCampaignIdRef.current = null;
      hasRestoredFromContext.current = false;
    }
  }, [
    campaignsSuccess,
    campaignsData,
    selectedCampaignId,
    dispatch,
    filters,
    fetchIndividualCollaborations,
  ]);

  const handleCampaignSelect = (campaign) => {
    setSelectedCreator(null);
    autoSelectedForCampaignRef.current = null;
    setSelectedCampaign(campaign);

    if (campaign) {
      dispatch(
        setSelectedCampaignContext({
          campaignId: campaign.id,
          collaborationType: campaign.collaboration_type || null,
        })
      );
    } else {
      dispatch(setSelectedCampaignContext({ campaignId: null, collaborationType: null }));
    }

    if (campaign) {
      if (campaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR) {
        fetchIndividualCollaborations();
      } else {
        dispatch(
          getAppliedCreators({
            campaignId: campaign.id,
            filters: filters,
          })
        );
      }
    }
  };

  useEffect(() => {
    const creators = appliedCreatorsData?.data;
    if (
      selectedCampaign &&
      selectedCampaign.collaboration_type !== COLLABORATION_TYPE.INDIVIDUAL_CREATOR &&
      appliedCreatorsSuccess &&
      Array.isArray(creators) &&
      creators.length > 0 &&
      !selectedCreator &&
      autoSelectedForCampaignRef.current !== selectedCampaign.id
    ) {
      setSelectedCreator(creators[0]);
      autoSelectedForCampaignRef.current = selectedCampaign.id;
    }
  }, [
    appliedCreatorsSuccess,
    appliedCreatorsData,
    selectedCampaign,
    selectedCreator,
    appliedCreatorsData?.data?.length,
    filters?.status,
  ]);

  useEffect(() => {
    if (
      selectedCampaign &&
      selectedCampaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR &&
      !individualCollaborationsLoading &&
      individualCollaborations.length > 0 &&
      !selectedCreator &&
      autoSelectedForCampaignRef.current !== selectedCampaign.id
    ) {
      const matchingCollaborations = individualCollaborations.filter(
        (invitation) => (invitation.campaign_id || invitation.campaign?.id) === selectedCampaign.id
      );

      const firstCreator = (
        matchingCollaborations.length > 0 ? matchingCollaborations : individualCollaborations
      ).map((invitation) => ({
        ...invitation,
        creator: invitation.creator,
        campaign_id: invitation.campaign_id || invitation.campaign?.id || null,
        campaign: invitation.campaign,
        applied_at: invitation.created_at,
        status: invitation.status || "PENDING",
      }))[0];

      if (firstCreator && firstCreator.creator) {
        setSelectedCreator(firstCreator);
        autoSelectedForCampaignRef.current = selectedCampaign.id;
      }
    }
  }, [
    selectedCampaign?.id,
    selectedCampaign?.collaboration_type,
    individualCollaborations.length,
    individualCollaborationsLoading,
    selectedCreator,
  ]);

  const handleCreatorSelect = useCallback((creator) => {
    setSelectedCreator(creator);
  }, []);

  const handleClearCreator = useCallback(() => {
    setSelectedCreator(null);
  }, []);

  useEffect(() => {
    if (!selectedCreator) {
      setMobilePane("list");
    }
  }, [selectedCreator]);

  const handleCreatorSelectWithPane = useCallback(
    (creator) => {
      handleCreatorSelect(creator);
      if (isMobileViewport()) {
        setMobilePane("detail");
      }
    },
    [handleCreatorSelect]
  );

  const backToApplicationList = useCallback(() => {
    handleClearCreator();
    setMobilePane("list");
  }, [handleClearCreator]);

  const handleHireClick = () => {
    if (!selectedCreator || !selectedCampaign) return;
    setHireCreatorData(selectedCreator);
    setSelectedCampaignForHire(selectedCampaign);
    setHireModalOpen(true);
  };

  const handleSendOffer = async (contractData) => {
    const isIndividual =
      selectedCampaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR ||
      (!selectedCampaign && selectedCreator?.campaign_id);

    const campaignId = isIndividual
      ? selectedCreator?.campaign_id || selectedCreator?.campaign?.id
      : selectedCampaign?.id;

    const contractPayload = {
      ...(campaignId ? { campaignId } : {}),
      creatorId: selectedCreator.creator?.id || selectedCreator.id,
      brandId:
        selectedCampaign?.created_by?.id ||
        selectedCampaign?.brand?.id ||
        selectedCreator?.brand?.id,
      startDate: contractData.startDate,
      completionDeadline: contractData.completionDeadline,
      firstDraftDeadline: contractData.firstDraftDeadline || undefined,
      contentFormat: contractData.contentFormat,
      revisionsLimit: contractData.revisionsLimit,
      compensationType: contractData.compensationType?.toUpperCase(),
      totalCompensation: contractData.totalCompensation
        ? parseFloat(contractData.totalCompensation)
        : undefined,
      productPrice: contractData.productPrice ? parseFloat(contractData.productPrice) : undefined,
      usageRights:
        contractData.usageRights === "no_usage"
          ? "no_usage"
          : contractData.usageRights === "permanent"
            ? "permanent"
            : `${contractData.usageRights}_months`,
      exclusivityClause:
        contractData.exclusivityClause === "none"
          ? "none"
          : `${contractData.exclusivityClause}_months`,
      hashtags: contractData.hashtags,
      mentions: contractData.mentions,
      inPersonRequired: contractData.inPersonRequired,
      eligibleCountry: contractData.eligibleCountry,
      eligibleCity: contractData.eligibleCity,
      ageRange: contractData.ageRange,
      gender: contractData.gender,
      language: contractData.language,
      ...(isIndividual && contractData.campaignType
        ? { campaignType: contractData.campaignType }
        : {}),
      ...(isIndividual && contractData.contentGuidelines
        ? { contentGuidelines: contractData.contentGuidelines }
        : {}),
    };

    const createResult = await dispatch(createContract(contractPayload)).unwrap();
    if (createResult.success) {
      await dispatch(sendContract(createResult.data.id)).unwrap();
      setHireModalOpen(false);
      setHireCreatorData(null);
      setSelectedCampaignForHire(null);
    }
  };

  const handleRejectClick = () => setShowRejectConfirmation(true);

  const handleConfirmReject = async () => {
    if (!selectedCampaign || !selectedCreator) {
      setShowRejectConfirmation(false);
      return;
    }

    const isIndividual =
      selectedCampaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;

    if (isIndividual) {
      const invitationId = selectedCreator.id;
      if (!invitationId) {
        setShowRejectConfirmation(false);
        return;
      }
      await dispatch(rejectInvitation(invitationId));
      setSelectedCreator(null);
      fetchIndividualCollaborations();
    } else {
      const creatorUserId = selectedCreator.creator?.id || selectedCreator.id;
      dispatch(rejectCreator({ campaignId: selectedCampaign.id, creatorId: creatorUserId }));
    }
    setShowRejectConfirmation(false);
  };

  const refetchAppliedCreatorsWithFilters = useCallback(
    (nextFilters) => {
      if (
        selectedCampaign &&
        selectedCampaign.collaboration_type !== COLLABORATION_TYPE.INDIVIDUAL_CREATOR
      ) {
        dispatch(
          getAppliedCreators({
            campaignId: selectedCampaign.id,
            filters: nextFilters,
          })
        );
      }
    },
    [dispatch, selectedCampaign]
  );

  const handleFilterChange = (filterName, value) => {
    const newFilters = normalizeAppliedCreatorsFilters({ ...filters, [filterName]: value });
    setFilters(newFilters);
    refetchAppliedCreatorsWithFilters(newFilters);
  };

  const handleFiltersReplace = useCallback(
    (nextFilters) => {
      const newFilters = normalizeAppliedCreatorsFilters(nextFilters);
      setFilters(newFilters);
      refetchAppliedCreatorsWithFilters(newFilters);
    },
    [refetchAppliedCreatorsWithFilters]
  );

  const clearFilters = () => {
    const clearedFilters = normalizeAppliedCreatorsFilters({
      min_followers: "",
      max_followers: "",
      min_rating: "",
      max_rating: "",
      countries: [],
      city: "",
      state: "",
      state_short: "",
      niches: [],
      platforms: [],
      status: APPLICATIONS_LIST_STATUSES.join(","),
      excludeStatus: "HIRED",
      sort: "newest",
    });
    setFilters(clearedFilters);
    if (
      selectedCampaign &&
      selectedCampaign.collaboration_type !== COLLABORATION_TYPE.INDIVIDUAL_CREATOR
    ) {
      dispatch(
        getAppliedCreators({
          campaignId: selectedCampaign.id,
          filters: clearedFilters,
        })
      );
    }
  };

  useEffect(() => {
    if (rejectSuccess && selectedCampaign) {
      autoSelectedForCampaignRef.current = null;
      setSelectedCreator(null);

      if (selectedCampaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR) {
        fetchIndividualCollaborations();
      } else {
        dispatch(
          getAppliedCreators({
            campaignId: selectedCampaign.id,
            filters: filters,
          })
        );
      }
    }
  }, [rejectSuccess, selectedCampaign, dispatch, filters, fetchIndividualCollaborations]);

  useEffect(() => {
    if (createContractSuccess && sendContractSuccess) {
      autoSelectedForCampaignRef.current = null;
      setSelectedCreator(null);

      if (selectedCampaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR) {
        fetchIndividualCollaborations();
      } else if (selectedCampaign) {
        dispatch(
          getAppliedCreators({
            campaignId: selectedCampaign.id,
            filters: filters,
          })
        );
      }
    }
  }, [
    createContractSuccess,
    sendContractSuccess,
    selectedCampaign,
    dispatch,
    filters,
    fetchIndividualCollaborations,
  ]);

  useEffect(() => {
    if (rejectInvitationSuccess && selectedCampaign) {
      if (selectedCampaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR) {
        autoSelectedForCampaignRef.current = null;
        setSelectedCreator(null);
        fetchIndividualCollaborations();
      }
    }
  }, [rejectInvitationSuccess, selectedCampaign, fetchIndividualCollaborations]);

  useEffect(() => {
    if (
      reinstateInvitationSuccess &&
      selectedCampaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR
    ) {
      autoSelectedForCampaignRef.current = null;
      setSelectedCreator(null);
      fetchIndividualCollaborations();
    }
  }, [reinstateInvitationSuccess, selectedCampaign, fetchIndividualCollaborations]);

  const getCampaignId = () => {
    if (selectedCampaign?.id) {
      return selectedCampaign.id;
    }
    if (selectedCreator?.campaign_id) {
      return selectedCreator.campaign_id;
    }
    if (selectedCreator?.campaign?.id) {
      return selectedCreator.campaign.id;
    }
    return null;
  };

  const getCreatorId = () => {
    return selectedCreator?.creator?.id || selectedCreator?.id || null;
  };

  const isSelectedCreatorForCurrentCampaign = useCallback(() => {
    if (!selectedCreator || !selectedCampaign) return false;

    const creatorCampaignId =
      selectedCreator.campaign_id || selectedCreator.campaign?.id || null;
    const isIndividual =
      selectedCampaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;

    if (isIndividual) {
      return (
        Boolean(selectedCreator.creator) &&
        (!creatorCampaignId || creatorCampaignId === selectedCampaign.id)
      );
    }

    if (creatorCampaignId && creatorCampaignId !== selectedCampaign.id) {
      return false;
    }

    return !selectedCreator.creator || Boolean(selectedCreator.creator);
  }, [selectedCreator, selectedCampaign]);

  useEffect(() => {
    if (!selectedCreator || !selectedCampaign) return;
    if (!isSelectedCreatorForCurrentCampaign()) {
      setSelectedCreator(null);
      autoSelectedForCampaignRef.current = null;
    }
  }, [selectedCreator, selectedCampaign, isSelectedCreatorForCurrentCampaign]);

  const initialMessagePayload = useMemo(() => {
    if (!selectedCreator || !selectedCampaign || !isSelectedCreatorForCurrentCampaign()) {
      return null;
    }

    const campaignId = selectedCampaign.id;
    const creatorUserId = selectedCreator?.creator?.id || selectedCreator?.id || null;
    const invitationMessage = selectedCreator?.custom_message?.trim();
    if (invitationMessage) {
      return {
        content: invitationMessage,
        senderRole: "BRAND",
        campaignId,
        creatorId: creatorUserId,
      };
    }
    const creatorPitch = selectedCreator?.pitch?.trim();
    if (creatorPitch) {
      return {
        content: creatorPitch,
        senderRole: "CREATOR",
        campaignId,
        creatorId: creatorUserId,
      };
    }
    return null;
  }, [selectedCreator, selectedCampaign, isSelectedCreatorForCurrentCampaign]);

  const messageThreadHook = useMessageThread(
    getCreatorId(),
    getCampaignId(),
    null,
    initialMessagePayload
  );

  const handleMessageClick = () => {
    const currentCampaignId = getCampaignId();

    if (!currentCampaignId) {
      return;
    }

    messageThreadHook.openMessageModal(currentCampaignId);
  };

  const creator = {
    id: selectedCreator?.creator?.id || selectedCreator?.id,
    name: selectedCreator?.creator
      ? `${selectedCreator.creator.first_name || ""} ${selectedCreator.creator.last_name || ""}`.trim()
      : selectedCreator?.name || "",
    avatar:
      selectedCreator?.creator?.creator_profile?.profile_photo_url ||
      selectedCreator?.profileImage ||
      avatar,
    isOnline: true,
  };

  const creators = Array.isArray(appliedCreatorsData?.data) ? appliedCreatorsData.data : [];

  const individualCreators = individualCollaborations.map((invitation) => ({
    ...invitation,
    creator: invitation.creator,
    campaign_id: invitation.campaign_id || invitation.campaign?.id || null,
    campaign: invitation.campaign,
    applied_at: invitation.created_at,
    status: invitation.status || "PENDING",
  }));

  const displayCreators =
    selectedCampaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR
      ? individualCreators
      : creators;

  useEffect(() => {
    if (
      !selectedCampaign &&
      !individualCollaborationsLoading &&
      individualCreators.length > 0 &&
      !selectedCreator
    ) {
      const campaignKey = "individual";
      if (autoSelectedForCampaignRef.current !== campaignKey) {
        setSelectedCreator(individualCreators[0]);
        autoSelectedForCampaignRef.current = campaignKey;
      }
    }
  }, [
    selectedCampaign,
    individualCreators.length,
    individualCollaborationsLoading,
    selectedCreator,
  ]);

  const user = getUser();
  const previousMessagesCountRef = useRef({});
  const lastRefreshTimeRef = useRef(0);

  useEffect(() => {
    if (user?.role !== "BRAND") return;
    if (!selectedCampaign) return;

    const now = Date.now();
    const minTimeBetweenRefreshes = 30000;

    let shouldRefresh = false;
    Object.keys(allMessages || {}).forEach((conversationId) => {
      const messages = allMessages[conversationId] || [];
      const previousCount = previousMessagesCountRef.current[conversationId] || 0;

      if (
        messages.length > previousCount &&
        previousCount > 0 &&
        now - lastRefreshTimeRef.current > minTimeBetweenRefreshes
      ) {
        const latestMessage = messages[messages.length - 1];
        const senderId = latestMessage?.sender?.id || latestMessage?.sender_id;
        if (latestMessage && latestMessage.sender?.role === "CREATOR" && senderId !== user?.id) {
          shouldRefresh = true;
        }
      }

      previousMessagesCountRef.current[conversationId] = messages.length;
    });
    if (shouldRefresh) {
      lastRefreshTimeRef.current = now;
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      refreshTimeoutRef.current = setTimeout(() => {
        const isIndividual =
          selectedCampaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;
        if (isIndividual) {
          dispatch(getBrandIndividualCollaborations());
        } else {
          dispatch(
            getAppliedCreators({
              campaignId: selectedCampaign.id,
              filters,
            })
          );
        }
      }, 2000);
    }

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [allMessages, selectedCampaign, dispatch, user, filters]);

  const isIndividualCreator =
    !selectedCampaign ||
    selectedCampaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;

  const rightPaneState = (() => {
    if (campaignsLoading || appliedCreatorsLoading || individualCollaborationsLoading) {
      return { type: "loading" };
    }

    if (!selectedCampaign && !selectedCreator) {
      return {
        type: "notFound",
        title: "No Campaign Selected",
        description: "Select a campaign to view details.",
      };
    }

    if (!selectedCampaign && displayCreators.length === 0) {
      return {
        type: "notFound",
        title: "No Creators Found",
        description: "No individual collaborations found.",
      };
    }

    if (selectedCampaign && displayCreators.length === 0) {
      return {
        type: "notFound",
        title: "No Creators Found",
        description: "No creators have applied to this campaign yet.",
      };
    }

    if (!selectedCreator) {
      const shouldAutoSelect =
        selectedCampaign &&
        displayCreators.length > 0 &&
        autoSelectedForCampaignRef.current !== selectedCampaign.id;

      if (shouldAutoSelect) {
        return { type: "loading" };
      }

      return {
        type: "notFound",
        title: "No Creator Selected",
        description: "Select a creator to view details.",
      };
    }

    return { type: "content", isIndividualCreator };
  })();

  return {
    appliedCreatorsData,
    appliedCreatorsLoading,
    individualCollaborationsLoading,
    isLoading: campaignsLoading,
    selectedCampaign,
    selectedCreator,
    hireModalOpen,
    setHireModalOpen,
    hireCreatorData,
    selectedCampaignForHire,
    showRejectConfirmation,
    setShowRejectConfirmation,
    createContractLoading,
    sendContractLoading,
    createContractSuccess,
    sendContractSuccess,
    createContractError,
    sendContractError,
    filters,
    creators: displayCreators,
    creator,
    messageThreadHook,
    rightPaneState,
    handleCampaignSelect,
    handleCreatorSelect,
    handleCreatorSelectWithPane,
    handleClearCreator,
    mobilePane,
    backToApplicationList,
    handleHireClick,
    handleSendOffer,
    handleRejectClick,
    handleConfirmReject,
    handleFilterChange,
    handleFiltersReplace,
    clearFilters,
    handleMessageClick,
    fetchIndividualCollaborations,
  };
}

export default useBrandApplications;
