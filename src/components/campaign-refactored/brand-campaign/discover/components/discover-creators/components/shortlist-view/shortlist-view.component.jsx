import { CheckSquare, Trash2, UserPlus, X } from "lucide-react";
import ViewHeader from "../view-header/view-header.component";
import CreatorGrid from "../creator-grid/creator-grid.component";
import NotFound from "@/common/components/not-found/not-found.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import Modal from "@/common/components/modal/modal.component";
import useShortlistView from "./use-shortlist-view.hook";

const ShortlistView = ({
  selectedShortlist,
  getSortedCreators,
  onBackClick,
  onCreatorPreview,
  onSaveToShortlist,
  onRemoveFromShortlist,
  onBulkRemoveFromShortlist,
  onInviteClick,
  onBulkInvite,
}) => {
  const sortedCreators = getSortedCreators();

  const {
    isBulkMode,
    selectedCreatorIds,
    selectedCount,
    showRemoveConfirm,
    setShowRemoveConfirm,
    isRemoving,
    handleEnterBulkMode,
    handleCreatorToggle,
    handleClearSelection,
    handleBulkInvite,
    handleBulkRemove,
    confirmBulkRemove,
  } = useShortlistView({
    sortedCreators,
    shortlistId: selectedShortlist?.id,
    onBulkInvite,
    onRemoveFromShortlist,
    onBulkRemoveFromShortlist,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ViewHeader
          title={selectedShortlist.name}
          count={sortedCreators.length}
          showBackButton={true}
          onBackClick={onBackClick}
        />
        {sortedCreators.length > 0 && (
          <CustomButton
            text={isBulkMode ? "Exit Bulk Select" : "Bulk Select"}
            onClick={handleEnterBulkMode}
            startIcon={<CheckSquare className="h-3 w-3 sm:h-4 sm:w-4" />}
            className="btn-outline w-full sm:w-auto"
          />
        )}
      </div>

      {isBulkMode && sortedCreators.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="flex flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="inline-flex h-9 min-h-9 items-center rounded-md border border-primary bg-white px-3 sm:h-10 sm:min-h-10">
                <span className="text-xs font-semibold text-primary">
                  {selectedCount} selected
                </span>
              </div>
              {selectedCount === 0 && (
                <span className="text-[10px] text-gray-500 sm:text-xs">
                  Select at least one creator
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <CustomButton
                text="Invite to Apply"
                onClick={handleBulkInvite}
                disabled={selectedCount === 0}
                startIcon={<UserPlus className="h-3 w-3 sm:h-4 sm:w-4" />}
                className="btn-primary flex-1 sm:flex-none"
              />
              <CustomButton
                text="Remove from Shortlist"
                onClick={handleBulkRemove}
                disabled={selectedCount === 0 || isRemoving}
                startIcon={<Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />}
                className="btn-danger-outline flex-1 sm:flex-none"
              />
              <CustomButton
                text="Clear Selection"
                onClick={handleClearSelection}
                startIcon={<X className="h-3 w-3 sm:h-4 sm:w-4" />}
                className="btn-outline flex-1 sm:flex-none"
              />
            </div>
          </div>
        </div>
      )}

      {sortedCreators.length === 0 ? (
        <NotFound
          title="No Creators Found"
          description="No creators found. Try adjusting your search or filters."
        />
      ) : (
        <CreatorGrid
          creators={sortedCreators}
          isShortlist={true}
          isBulkMode={isBulkMode}
          selectedCreatorIds={selectedCreatorIds}
          onCreatorPreview={onCreatorPreview}
          onCreatorToggle={handleCreatorToggle}
          onSaveToShortlist={onSaveToShortlist}
          onRemoveFromShortlist={onRemoveFromShortlist}
          onInviteClick={onInviteClick}
        />
      )}

      <Modal
        title="Remove from Shortlist"
        show={showRemoveConfirm}
        onClose={() => {
          if (!isRemoving) setShowRemoveConfirm(false);
        }}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Remove {selectedCount} creator{selectedCount !== 1 ? "s" : ""} from{" "}
            {selectedShortlist.name}?
          </p>
          <div className="flex justify-end gap-3">
            <CustomButton
              text="Cancel"
              onClick={() => setShowRemoveConfirm(false)}
              disabled={isRemoving}
              className="btn-outline"
            />
            <CustomButton
              text="Remove"
              onClick={confirmBulkRemove}
              loading={isRemoving}
              className="btn-danger"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ShortlistView;
