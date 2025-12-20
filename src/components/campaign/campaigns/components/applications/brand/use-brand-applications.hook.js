import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createContract,
  getAppliedCreators,
  rejectCreator,
  sendContract,
} from "@/provider/features/campaigns/campaigns.slice";
import {
  getBrandIndividualCollaborations,
  rejectInvitation,
} from "@/provider/features/invitation/invitation.slice";
import useMessageThread from "../../message-thread-modal/use-message-thread.hook";
import { avatar } from "@/common/constants/auth.constant";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import { getUser } from "@/common/utils/users.util";

function useBrandApplications() {
  const dispatch = useDispatch();

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
    country: "",
    city: "",
    niches: [],
    platforms: [],
    status: "PENDING",
    excludeStatus: "HIRED",
    sort: "newest",
  });

  const fetchIndividualCollaborations = useCallback(async () => {
    dispatch(getBrandIndividualCollaborations());
  }, [dispatch]);

  const handleCampaignSelect = (campaign) => {
    setSelectedCreator(null);
    autoSelectedForCampaignRef.current = null;
    setSelectedCampaign(campaign);

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
  }, [appliedCreatorsSuccess, appliedCreatorsData, selectedCampaign, selectedCreator]);

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
    individualCollaborations,
    individualCollaborationsLoading,
    selectedCreator,
  ]);

  const handleCreatorSelect = (creator) => {
    setSelectedCreator(creator);
  };

  const handleClearCreator = () => {
    setSelectedCreator(null);
  };

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
      dispatch(rejectCreator({ campaignId: selectedCampaign.id, creatorId: selectedCreator.id }));
    }
    setShowRejectConfirmation(false);
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    if (
      selectedCampaign &&
      selectedCampaign.collaboration_type !== COLLABORATION_TYPE.INDIVIDUAL_CREATOR
    ) {
      dispatch(
        getAppliedCreators({
          campaignId: selectedCampaign.id,
          filters: newFilters,
        })
      );
    }
  };

  const clearFilters = () => {
    const clearedFilters = {
      min_followers: "",
      max_followers: "",
      min_rating: "",
      max_rating: "",
      country: "",
      city: "",
      niches: [],
      platforms: [],
      status: "",
      excludeStatus: "HIRED",
      sort: "newest",
    };
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
      setSelectedCreator(null);
      autoSelectedForCampaignRef.current = null;
    }
  }, [rejectSuccess, selectedCampaign, dispatch, filters, fetchIndividualCollaborations]);

  useEffect(() => {
    if (createContractSuccess && sendContractSuccess) {
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
      setSelectedCreator(null);
      autoSelectedForCampaignRef.current = null;
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
        fetchIndividualCollaborations();
        setSelectedCreator(null);
        autoSelectedForCampaignRef.current = null;
      }
    }
  }, [rejectInvitationSuccess, selectedCampaign, dispatch, fetchIndividualCollaborations]);

  useEffect(() => {
    if (
      reinstateInvitationSuccess &&
      selectedCampaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR
    ) {
      fetchIndividualCollaborations();
      setSelectedCreator(null);
      autoSelectedForCampaignRef.current = null;
    }
  }, [reinstateInvitationSuccess, selectedCampaign, dispatch, fetchIndividualCollaborations]);

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

  const applicationPitch = selectedCreator?.pitch || selectedCreator?.custom_message || null;

  const messageThreadHook = useMessageThread(
    getCreatorId(),
    getCampaignId(),
    null,
    applicationPitch
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
    if (
      selectedCampaign &&
      selectedCampaign?.collaboration_type !== COLLABORATION_TYPE.INDIVIDUAL_CREATOR &&
      selectedCampaign !== null
    )
      return;

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
        dispatch(getBrandIndividualCollaborations());
      }, 2000);
    }

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [allMessages, selectedCampaign, dispatch, user]);

  const isIndividualCreator =
    !selectedCampaign ||
    selectedCampaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;

  const rightPaneState = (() => {
    if (appliedCreatorsLoading || individualCollaborationsLoading) {
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
    handleClearCreator,
    handleHireClick,
    handleSendOffer,
    handleRejectClick,
    handleConfirmReject,
    handleFilterChange,
    clearFilters,
    handleMessageClick,
    fetchIndividualCollaborations,
  };
}

export default useBrandApplications;
