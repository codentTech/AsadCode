import useCommonHelpers from "@/common/hooks/use-common-helper.hook";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useMessageThread from "../message-thread-modal/use-message-thread.hook";
import { avatar } from "@/common/constants/auth.constant";
import {
  createCampaignNote,
  getCampaignNotes,
  updateCampaignNote,
  deleteCampaignNote,
  resetCreateCampaignNote,
  resetUpdateCampaignNote,
  resetDeleteCampaignNote,
} from "@/provider/features/campaign-notes/campaign-notes.slice";

const useDeliverablesProgress = (campaignId = "temp-campaign-id") => {
  const { getStatusColor, getStatusIcon } = useCommonHelpers();
  const dispatch = useDispatch();

  // Redux selectors
  const {
    createCampaignNote: createNoteState,
    getCampaignNotes: getNotesState,
    updateCampaignNote: updateNoteState,
    deleteCampaignNote: deleteNoteState,
  } = useSelector((state) => state.campaignNotes);

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

  // Get private notes from Redux (or use empty array as fallback)
  const privateNotes = getNotesState.data || [];

  // Note editing state
  const [editingNote, setEditingNote] = useState(null);
  const [editNoteForm, setEditNoteForm] = useState({ text: "" });
  const [newNoteText, setNewNoteText] = useState("");

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

  // Private Notes Management Functions
  const handleEditNote = (note) => {
    setEditingNote(note.id);
    setEditNoteForm({ text: note.text });
  };

  const handleSaveEditNote = async (noteId) => {
    try {
      await dispatch(
        updateCampaignNote({
          noteId,
          noteData: { text: editNoteForm.text },
        })
      ).unwrap();

      setEditingNote(null);
      setEditNoteForm({ text: "" });

      // Refresh notes after update
      dispatch(getCampaignNotes(campaignId));
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleCancelEditNote = () => {
    setEditingNote(null);
    setEditNoteForm({ text: "" });
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await dispatch(deleteCampaignNote(noteId)).unwrap();

      // Refresh notes after delete
      dispatch(getCampaignNotes(campaignId));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleSaveNewNote = async () => {
    if (!newNoteText.trim()) return;

    try {
      await dispatch(
        createCampaignNote({
          campaignId,
          noteData: { text: newNoteText.trim() },
        })
      ).unwrap();

      setNewNoteText("");

      // Refresh notes after creation
      dispatch(getCampaignNotes(campaignId));
    } catch (error) {
      console.error("Error adding new note:", error);
    }
  };

  const handleCancelNewNote = () => {
    setNewNoteText("");
  };

  // Fetch notes when component mounts or campaignId changes
  useEffect(() => {
    if (campaignId && campaignId !== "temp-campaign-id") {
      dispatch(getCampaignNotes(campaignId));
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

    // Private Notes Management
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
    isNotesLoading: getNotesState.isLoading,
    isCreateNoteLoading: createNoteState.isLoading,
    isUpdateNoteLoading: updateNoteState.isLoading,
    isDeleteNoteLoading: deleteNoteState.isLoading,
  };
};

export default useDeliverablesProgress;
