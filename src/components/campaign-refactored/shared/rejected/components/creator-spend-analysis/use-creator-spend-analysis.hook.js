import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllBrandCampaigns } from "@/provider/features/campaigns/campaigns.slice";
import { getAllShortlists } from "@/provider/features/shortlist/shortlist.slice";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import { sortOptions, avatar } from "@/common/constants/auth.constant";
import { setSelectedCampaign as setSelectedCampaignContext } from "@/provider/features/campaign-context/campaign-context.slice";

function useCreatorSpendAnalysis({
  selectedCampaign,
  onCampaignSelect,
  onReinstateCreator,
  onSaveToShortlist,
  onSortChange,
  onCreatorSelect,
  onClearCreator,
}) {
  const [showReinstateConfirmation, setShowReinstateConfirmation] = useState(false);
  const [originalCreatorToReinstate, setOriginalCreatorToReinstate] = useState(null);
  const [showSaveToShortlistModal, setShowSaveToShortlistModal] = useState(false);
  const [creatorToSave, setCreatorToSave] = useState(null);
  const [open, setOpen] = useState(false);
  const [isMultiCreator, setIsMultiCreator] = useState(true);
  const hasAutoSelectedCampaignRef = useRef(false);
  const hasRestoredFromContext = useRef(false);
  const lastRestoredCampaignIdRef = useRef(null);
  const awaitingReinstateConfirmRef = useRef(false);

  const dispatch = useDispatch();

  const { selectedCampaignId } = useSelector((state) => state.campaignContext || {});

  const { isSuccess: reinstateCreatorSuccess, isError: reinstateCreatorError } = useSelector(
    (state) => state.campaigns.reinstateCreator || {}
  );
  const { isSuccess: reinstateInvitationSuccess, isError: reinstateInvitationError } = useSelector(
    (state) => state.invitation.reinstateInvitation || {}
  );

  const { data: allCampaignsData, isLoading: campaignsLoading } = useSelector(
    (state) => state.campaigns.getAllBrandCampaigns
  );

  // Filter out completed campaigns on frontend
  const campaignsData = useMemo(() => {
    if (!allCampaignsData?.data || !Array.isArray(allCampaignsData.data)) return allCampaignsData;
    return {
      ...allCampaignsData,
      data: allCampaignsData.data.filter((campaign) => campaign.status !== "COMPLETE"),
    };
  }, [allCampaignsData]);

  const { data: shortlistsData, isLoading: shortlistsLoading } = useSelector(
    (state) => state.shortlist.getAllShortlists
  );

  useEffect(() => {
    dispatch(getAllBrandCampaigns());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllShortlists());
  }, [dispatch]);

  useEffect(() => {
    if (!awaitingReinstateConfirmRef.current) return;
    if (reinstateCreatorSuccess || reinstateInvitationSuccess) {
      awaitingReinstateConfirmRef.current = false;
      setShowReinstateConfirmation(false);
      setOriginalCreatorToReinstate(null);
    }
    if (reinstateCreatorError || reinstateInvitationError) {
      awaitingReinstateConfirmRef.current = false;
    }
  }, [
    reinstateCreatorSuccess,
    reinstateInvitationSuccess,
    reinstateCreatorError,
    reinstateInvitationError,
  ]);

  // Restore campaign from Redux context
  useEffect(() => {
    // Reset restoration flag if selectedCampaignId from Redux changed
    if (selectedCampaignId !== lastRestoredCampaignIdRef.current) {
      hasRestoredFromContext.current = false;
    }
  }, [selectedCampaignId]);

  useEffect(() => {
    if (
      !campaignsLoading &&
      campaignsData?.data &&
      selectedCampaignId &&
      !hasRestoredFromContext.current &&
      !selectedCampaign
    ) {
      const campaigns = Array.isArray(campaignsData.data) ? campaignsData.data : [];
      const restoredCampaign = campaigns.find((c) => c.id === selectedCampaignId);
      if (restoredCampaign) {
        onCampaignSelect(restoredCampaign);
        hasRestoredFromContext.current = true;
        lastRestoredCampaignIdRef.current = selectedCampaignId;
      }
    } else if (!selectedCampaignId) {
      // Reset when Redux context is cleared
      lastRestoredCampaignIdRef.current = null;
      hasRestoredFromContext.current = false;
    }
  }, [campaignsLoading, campaignsData, selectedCampaignId, selectedCampaign, onCampaignSelect]);

  const campaignOptions = useMemo(
    () =>
      campaignsData?.data?.map((campaign) => ({
        value: campaign.id,
        label: campaign.campaign_title,
      })) || [],
    [campaignsData?.data]
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

  useEffect(() => {
    if (
      isMultiCreator &&
      !selectedCampaign &&
      !hasAutoSelectedCampaignRef.current &&
      !campaignsLoading &&
      Array.isArray(campaignsData?.data) &&
      campaignsData.data.length > 0 &&
      filteredCampaignOptions.length > 0 &&
      !hasRestoredFromContext.current
    ) {
      const firstCampaign = campaignsData.data.find(
        (c) => c.id === filteredCampaignOptions[0]?.value
      );
      if (firstCampaign) {
        onCampaignSelect(firstCampaign);
        hasAutoSelectedCampaignRef.current = true;
        dispatch(
          setSelectedCampaignContext({
            campaignId: firstCampaign.id,
            collaborationType: firstCampaign.collaboration_type || null,
          })
        );
      }
    }
  }, [
    isMultiCreator,
    selectedCampaign,
    campaignsData?.data,
    campaignsLoading,
    filteredCampaignOptions.length,
    onCampaignSelect,
    dispatch,
    hasRestoredFromContext.current,
  ]);

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

  const handleToggleChange = (event) => {
    const newIsMultiCreator = event.target.checked;
    setIsMultiCreator(newIsMultiCreator);
    hasAutoSelectedCampaignRef.current = false;

    if (onClearCreator) {
      onClearCreator();
    }

    if (!newIsMultiCreator) {
      if (onCampaignSelect) {
        onCampaignSelect(null);
      }
    } else {
      if (selectedCampaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR) {
        if (onCampaignSelect) {
          onCampaignSelect(null);
        }
      }
    }
  };

  const handleSortChange = (option) => {
    if (onSortChange && option?.value) {
      onSortChange(option.value);
    }
  };

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleCreatorPreview = (creator) => {
    if (onCreatorSelect) {
      onCreatorSelect(creator);
    }
  };

  const mapCreatorForCard = (data) => {
    const creatorData = data.creator;
    const profile = creatorData?.creator_profile;
    const socialAccounts = creatorData?.social_accounts || [];
    const appliedDate = data.applied_at || data.created_at;
    const rejectedDate = data.rejected_at || data.updated_at;

    const platformStatsFromAccounts = socialAccounts.reduce((acc, s) => {
      const pd = s.profile_data || {};
      const followers =
        Number(pd.followers) ||
        Number(pd.followers_count) ||
        Number(pd.follower_count) ||
        Number(pd.subscriber_count) ||
        0;
      if (s.platform) acc[s.platform] = { followers };
      return acc;
    }, {});

    const totalFromAccounts = Object.values(platformStatsFromAccounts).reduce(
      (sum, stat) => sum + (stat?.followers || 0),
      0
    );

    const platforms =
      Object.keys(platformStatsFromAccounts).length > 0
        ? Object.keys(platformStatsFromAccounts)
        : (profile?.social_platforms || [])
            .map((p) => (typeof p === "object" ? p.platform : p))
            .filter(Boolean);

    const platformStats =
      Object.keys(platformStatsFromAccounts).length > 0
        ? platformStatsFromAccounts
        : platforms.reduce((acc, platformName) => {
            if (platformName) acc[platformName] = { followers: 0 };
            return acc;
          }, {});

    const followers = totalFromAccounts > 0 ? totalFromAccounts : (profile?.total_followers || 0);

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
      niches: profile?.categories || [],
      tagline: data.custom_message || data.pitch || profile?.bio || "",
      portfolioImages: profile?.mini_profile_pictures || [],
      platforms,
      platformStats,
      appliedDate: appliedDate ? new Date(appliedDate).toLocaleDateString() : "",
      rejectedDate: rejectedDate ? new Date(rejectedDate).toLocaleDateString() : "N/A",
      originalData: data,
    };
  };

  const handleReinstateClick = (data, e) => {
    e?.stopPropagation();
    setOriginalCreatorToReinstate(data);
    setShowReinstateConfirmation(true);
  };

  const handleConfirmReinstate = () => {
    if (!onReinstateCreator || !originalCreatorToReinstate) {
      setShowReinstateConfirmation(false);
      setOriginalCreatorToReinstate(null);
      return;
    }

    const isMultiCreatorMode =
      isMultiCreator &&
      selectedCampaign &&
      selectedCampaign.collaboration_type !== COLLABORATION_TYPE.INDIVIDUAL_CREATOR;

    if (isMultiCreatorMode && selectedCampaign?.id) {
      const creatorId =
        originalCreatorToReinstate.creator?.id ||
        originalCreatorToReinstate.creator_id ||
        originalCreatorToReinstate.originalData?.creator?.id;
      if (creatorId) {
        awaitingReinstateConfirmRef.current = true;
        onReinstateCreator(selectedCampaign.id, creatorId);
        return;
      }
    }

    const invitationId =
      originalCreatorToReinstate.originalData?.id ||
      originalCreatorToReinstate.id ||
      originalCreatorToReinstate.invitation_id;
    if (invitationId) {
      awaitingReinstateConfirmRef.current = true;
      onReinstateCreator(null, null, invitationId);
      return;
    }

    setShowReinstateConfirmation(false);
    setOriginalCreatorToReinstate(null);
  };

  const handleCancelReinstate = () => {
    awaitingReinstateConfirmRef.current = false;
    setShowReinstateConfirmation(false);
    setOriginalCreatorToReinstate(null);
  };

  const handleSaveToShortlistClick = useCallback((creator) => {
    setCreatorToSave(creator);
    setShowSaveToShortlistModal(true);
  }, []);

  const handleConfirmSaveToShortlist = useCallback(
    (shortlistId) => {
      if (creatorToSave && onSaveToShortlist) {
        onSaveToShortlist(creatorToSave.creator, shortlistId);
      }
      setShowSaveToShortlistModal(false);
      setCreatorToSave(null);
    },
    [creatorToSave, onSaveToShortlist]
  );

  const handleCancelSaveToShortlist = useCallback(() => {
    setShowSaveToShortlistModal(false);
    setCreatorToSave(null);
  }, []);

  const shortlists = Array.isArray(shortlistsData) ? shortlistsData : [];

  return {
    showReinstateConfirmation,
    campaignsData,
    campaignsLoading,
    filteredCampaignOptions,
    isSelectedCampaignValid,
    selectedCampaignValue,
    showSaveToShortlistModal,
    creatorToSave,
    shortlists,
    shortlistsLoading,
    open,
    isMultiCreator,
    sortOptions,
    handleToggleChange,
    handleSortChange,
    handleReinstateClick,
    handleConfirmReinstate,
    handleCancelReinstate,
    handleSaveToShortlistClick,
    handleConfirmSaveToShortlist,
    handleCancelSaveToShortlist,
    handleOpenModal,
    handleCloseModal,
    handleCreatorPreview,
    mapCreatorForCard,
  };
}

export default useCreatorSpendAnalysis;
