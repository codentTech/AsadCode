import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Modal from "@/common/components/modal/modal.component";
import NotFound from "@/common/components/not-found/not-found.component";
import { List } from "lucide-react";
import CreatorPreview from "./components/creator-preview/creator-preview.component";
import DiscoverCreators from "./components/discover-creators/discover-creators.component";
import ShortlistSidebar from "./components/shortlist-sidebar/shortlist-sidebar.component";
import useDiscover from "./use-brand-discover.hook";

function BrandDiscover() {
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
  } = useDiscover();

  return (
    <div className="flex bg-white w-full h-[calc(100vh-48px)]">
      <ShortlistSidebar
        shortlists={shortlists}
        selectedShortlist={selectedShortlist}
        setSelectedShortlist={setSelectedShortlist}
        handleShortlistSelect={handleShortlistSelect}
        setIsNewShortlistDialogOpen={setIsNewShortlistDialogOpen}
        handleEditShortlist={handleEditShortlist}
        handleDeleteShortlist={handleDeleteShortlist}
        handleCreateShortlist={handleCreateShortlist}
        newShortlistName={newShortlistName}
        setNewShortlistName={setNewShortlistName}
        shortlistState={shortlistState}
      />

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
        <div className="flex justify-end gap-3 mt-3">
          <CustomButton
            onClick={() => setIsNewShortlistDialogOpen(false)}
            text="Cancel"
            className="btn-cancel"
          />
          <CustomButton onClick={handleCreateShortlist} text="Create" />
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
          <h5 className="text-primary font-bold mb-2">Click the shortlist to save</h5>
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
            <ul className="space-y-2 mt-4">
              {shortlists.map((shortlist) => (
                <li key={shortlist.id}>
                  <div
                    className="w-full text-sm p-2 border border-gray-200 hover:border-primary hover:bg-indigo-50 rounded-lg cursor-pointer transition-all flex items-center"
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

export default BrandDiscover;
