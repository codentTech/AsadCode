import { avatar } from "@/common/constants/auth.constant";
import { TIMELINE_STATUS } from "@/common/constants/campaign.constant";
import { getUser, isCreatorMode } from "@/common/utils/users.util";
import {
  createCampaignNote,
  deleteCampaignNote,
  getCampaignNotes,
  getCampaignNotesByCreatorProfile,
  updateCampaignNote,
} from "@/provider/features/campaign-notes/campaign-notes.slice";
import {
  createCampaignReview,
  getReviewStatus,
  getCampaignReviewsByCreatorProfile,
} from "@/provider/features/campaign-reviews/campaign-reviews.slice";
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
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import useMessageThread from "../../../../message-thread-modal/use-message-thread.hook";

const useDeliverablesProgress = (
  selectedCampaign = null,
  selectedCreator = null,
  isIndividualCreator = false,
  onClearCreator = null,
  filters = { status: "HIRED", sort: "newest" }
) => {
  const creatorMode = isCreatorMode();
  const user = getUser();
  const dispatch = useDispatch();
  const router = useRouter();

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

  const {
    getCampaignReviewsByCreatorProfile: getReviewsByCreatorProfileState,
    createCampaignReview: createReviewState,
    getReviewStatus: getReviewStatusState,
  } = useSelector((state) => state.campaignReviews || {});

  const [editingNote, setEditingNote] = useState(null);
  const [newNoteText, setNewNoteText] = useState("");
  const [textareaKey, setTextareaKey] = useState(0);

  const [showMarkCompleteModal, setShowMarkCompleteModal] = useState(false);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [markCompleteRating, setMarkCompleteRating] = useState(0);
  const [markCompleteFeedback, setMarkCompleteFeedback] = useState("");
  const [isAddressCopied, setIsAddressCopied] = useState(false);

  // Track the last called keys to prevent duplicate calls
  const lastCalledKeysRef = useRef({
    notes: null,
    timeline: null,
    reviews: null,
    individualContracts: false,
  });

  // Track previous mode to detect mode switches
  const prevModeRef = useRef(isIndividualCreator);

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
      const contractProfile =
        contractCreator?.creator_profile || selectedCreator.creator?.creator_profile;

      return {
        id: creatorProfileId || selectedCreator.creatorUserId || selectedCreator.id,
        name: `${selectedCreator.name || ""}`.trim() || "Creator",
        image: selectedCreator.image || contractProfile?.profile_photo_url || avatar,
        avatar: selectedCreator.image || contractProfile?.profile_photo_url || avatar,
        isOnline: true,
        location: `${selectedCreator.location || ""}`.trim() || "Location not specified",
        rating: parseFloat(selectedCreator.rating) || parseFloat(contractProfile?.rating) || 0,
        reviewCount: selectedCreator.reviewCount || contractProfile?.review_count || 0,
        bio: selectedCreator.bio || contractProfile?.bio || "No bio available",
        shippingAddress: contractProfile?.shipping_address || selectedCreator?.creator?.creator_profile?.shipping_address || null,
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
          `${creator.city || ""} ${creator.country || ""}`.trim() ||
          selectedCreator.location ||
          "Location not specified",
        rating: parseFloat(profile?.rating) || parseFloat(selectedCreator.rating) || 0,
        reviewCount: profile?.review_count || selectedCreator.reviewCount || 0,
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

  const messageThreadHook = useMessageThread(creatorUserId, messageCampaignId);

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

  useEffect(() => {
    const modeChanged = prevModeRef.current !== isIndividualCreator;

    if (isIndividualCreator) {
      // Update mode ref immediately to prevent multiple triggers
      if (modeChanged) {
        prevModeRef.current = isIndividualCreator;
        // Reset other refs when mode changes to allow fresh data fetch
        lastCalledKeysRef.current.notes = null;
        lastCalledKeysRef.current.timeline = null;
        lastCalledKeysRef.current.reviews = null;
        lastCalledKeysRef.current.individualContracts = false;
      }

      // Check if we already have data or are currently loading - if yes, don't fetch again
      const hasData =
        Array.isArray(getIndividualContractsState.data) &&
        getIndividualContractsState.data.length > 0;
      const isCurrentlyLoading = getIndividualContractsState.isLoading;

      // Only fetch if mode changed (switching TO individual creator) AND we haven't fetched yet
      // OR if we don't have data and we're not loading and haven't marked as fetched
      const shouldFetch =
        (modeChanged && !lastCalledKeysRef.current.individualContracts) ||
        (!hasData && !isCurrentlyLoading && !lastCalledKeysRef.current.individualContracts);

      if (shouldFetch) {
        // Mark as fetched BEFORE dispatching to prevent duplicate calls
        lastCalledKeysRef.current.individualContracts = true;
        dispatch(getIndividualCollaborationContracts(false));
      }
    } else {
      // Reset flag when switching away from individual creator mode
      if (modeChanged) {
        prevModeRef.current = isIndividualCreator;
        lastCalledKeysRef.current.individualContracts = false;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isIndividualCreator]);

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

  useEffect(() => {
    if (!effectiveCampaignId || !creatorProfileId || creatorMode) return;

    // Create a unique key - only depends on actual IDs
    const currentKey = `${effectiveCampaignId}-${creatorProfileId}`;

    // Prevent duplicate API calls
    if (lastCalledKeysRef.current.reviews === currentKey) {
      return;
    }

    // Update the ref BEFORE making the call
    lastCalledKeysRef.current.reviews = currentKey;

    dispatch(getReviewStatus({ campaignId: effectiveCampaignId, creatorProfileId }));
    dispatch(
      getCampaignReviewsByCreatorProfile({
        campaignId: effectiveCampaignId,
        creatorProfileId: creatorProfileId,
      })
    );
  }, [dispatch, effectiveCampaignId, creatorProfileId, creatorMode]);

  const timelineSteps = getTimelineState?.data?.data || [];

  let creatorTimelineSteps = timelineSteps.filter((step) => {
    const stepCreatorId =
      step.creator?.id || step.creator_id || step.creator?.user_id || step.creator_user_id;
    return stepCreatorId === creatorUserId;
  });

  if (creatorTimelineSteps.length === 0 && timelineSteps.length > 0) {
    creatorTimelineSteps = timelineSteps;
  }

  const areAllStepsComplete =
    creatorTimelineSteps.length >= 3 &&
    creatorTimelineSteps.every((step) => step.status === TIMELINE_STATUS.COMPLETED);

  const isMarkCompleteDisabled = !areAllStepsComplete;

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

    if (isIndividualCreator) {
      // Refetch both active and completed contracts
      await dispatch(getIndividualCollaborationContracts(false)).unwrap();
      await dispatch(getIndividualCollaborationContracts(true)).unwrap();
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
      }
      if (onClearCreator) {
        onClearCreator();
      }
    }

    setShowMarkCompleteModal(false);
    setMarkCompleteRating(0);
    setMarkCompleteFeedback("");
    setIsMarkingComplete(false);
  };

  // Format shipping address for display
  const formatShippingAddress = useCallback((address) => {
    if (!address) return null;

    const lines = [];
    if (address.street) lines.push(address.street);
    if (address.line2) lines.push(address.line2);
    if (address.line3) lines.push(address.line3);

    const cityStateZip = [
      address.city,
      address.state,
      address.zipCode,
    ]
      .filter(Boolean)
      .join(", ");

    if (cityStateZip) lines.push(cityStateZip);
    if (address.country) lines.push(address.country);

    return lines;
  }, []);

  // Copy shipping address to clipboard
  const handleCopyShippingAddress = useCallback(async (address) => {
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
  }, [formatShippingAddress]);

  // Handle copy shipping address with state management
  const onCopyShippingAddress = useCallback(async (address) => {
    const success = await handleCopyShippingAddress(address);
    if (success) {
      setIsAddressCopied(true);
      setTimeout(() => {
        setIsAddressCopied(false);
      }, 2000);
    }
  }, [handleCopyShippingAddress]);
  
  const handleViewCreatorPortfolio = useCallback(() => {
    if (creatorUserId) {
      router.push(`/creator-profile/${creatorUserId}`);
    }
  }, [creatorUserId, router]);

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
    markCompleteRating,
    setMarkCompleteRating,
    markCompleteFeedback,
    setMarkCompleteFeedback,
    handleMarkCompleteClick,
    handleCancelMarkComplete,
    handleConfirmMarkComplete,
    campaignReviews: getReviewsByCreatorProfileState.data || [],
    reviewStatus: getReviewStatusState.data || null,
    isReviewsLoading: getReviewsByCreatorProfileState.isLoading || getReviewStatusState.isLoading,
    handleViewCreatorPortfolio,
  };
};

export default useDeliverablesProgress;
