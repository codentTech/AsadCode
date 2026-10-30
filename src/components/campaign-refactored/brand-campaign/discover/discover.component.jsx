import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Modal from "@/common/components/modal/modal.component";
import NotFound from "@/common/components/not-found/not-found.component";
import { useCampaignTabBarMobileSlot } from "@/components/campaign-refactored/campaign-tab-bar-mobile-slot.context";
import { List, Loader2 } from "lucide-react";
import { useEffect } from "react";
import CreatorPreview from "./components/creator-preview/creator-preview.component";
import DiscoverCreators from "./components/discover-creators/discover-creators.component";
import ShortlistSidebar from "./components/shortlist-sidebar/shortlist-sidebar.component";
import useDiscover from "./use-discover.hook";

export default function BrandDiscover() {
  const {
    shortlists,
    selectedShortlist,
    setSelectedShortlist,
    isNewShortlistDialogOpen,
    setIsNewShortlistDialogOpen,
    newShortlistName,
    setNewShortlistName,
    previewCreator,
    isPreviewOpen,
    setIsPreviewOpen,
    saveToShortlistDialogOpen,
    creatorsToSave,
    savingShortlistId,
    saveToShortlistResult,
    handleCloseSaveToShortlist,
    handleShortlistSelect,
    handleCreateShortlist,
    handleCreatorPreview,
    handleSaveToShortlist,
    confirmSaveToShortlist,
    getSortedCreators,
    handleRemoveFromShortlist,
    handleBulkRemoveFromShortlist,
    handleEditShortlist,
    handleDeleteShortlist,
    handleInviteToApply,
    handleRefreshCampaigns,
    isCampaignsLoading,
    userCampaigns,
    shortlistState,
    shortlistMenuOpen,
    setShortlistMenuOpen,
  } = useDiscover();

  const tabBarMobileSlot = useCampaignTabBarMobileSlot();
  const registerMobileSlot = tabBarMobileSlot?.registerMobileSlot;
  const clearMobileSlot = tabBarMobileSlot?.clearMobileSlot;

  useEffect(() => {
    if (!registerMobileSlot || !clearMobileSlot) return;
    registerMobileSlot(
      <button
        type="button"
        onClick={() => setShortlistMenuOpen(true)}
        className="inline-flex min-h-[30px] w-10 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 sm:min-h-8 md:min-h-9"
        aria-label="Open shortlists"
      >
        <List className="h-4 w-4 text-primary" strokeWidth={2} aria-hidden />
      </button>
    );
    return () => {
      clearMobileSlot();
    };
  }, [registerMobileSlot, clearMobileSlot, setShortlistMenuOpen]);

  const closeShortlistDrawer = () => setShortlistMenuOpen(false);

  return (
    <div className="relative flex w-full flex-1 min-h-0 flex-col overflow-hidden bg-white md:flex-row">
      {shortlistMenuOpen ? (
        <div
          className="fixed inset-0 z-[100] bg-black/40 md:hidden"
          aria-hidden
          onClick={closeShortlistDrawer}
        />
      ) : null}

      <div
        className={`flex shrink-0 flex-col overflow-hidden border-gray-200 bg-gradient-to-b from-gray-50 to-white transition-transform duration-300 ease-out md:relative md:z-0 md:h-auto md:w-72 md:translate-x-0 md:border-r max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-[110] max-md:h-dvh max-md:w-[min(100vw,20rem)] max-md:max-w-sm max-md:border-r max-md:shadow-2xl ${
          shortlistMenuOpen
            ? "max-md:translate-x-0"
            : "max-md:pointer-events-none max-md:-translate-x-full"
        }`}
      >
        <ShortlistSidebar
          shortlists={shortlists}
          selectedShortlist={selectedShortlist}
          handleShortlistSelect={handleShortlistSelect}
          handleEditShortlist={handleEditShortlist}
          handleDeleteShortlist={handleDeleteShortlist}
          handleCreateShortlist={handleCreateShortlist}
          newShortlistName={newShortlistName}
          setNewShortlistName={setNewShortlistName}
          shortlistState={shortlistState}
          onCloseDrawer={closeShortlistDrawer}
        />
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <DiscoverCreators
          selectedShortlist={selectedShortlist}
          setSelectedShortlist={setSelectedShortlist}
          handleCreatorPreview={handleCreatorPreview}
          handleSaveToShortlist={handleSaveToShortlist}
          getSortedCreators={getSortedCreators}
          handleRemoveFromShortlist={handleRemoveFromShortlist}
          handleBulkRemoveFromShortlist={handleBulkRemoveFromShortlist}
          handleInviteToApply={handleInviteToApply}
          onRefreshCampaigns={handleRefreshCampaigns}
          isCampaignsLoading={isCampaignsLoading}
          userCampaigns={userCampaigns}
        />
      </div>

      <Modal
        title="Create New Shortlist"
        show={isNewShortlistDialogOpen}
        onClose={() => setIsNewShortlistDialogOpen(false)}
      >
        <CustomInput
          label="Shortlist Name"
          placeholder="Enter shortlist name"
          value={newShortlistName}
          onChange={(e) => setNewShortlistName(e.target.value)}
        />
        <div className="mt-3 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <CustomButton
            onClick={() => setIsNewShortlistDialogOpen(false)}
            text="Cancel"
            className="btn-cancel w-full sm:w-auto !text-xs sm:!text-sm !py-2"
          />
          <CustomButton
            onClick={handleCreateShortlist}
            text="Create"
            className="w-full sm:w-auto !text-xs sm:!text-sm !py-2"
          />
        </div>
      </Modal>

      <Modal
        title="Creator Preview"
        show={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        size="lg"
      >
        <CreatorPreview previewCreator={previewCreator} setIsPreviewOpen={setIsPreviewOpen} />
      </Modal>

      <Modal
        title="Save to Shortlist"
        show={saveToShortlistDialogOpen}
        onClose={handleCloseSaveToShortlist}
      >
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <h5 className="min-w-0 text-sm font-bold text-primary sm:text-base">
              Click the shortlist to save
            </h5>
            {creatorsToSave?.length > 0 && (
              <span className="shrink-0 text-xs text-gray-600 sm:text-sm">
                {creatorsToSave.length} selected
              </span>
            )}
          </div>
          <hr className="border border-primary" />
          {saveToShortlistResult ? (
            <div className="mt-3 space-y-2">
              {saveToShortlistResult.added?.length > 0 && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800 sm:text-sm">
                  <p className="mb-2 font-semibold">
                    Added to {saveToShortlistResult.shortlistName}:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {saveToShortlistResult.added.map((name, index) => (
                      <span
                        key={`added-${index}-${name}`}
                        className="rounded-md border border-emerald-300 bg-white px-2 py-1 text-[11px] font-medium text-emerald-800 sm:text-xs"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {saveToShortlistResult.alreadyIn?.length > 0 && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 sm:text-sm">
                  <p className="mb-2 font-semibold">
                    Already in {saveToShortlistResult.shortlistName}:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {saveToShortlistResult.alreadyIn.map((name, index) => (
                      <span
                        key={`already-${index}-${name}`}
                        className="rounded-md border border-amber-300 bg-white px-2 py-1 text-[11px] font-medium text-amber-800 sm:text-xs"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {saveToShortlistResult.failed?.length > 0 && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 sm:text-sm">
                  <p className="mb-2 font-semibold">Could not add:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {saveToShortlistResult.failed.map((name, index) => (
                      <span
                        key={`failed-${index}-${name}`}
                        className="rounded-md border border-red-300 bg-white px-2 py-1 text-[11px] font-medium text-red-700 sm:text-xs"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
          {shortlists.length === 0 ? (
            <NotFound
              title="No Shortlists Found"
              description="Create a shortlist first to save creators."
              icon={List}
              showAnimation={false}
              className="py-8"
            />
          ) : (
            <ul className="mt-4 space-y-2">
              {shortlists.map((shortlist) => {
                const isSaving = savingShortlistId === shortlist.id;
                return (
                  <li key={shortlist.id}>
                    <div
                      className={`flex w-full items-center justify-between gap-2 rounded-lg border border-gray-200 p-2 text-xs transition-all sm:text-sm ${
                        savingShortlistId && !isSaving
                          ? "cursor-not-allowed opacity-60"
                          : "cursor-pointer hover:border-primary hover:bg-indigo-50"
                      }`}
                      onClick={() => {
                        if (savingShortlistId) return;
                        confirmSaveToShortlist(shortlist.id);
                      }}
                    >
                      <span className="min-w-0 truncate">{shortlist.name}</span>
                      {isSaving && (
                        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Modal>
    </div>
  );
}
