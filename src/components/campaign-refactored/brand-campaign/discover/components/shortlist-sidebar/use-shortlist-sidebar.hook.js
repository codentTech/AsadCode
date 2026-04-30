import { useEffect, useRef, useState } from "react";
import useClickOutside from "@/common/hooks/use-click-outside";

function useShortlistSidebar({
  handleEditShortlist,
  handleDeleteShortlist,
  handleCreateShortlist,
  newShortlistName,
  setNewShortlistName,
}) {
  const [editingShortlist, setEditingShortlist] = useState(null);
  const [editName, setEditName] = useState("");
  const [showOptions, setShowOptions] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const createInputRef = useRef(null);
  const optionsMenuRef = useRef(null);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (editingShortlist && event.key === "Escape") {
        handleCancelEdit();
      }
      if (isCreatingNew && event.key === "Escape") {
        handleCancelCreate();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [editingShortlist, isCreatingNew]);

  useEffect(() => {
    if (isCreatingNew && createInputRef.current) {
      createInputRef.current.focus();
    }
  }, [isCreatingNew]);

  useClickOutside([optionsMenuRef], [() => setShowOptions(null)]);

  const handleEditClick = (e, shortlist) => {
    e.stopPropagation();
    setEditingShortlist(shortlist);
    setEditName(shortlist.name);
    setShowOptions(null);
  };

  const handleDeleteClick = (e, shortlist) => {
    e.stopPropagation();
    setShowDeleteConfirm(shortlist);
    setShowOptions(null);
  };

  const handleConfirmDelete = (shortlistId) => {
    handleDeleteShortlist(shortlistId);
    setShowDeleteConfirm(null);
  };

  const handleSaveEdit = () => {
    if (editName.trim() && editingShortlist) {
      handleEditShortlist(editingShortlist.id, editName.trim());
      setEditingShortlist(null);
      setEditName("");
    }
  };

  const handleCancelEdit = () => {
    setEditingShortlist(null);
    setEditName("");
  };

  const handleCreateClick = () => {
    setIsCreatingNew(true);
    setNewShortlistName("");
  };

  const handleSaveCreate = () => {
    if (newShortlistName.trim()) {
      handleCreateShortlist();
      setIsCreatingNew(false);
      setNewShortlistName("");
    }
  };

  const handleCancelCreate = () => {
    setIsCreatingNew(false);
    setNewShortlistName("");
  };

  const toggleOptions = (e, shortlistId) => {
    e.stopPropagation();
    setShowOptions(showOptions === shortlistId ? null : shortlistId);
  };

  return {
    editingShortlist,
    editName,
    setEditName,
    showOptions,
    showDeleteConfirm,
    setShowDeleteConfirm,
    isCreatingNew,
    createInputRef,
    optionsMenuRef,
    handleEditClick,
    handleDeleteClick,
    handleConfirmDelete,
    handleSaveEdit,
    handleCancelEdit,
    handleCreateClick,
    handleSaveCreate,
    handleCancelCreate,
    toggleOptions,
    setShowOptions,
  };
}

export default useShortlistSidebar;
