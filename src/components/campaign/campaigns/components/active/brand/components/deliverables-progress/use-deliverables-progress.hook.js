import { avatar } from "@/common/constants/auth.constant";
import { getUser, isCreatorMode } from "@/common/utils/users.util";
import {
  createCampaignNote,
  deleteCampaignNote,
  getCampaignNotes,
  getCampaignNotesByCreatorProfile,
  updateCampaignNote,
} from "@/provider/features/campaign-notes/campaign-notes.slice";
import { createCampaignReview } from "@/provider/features/campaign-reviews/campaign-reviews.slice";
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
import { useEffect, useState } from "react";
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

  const { createCampaignReview: createReviewState } = useSelector((state) => state.campaignReviews);

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

  const { updateCampaign: updateCampaignState, markCampaignComplete: markCampaignCompleteState } =
    useSelector((state) => state.campaigns);

  const { getTimeline: getTimelineState } = useSelector((state) => state.campaignTimeline);

  const [project] = useState({
    deliverables: [
      { id: 1, completed: true },
      { id: 2, completed: false },
      { id: 3, completed: false },
      { id: 4, completed: false },
    ],
  });

  const [editingNote, setEditingNote] = useState(null);
  const [newNoteText, setNewNoteText] = useState("");

  const [showMarkCompleteModal, setShowMarkCompleteModal] = useState(false);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [markCompleteRating, setMarkCompleteRating] = useState(0);
  const [markCompleteFeedback, setMarkCompleteFeedback] = useState("");
  const creator = selectedCreator
    ? {
        id: selectedCreator.id,
        name: `${selectedCreator.name || ""}`.trim() || "Creator",
        image: selectedCreator.image || avatar,
        avatar: selectedCreator.image || avatar,
        isOnline: true,
        location: `${selectedCreator.location || ""}`.trim() || "Location not specified",
        rating: selectedCreator.rating || 0,
        bio: selectedCreator.bio || "No bio available",
        age: selectedCreator.age,
      }
    : {
        id: "unknown",
        name: "Creator",
        image: avatar,
        avatar,
        isOnline: false,
        location: "Location not specified",
        rating: 0,
        bio: "No bio available",
      };

  const creatorUserId = selectedCreator?.creatorUserId || selectedCreator?.id;
  const messageThreadHook = useMessageThread(creatorUserId);
  const creatorProfileId = selectedCreator?.id || user?.creator_profile?.id;

  const privateNotes = creatorProfileId
    ? getNotesByCreatorProfileState.data || []
    : getNotesState.data || [];

  const contracts =
    isIndividualCreator || campaignId?.startsWith("individual-")
      ? getIndividualContractsState.data || []
      : getContractsState.data || [];

  const selectedContract =
    contracts.find((contract) => {
      const possibleCreatorIds = [creatorProfileId, creatorUserId].filter(Boolean);
      const contractCreatorId = contract.creator?.id || contract.creatorId || contract.creator_id;
      return possibleCreatorIds.includes(contractCreatorId);
    }) || contracts[0];

  useEffect(() => {
    if (isIndividualCreator || campaignId?.startsWith("individual-")) {
      dispatch(getIndividualCollaborationContracts(false));
    }
  }, [dispatch, isIndividualCreator, campaignId]);

  useEffect(() => {
    if (isIndividualCreator || campaignId?.startsWith("individual-")) {
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
  }, [dispatch, campaignId, creatorProfileId, isIndividualCreator, creatorMode]);

  useEffect(() => {
    if (isIndividualCreator || campaignId?.startsWith("individual-")) {
      return;
    }

    if (
      campaignId &&
      campaignId !== "temp-campaign-id" &&
      contracts.length > 0 &&
      creatorProfileId
    ) {
      dispatch(getTimeline(campaignId));
    }
  }, [dispatch, campaignId, contracts.length, creatorProfileId, isIndividualCreator]);

  const handleEditNote = (noteId) => {
    const note = privateNotes.find((n) => n.id === noteId);
    if (note) {
      setEditingNote(noteId);
      setNewNoteText(note.text);
    }
  };

  const handleSaveEditNote = async (noteId) => {
    try {
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
    } catch (error) {}
  };

  const handleCancelEditNote = () => {
    setEditingNote(null);
    setNewNoteText("");
  };

  const handleDeleteNote = async (noteId) => {
    await dispatch(deleteCampaignNote(noteId)).unwrap();

    // Refresh notes after deleting
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
    if (!newNoteText.trim()) return;

    if (!creatorProfileId) {
      return;
    }

    try {
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
    } catch (error) {}
  };

  const handleCancelNewNote = () => {
    setNewNoteText("");
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

  const allDeliverablesComplete = project.deliverables.every(
    (deliverable) => deliverable.completed
  );

  const isMarkCompleteDisabled =
    isIndividualCreator || campaignId?.startsWith("individual-")
      ? !allDeliverablesComplete
      : !areAllStepsComplete;
  const handleMarkCompleteClick = () => {
    setShowMarkCompleteModal(true);
  };

  const handleCancelMarkComplete = () => {
    setShowMarkCompleteModal(false);
    setMarkCompleteRating(0);
    setMarkCompleteFeedback("");
  };

  const handleConfirmMarkComplete = async () => {
    if (!selectedContract || !campaignId || !creatorProfileId || markCompleteRating === 0) return;

    setIsMarkingComplete(true);
    try {
      await dispatch(
        createCampaignReview({
          campaignId,
          creatorProfileId,
          reviewData: {
            rating: markCompleteRating,
            review: markCompleteFeedback || null,
          },
        })
      ).unwrap();

      await dispatch(markCampaignComplete(campaignId)).unwrap();
      await dispatch(getAllBrandCampaigns()).unwrap();

      setShowMarkCompleteModal(false);
      setMarkCompleteRating(0);
      setMarkCompleteFeedback("");
    } catch (error) {
    } finally {
      setIsMarkingComplete(false);
    }
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
  };
};

export default useDeliverablesProgress;
