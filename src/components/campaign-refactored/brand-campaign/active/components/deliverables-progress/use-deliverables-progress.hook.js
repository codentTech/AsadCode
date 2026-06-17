import { avatar } from "@/common/constants/auth.constant";
import { formatCreatorLocation } from "@/common/utils/creator-location.util";
import { TIMELINE_STATUS, TIMELINE_STEPS } from "@/common/constants/campaign.constant";
import { getUser, isCreatorMode } from "@/common/utils/users.util";
import useMessageThread from "@/components/campaign-refactored/shared/message-thread-modal/use-message-thread.hook";
import {
  createCampaignNote,
  deleteCampaignNote,
  getCampaignNotesByCreatorProfile,
  updateCampaignNote,
} from "@/provider/features/campaign-notes/campaign-notes.slice";
import { createCampaignReview } from "@/provider/features/campaign-reviews/campaign-reviews.slice";
import { getBrandTasks } from "@/provider/features/campaign-tasks/campaign-tasks.slice";
import { getTimeline } from "@/provider/features/campaign-timeline/campaign-timeline.slice";
import {
  getAllBrandCampaigns,
  getHiredCreators,
  markCreatorComplete,
} from "@/provider/features/campaigns/campaigns.slice";
import {
  getContractsByCampaign,
  getIndividualCollaborationContracts,
} from "@/provider/features/contracts/contracts.slice";
import { fetchCampaignCombinedDemographics } from "@/provider/features/phyllo/phyllo.slice";
import usersService from "@/provider/features/users/users.service";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useDeliverablesProgress = (
  selectedCampaign = null,
  selectedCreator = null,
  isIndividualCreator = false,
  onClearCreator = null,
  filters = { status: "HIRED", sort: "newest" },
  onPipelineUpdated = null
) => {
  const creatorMode = isCreatorMode();
  const user = getUser();
  const dispatch = useDispatch();

  const {
    createCampaignNote: createNoteState,
    getCampaignNotes: getNotesState,
    getCampaignNotesByCreatorProfile: getNotesByCreatorProfileState,
    updateCampaignNote: updateNoteState,
    deleteCampaignNote: deleteNoteState,
  } = useSelector((state) => state.campaignNotes);

  const {
    getContractsByCampaign: getContractsState,
    getIndividualCollaborationContracts: getIndividualContractsState,
  } = useSelector((state) => state.contracts);

  const { updateCampaign: updateCampaignState } = useSelector((state) => state.campaigns);

  const { getTimeline: getTimelineState } = useSelector((state) => state.campaignTimeline);

  const [editingNote, setEditingNote] = useState(null);
  const [newNoteText, setNewNoteText] = useState("");
  const [textareaKey, setTextareaKey] = useState(0);

  const [showMarkCompleteModal, setShowMarkCompleteModal] = useState(false);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [markCompleteRating, setMarkCompleteRating] = useState(0);
  const [markCompleteFeedback, setMarkCompleteFeedback] = useState("");
  const [isAddressCopied, setIsAddressCopied] = useState(false);
  const [hydratedCreatorUser, setHydratedCreatorUser] = useState(null);

  // Track the last called keys to prevent duplicate calls
  const lastCalledKeysRef = useRef({
    notes: null,
    timeline: null,
  });

  // Extract stable IDs to prevent unnecessary recalculations - extract once at the top
  const selectedCreatorContractCampaignId = selectedCreator?.contract?.campaignId;
  const selectedCampaignId = selectedCampaign?.id;

  const creatorUserId = useMemo(() => {
    if (!selectedCreator) return null;
    if (isIndividualCreator) {
      return selectedCreator?.creatorUserId || selectedCreator?.creator?.id || null;
    }
    return (
      selectedCreator?.creatorUserId || selectedCreator?.creator?.id || selectedCreator?.id || null
    );
  }, [
    selectedCreator?.id,
    selectedCreator?.creatorUserId,
    selectedCreator?.creator?.id,
    isIndividualCreator,
  ]);

  const creatorProfileId = useMemo(() => {
    if (!selectedCreator) return null;

    if (isIndividualCreator) {
      return selectedCreator?.contract?.creator?.creator_profile?.id || null;
    }

    return selectedCreator?.creator?.creator_profile?.id || null;
  }, [
    selectedCreator?.id,
    selectedCreator?.contract?.creator?.creator_profile?.id,
    selectedCreator?.creator?.creator_profile?.id,
    isIndividualCreator,
  ]);

  useEffect(() => {
    if (!isIndividualCreator || !creatorUserId) {
      setHydratedCreatorUser(null);
      return;
    }

    usersService.getUserById(creatorUserId).then(
      (response) => {
        const payload = response?.data || null;
        if (payload?.id === creatorUserId) {
          setHydratedCreatorUser(payload);
          return;
        }
        setHydratedCreatorUser(null);
      },
      () => {
        setHydratedCreatorUser(null);
      }
    );
  }, [isIndividualCreator, creatorUserId]);

  const getCreatorData = () => {
    if (!selectedCreator) {
      return {
        id: "unknown",
        name: "Creator",
        image: avatar,
        avatar,
        isOnline: false,
        location: "Location not specified",
        rating: 0,
        bio: "No bio available",
        age: null,
      };
    }

    if (isIndividualCreator) {
      const contractCreator = selectedCreator.contract?.creator || selectedCreator.creator;
      const effectiveCreator = hydratedCreatorUser || contractCreator;
      const contractProfile =
        effectiveCreator?.creator_profile ||
        contractCreator?.creator_profile ||
        selectedCreator.creator?.creator_profile;
      const hydratedProfile = hydratedCreatorUser?.creator_profile;

      return {
        id: creatorProfileId || selectedCreator.creatorUserId || selectedCreator.id,
        name: `${selectedCreator.name || ""}`.trim() || "Creator",
        image: selectedCreator.image || contractProfile?.profile_photo_url || avatar,
        avatar: selectedCreator.image || contractProfile?.profile_photo_url || avatar,
        isOnline: true,
        location: `${selectedCreator.location || ""}`.trim() || "Location not specified",
        rating: Number(
          hydratedProfile?.rating ?? selectedCreator.rating ?? contractProfile?.rating ?? 0
        ),
        reviewCount: Number(
          hydratedProfile?.reviewCount ??
            hydratedProfile?.review_count ??
            selectedCreator.reviewCount ??
            selectedCreator.review_count ??
            contractProfile?.reviewCount ??
            contractProfile?.review_count ??
            0
        ),
        bio: selectedCreator.bio || contractProfile?.bio || "No bio available",
        shippingAddress:
          contractProfile?.shipping_address ||
          hydratedCreatorUser?.creator_profile?.shipping_address ||
          selectedCreator?.creator?.creator_profile?.shipping_address ||
          null,
        age: selectedCreator.age,
      };
    }

    if (selectedCreator.creator) {
      const creator = selectedCreator.creator;
      const profile = creator?.creator_profile;

      return {
        id: selectedCreator.id || creator.id,
        name:
          `${creator.first_name || ""} ${creator.last_name || ""}`.trim() ||
          selectedCreator.name ||
          "Creator",
        image: profile?.profile_photo_url || selectedCreator.image || avatar,
        avatar: profile?.profile_photo_url || selectedCreator.image || avatar,
        isOnline: true,
        location:
          formatCreatorLocation({
            city: creator.city,
            country: creator.country,
            state: creator.state,
            stateShort: creator.state_short,
          }) ||
          selectedCreator.location ||
          "Location not specified",
        rating: parseFloat(profile?.rating) || parseFloat(selectedCreator.rating) || 0,
        reviewCount:
          profile?.reviewCount ||
          profile?.review_count ||
          selectedCreator.reviewCount ||
          selectedCreator.review_count ||
          0,
        bio: profile?.bio || selectedCreator.bio || "No bio available",
        shippingAddress: profile?.shipping_address || null,
        age:
          selectedCreator.age ||
          (creator.date_of_birth
            ? new Date().getFullYear() - new Date(creator.date_of_birth).getFullYear()
            : null),
      };
    }

    return {
      id: selectedCreator.id || "unknown",
      name: `${selectedCreator.name || ""}`.trim() || "Creator",
      image: selectedCreator.image || avatar,
      avatar: selectedCreator.image || avatar,
      isOnline: true,
      location: `${selectedCreator.location || ""}`.trim() || "Location not specified",
      rating: parseFloat(selectedCreator.rating) || 0,
      reviewCount: selectedCreator.reviewCount || 0,
      bio: selectedCreator.bio || "No bio available",
      shippingAddress: selectedCreator?.creator?.creator_profile?.shipping_address || null,
      age: selectedCreator.age,
    };
  };

  const creator = useMemo(
    () => getCreatorData(),
    [
      selectedCreator?.id,
      selectedCreator?.name,
      selectedCreator?.image,
      selectedCreator?.location,
      selectedCreator?.rating,
      selectedCreator?.reviewCount,
      selectedCreator?.bio,
      selectedCreator?.age,
      selectedCreator?.creatorUserId,
      selectedCreator?.creator?.id,
      selectedCreator?.creator?.first_name,
      selectedCreator?.creator?.last_name,
      selectedCreator?.creator?.city,
      selectedCreator?.creator?.country,
      selectedCreator?.creator?.date_of_birth,
      selectedCreator?.creator?.creator_profile?.id,
      selectedCreator?.creator?.creator_profile?.profile_photo_url,
      selectedCreator?.creator?.creator_profile?.rating,
      selectedCreator?.creator?.creator_profile?.review_count,
      selectedCreator?.creator?.creator_profile?.bio,
      selectedCreator?.contract?.id,
      selectedCreator?.contract?.creator?.id,
      selectedCreator?.contract?.creator?.creator_profile?.id,
      selectedCreator?.contract?.creator?.creator_profile?.profile_photo_url,
      selectedCreator?.contract?.creator?.creator_profile?.rating,
      selectedCreator?.contract?.creator?.creator_profile?.review_count,
      selectedCreator?.contract?.creator?.creator_profile?.bio,
      selectedCreator?.contract?.creator?.creator_profile?.shipping_address,
      selectedCreator?.creator?.creator_profile?.shipping_address,
      hydratedCreatorUser?.id,
      hydratedCreatorUser?.creator_profile?.shipping_address,
      creatorProfileId,
      isIndividualCreator,
    ]
  );

  const messageCampaignId = useMemo(() => {
    if (isIndividualCreator) {
      return selectedCreatorContractCampaignId || null;
    }
    return selectedCampaignId || null;
  }, [isIndividualCreator, selectedCreatorContractCampaignId, selectedCampaignId]);

  const applicationPitch = useMemo(() => {
    const raw =
      selectedCreator?.pitch ||
      selectedCreator?.custom_message ||
      selectedCreator?.application?.pitch ||
      selectedCreator?.application?.custom_message ||
      selectedCreator?.contract?.application?.pitch ||
      selectedCreator?.contract?.application?.custom_message ||
      "";
    const trimmed = typeof raw === "string" ? raw.trim() : "";
    return trimmed.length > 0 ? trimmed : null;
  }, [
    selectedCreator?.pitch,
    selectedCreator?.custom_message,
    selectedCreator?.application?.pitch,
    selectedCreator?.application?.custom_message,
    selectedCreator?.contract?.application?.pitch,
    selectedCreator?.contract?.application?.custom_message,
  ]);

  const messageThreadHook = useMessageThread(
    creatorUserId,
    messageCampaignId,
    null,
    applicationPitch
  );

  const handleMessageClick = () => {
    if (!messageCampaignId) {
      return;
    }

    messageThreadHook.openMessageModal(messageCampaignId);
  };

  const privateNotes = getNotesByCreatorProfileState.data || [];

  // Use stable references to prevent unnecessary recalculations
  const individualContractsData = getIndividualContractsState.data;
  const multiContractsData = getContractsState.data;
  const individualContractsLength = Array.isArray(individualContractsData)
    ? individualContractsData.length
    : 0;
  const multiContractsLength = Array.isArray(multiContractsData) ? multiContractsData.length : 0;

  const contracts = useMemo(() => {
    if (isIndividualCreator) {
      return Array.isArray(individualContractsData) ? individualContractsData : [];
    }
    return Array.isArray(multiContractsData) ? multiContractsData : [];
  }, [isIndividualCreator, individualContractsLength, multiContractsLength]);

  const selectedContract = useMemo(() => {
    if (!selectedCreator || !contracts || contracts.length === 0) return null;

    if (isIndividualCreator) {
      return (
        contracts.find((contract) => {
          const contractCreatorId =
            contract.creator?.id || contract.creatorId || contract.creator_id;
          const contractId = contract.id;
          return (
            contractCreatorId === creatorUserId ||
            contractId === selectedCreator.contractId ||
            contractId === selectedCreator.id
          );
        }) || contracts[0]
      );
    }

    const possibleCreatorIds = [creatorProfileId, creatorUserId].filter(Boolean);
    return (
      contracts.find((contract) => {
        const contractCreatorId = contract.creator?.id || contract.creatorId || contract.creator_id;
        return possibleCreatorIds.includes(contractCreatorId);
      }) || contracts[0]
    );
  }, [
    contracts,
    selectedCreator?.id,
    selectedCreator?.contractId,
    creatorProfileId,
    creatorUserId,
    isIndividualCreator,
  ]);

  // Individual collaboration contracts list is fetched by the parent (Active: use-active-brand, Completed: brand handleToggleChange). This hook only reads from Redux — do not dispatch here or the right pane mounts/unmounts on loading and causes an infinite loop on Completed tab.

  const effectiveCampaignId = useMemo(() => {
    if (isIndividualCreator) {
      return selectedCreatorContractCampaignId || null;
    }
    return selectedCampaignId || null;
  }, [isIndividualCreator, selectedCreatorContractCampaignId, selectedCampaignId]);

  useEffect(() => {
    if (creatorMode) return;
    if (!selectedCreator) return;
    if (!creatorProfileId) return;
    if (!effectiveCampaignId) return;

    // Create a unique key for this combination - only depends on actual IDs
    const currentKey = `${effectiveCampaignId}-${creatorProfileId}-${isIndividualCreator}`;

    // Prevent duplicate API calls - check if we already called with this exact key
    if (lastCalledKeysRef.current.notes === currentKey) {
      return;
    }

    // Update the ref BEFORE making the call to prevent race conditions
    lastCalledKeysRef.current.notes = currentKey;

    if (isIndividualCreator) {
      dispatch(
        getCampaignNotesByCreatorProfile({ campaignId: effectiveCampaignId, creatorProfileId })
      );
    } else {
      dispatch(getContractsByCampaign(effectiveCampaignId));
      dispatch(
        getCampaignNotesByCreatorProfile({ campaignId: effectiveCampaignId, creatorProfileId })
      );
    }
  }, [
    dispatch,
    effectiveCampaignId,
    creatorProfileId,
    isIndividualCreator,
    creatorMode,
    selectedCreator?.id,
  ]);

  useEffect(() => {
    if (!effectiveCampaignId || !creatorUserId) return;

    // Create a unique key - only depends on actual IDs
    const currentKey = `${effectiveCampaignId}-${creatorUserId}`;

    // Prevent duplicate API calls
    if (lastCalledKeysRef.current.timeline === currentKey) {
      return;
    }

    // Update the ref BEFORE making the call
    lastCalledKeysRef.current.timeline = currentKey;

    dispatch(getTimeline({ campaignId: effectiveCampaignId, creatorId: creatorUserId }));
  }, [dispatch, effectiveCampaignId, creatorUserId]);

  const handleEditNote = (noteId) => {
    const note = privateNotes.find((n) => n.id === noteId);
    if (note) {
      setEditingNote(noteId);
      setNewNoteText(note.text || note.note || "");
    }
  };

  const handleSaveEditNote = async (noteId) => {
    if (!creatorProfileId || !effectiveCampaignId) return;

    await dispatch(
      updateCampaignNote({
        noteId,
        noteData: { text: newNoteText },
      })
    ).unwrap();

    setEditingNote(null);
    setNewNoteText("");
    setTextareaKey((prev) => prev + 1);

    if (!creatorMode) {
      dispatch(
        getCampaignNotesByCreatorProfile({ campaignId: effectiveCampaignId, creatorProfileId })
      );
    }
  };

  const handleCancelEditNote = () => {
    setEditingNote(null);
    setNewNoteText("");
    setTextareaKey((prev) => prev + 1);
  };

  const handleDeleteNote = async (noteId) => {
    if (!creatorProfileId || !effectiveCampaignId) return;

    await dispatch(deleteCampaignNote(noteId)).unwrap();

    if (!creatorMode) {
      dispatch(
        getCampaignNotesByCreatorProfile({ campaignId: effectiveCampaignId, creatorProfileId })
      );
    }
  };

  const handleSaveNewNote = async () => {
    if (!newNoteText.trim() || !creatorProfileId || !effectiveCampaignId) return;

    await dispatch(
      createCampaignNote({
        campaignId: effectiveCampaignId,
        creatorProfileId: creatorProfileId,
        noteData: { text: newNoteText.trim() },
      })
    ).unwrap();

    setNewNoteText("");
    setTextareaKey((prev) => prev + 1);

    if (!creatorMode) {
      dispatch(
        getCampaignNotesByCreatorProfile({ campaignId: effectiveCampaignId, creatorProfileId })
      );
    }
  };

  const handleCancelNewNote = () => {
    setNewNoteText("");
    setTextareaKey((prev) => prev + 1);
  };

  const timelineSteps = getTimelineState?.data?.data || [];

  let creatorTimelineSteps = timelineSteps.filter((step) => {
    const stepCreatorId =
      step.creator?.id || step.creator_id || step.creator?.user_id || step.creator_user_id;
    return stepCreatorId === creatorUserId;
  });

  if (creatorTimelineSteps.length === 0 && timelineSteps.length > 0) {
    creatorTimelineSteps = timelineSteps;
  }

  const hasPublishedPostStep = creatorTimelineSteps.some(
    (s) => s.step === TIMELINE_STEPS.FINAL_PUBLISHED
  );

  const areAllStepsComplete = (() => {
    if (!creatorTimelineSteps.length) return false;
    if (hasPublishedPostStep) {
      return creatorTimelineSteps.every((s) => s.status === TIMELINE_STATUS.COMPLETED);
    }
    return creatorTimelineSteps.every((step) => {
      if (step.step === TIMELINE_STEPS.CONTENT_RECORDED) {
        return step.status === TIMELINE_STATUS.COMPLETED;
      }
      if (step.step === TIMELINE_STEPS.DRAFT_REVIEW) {
        return (
          step.status === TIMELINE_STATUS.COMPLETED || step.status === TIMELINE_STATUS.APPROVED
        );
      }
      return step.status === TIMELINE_STATUS.COMPLETED;
    });
  })();

  const isMarkCompleteDisabled = !areAllStepsComplete;

  const markCompleteDisabledTitle = areAllStepsComplete
    ? ""
    : hasPublishedPostStep
      ? "Final content must be published before completion"
      : "Complete all campaign steps before marking complete";

  const handleMarkCompleteClick = () => {
    setShowMarkCompleteModal(true);
  };

  const handleCancelMarkComplete = () => {
    setShowMarkCompleteModal(false);
    setMarkCompleteRating(0);
    setMarkCompleteFeedback("");
  };

  const handleConfirmMarkComplete = async () => {
    if (
      !selectedContract ||
      !effectiveCampaignId ||
      !creatorProfileId ||
      !creatorUserId ||
      markCompleteRating === 0
    )
      return;

    setIsMarkingComplete(true);
    await dispatch(
      createCampaignReview({
        campaignId: effectiveCampaignId,
        creatorProfileId,
        reviewData: {
          rating: markCompleteRating,
          review: markCompleteFeedback || null,
        },
      })
    ).unwrap();

    await dispatch(
      markCreatorComplete({ campaignId: effectiveCampaignId, creatorId: creatorUserId })
    ).unwrap();

    dispatch(getBrandTasks(null));

    if (isIndividualCreator) {
      // Refetch only the currently visible dataset.
      // Both active and completed screens share the same Redux slice key, so
      // fetching both back-to-back can overwrite Active data with Completed data.
      const shouldFetchCompleted = filters?.status === "COMPLETED";
      await dispatch(getIndividualCollaborationContracts(shouldFetchCompleted)).unwrap();
      if (onClearCreator) {
        onClearCreator();
      }
    } else {
      await dispatch(getAllBrandCampaigns()).unwrap();
      if (selectedCampaign?.id) {
        await dispatch(
          getHiredCreators({
            campaignId: selectedCampaign.id,
            filters: filters,
          })
        ).unwrap();
        // Refetch combined demographics so audience panel reflects remaining creators
        dispatch(fetchCampaignCombinedDemographics({ campaignId: selectedCampaign.id }));
      }
      if (onClearCreator) {
        onClearCreator();
      }
    }

    setShowMarkCompleteModal(false);
    setMarkCompleteRating(0);
    setMarkCompleteFeedback("");
    setIsMarkingComplete(false);
    onPipelineUpdated?.();
  };

  // Format shipping address for display
  const formatShippingAddress = useCallback((address) => {
    if (!address) return null;

    const lines = [];
    if (address.street) lines.push(address.street);
    if (address.line2) lines.push(address.line2);
    if (address.line3) lines.push(address.line3);

    const cityStateZip = [address.city, address.state, address.zipCode].filter(Boolean).join(", ");

    if (cityStateZip) lines.push(cityStateZip);
    if (address.country) lines.push(address.country);

    return lines;
  }, []);

  // Copy shipping address to clipboard
  const handleCopyShippingAddress = useCallback(
    async (address) => {
      if (!address) return false;

      const addressLines = formatShippingAddress(address);
      if (!addressLines || addressLines.length === 0) return false;

      const formattedAddress = addressLines.join("\n");

      try {
        await navigator.clipboard.writeText(formattedAddress);
        return true;
      } catch (error) {
        console.error("Failed to copy address:", error);
        return false;
      }
    },
    [formatShippingAddress]
  );

  // Handle copy shipping address with state management
  const onCopyShippingAddress = useCallback(
    async (address) => {
      const success = await handleCopyShippingAddress(address);
      if (success) {
        setIsAddressCopied(true);
        setTimeout(() => {
          setIsAddressCopied(false);
        }, 2000);
      }
    },
    [handleCopyShippingAddress]
  );

  const handleViewCreatorPortfolio = useCallback(() => {
    if (creatorUserId) {
      window.open(`/creator-profile/${creatorUserId}`, "_blank", "noopener,noreferrer");
    }
  }, [creatorUserId]);

  return {
    messageThreadHook,
    handleMessageClick,
    creator,
    creatorUserId,
    formatShippingAddress,
    handleCopyShippingAddress,
    onCopyShippingAddress,
    isAddressCopied,
    privateNotes,
    editingNote,
    newNoteText,
    setNewNoteText,
    textareaKey,
    handleEditNote,
    handleSaveEditNote,
    handleCancelEditNote,
    handleDeleteNote,
    handleSaveNewNote,
    handleCancelNewNote,
    isNotesLoading: getNotesByCreatorProfileState.isLoading,
    isCreateNoteLoading: createNoteState.isLoading,
    isUpdateNoteLoading: updateNoteState.isLoading,
    isDeleteNoteLoading: deleteNoteState.isLoading,
    isContractsLoading: isIndividualCreator
      ? getIndividualContractsState.isLoading
      : getContractsState.isLoading,
    isUpdateCampaignLoading: updateCampaignState.isLoading,
    selectedContract,
    contracts,
    showMarkCompleteModal,
    isMarkingComplete,
    isMarkCompleteDisabled,
    markCompleteDisabledTitle,
    markCompleteRating,
    setMarkCompleteRating,
    markCompleteFeedback,
    setMarkCompleteFeedback,
    handleMarkCompleteClick,
    handleCancelMarkComplete,
    handleConfirmMarkComplete,
    handleViewCreatorPortfolio,
  };
};

export default useDeliverablesProgress;
