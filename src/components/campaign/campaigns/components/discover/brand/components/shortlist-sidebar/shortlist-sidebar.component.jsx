import CustomButton from "@/common/components/custom-button/custom-button.component";
import { AddCircle, Edit, Delete, MoreVert } from "@mui/icons-material";
import React, { useState, useEffect, useRef } from "react";

function ShortlistSidebar({
  shortlists,
  selectedShortlist,
  setSelectedShortlist,
  handleShortlistSelect,
  setIsNewShortlistDialogOpen,
  handleEditShortlist,
  handleDeleteShortlist,
}) {
  const [editingShortlist, setEditingShortlist] = useState(null);
  const [editName, setEditName] = useState("");
  const [showOptions, setShowOptions] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const optionsRef = useRef(null);

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

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      handleDeleteShortlist(showDeleteConfirm.id);
      setShowDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
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

  const toggleOptions = (e, shortlistId) => {
    e.stopPropagation();
    setShowOptions(showOptions === shortlistId ? null : shortlistId);
  };

  // Close options dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (editingShortlist) {
        if (event.key === "Escape") {
          handleCancelEdit();
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [editingShortlist]);

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
          startIcon={<AddCircle className="w-4 h-4" />}
          onClick={() => setIsNewShortlistDialogOpen(true)}
        />
      </div>

      {/* Shortlists List */}
      <div className="flex-1 overflow-y-auto p-4">
        {shortlists.length === 0 ? (
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
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 text-sm px-2.5 py-1.5 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        autoFocus
                        onKeyPress={(e) => e.key === "Enter" && handleSaveEdit()}
                        placeholder="Enter shortlist name"
                      />
                      <button
                        onClick={handleSaveEdit}
                        className="w-7 h-7 bg-green-500 hover:bg-green-600 text-white rounded-md flex items-center justify-center transition-colors text-sm"
                        title="Save"
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="w-7 h-7 bg-gray-500 hover:bg-gray-600 text-white rounded-md flex items-center justify-center transition-colors text-sm"
                        title="Cancel"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1.5 rounded-md">
                      Press Enter to save, Esc to cancel
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div
                    onClick={() => handleShortlistSelect(shortlist)}
                    className={`group cursor-pointer bg-white rounded-lg border transition-all duration-200 hover:shadow-sm ${
                      selectedShortlist?.id === shortlist.id
                        ? "border-indigo-500 bg-indigo-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="px-3 py-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h3
                            className={`font-medium text-sm truncate ${
                              selectedShortlist?.id === shortlist.id
                                ? "text-indigo-800"
                                : "text-gray-800"
                            }`}
                          >
                            {shortlist.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">
                              {shortlist.creators?.length || 0} creators
                            </span>
                            {shortlist.creators?.length > 0 && (
                              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            )}
                            <span className="text-xs text-gray-400">
                              {shortlist.creators?.length > 0 ? "Active" : "Empty"}
                            </span>
                          </div>
                        </div>

                        {/* Options Menu */}
                        <div className="relative ml-2" ref={optionsRef}>
                          <button
                            onClick={(e) => toggleOptions(e, shortlist.id)}
                            className={`p-1.5 rounded-md transition-all duration-200 ${
                              showOptions === shortlist.id
                                ? "bg-gray-100 text-gray-700"
                                : "opacity-0 group-hover:opacity-100 hover:bg-gray-100 text-gray-500"
                            }`}
                            title="More options"
                          >
                            <MoreVert className="w-4 h-4" />
                          </button>

                          {/* Dropdown Options */}
                          {showOptions === shortlist.id && (
                            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[130px] py-1">
                              <button
                                onClick={(e) => handleEditClick(e, shortlist)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                <Edit className="w-4 h-4 text-gray-500" />
                                Edit Name
                              </button>
                              <button
                                onClick={(e) => handleDeleteClick(e, shortlist)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Delete className="w-4 h-4 text-red-500" />
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
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Delete className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Delete Shortlist</h3>
                  <p className="text-red-100 text-sm">This action cannot be undone</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-700 text-sm leading-relaxed">
                  Are you sure you want to delete{" "}
                  <span className="font-bold text-gray-900">"{showDeleteConfirm.name}"</span>?
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  This will permanently remove the shortlist and all{" "}
                  {showDeleteConfirm.creators?.length || 0} creators in it.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all duration-200 hover:shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 text-white bg-red-500 hover:bg-red-600 rounded-xl font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                >
                  Delete Shortlist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShortlistSidebar;
