import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getBrandCampaignsExcludingCompleted } from "@/provider/features/campaigns/campaigns.slice";
import { getAllShortlists } from "@/provider/features/shortlist/shortlist.slice";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import { sortOptions, avatar } from "@/common/constants/auth.constant";

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

  const dispatch = useDispatch();

  const { data: campaignsData, isLoading: campaignsLoading } = useSelector(
    (state) => state.campaigns.getBrandCampaignsExcludingCompleted
  );

  const { data: shortlistsData, isLoading: shortlistsLoading } = useSelector(
    (state) => state.shortlist.getAllShortlists
  );

  useEffect(() => {
    dispatch(getBrandCampaignsExcludingCompleted());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllShortlists());
  }, [dispatch]);

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
      typeof onCampaignSelect === "function"
    ) {
      const firstCampaign = campaignsData.data.find(
        (c) => c.id === filteredCampaignOptions[0]?.value
      );
      if (firstCampaign) {
        onCampaignSelect(firstCampaign);
        hasAutoSelectedCampaignRef.current = true;
      }
    }
  }, [
    isMultiCreator,
    selectedCampaign,
    campaignsData?.data,
    campaignsLoading,
    filteredCampaignOptions.length,
    onCampaignSelect,
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
    const appliedDate = data.applied_at || data.created_at;
    const rejectedDate = data.rejected_at || data.updated_at;

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
      followers: profile?.total_followers || 0,
      niches: profile?.categories || [],
      tagline: data.custom_message || data.pitch || profile?.bio || "",
      portfolioImages: profile?.mini_profile_pictures || [],
      platforms: (profile?.social_platforms || [])
        .map((p) => (typeof p === "object" ? p.platform : p))
        .filter(Boolean),
      platformStats: (profile?.social_platforms || []).reduce((acc, platform) => {
        const platformName = typeof platform === "object" ? platform.platform : platform;
        if (platformName) {
          acc[platformName] = { followers: 0 };
        }
        return acc;
      }, {}),
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

    const hasCampaignId = !!originalCreatorToReinstate.campaign_id;
    const hasCreatorIdField = !!originalCreatorToReinstate.creator_id;
    const isMultiCreatorStructure = hasCampaignId || hasCreatorIdField;
    const isMultiCreatorCampaign =
      selectedCampaign && selectedCampaign.collaboration_type !== "INDIVIDUAL_CREATOR";

    if (isMultiCreatorCampaign || isMultiCreatorStructure) {
      const creatorId =
        originalCreatorToReinstate.creator?.id ||
        originalCreatorToReinstate.creator_id ||
        originalCreatorToReinstate.originalData?.creator?.id;
      if (selectedCampaign && creatorId) {
        onReinstateCreator(selectedCampaign.id, creatorId);
      }
    } else {
      const invitationId =
        originalCreatorToReinstate.originalData?.id || originalCreatorToReinstate.id;
      if (invitationId) {
        onReinstateCreator(null, null, invitationId);
      }
    }

    setShowReinstateConfirmation(false);
    setOriginalCreatorToReinstate(null);
  };

  const handleCancelReinstate = () => {
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
