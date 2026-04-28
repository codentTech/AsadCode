import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Modal from "@/common/components/modal/modal.component";
import NotFound from "@/common/components/not-found/not-found.component";
import { useCampaignTabBarMobileSlot } from "@/components/campaign-refactored/campaign-tab-bar-mobile-slot.context";
import { List } from "lucide-react";
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
    setSaveToShortlistDialogOpen,
    handleShortlistSelect,
    handleCreateShortlist,
    handleCreatorPreview,
    handleSaveToShortlist,
    confirmSaveToShortlist,
    getSortedCreators,
    handleRemoveFromShortlist,
    handleEditShortlist,
    handleDeleteShortlist,
    handleInviteToApply,
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
        className={`z-[101] flex shrink-0 flex-col overflow-hidden border-gray-200 bg-gradient-to-b from-gray-50 to-white transition-transform duration-300 ease-out md:relative md:z-0 md:h-auto md:w-72 md:translate-x-0 md:border-r max-md:fixed max-md:left-0 max-md:top-0 max-md:h-full max-md:w-[min(88vw,20rem)] max-md:max-w-[288px] max-md:border-r max-md:shadow-xl ${
          shortlistMenuOpen ? "max-md:translate-x-0" : "max-md:pointer-events-none max-md:-translate-x-full"
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

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <DiscoverCreators
          selectedShortlist={selectedShortlist}
          setSelectedShortlist={setSelectedShortlist}
          handleCreatorPreview={handleCreatorPreview}
          handleSaveToShortlist={handleSaveToShortlist}
          getSortedCreators={getSortedCreators}
          handleRemoveFromShortlist={handleRemoveFromShortlist}
          handleInviteToApply={handleInviteToApply}
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
        onClose={() => setSaveToShortlistDialogOpen(false)}
      >
        <div>
          <h5 className="mb-2 text-sm font-bold text-primary sm:text-base">Click the shortlist to save</h5>
          <hr className="border border-primary" />
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
              {shortlists.map((shortlist) => (
                <li key={shortlist.id}>
                  <div
                    className="flex w-full cursor-pointer items-center rounded-lg border border-gray-200 p-2 text-xs transition-all hover:border-primary hover:bg-indigo-50 sm:text-sm"
                    onClick={() => confirmSaveToShortlist(shortlist.id)}
                  >
                    {shortlist.name}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Modal>
    </div>
  );
}
