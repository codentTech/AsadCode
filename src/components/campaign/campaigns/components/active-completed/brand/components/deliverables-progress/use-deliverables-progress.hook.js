import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { avatar } from "@/common/constants/auth.constant";
import useCommonHelpers from "@/common/hooks/use-common-helper.hook";
import useMessageThread from "../message-thread-modal/use-message-thread.hook";
import {
  createCampaignNote,
  deleteCampaignNote,
  getCampaignNotes,
  updateCampaignNote,
} from "@/provider/features/campaign-notes/campaign-notes.slice";
import {
  createCampaignReview,
  deleteCampaignReview,
  getCampaignReviews,
  updateCampaignReview,
} from "@/provider/features/campaign-reviews/campaign-reviews.slice";

const useDeliverablesProgress = (campaignId = "temp-campaign-id", selectedCampaign = null) => {
  const dispatch = useDispatch();
  const { getStatusColor, getStatusIcon } = useCommonHelpers();

  // ==================== REDUX SELECTORS ====================
  const {
    createCampaignReview: createReviewState,
    getCampaignReviews: getReviewsState,
    updateCampaignReview: updateReviewState,
    deleteCampaignReview: deleteReviewState,
  } = useSelector((state) => state.campaignReviews);

  const {
    createCampaignNote: createNoteState,
    getCampaignNotes: getNotesState,
    updateCampaignNote: updateNoteState,
    deleteCampaignNote: deleteNoteState,
  } = useSelector((state) => state.campaignNotes);

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

  // Notes State
  const [editingNote, setEditingNote] = useState(null);
  const [editNoteForm, setEditNoteForm] = useState({ text: "" });
  const [newNoteText, setNewNoteText] = useState("");

  // ==================== CREATOR DATA ====================
  const creator = {
    id: "creator_sam_waters",
    name: "Sam Waters",
    avatar,
    isOnline: true,
    location: "Los Angeles, CA",
    age: 27,
    rating: 4.2,
    reviewCount: 245,
    platforms: {
      instagram: { followers: 285000, verified: true },
      youtube: { followers: 95000, verified: true },
      twitter: { followers: 42000, verified: false },
    },
  };

  // ==================== HOOKS ====================
  const messageThreadHook = useMessageThread(creator.id);

  // ==================== DATA FROM REDUX ====================
  const privateNotes = getNotesState.data || [];
  const campaignReviews = getReviewsState.data || [];

  // ==================== EFFECTS ====================
  useEffect(() => {
    if (campaignId && campaignId !== "temp-campaign-id") {
      dispatch(getCampaignReviews(campaignId));
      dispatch(getCampaignNotes(campaignId));
    }
  }, [dispatch, campaignId]);

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
  const handleEditReview = (review) => {
    setEditingReview(review.id);
    setEditReviewForm({ review: review.review, rating: review.rating });
  };

  const handleSaveEditReview = async (reviewId) => {
    await dispatch(
      updateCampaignReview({
        reviewId,
        reviewData: {
          review: editReviewForm.review,
          rating: editReviewForm.rating,
        },
      })
    ).unwrap();

    setEditingReview(null);
    setEditReviewForm({ review: "", rating: 5 });
    dispatch(getCampaignReviews(campaignId));
  };

  const handleCancelEditReview = () => {
    setEditingReview(null);
    setEditReviewForm({ review: "", rating: 5 });
  };

  const handleDeleteReview = async (reviewId) => {
    await dispatch(deleteCampaignReview(reviewId)).unwrap();
    dispatch(getCampaignReviews(campaignId));
  };

  const handleSaveNewReview = async () => {
    if (!newReviewText.trim()) return;

    await dispatch(
      createCampaignReview({
        campaignId,
        reviewData: {
          review: newReviewText.trim(),
          rating: newReviewRating,
        },
      })
    ).unwrap();

    setNewReviewText("");
    setNewReviewRating(5);
    dispatch(getCampaignReviews(campaignId));
  };

  const handleCancelNewReview = () => {
    setNewReviewText("");
    setNewReviewRating(5);
  };

  // ==================== NOTES MANAGEMENT FUNCTIONS ====================
  const handleEditNote = (note) => {
    setEditingNote(note.id);
    setEditNoteForm({ text: note.text });
  };

  const handleSaveEditNote = async (noteId) => {
    await dispatch(
      updateCampaignNote({
        noteId,
        noteData: { text: editNoteForm.text },
      })
    ).unwrap();

    setEditingNote(null);
    setEditNoteForm({ text: "" });
    dispatch(getCampaignNotes(campaignId));
  };

  const handleCancelEditNote = () => {
    setEditingNote(null);
    setEditNoteForm({ text: "" });
  };

  const handleDeleteNote = async (noteId) => {
    await dispatch(deleteCampaignNote(noteId)).unwrap();
    dispatch(getCampaignNotes(campaignId));
  };

  const handleSaveNewNote = async () => {
    if (!newNoteText.trim()) return;

    await dispatch(
      createCampaignNote({
        campaignId,
        noteData: { text: newNoteText.trim() },
      })
    ).unwrap();

    setNewNoteText("");
    dispatch(getCampaignNotes(campaignId));
  };

  const handleCancelNewNote = () => {
    setNewNoteText("");
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
    isReviewsLoading: getReviewsState.isLoading,
    isCreateReviewLoading: createReviewState.isLoading,
    isUpdateReviewLoading: updateReviewState.isLoading,
    isDeleteReviewLoading: deleteReviewState.isLoading,
    isNotesLoading: getNotesState.isLoading,
    isCreateNoteLoading: createNoteState.isLoading,
    isUpdateNoteLoading: updateNoteState.isLoading,
    isDeleteNoteLoading: deleteNoteState.isLoading,

    // Helper functions
    getStatusColor,
    getStatusIcon,
  };
};

export default useDeliverablesProgress;
