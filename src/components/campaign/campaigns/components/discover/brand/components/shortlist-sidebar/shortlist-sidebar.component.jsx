import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import DeleteConfirmationModal from "@/common/components/delete-confirmation-modal/delete-confirmation-modal.component";
import Loader from "@/common/components/loader/loader.component";
import useClickOutside from "@/common/hooks/use-click-outside";
import { AddCircle, Delete, Edit, MoreVert } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";

function ShortlistSidebar({
  shortlists,
  selectedShortlist,
  setSelectedShortlist,
  handleShortlistSelect,
  setIsNewShortlistDialogOpen,
  handleEditShortlist,
  handleDeleteShortlist,
  handleCreateShortlist,
  newShortlistName,
  setNewShortlistName,
  shortlistState,
}) {
  const [editingShortlist, setEditingShortlist] = useState(null);
  const [editName, setEditName] = useState("");
  const [showOptions, setShowOptions] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const createInputRef = useRef(null);
  const optionsMenuRef = useRef(null);

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
      // Use the hook's handleCreateShortlist function which will use the hook's newShortlistName state
      handleCreateShortlist();
      setIsCreatingNew(false);
      setNewShortlistName(""); // Clear the input
    }
  };

  const handleCancelCreate = () => {
    setIsCreatingNew(false);
    setNewShortlistName(""); // Clear the input
  };

  const toggleOptions = (e, shortlistId) => {
    e.stopPropagation();
    setShowOptions(showOptions === shortlistId ? null : shortlistId);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (editingShortlist) {
        if (event.key === "Escape") {
          handleCancelEdit();
        }
      }
      if (isCreatingNew) {
        if (event.key === "Escape") {
          handleCancelCreate();
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [editingShortlist, isCreatingNew]);

  // Focus the create input when the form becomes visible
  useEffect(() => {
    if (isCreatingNew && createInputRef.current) {
      createInputRef.current.focus();
    }
  }, [isCreatingNew]);

  // Handle click outside to close options menu
  useClickOutside([optionsMenuRef], [() => setShowOptions(null)]);

  return (
    <div className="w-72 flex flex-col bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 overflow-hidden">
      {/* Header Section */}
      <div className="p-4 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-800">Shortlists</h2>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {shortlists.length}
          </span>
        </div>

        <CustomButton
          text="Create New Shortlist"
          className="btn-primary w-full h-9 text-sm font-medium"
          startIcon={
            shortlistState.createShortlist.isLoading ? (
              <Loader loading={true} />
            ) : (
              <AddCircle className="w-4 h-4" />
            )
          }
          onClick={handleCreateClick}
          disabled={shortlistState.createShortlist.isLoading}
        />
      </div>

      {/* Shortlists List */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Inline Create Form */}
        {isCreatingNew && (
          <div className="mb-4 bg-white rounded-lg border-2 border-indigo-200 shadow-sm p-3">
            <div className="flex items-center gap-2 mb-2">
              <CustomInput
                name="newShortlistName"
                customRef={createInputRef}
                value={newShortlistName}
                onChange={(e) => setNewShortlistName(e.target.value)}
                placeholder="Enter shortlist name"
                autoFocus={true}
                disabled={shortlistState.createShortlist.isLoading}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !shortlistState.createShortlist.isLoading) {
                    handleSaveCreate();
                  }
                  if (e.key === "Escape") {
                    handleCancelCreate();
                  }
                }}
              />
            </div>
            <div className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1.5 rounded-md">
              Press Enter to save, Esc to cancel
            </div>
          </div>
        )}

        {shortlistState.getAllShortlists.isLoading ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Loader loading={true} />
            </div>
            <p className="text-gray-500 text-sm">Loading shortlists...</p>
          </div>
        ) : shortlists.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <AddCircle className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No shortlists yet</p>
            <p className="text-gray-400 text-xs">Create your first shortlist to get started</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {shortlists.map((shortlist) => (
              <li key={shortlist.id} className="relative">
                {editingShortlist?.id === shortlist.id ? (
                  // Edit Mode
                  <div className="bg-white rounded-lg border-2 border-indigo-200 shadow-sm p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <CustomInput
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Enter shortlist name"
                        disabled={shortlistState.updateShortlist.isLoading}
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && !shortlistState.updateShortlist.isLoading) {
                            handleSaveEdit();
                          }
                          if (e.key === "Escape") {
                            handleCancelEdit();
                          }
                        }}
                      />
                    </div>
                    <div className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1.5 rounded-md">
                      Press Enter to save, Esc to cancel
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div
                    onClick={() => {
                      if (
                        !shortlistState.updateShortlist.isLoading &&
                        !shortlistState.deleteShortlist.isLoading
                      ) {
                        handleShortlistSelect(shortlist);
                        setShowOptions(null); // Close any open options menu
                      }
                    }}
                    className={`group cursor-pointer bg-white rounded-lg border transition-all duration-200 hover:shadow-sm ${
                      selectedShortlist?.id === shortlist.id
                        ? "border-indigo-500 bg-indigo-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    } ${shortlistState.updateShortlist.isLoading || shortlistState.deleteShortlist.isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="px-3 py-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3
                              className={`font-medium text-sm truncate ${
                                selectedShortlist?.id === shortlist.id
                                  ? "text-indigo-800"
                                  : "text-gray-800"
                              }`}
                            >
                              {shortlist.name}
                            </h3>
                            {(shortlistState.updateShortlist.isLoading ||
                              shortlistState.deleteShortlist.isLoading) && (
                              <Loader loading={true} />
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">
                              {shortlist.user_count || 0} creators
                            </span>
                            {(shortlist.user_count || 0) > 0 && (
                              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            )}
                            <span className="text-xs text-gray-400">
                              {(shortlist.user_count || 0) > 0 ? "Active" : "Empty"}
                            </span>
                          </div>
                        </div>

                        {/* Options Menu */}
                        <div
                          className="relative ml-2"
                          ref={showOptions === shortlist.id ? optionsMenuRef : null}
                        >
                          <button
                            onClick={(e) => {
                              if (
                                !shortlistState.updateShortlist.isLoading &&
                                !shortlistState.deleteShortlist.isLoading
                              ) {
                                toggleOptions(e, shortlist.id);
                              }
                            }}
                            className={`p-1.5 rounded-md transition-all duration-200 ${
                              showOptions === shortlist.id
                                ? "bg-gray-100 text-gray-700"
                                : "hover:bg-gray-100 text-gray-500"
                            } ${shortlistState.updateShortlist.isLoading || shortlistState.deleteShortlist.isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                            title="More options"
                            disabled={
                              shortlistState.updateShortlist.isLoading ||
                              shortlistState.deleteShortlist.isLoading
                            }
                          >
                            <MoreVert className="w-4 h-4" />
                          </button>

                          {/* Dropdown Options */}
                          {showOptions === shortlist.id && (
                            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[130px] py-1">
                              <button
                                onClick={(e) => handleEditClick(e, shortlist)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={
                                  shortlistState.updateShortlist.isLoading ||
                                  shortlistState.deleteShortlist.isLoading
                                }
                              >
                                {shortlistState.updateShortlist.isLoading ? (
                                  <Loader loading={true} />
                                ) : (
                                  <Edit className="w-4 h-4 text-gray-500" />
                                )}
                                Edit Name
                              </button>
                              <button
                                onClick={(e) => handleDeleteClick(e, shortlist)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={
                                  shortlistState.updateShortlist.isLoading ||
                                  shortlistState.deleteShortlist.isLoading
                                }
                              >
                                {shortlistState.deleteShortlist.isLoading ? (
                                  <Loader loading={true} />
                                ) : (
                                  <Delete className="w-4 h-4 text-red-500" />
                                )}
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        id={showDeleteConfirm?.id}
        confirmationRef={null}
        openConfirmationPopup={!!showDeleteConfirm}
        setOpenConfirmationPopup={() => setShowDeleteConfirm(null)}
        mainText={`Are you sure you want to delete "${showDeleteConfirm?.name}"?`}
        mainStyling="text-center text-lg font-semibold text-gray-900"
        subText={`This will permanently remove the shortlist and all ${showDeleteConfirm?.user_count || 0} creators in it.`}
        subStyling="text-center text-sm text-gray-600 mt-2"
        confirmText={shortlistState.deleteShortlist.isLoading ? "Deleting..." : "Delete Shortlist"}
        closeText="Cancel"
        action={handleConfirmDelete}
        type="danger"
      />
    </div>
  );
}

export default ShortlistSidebar;
