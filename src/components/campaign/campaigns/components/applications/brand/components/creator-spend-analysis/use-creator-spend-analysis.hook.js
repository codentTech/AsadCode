import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useCampaignOverview from "../campaign-overview/use-campaign-overview.hook";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import { getBrandIndividualCollaborations } from "@/provider/features/invitation/invitation.slice";
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

  const individualCollaborations = (individualCollaborationsData?.data || []).filter(
    (invitation) => invitation.status === "PENDING"
  );

  const filteredCampaignOptions = campaignOptions.filter((option) => {
    if (!campaignsData?.data) return false;
    const campaign = campaignsData.data.find((c) => c.id === option.value);
    if (!campaign) return false;
    const collaborationType = campaign.collaboration_type || COLLABORATION_TYPE.MULTI_CREATOR;
    return isMultiCreator
      ? collaborationType === COLLABORATION_TYPE.MULTI_CREATOR
      : collaborationType === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;
  });

  const isSelectedCampaignValid =
    selectedCampaign &&
    (isMultiCreator
      ? (selectedCampaign.collaboration_type || COLLABORATION_TYPE.MULTI_CREATOR) ===
        COLLABORATION_TYPE.MULTI_CREATOR
      : selectedCampaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR);

  const fetchIndividualCollaborations = async () => {
    hasFetchedIndividual.current = true;
    const result = await dispatch(getBrandIndividualCollaborations());

    // Auto-select first collaboration if none selected
    if (result.payload?.success && result.payload?.data?.length > 0) {
      const collaborations = result.payload.data.filter(
        (invitation) => invitation.status === "PENDING"
      );
      if (collaborations.length > 0) {
        const currentIsIndividual =
          selectedCampaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;
        if (!selectedCampaign || !currentIsIndividual) {
          const firstCollaboration = {
            id: `individual-${collaborations[0].id}`,
            collaboration_type: COLLABORATION_TYPE.INDIVIDUAL_CREATOR,
            campaign_title: "Individual Collaboration",
            brand: collaborations[0].brand,
            created_by: collaborations[0].brand,
            invitation: collaborations[0],
          };
          if (onCampaignSelect) {
            onCampaignSelect(firstCollaboration);
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
    }

    if (!newIsMultiCreator) {
      hasFetchedIndividual.current = false;
      fetchIndividualCollaborations();
    }
  };

  useEffect(() => {
    if (isMultiCreator) {
      hasFetchedIndividual.current = false;
      if (
        !selectedCampaign &&
        !hasAutoSelected.current &&
        filteredCampaignOptions.length > 0 &&
        typeof onCampaignSelect === "function"
      ) {
        const firstCampaign = campaignsData?.data?.find(
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
  }, [isMultiCreator, selectedCampaign?.id]);

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

  const handleSaveToShortlist = (creator) => {};

  const mapCreatorForCard = (data) => {
    const creatorData = data.creator;
    const profile = creatorData?.creator_profile;
    const appliedDate = data.applied_at || data.created_at;

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
    isSelectedCampaignValid,
    handleToggleChange,
    handleCreatorPreview,
    handleSaveToShortlist,
    mapCreatorForCard,
    handleSortChange,
    sortOptions,
  };
}

export default useCreatorSpendAnalysis;
