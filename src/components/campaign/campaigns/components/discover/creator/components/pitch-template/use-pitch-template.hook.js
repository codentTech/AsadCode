import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  createPitch,
  getAllPitches,
  updatePitch,
  deletePitch,
  resetCreatePitch,
  resetUpdatePitch,
  resetDeletePitch,
} from "@/provider/features/pitches/pitches.slice";

// Single validation schema for both create and update
const pitchSchema = Yup.object().shape({
  name: Yup.string().required("Pitch name is required").trim(),
  content: Yup.string().required("Pitch content is required").trim(),
});

const usePitchTemplate = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  // Redux state selectors
  const {
    createPitch: createPitchState,
    getAllPitches: getAllPitchesState,
    updatePitch: updatePitchState,
    deletePitch: deletePitchState,
  } = useSelector((state) => state.pitches);

  // Local state
  const [showPitchPopup, setShowPitchPopup] = useState(null);
  const [showNewPitchForm, setShowNewPitchForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [applicationPitch, setApplicationPitch] = useState("");
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState({
    open: false,
    pitchId: null,
    pitchName: "",
  });

  // Single form for both create and edit
  const pitchForm = useForm({
    resolver: yupResolver(pitchSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      content: "",
    },
  });

  // Get pitch templates from Redux state
  const pitchTemplates = getAllPitchesState.data?.data || [];

  // Load pitches on component mount
  useEffect(() => {
    dispatch(getAllPitches());
  }, [dispatch]);

  // Update showPitchPopup when pitchTemplates change (for immediate reflection)
  useEffect(() => {
    if (showPitchPopup && pitchTemplates.length > 0) {
      const updatedPitch = pitchTemplates.find((p) => p.id === showPitchPopup.id);
      if (updatedPitch) {
        setShowPitchPopup(updatedPitch);
      }
    }
  }, [pitchTemplates, showPitchPopup]);

  // Unified success handler for all operations
  useEffect(() => {
    if (createPitchState.isSuccess) {
      handleOperationSuccess("create");
    }
    if (updatePitchState.isSuccess) {
      handleOperationSuccess("update");
    }
    if (deletePitchState.isSuccess) {
      handleOperationSuccess("delete");
    }
  }, [createPitchState.isSuccess, updatePitchState.isSuccess, deletePitchState.isSuccess]);

  // Unified error handler for all operations
  useEffect(() => {
    if (createPitchState.isError) {
      dispatch(resetCreatePitch());
    }
    if (updatePitchState.isError) {
      dispatch(resetUpdatePitch());
    }
    if (deletePitchState.isError) {
      dispatch(resetDeletePitch());
    }
  }, [createPitchState.isError, updatePitchState.isError, deletePitchState.isError, dispatch]);

  // Unified success handler
  const handleOperationSuccess = (operation) => {
    switch (operation) {
      case "create":
        setShowNewPitchForm(false);
        break;
      case "update":
        setIsEditing(false);
        break;
      case "delete":
        setShowPitchPopup(null);
        setDeleteConfirmationModal({ open: false, pitchId: null, pitchName: "" });
        break;
    }

    pitchForm.reset();
    dispatch(getAllPitches());

    // Reset specific operation state
    if (operation === "create") dispatch(resetCreatePitch());
    if (operation === "update") dispatch(resetUpdatePitch());
    if (operation === "delete") dispatch(resetDeletePitch());
  };

  // Unified action dispatcher
  const dispatchPitchAction = (action, data) => {
    dispatch(action(data));
  };

  const copyPitchTemplate = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      setApplicationPitch(content);
      enqueueSnackbar("Pitch copied to clipboard!", { variant: "success" });
    } catch (error) {
      console.error("Clipboard error:", error);
      // Fallback for older browsers or when clipboard API fails
      try {
        const textArea = document.createElement("textarea");
        textArea.value = content;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setApplicationPitch(content);
        enqueueSnackbar("Pitch copied to clipboard!", { variant: "success" });
      } catch (fallbackError) {
        console.error("Fallback copy failed:", fallbackError);
        enqueueSnackbar("Failed to copy pitch to clipboard", { variant: "error" });
      }
    }
  };

  // Form handlers
  const handleSubmitForm = (data) => {
    const trimmedData = {
      name: data.name.trim(),
      content: data.content.trim(),
    };

    if (isEditing && showPitchPopup) {
      dispatchPitchAction(updatePitch, {
        id: showPitchPopup.id,
        data: trimmedData,
      });
    } else {
      dispatchPitchAction(createPitch, trimmedData);
    }
  };

  const handleEditPitch = () => {
    if (showPitchPopup) {
      pitchForm.reset({
        name: showPitchPopup.name,
        content: showPitchPopup.content,
      });
      setIsEditing(true);
    }
  };

  const handleOpenNewPitchForm = () => {
    setShowNewPitchForm(true);
    setIsEditing(false);
    pitchForm.reset();
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    pitchForm.reset();
  };

  const handleCloseNewPitchForm = () => {
    setShowNewPitchForm(false);
    pitchForm.reset();
  };

  const handleDeletePitch = (id) => {
    if (!id) {
      enqueueSnackbar("Invalid pitch ID", { variant: "error" });
      return;
    }

    const pitch = pitchTemplates.find((p) => p.id === id);
    setDeleteConfirmationModal({
      open: true,
      pitchId: id,
      pitchName: pitch?.name || "",
    });
  };

  const confirmDeletePitch = () => {
    if (deleteConfirmationModal.pitchId) {
      dispatchPitchAction(deletePitch, deleteConfirmationModal.pitchId);
    }
  };

  const closeDeleteConfirmationModal = () => {
    setDeleteConfirmationModal({ open: false, pitchId: null, pitchName: "" });
  };

  // Loading states
  const isLoading =
    createPitchState.isLoading || updatePitchState.isLoading || deletePitchState.isLoading;

  return {
    // State
    pitchTemplates,
    showPitchPopup,
    showNewPitchForm,
    isEditing,
    applicationPitch,
    isLoading,
    deleteConfirmationModal,

    // Form
    pitchForm,

    // Setters
    setShowPitchPopup,
    setShowNewPitchForm,
    setIsEditing,

    // Actions
    copyPitchTemplate,

    // Event Handlers
    handleSubmitForm,
    handleEditPitch,
    handleOpenNewPitchForm,
    handleCancelEdit,
    handleCloseNewPitchForm,
    handleDeletePitch,
    confirmDeletePitch,
    closeDeleteConfirmationModal,
  };
};

export default usePitchTemplate;
