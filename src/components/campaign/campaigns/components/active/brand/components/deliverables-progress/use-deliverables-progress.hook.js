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
  updateCampaignReview,
  deleteCampaignReview,
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
  campaignId = "temp-campaign-id",
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
    getCampaignReviews: getReviewsState,
    getCampaignReviewsByCreatorProfile: getReviewsByCreatorProfileState,
    createCampaignReview: createReviewState,
    updateCampaignReview: updateReviewState,
    deleteCampaignReview: deleteReviewState,
    getReviewStatus: getReviewStatusState,
  } = useSelector((state) => state.campaignReviews || {});

  const [editingNote, setEditingNote] = useState(null);
  const [newNoteText, setNewNoteText] = useState("");

  const [editingReview, setEditingReview] = useState(null);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(0);

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
    : selectedCreator?.id || user?.creator_profile?.id;
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
        rating: selectedCreator.rating || 0,
        bio: selectedCreator.bio || "No bio available",
        age: selectedCreator.age,
      };
    }

    return {
      id: selectedCreator.id,
      name: `${selectedCreator.name || ""}`.trim() || "Creator",
      image: selectedCreator.image || avatar,
      avatar: selectedCreator.image || avatar,
      isOnline: true,
      location: `${selectedCreator.location || ""}`.trim() || "Location not specified",
      rating: selectedCreator.rating || 0,
      bio: selectedCreator.bio || "No bio available",
      age: selectedCreator.age,
    };
  };

  const creator = getCreatorData();

  const messageCampaignId = isIndividualCreator
    ? selectedCreator?.campaign_id ||
      selectedCreator?.campaign?.id ||
      selectedCreator?.contract?.campaignId
    : campaignId;

  const messageThreadHook = useMessageThread(creatorUserId, messageCampaignId);

  const privateNotes = creatorProfileId
    ? getNotesByCreatorProfileState.data || []
    : getNotesState.data || [];

  const contracts =
    isIndividualCreator || campaignId?.startsWith("individual-")
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
    if (isIndividualCreator || campaignId?.startsWith("individual-")) {
      dispatch(getIndividualCollaborationContracts(false));
    }
  }, [dispatch, isIndividualCreator, campaignId]);

  useEffect(() => {
    if (isIndividualCreator || campaignId?.startsWith("individual-")) {
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

    if (campaignId && campaignId !== "temp-campaign-id") {
      dispatch(getContractsByCampaign(campaignId));

      if (creatorProfileId && !creatorMode) {
        dispatch(
          getCampaignNotesByCreatorProfile({
            campaignId,
            creatorProfileId: creatorProfileId,
          })
        );
      } else if (!creatorMode) {
        dispatch(getCampaignNotes(campaignId));
      }
    }
  }, [dispatch, campaignId, creatorProfileId, isIndividualCreator, creatorMode, selectedCreator]);

  useEffect(() => {
    const effectiveCampaignId = isIndividualCreator
      ? selectedCreator?.campaign_id ||
        selectedCreator?.campaign?.id ||
        selectedCreator?.contract?.campaignId
      : campaignId;

    if (effectiveCampaignId && effectiveCampaignId !== "temp-campaign-id") {
      if (isIndividualCreator) {
        dispatch(getTimeline(effectiveCampaignId));
      } else if (contracts.length > 0 && creatorProfileId) {
        dispatch(getTimeline(effectiveCampaignId));
      }
    }
  }, [
    dispatch,
    campaignId,
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
    await dispatch(
      updateCampaignNote({
        noteId,
        noteData: { text: newNoteText },
      })
    ).unwrap();

    setTimeout(() => {
      setEditingNote(null);
      setNewNoteText("");
    }, 0);

    if (creatorProfileId && !creatorMode) {
      dispatch(
        getCampaignNotesByCreatorProfile({
          campaignId,
          creatorProfileId: creatorProfileId,
        })
      );
    } else if (!creatorMode) {
      dispatch(getCampaignNotes(campaignId));
    }
  };

  const handleCancelEditNote = () => {
    setEditingNote(null);
    setNewNoteText("");
  };

  const handleDeleteNote = async (noteId) => {
    await dispatch(deleteCampaignNote(noteId)).unwrap();

    if (creatorProfileId && !creatorMode) {
      dispatch(
        getCampaignNotesByCreatorProfile({
          campaignId,
          creatorProfileId: creatorProfileId,
        })
      );
    } else if (!creatorMode) {
      dispatch(getCampaignNotes(campaignId));
    }
  };

  const handleSaveNewNote = async () => {
    if (!newNoteText.trim() || !creatorProfileId) return;

    await dispatch(
      createCampaignNote({
        campaignId,
        creatorProfileId: creatorProfileId,
        noteData: { text: newNoteText.trim() },
      })
    ).unwrap();

    setTimeout(() => {
      setNewNoteText("");
    }, 0);

    if (creatorProfileId && !creatorMode) {
      dispatch(
        getCampaignNotesByCreatorProfile({
          campaignId,
          creatorProfileId: creatorProfileId,
        })
      );
    } else if (!creatorMode) {
      dispatch(getCampaignNotes(campaignId));
    }
  };

  const handleCancelNewNote = () => {
    setNewNoteText("");
  };

  useEffect(() => {
    const effectiveCampaignId = isIndividualCreator
      ? selectedCreator?.campaign_id ||
        selectedCreator?.campaign?.id ||
        selectedCreator?.contract?.campaignId
      : campaignId;

    if (effectiveCampaignId && effectiveCampaignId !== "temp-campaign-id" && creatorProfileId) {
      dispatch(
        getCampaignReviewsByCreatorProfile({ campaignId: effectiveCampaignId, creatorProfileId })
      );
      dispatch(getReviewStatus({ campaignId: effectiveCampaignId, creatorProfileId }));
    }
  }, [dispatch, campaignId, selectedCreator, creatorProfileId, isIndividualCreator]);

  const campaignReviews = creatorProfileId
    ? getReviewsByCreatorProfileState?.data?.data || []
    : getReviewsState?.data?.data || [];

  const reviewStatus = getReviewStatusState?.data?.data || null;

  const handleEditReview = (reviewId) => {
    const review = campaignReviews.find((r) => r.id === reviewId);
    if (review) {
      setEditingReview(reviewId);
      setNewReviewText(review.review || "");
      setNewReviewRating(review.rating || 0);
    }
  };

  const handleSaveEditReview = async (reviewId) => {
    if (!newReviewText?.trim() || newReviewRating === 0) return;

    await dispatch(
      updateCampaignReview({
        reviewId,
        reviewData: {
          rating: newReviewRating,
          review: newReviewText.trim(),
        },
      })
    ).unwrap();

    const effectiveCampaignId = isIndividualCreator
      ? selectedCreator?.campaign_id ||
        selectedCreator?.campaign?.id ||
        selectedCreator?.contract?.campaignId
      : campaignId;

    if (effectiveCampaignId && creatorProfileId) {
      dispatch(
        getCampaignReviewsByCreatorProfile({ campaignId: effectiveCampaignId, creatorProfileId })
      );
      dispatch(getReviewStatus({ campaignId: effectiveCampaignId, creatorProfileId }));
    }

    setEditingReview(null);
    setNewReviewText("");
    setNewReviewRating(0);
  };

  const handleCancelEditReview = () => {
    setEditingReview(null);
    setNewReviewText("");
    setNewReviewRating(0);
  };

  const handleDeleteReview = async (reviewId) => {
    await dispatch(deleteCampaignReview(reviewId)).unwrap();

    const effectiveCampaignId = isIndividualCreator
      ? selectedCreator?.campaign_id ||
        selectedCreator?.campaign?.id ||
        selectedCreator?.contract?.campaignId
      : campaignId;

    if (effectiveCampaignId && creatorProfileId) {
      dispatch(
        getCampaignReviewsByCreatorProfile({ campaignId: effectiveCampaignId, creatorProfileId })
      );
      dispatch(getReviewStatus({ campaignId: effectiveCampaignId, creatorProfileId }));
    }
  };

  const handleSaveNewReview = async () => {
    if (!newReviewText?.trim() || newReviewRating === 0 || !creatorProfileId) return;

    const effectiveCampaignId = isIndividualCreator
      ? selectedCreator?.campaign_id ||
        selectedCreator?.campaign?.id ||
        selectedCreator?.contract?.campaignId
      : campaignId;

    if (!effectiveCampaignId || effectiveCampaignId === "temp-campaign-id") return;

    await dispatch(
      createCampaignReview({
        campaignId: effectiveCampaignId,
        creatorProfileId,
        reviewData: {
          rating: newReviewRating,
          review: newReviewText.trim(),
        },
      })
    ).unwrap();

    dispatch(
      getCampaignReviewsByCreatorProfile({ campaignId: effectiveCampaignId, creatorProfileId })
    );
    dispatch(getReviewStatus({ campaignId: effectiveCampaignId, creatorProfileId }));

    setNewReviewText("");
    setNewReviewRating(0);
  };

  const handleCancelNewReview = () => {
    setNewReviewText("");
    setNewReviewRating(0);
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
      : campaignId;

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
    creator,
    privateNotes,
    editingNote,
    newNoteText,
    setNewNoteText,
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
    isContractsLoading:
      isIndividualCreator || campaignId?.startsWith("individual-")
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
    campaignReviews,
    editingReview,
    newReviewText,
    setNewReviewText,
    newReviewRating,
    setNewReviewRating,
    handleEditReview,
    handleSaveEditReview,
    handleCancelEditReview,
    handleDeleteReview,
    handleSaveNewReview,
    handleCancelNewReview,
    isReviewsLoading: creatorProfileId
      ? getReviewsByCreatorProfileState.isLoading
      : getReviewsState.isLoading,
    isCreateReviewLoading: createReviewState.isLoading,
    isUpdateReviewLoading: updateReviewState.isLoading,
    isDeleteReviewLoading: deleteReviewState.isLoading,
    reviewStatus,
  };
};

export default useDeliverablesProgress;
