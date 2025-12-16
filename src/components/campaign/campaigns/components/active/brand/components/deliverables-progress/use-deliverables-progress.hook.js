import { avatar } from "@/common/constants/auth.constant";
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
  getCampaignReviewsByCreatorProfile,
  getReviewStatus,
} from "@/provider/features/campaign-reviews/campaign-reviews.slice";
import {
  getAllBrandCampaigns,
  markCampaignComplete,
} from "@/provider/features/campaigns/campaigns.slice";
import {
  getContractsByCampaign,
  getIndividualCollaborationContracts,
} from "@/provider/features/contracts/contracts.slice";
import { getTimeline } from "@/provider/features/campaign-timeline/campaign-timeline.slice";
import { TIMELINE_STATUS } from "@/common/constants/campaign.constant";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import useMessageThread from "../../../../message-thread-modal/use-message-thread.hook";

const useDeliverablesProgress = (
  selectedCampaign = null,
  selectedCreator = null,
  isIndividualCreator = false
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

  const creatorUserId = isIndividualCreator
    ? selectedCreator?.creatorUserId || selectedCreator?.creator?.id
    : selectedCreator?.creatorUserId || selectedCreator?.creator?.id || selectedCreator?.id;

  const creatorProfileId = isIndividualCreator
    ? selectedCreator?.creator?.creator_profile?.id ||
      selectedCreator?.contract?.creator?.creator_profile?.id ||
      null
    : selectedCreator?.id ||
      selectedCreator?.creator?.creator_profile?.id ||
      user?.creator_profile?.id;

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
      return {
        id: creatorProfileId || selectedCreator.creatorUserId || selectedCreator.id,
        name: `${selectedCreator.name || ""}`.trim() || "Creator",
        image: selectedCreator.image || avatar,
        avatar: selectedCreator.image || avatar,
        isOnline: true,
        location: `${selectedCreator.location || ""}`.trim() || "Location not specified",
        rating: parseFloat(selectedCreator.rating) || 0,
        bio: selectedCreator.bio || "No bio available",
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
        bio: profile?.bio || selectedCreator.bio || "No bio available",
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
      bio: selectedCreator.bio || "No bio available",
      age: selectedCreator.age,
    };
  };

  const creator = getCreatorData();

  const getMessageCampaignId = () => {
    if (isIndividualCreator) {
      return (
        selectedCreator?.campaign_id ||
        selectedCreator?.campaign?.id ||
        selectedCreator?.contract?.campaignId ||
        null
      );
    }
    return selectedCampaign?.id || null;
  };

  const messageCampaignId = getMessageCampaignId();
  const messageThreadHook = useMessageThread(creatorUserId, messageCampaignId);

  const handleMessageClick = () => {
    const currentCampaignId = getMessageCampaignId();

    if (!currentCampaignId) {
      return;
    }

    messageThreadHook.openMessageModal(currentCampaignId);
  };

  const privateNotes = creatorProfileId
    ? getNotesByCreatorProfileState.data || []
    : getNotesState.data || [];

  const contracts = isIndividualCreator
    ? getIndividualContractsState.data || []
    : getContractsState.data || [];

  const selectedContract = useMemo(() => {
    if (!selectedCreator || contracts.length === 0) return null;

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
  }, [contracts, selectedCreator, creatorProfileId, creatorUserId, isIndividualCreator]);

  useEffect(() => {
    if (isIndividualCreator) {
      dispatch(getIndividualCollaborationContracts(false));
    }
  }, [dispatch, isIndividualCreator]);

  useEffect(() => {
    if (isIndividualCreator) {
      const effectiveCampaignId =
        selectedCreator?.campaign_id ||
        selectedCreator?.campaign?.id ||
        selectedCreator?.contract?.campaignId;
      if (effectiveCampaignId && creatorProfileId && !creatorMode) {
        dispatch(
          getCampaignNotesByCreatorProfile({
            campaignId: effectiveCampaignId,
            creatorProfileId: creatorProfileId,
          })
        );
      }
      return;
    }

    if (selectedCampaign?.id) {
      dispatch(getContractsByCampaign(selectedCampaign.id));

      if (creatorProfileId && !creatorMode) {
        dispatch(
          getCampaignNotesByCreatorProfile({
            campaignId: selectedCampaign.id,
            creatorProfileId: creatorProfileId,
          })
        );
      } else if (!creatorMode) {
        dispatch(getCampaignNotes(selectedCampaign.id));
      }
    }
  }, [
    dispatch,
    selectedCampaign?.id,
    creatorProfileId,
    isIndividualCreator,
    creatorMode,
    selectedCreator,
  ]);

  useEffect(() => {
    const effectiveCampaignId = isIndividualCreator
      ? selectedCreator?.campaign_id ||
        selectedCreator?.campaign?.id ||
        selectedCreator?.contract?.campaignId
      : selectedCampaign?.id;

    if (effectiveCampaignId) {
      if (isIndividualCreator) {
        dispatch(getTimeline(effectiveCampaignId));
      } else if (contracts.length > 0 && creatorProfileId) {
        dispatch(getTimeline(effectiveCampaignId));
      }
    }
  }, [
    dispatch,
    selectedCampaign?.id,
    selectedCreator,
    contracts.length,
    creatorProfileId,
    isIndividualCreator,
  ]);

  const handleEditNote = (noteId) => {
    const note = privateNotes.find((n) => n.id === noteId);
    if (note) {
      setEditingNote(noteId);
      setNewNoteText(note.text);
    }
  };

  const handleSaveEditNote = async (noteId) => {
    const effectiveCampaignId = isIndividualCreator
      ? selectedCreator?.campaign_id ||
        selectedCreator?.campaign?.id ||
        selectedCreator?.contract?.campaignId
      : selectedCampaign?.id;

    await dispatch(
      updateCampaignNote({
        noteId,
        noteData: { text: newNoteText },
      })
    ).unwrap();

    setEditingNote(null);
    setNewNoteText("");
    setTextareaKey((prev) => prev + 1);

    if (effectiveCampaignId) {
      if (creatorProfileId && !creatorMode) {
        dispatch(
          getCampaignNotesByCreatorProfile({
            campaignId: effectiveCampaignId,
            creatorProfileId: creatorProfileId,
          })
        );
      } else if (!creatorMode) {
        dispatch(getCampaignNotes(effectiveCampaignId));
      }
    }
  };

  const handleCancelEditNote = () => {
    setEditingNote(null);
    setNewNoteText("");
    setTextareaKey((prev) => prev + 1);
  };

  const handleDeleteNote = async (noteId) => {
    const effectiveCampaignId = isIndividualCreator
      ? selectedCreator?.campaign_id ||
        selectedCreator?.campaign?.id ||
        selectedCreator?.contract?.campaignId
      : selectedCampaign?.id;

    await dispatch(deleteCampaignNote(noteId)).unwrap();

    if (effectiveCampaignId) {
      if (creatorProfileId && !creatorMode) {
        dispatch(
          getCampaignNotesByCreatorProfile({
            campaignId: effectiveCampaignId,
            creatorProfileId: creatorProfileId,
          })
        );
      } else if (!creatorMode) {
        dispatch(getCampaignNotes(effectiveCampaignId));
      }
    }
  };

  const handleSaveNewNote = async () => {
    if (!newNoteText.trim() || !creatorProfileId) return;

    const effectiveCampaignId = isIndividualCreator
      ? selectedCreator?.campaign_id ||
        selectedCreator?.campaign?.id ||
        selectedCreator?.contract?.campaignId
      : selectedCampaign?.id;

    if (!effectiveCampaignId) return;

    await dispatch(
      createCampaignNote({
        campaignId: effectiveCampaignId,
        creatorProfileId: creatorProfileId,
        noteData: { text: newNoteText.trim() },
      })
    ).unwrap();

    setNewNoteText("");
    setTextareaKey((prev) => prev + 1);

    if (creatorProfileId && !creatorMode) {
      dispatch(
        getCampaignNotesByCreatorProfile({
          campaignId: effectiveCampaignId,
          creatorProfileId: creatorProfileId,
        })
      );
    } else if (!creatorMode) {
      dispatch(getCampaignNotes(effectiveCampaignId));
    }
  };

  const handleCancelNewNote = () => {
    setNewNoteText("");
    setTextareaKey((prev) => prev + 1);
  };

  useEffect(() => {
    const effectiveCampaignId = isIndividualCreator
      ? selectedCreator?.campaign_id ||
        selectedCreator?.campaign?.id ||
        selectedCreator?.contract?.campaignId
      : selectedCampaign?.id;

    if (effectiveCampaignId && creatorProfileId) {
      dispatch(getReviewStatus({ campaignId: effectiveCampaignId, creatorProfileId }));
    }
  }, [dispatch, selectedCampaign?.id, selectedCreator, creatorProfileId, isIndividualCreator]);

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
    const effectiveCampaignId = isIndividualCreator
      ? selectedCreator?.campaign_id ||
        selectedCreator?.campaign?.id ||
        selectedCreator?.contract?.campaignId
      : selectedCampaign?.id;

    if (!selectedContract || !effectiveCampaignId || !creatorProfileId || markCompleteRating === 0)
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

    await dispatch(markCampaignComplete(effectiveCampaignId)).unwrap();

    if (isIndividualCreator) {
      await dispatch(getIndividualCollaborationContracts(false)).unwrap();
    } else {
      await dispatch(getAllBrandCampaigns()).unwrap();
    }

    setShowMarkCompleteModal(false);
    setMarkCompleteRating(0);
    setMarkCompleteFeedback("");
    setIsMarkingComplete(false);
  };

  return {
    messageThreadHook,
    handleMessageClick,
    creator,
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
    isNotesLoading: creatorProfileId
      ? getNotesByCreatorProfileState.isLoading
      : getNotesState.isLoading,
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
  };
};

export default useDeliverablesProgress;
