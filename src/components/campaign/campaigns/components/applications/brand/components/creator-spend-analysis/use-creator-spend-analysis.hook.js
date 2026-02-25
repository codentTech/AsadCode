import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import useCampaignOverview from "../campaign-overview/use-campaign-overview.hook";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import { getBrandIndividualCollaborations } from "@/provider/features/invitation/invitation.slice";
import {
  getAllShortlists,
  addUserToShortlist,
} from "@/provider/features/shortlist/shortlist.slice";
import { avatar } from "@/common/constants/auth.constant";
import { sortOptions } from "@/common/constants/auth.constant";

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
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterType, setFilterType] = useState("creator");
  const [isMultiCreator, setIsMultiCreator] = useState(true);
  const { campaignsData, campaignsLoading, campaignOptions } = useCampaignOverview();
  const hasAutoSelected = useRef(false);
  const hasFetchedIndividual = useRef(false);

  const { data: individualCollaborationsData, isLoading: individualCollaborationsLoading } =
    useSelector((state) => state.invitation.getBrandIndividualCollaborations || {});

  const { isSuccess: reinstateInvitationSuccess } = useSelector(
    (state) => state.invitation.reinstateInvitation || {}
  );

  const shortlistState = useSelector((state) => state.shortlist || {});

  const [showSaveToShortlistModal, setShowSaveToShortlistModal] = useState(false);
  const [creatorToSave, setCreatorToSave] = useState(null);

  // Fetch shortlists on mount
  useEffect(() => {
    dispatch(getAllShortlists());
  }, [dispatch]);

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
  };

  const handleToggleChange = (event) => {
    const newIsMultiCreator = event.target.checked;
    setIsMultiCreator(newIsMultiCreator);
    hasAutoSelected.current = false;

    if (onClearCreator) {
      onClearCreator();
    }

    if (newIsMultiCreator) {
      hasFetchedIndividual.current = false;
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
      platforms,
      platformStats,
      portfolioImages: profile?.mini_profile_pictures || [],
      niches: profile?.categories || [],
      tagline: data.custom_message || data.pitch || profile?.bio || "",
      appliedDate: appliedDate ? new Date(appliedDate).toLocaleDateString() : "",
    };
  };

  const handleSortChange = (option) => {
    if (onFilterChange && option?.value) {
      onFilterChange("sort", option.value);
    }
  };

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
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
    handleSortChange,
    sortOptions,
  };
}

export default useCreatorSpendAnalysis;
