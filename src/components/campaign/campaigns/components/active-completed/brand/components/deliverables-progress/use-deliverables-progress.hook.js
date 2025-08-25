import useCommonHelpers from "@/common/hooks/use-common-helper.hook";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useMessageThread from "../message-thread-modal/use-message-thread.hook";
import { avatar } from "@/common/constants/auth.constant";
import {
  createCampaignReview,
  getCampaignReviews,
  updateCampaignReview,
  deleteCampaignReview,
  resetCreateCampaignReview,
  resetUpdateCampaignReview,
  resetDeleteCampaignReview,
} from "@/provider/features/campaign-reviews/campaign-reviews.slice";

const useDeliverablesProgress = (campaignId = "temp-campaign-id") => {
  const { getStatusColor, getStatusIcon } = useCommonHelpers();
  const dispatch = useDispatch();

  // Redux selectors for reviews
  const {
    createCampaignReview: createReviewState,
    getCampaignReviews: getReviewsState,
    updateCampaignReview: updateReviewState,
    deleteCampaignReview: deleteReviewState,
  } = useSelector((state) => state.campaignReviews);

  // Creator data for message thread
  const creator = {
    id: "creator_sam_waters",
    name: "Sam Waters",
    avatar, // Replace with actual avatar path
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

  // Initialize message thread hook
  const messageThreadHook = useMessageThread(creator.id);

  // Existing state management
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({});

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

  // Private notes data
  const privateNotes = [
    {
      text: "Mention the brand in the first 5 seconds",
      timestamp: "2025-04-23 10:12 AM",
    },
    {
      text: "Use trending audio",
      timestamp: "2025-04-23 10:15 AM",
    },
    {
      text: "Tag the brand and use hashtag #SpringLaunch",
      timestamp: "2025-04-23 10:18 AM",
    },
  ];

  // Existing project management functions
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

  // Enhanced campaign actions
  const markCampaignComplete = async () => {
    try {
      // TODO: Replace with actual API call
      console.log("Marking campaign as complete...");

      // Update all deliverables to completed
      setProject((prev) => ({
        ...prev,
        deliverables: prev.deliverables.map((item) => ({
          ...item,
          completed: true,
          status: "completed",
        })),
        timeline: prev.timeline.map((step) => ({
          ...step,
          completed: true,
        })),
      }));

      // Optionally send a message to the creator
      await messageThreadHook.sendMessage(
        "Campaign has been marked as complete! Great work on all deliverables."
      );
    } catch (error) {
      console.error("Error marking campaign complete:", error);
    }
  };

  const releasePayment = async () => {
    try {
      // TODO: Replace with actual API call
      console.log("Releasing payment...");

      // Optionally notify creator via message
      await messageThreadHook.sendMessage(
        "Payment has been released! You should receive it within 2-3 business days."
      );
    } catch (error) {
      console.error("Error releasing payment:", error);
    }
  };

  const requestRevision = async (revisionDetails) => {
    try {
      // TODO: Replace with actual API call
      console.log("Requesting revision:", revisionDetails);

      // Send message to creator about revision
      const revisionMessage = `Revision Request: ${revisionDetails || "Please make some adjustments to the deliverables as discussed."}`;
      await messageThreadHook.sendMessage(revisionMessage);
    } catch (error) {
      console.error("Error requesting revision:", error);
    }
  };

  const editPaymentDetails = async (paymentDetails) => {
    try {
      // TODO: Replace with actual API call
      console.log("Updating payment details:", paymentDetails);

      setProject((prev) => ({
        ...prev,
        totalAmount: paymentDetails.amount || prev.totalAmount,
      }));
    } catch (error) {
      console.error("Error updating payment details:", error);
    }
  };

  // Get reviews from Redux (or use empty array as fallback)
  const campaignReviews = getReviewsState.data || [];

  // Review state management
  const [editingReview, setEditingReview] = useState(null);
  const [editReviewForm, setEditReviewForm] = useState({ review: "", rating: 5 });
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);

  // Review Management Functions
  const handleEditReview = (review) => {
    setEditingReview(review.id);
    setEditReviewForm({ review: review.review, rating: review.rating });
  };

  const handleSaveEditReview = async (reviewId) => {
    try {
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

      // Refresh reviews after update
      dispatch(getCampaignReviews(campaignId));
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const handleCancelEditReview = () => {
    setEditingReview(null);
    setEditReviewForm({ review: "", rating: 5 });
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await dispatch(deleteCampaignReview(reviewId)).unwrap();

      // Refresh reviews after delete
      dispatch(getCampaignReviews(campaignId));
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleSaveNewReview = async () => {
    if (!newReviewText.trim()) return;

    try {
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

      // Refresh reviews after creation
      dispatch(getCampaignReviews(campaignId));
    } catch (error) {
      console.error("Error adding new review:", error);
    }
  };

  const handleCancelNewReview = () => {
    setNewReviewText("");
    setNewReviewRating(5);
  };

  // Fetch reviews when component mounts or campaignId changes
  useEffect(() => {
    if (campaignId && campaignId !== "temp-campaign-id") {
      dispatch(getCampaignReviews(campaignId));
    }
  }, [dispatch, campaignId]);

  return {
    // Message thread integration
    messageThreadHook,
    creator,

    // Existing functionality
    getStatusColor,
    getStatusIcon,
    project,
    privateNotes,
    editingItem,
    editForm,
    setEditForm,
    handleEdit,
    handleSave,
    handleCancel,
    toggleDeliverable,
    toggleTimelineStep,

    // Enhanced campaign actions
    markCampaignComplete,
    releasePayment,
    requestRevision,
    editPaymentDetails,

    // Review Management
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

    // Review Loading states
    isReviewsLoading: getReviewsState.isLoading,
    isCreateReviewLoading: createReviewState.isLoading,
    isUpdateReviewLoading: updateReviewState.isLoading,
    isDeleteReviewLoading: deleteReviewState.isLoading,
  };
};

export default useDeliverablesProgress;
