import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import DeleteConfirmationModal from "@/common/components/delete-confirmation-modal/delete-confirmation-modal.component";
import { Skeleton } from "@/common/components/loader/skeleton-loader.component";
import { AddCircle, Delete, Edit, MoreVert } from "@mui/icons-material";
import { Loader2, X } from "lucide-react";
import useShortlistSidebar from "./use-shortlist-sidebar.hook";

function ShortlistSidebar({
  shortlists,
  selectedShortlist,
  handleShortlistSelect,
  handleEditShortlist,
  handleDeleteShortlist,
  handleCreateShortlist,
  newShortlistName,
  setNewShortlistName,
  shortlistState,
  onCloseDrawer,
}) {
  const {
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
  } = useShortlistSidebar({
    handleEditShortlist,
    handleDeleteShortlist,
    handleCreateShortlist,
    newShortlistName,
    setNewShortlistName,
  });

  return (
    <div className="flex h-full min-h-0 w-full shrink-0 flex-col overflow-hidden border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white md:border-b-0 md:border-r">
      <div className="border-b border-gray-100 bg-white p-3 shadow-sm sm:p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-base font-bold text-gray-800 sm:text-lg">Shortlists</h2>
          <div className="flex shrink-0 items-center gap-2">
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
              {shortlists.length}
            </span>
            {onCloseDrawer ? (
              <button
                type="button"
                onClick={onCloseDrawer}
                className="rounded-md p-1.5 text-gray-600 hover:bg-gray-100 md:hidden"
                aria-label="Close shortlists"
              >
                <X className="h-5 w-5" />
              </button>
            ) : null}
          </div>
        </div>

        <CustomButton
          text="Create New Shortlist"
          className="btn-primary w-full !h-8 sm:!h-9 !text-xs sm:!text-sm font-medium"
          startIcon={
            shortlistState.createShortlist.isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <AddCircle className="w-4 h-4" />
            )
          }
          onClick={handleCreateClick}
          disabled={shortlistState.createShortlist.isLoading}
        />
      </div>

      <div className="flex-1 overflow-y-auto overscroll-y-contain p-3 sm:p-4">
        {isCreatingNew && (
          <div className="mb-4 rounded-lg border-2 border-indigo-200 bg-white p-3 shadow-sm">
            <div className="mb-2">
              <CustomInput
                name="newShortlistName"
                customRef={createInputRef}
                value={newShortlistName}
                onChange={(e) => setNewShortlistName(e.target.value)}
                placeholder="Enter shortlist name"
                autoFocus={true}
                disabled={shortlistState.createShortlist.isLoading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !shortlistState.createShortlist.isLoading) {
                    e.preventDefault();
                    handleSaveCreate();
                  }
                  if (e.key === "Escape") {
                    e.preventDefault();
                    handleCancelCreate();
                  }
                }}
              />
            </div>
            <div className="mb-3 rounded-md bg-indigo-50 px-2 py-1.5 text-[10px] leading-snug text-indigo-700 sm:text-xs">
              Tap Save, or use Enter / Esc on a keyboard
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-2">
              <CustomButton
                type="button"
                text="Cancel"
                className="btn-outline order-2 w-full sm:order-1 sm:w-auto sm:min-w-[106px]"
                onClick={handleCancelCreate}
                disabled={shortlistState.createShortlist.isLoading}
              />
              <CustomButton
                type="button"
                text="Save"
                className="btn-primary order-1 w-full sm:order-2 sm:w-auto sm:min-w-[106px]"
                onClick={handleSaveCreate}
                disabled={
                  shortlistState.createShortlist.isLoading || !String(newShortlistName || "").trim()
                }
                loading={shortlistState.createShortlist.isLoading}
              />
            </div>
          </div>
        )}

        {shortlistState.getAllShortlists.isLoading ? (
          <ul className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <li key={i} className="bg-white rounded-lg border border-gray-200 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-8 rounded-md flex-shrink-0" />
                </div>
              </li>
            ))}
          </ul>
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
                  <div className="rounded-lg border-2 border-indigo-200 bg-white p-3 shadow-sm">
                    <div className="mb-2">
                      <CustomInput
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Enter shortlist name"
                        disabled={shortlistState.updateShortlist.isLoading}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !shortlistState.updateShortlist.isLoading) {
                            e.preventDefault();
                            handleSaveEdit();
                          }
                          if (e.key === "Escape") {
                            e.preventDefault();
                            handleCancelEdit();
                          }
                        }}
                      />
                    </div>
                    <div className="mb-3 rounded-md bg-indigo-50 px-2 py-1.5 text-[10px] leading-snug text-indigo-700 sm:text-xs">
                      Tap Save, or use Enter / Esc on a keyboard
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-2">
                      <CustomButton
                        type="button"
                        text="Cancel"
                        className="btn-outline order-2 w-full sm:order-1 sm:w-auto sm:min-w-[106px]"
                        onClick={handleCancelEdit}
                        disabled={shortlistState.updateShortlist.isLoading}
                      />
                      <CustomButton
                        type="button"
                        text="Save"
                        className="btn-primary order-1 w-full sm:order-2 sm:w-auto sm:min-w-[106px]"
                        onClick={handleSaveEdit}
                        disabled={
                          shortlistState.updateShortlist.isLoading || !String(editName || "").trim()
                        }
                        loading={shortlistState.updateShortlist.isLoading}
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      if (
                        !shortlistState.updateShortlist.isLoading &&
                        !shortlistState.deleteShortlist.isLoading
                      ) {
                        handleShortlistSelect(shortlist);
                        setShowOptions(null);
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
                                  <Skeleton className="w-4 h-4 rounded" />
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
                                  <Skeleton className="w-4 h-4 rounded" />
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
