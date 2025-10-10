import { avatar } from "@/common/constants/auth.constant";
import useCommonHelpers from "@/common/hooks/use-common-helper.hook";
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
  deleteCampaignReview,
  getCampaignReviews,
  getCampaignReviewsByCreatorProfile,
  getReviewStatus,
  updateCampaignReview,
} from "@/provider/features/campaign-reviews/campaign-reviews.slice";
import {
  getAllCampaigns,
  getBrandCampaignsExcludingCompleted,
  markCampaignComplete,
} from "@/provider/features/campaigns/campaigns.slice";
import { getContractsByCampaign } from "@/provider/features/contracts/contracts.slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useMessageThread from "../../../../message-thread-modal/use-message-thread.hook";

const useDeliverablesProgress = (
  campaignId = "temp-campaign-id",
  selectedCampaign = null,
  selectedCreator = null
) => {
  const creatorMode = isCreatorMode();
  const user = getUser();
  const dispatch = useDispatch();
  const { getStatusColor, getStatusIcon } = useCommonHelpers();

  // ==================== REDUX SELECTORS ====================
  const {
    createCampaignReview: createReviewState,
    getCampaignReviews: getReviewsState,
    getCampaignReviewsByCreatorProfile: getReviewsByCreatorProfileState,
    updateCampaignReview: updateReviewState,
    deleteCampaignReview: deleteReviewState,
  } = useSelector((state) => state.campaignReviews);

  const {
    createCampaignNote: createNoteState,
    getCampaignNotes: getNotesState,
    getCampaignNotesByCreatorProfile: getNotesByCreatorProfileState,
    updateCampaignNote: updateNoteState,
    deleteCampaignNote: deleteNoteState,
  } = useSelector((state) => state.campaignNotes);

  const { getContractsByCampaign: getContractsState } = useSelector((state) => state.contracts);

  const { updateCampaign: updateCampaignState, markCampaignComplete: markCampaignCompleteState } =
    useSelector((state) => state.campaigns);

  // ==================== STATE MANAGEMENT ====================

  // Project Management State
  const [project, setProject] = useState({
    title: "Brand Identity Design Package",
    client: "TechStart Inc.",
    totalAmount: 2500,
    timeline: [
      { id: 1, step: "Contract Signed", completed: true, date: "2024-05-15" },
      { id: 2, step: "Submit Content", completed: true, date: "2024-05-20" },
      { id: 3, step: "Content Approved", completed: false, date: "2024-05-25" },
      { id: 4, step: "Payment Released", completed: false, date: "2024-05-30" },
    ],
    deliverables: [
      {
        id: 1,
        title: "Logo Design (3 concepts)",
        deadline: "2024-06-01",
        amount: 800,
        status: "completed",
        completed: true,
      },
      {
        id: 2,
        title: "Brand Guidelines Document",
        deadline: "2024-06-05",
        amount: 600,
        status: "in-progress",
        completed: false,
      },
      {
        id: 3,
        title: "Business Card Design",
        deadline: "2024-06-08",
        amount: 400,
        status: "pending",
        completed: false,
      },
      {
        id: 4,
        title: "Social Media Templates",
        deadline: "2024-06-10",
        amount: 700,
        status: "pending",
        completed: false,
      },
    ],
  });

  // Editing State
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Review State
  const [editingReview, setEditingReview] = useState(null);
  const [editReviewForm, setEditReviewForm] = useState({ review: "", rating: 5 });
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);

  // Double-blind review status
  const [reviewStatus, setReviewStatus] = useState({
    hasBrandReview: false,
    hasCreatorReview: false,
    isUnlocked: false,
  });

  // Notes State
  const [editingNote, setEditingNote] = useState(null);
  const [editNoteForm, setEditNoteForm] = useState({ text: "" });
  const [newNoteText, setNewNoteText] = useState("");

  // Mark Complete Modal State
  const [showMarkCompleteModal, setShowMarkCompleteModal] = useState(false);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);

  // ==================== CREATOR DATA ====================
  // Use real creator data from selectedCreator (matches applications tab structure)
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

  // ==================== HOOKS ====================
  const messageThreadHook = useMessageThread(creator.id);

  // ==================== DATA FROM REDUX ====================
  // Get creator profile ID from the selectedCreator object
  // The selectedCreator.id is the creator profile ID from the applied creators API
  const creatorProfileId = selectedCreator?.id || user?.creator_profile?.id;

  // Use creator-specific notes if creator is selected, otherwise use all campaign notes
  const privateNotes = creatorProfileId
    ? getNotesByCreatorProfileState.data || []
    : getNotesState.data || [];

  // Use creator-specific reviews if creator is selected, otherwise use all campaign reviews
  const campaignReviews = creatorProfileId
    ? getReviewsByCreatorProfileState.data || []
    : getReviewsState.data || [];

  // Get contracts for the campaign
  const contracts = getContractsState.data || [];

  // Find the contract for the selected creator
  const selectedContract =
    contracts.find((contract) => {
      // Try different ID fields that might match
      const possibleCreatorIds = [creatorProfileId].filter(Boolean); // Remove undefined values

      return possibleCreatorIds.includes(contract.creatorId);
    }) || contracts[0]; // Fallback to first contract if no match found

  // ==================== EFFECTS ====================
  useEffect(() => {
    if (campaignId && campaignId !== "temp-campaign-id") {
      // Fetch contracts for the campaign
      dispatch(getContractsByCampaign(campaignId));

      // Fetch notes based on whether a creator is selected
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

      // Fetch reviews based on whether a creator is selected
      if (creatorProfileId) {
        dispatch(
          getCampaignReviewsByCreatorProfile({
            campaignId,
            creatorProfileId: creatorProfileId,
          })
        );
      } else {
        dispatch(getCampaignReviews(campaignId));
      }
    }
  }, [dispatch, campaignId, creatorProfileId]);

  // Fetch double-blind review status
  useEffect(() => {
    const fetchStatus = async () => {
      if (!campaignId || !creatorProfileId || campaignId === "temp-campaign-id") return;
      const res = await dispatch(getReviewStatus({ campaignId, creatorProfileId })).unwrap();
      setReviewStatus(res);
    };
    fetchStatus();
  }, [dispatch, campaignId, creatorProfileId]);

  // ==================== PROJECT MANAGEMENT FUNCTIONS ====================
  const handleEdit = (type, item) => {
    setEditingItem({ type, id: item.id });
    if (type === "deliverable") {
      setEditForm({
        title: item.title,
        deadline: item.deadline,
        amount: item.amount,
      });
    }
  };

  const handleSave = () => {
    if (editingItem.type === "deliverable") {
      setProject((prev) => ({
        ...prev,
        deliverables: prev.deliverables.map((item) =>
          item.id === editingItem.id ? { ...item, ...editForm } : item
        ),
      }));
    }
    setEditingItem(null);
    setEditForm({});
  };

  const handleCancel = () => {
    setEditingItem(null);
    setEditForm({});
  };

  const toggleDeliverable = (id) => {
    setProject((prev) => ({
      ...prev,
      deliverables: prev.deliverables.map((item) =>
        item.id === id
          ? {
              ...item,
              completed: !item.completed,
              status: !item.completed ? "completed" : "pending",
            }
          : item
      ),
    }));
  };

  const toggleTimelineStep = (id) => {
    setProject((prev) => ({
      ...prev,
      timeline: prev.timeline.map((step) =>
        step.id === id ? { ...step, completed: !step.completed } : step
      ),
    }));
  };

  // ==================== REVIEW MANAGEMENT FUNCTIONS ====================
  const handleEditReview = (reviewId) => {
    const review = campaignReviews.find((r) => r.id === reviewId);
    if (review) {
      setEditingReview(reviewId);
      setEditReviewForm({ review: review.review, rating: review.rating });
      // Populate the new review text area with existing review data
      setNewReviewText(review.review);
      setNewReviewRating(review.rating);
    }
  };

  const handleSaveEditReview = async (reviewId) => {
    try {
      await dispatch(
        updateCampaignReview({
          reviewId,
          reviewData: {
            review: newReviewText,
            rating: newReviewRating,
          },
        })
      ).unwrap();

      // Clear form after successful update
      setEditingReview(null);
      setEditReviewForm({ review: "", rating: 5 });
      setNewReviewText("");
      setNewReviewRating(5);

      // Refresh reviews after update
      if (creatorProfileId) {
        dispatch(
          getCampaignReviewsByCreatorProfile({
            campaignId,
            creatorProfileId: creatorProfileId,
          })
        );
      } else {
        dispatch(getCampaignReviews(campaignId));
      }
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const handleCancelEditReview = () => {
    setEditingReview(null);
    setEditReviewForm({ review: "", rating: 5 });
    setNewReviewText("");
    setNewReviewRating(5);
  };

  const handleDeleteReview = async (reviewId) => {
    await dispatch(deleteCampaignReview(reviewId)).unwrap();

    // Refresh reviews after deletion
    if (creatorProfileId) {
      dispatch(
        getCampaignReviewsByCreatorProfile({
          campaignId,
          creatorProfileId: creatorProfileId,
        })
      );
    } else {
      dispatch(getCampaignReviews(campaignId));
    }
  };

  const handleSaveNewReview = async () => {
    if (!newReviewText.trim()) {
      return;
    }

    if (!creatorProfileId) {
      return;
    }

    try {
      await dispatch(
        createCampaignReview({
          campaignId,
          creatorProfileId: creatorProfileId,
          reviewData: {
            review: newReviewText.trim(),
            rating: newReviewRating,
          },
        })
      ).unwrap();

      // Clear form after successful creation
      setNewReviewText("");
      setNewReviewRating(5);

      // Refresh reviews after creation
      if (creatorProfileId) {
        dispatch(
          getCampaignReviewsByCreatorProfile({
            campaignId,
            creatorProfileId: creatorProfileId,
          })
        );
      } else {
        dispatch(getCampaignReviews(campaignId));
      }

      // Refresh review status immediately to show the indicator
      try {
        const res = await dispatch(getReviewStatus({ campaignId, creatorProfileId })).unwrap();
        setReviewStatus(res);
      } catch (e) {}
    } catch (error) {
      console.error("Error creating review:", error);
    }
  };

  const handleCancelNewReview = () => {
    setNewReviewText("");
    setNewReviewRating(5);
  };

  // ==================== NOTES MANAGEMENT FUNCTIONS ====================
  const handleEditNote = (noteId) => {
    const note = privateNotes.find((n) => n.id === noteId);
    if (note) {
      setEditingNote(noteId);
      setEditNoteForm({ text: note.text });
      // Populate the new note text area with existing note data
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

      // Clear form after successful update - use setTimeout to ensure state update
      setTimeout(() => {
        setEditingNote(null);
        setEditNoteForm({ text: "" });
        setNewNoteText("");
      }, 0);

      // Refresh notes after updating
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
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleCancelEditNote = () => {
    setEditingNote(null);
    setEditNoteForm({ text: "" });
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

      // Clear form after successful creation - use setTimeout to ensure state update
      setTimeout(() => {
        setNewNoteText("");
      }, 0);

      // Refresh notes after creating
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
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const handleCancelNewNote = () => {
    setNewNoteText("");
  };

  // ==================== MARK COMPLETE FUNCTIONS ====================
  const handleMarkCompleteClick = () => {
    setShowMarkCompleteModal(true);
  };

  const handleCancelMarkComplete = () => {
    setShowMarkCompleteModal(false);
  };

  const handleConfirmMarkComplete = async () => {
    if (!selectedContract || !campaignId) return;

    setIsMarkingComplete(true);
    try {
      // Mark campaign as complete (updates campaign status and creator statuses)
      await dispatch(markCampaignComplete(campaignId)).unwrap();

      // Refresh brand campaigns (excludes completed ones - for active tab)
      await dispatch(getBrandCampaignsExcludingCompleted()).unwrap();

      // Refresh all campaigns (includes completed ones - for completed tab)
      await dispatch(getAllCampaigns({ status: "COMPLETE" })).unwrap();

      // Force refresh of completed tab by dispatching without status filter
      // This ensures the completed tab gets the updated data
      await dispatch(getAllCampaigns()).unwrap();

      // Close modal and show success
      setShowMarkCompleteModal(false);
      // TODO: Show success message or update UI
    } catch (error) {
      console.error("Error marking campaign complete:", error);
      // TODO: Show error message
    } finally {
      setIsMarkingComplete(false);
    }
  };

  // ==================== RETURN OBJECT ====================
  return {
    // Message thread integration
    messageThreadHook,
    creator,

    // Project management
    project,
    editingItem,
    editForm,
    setEditForm,
    handleEdit,
    handleSave,
    handleCancel,
    toggleDeliverable,
    toggleTimelineStep,

    // Reviews
    campaignReviews,
    editingReview,
    editReviewForm,
    setEditReviewForm,
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

    // Notes
    privateNotes,
    editingNote,
    editNoteForm,
    setEditNoteForm,
    newNoteText,
    setNewNoteText,
    handleEditNote,
    handleSaveEditNote,
    handleCancelEditNote,
    handleDeleteNote,
    handleSaveNewNote,
    handleCancelNewNote,

    // Loading states
    isReviewsLoading: creatorProfileId
      ? getReviewsByCreatorProfileState.isLoading
      : getReviewsState.isLoading,
    isCreateReviewLoading: createReviewState.isLoading,
    isUpdateReviewLoading: updateReviewState.isLoading,
    isDeleteReviewLoading: deleteReviewState.isLoading,
    isNotesLoading: creatorProfileId
      ? getNotesByCreatorProfileState.isLoading
      : getNotesState.isLoading,
    isCreateNoteLoading: createNoteState.isLoading,
    isUpdateNoteLoading: updateNoteState.isLoading,
    isDeleteNoteLoading: deleteNoteState.isLoading,
    isContractsLoading: getContractsState.isLoading,
    isUpdateCampaignLoading: updateCampaignState.isLoading,
    reviewStatus,
    isMarkCampaignCompleteLoading: markCampaignCompleteState.isLoading,

    // Contract data
    selectedContract,
    contracts,

    // Mark Complete functionality
    showMarkCompleteModal,
    isMarkingComplete,
    handleMarkCompleteClick,
    handleCancelMarkComplete,
    handleConfirmMarkComplete,

    // Helper functions
    getStatusColor,
    getStatusIcon,
  };
};

export default useDeliverablesProgress;
