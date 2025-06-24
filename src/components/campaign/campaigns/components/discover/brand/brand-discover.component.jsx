import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
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
    messageDialogOpen,
    setMessageDialogOpen,
    creatorToMessage,
    messageText,
    setMessageText,
    handleShortlistSelect,
    handleCreateShortlist,
    handleCreatorPreview,
    handleSaveToShortlist,
    confirmSaveToShortlist,
    handleMessageCreator,
    getSortedCreators,
    mockNicheCategories,
    sortOptions,
    handleRemoveFromShortlist,
    handleSendMessage,
  } = useDiscover();
  return (
    <div className="flex bg-white w-full h-[calc(100vh-48px)]">
      {/* Left Column - Shortlists Sidebar */}
      <ShortlistSidebar
        shortlists={shortlists}
        selectedShortlist={selectedShortlist}
        setSelectedShortlist={setSelectedShortlist}
        handleShortlistSelect={handleShortlistSelect}
        setIsNewShortlistDialogOpen={setIsNewShortlistDialogOpen}
      />

      {/* Center Column - Discovery Feed or Shortlist View */}
      <DiscoverCreators
        sortOptions={sortOptions}
        selectedShortlist={selectedShortlist}
        mockNicheCategories={mockNicheCategories}
        handleCreatorPreview={handleCreatorPreview}
        handleSaveToShortlist={handleSaveToShortlist}
        handleMessageCreator={handleMessageCreator}
        getSortedCreators={getSortedCreators}
        handleRemoveFromShortlist={handleRemoveFromShortlist}
      />

      {/* New Shortlist Dialog */}
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
          ></CustomButton>
          <CustomButton onClick={handleCreateShortlist} text="Create" />
        </div>
      </Modal>

      {/* Creator Preview Dialog */}
      <Modal
        title="Creator Preview"
        show={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        size="lg"
      >
        <CreatorPreview previewCreator={previewCreator} setIsPreviewOpen={setIsPreviewOpen} />
      </Modal>

      {/* Save to Shortlist Dialog */}
      <Modal
        title="Save to Shortlist"
        show={saveToShortlistDialogOpen}
        onClose={() => setSaveToShortlistDialogOpen(false)}
      >
        <div>
          <h5 className="text-primary font-bold mb-2">Click the campaign to save</h5>
          <hr className="border border-primary" />
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
        </div>
      </Modal>

      {/* Message Creator Dialog */}
      <Modal
        title={`Message to ${creatorToMessage?.name}`}
        show={messageDialogOpen}
        onClose={() => setMessageDialogOpen(false)}
      >
        {creatorToMessage && (
          <>
            <TextArea
              label="Your Message"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
            <div className="w-full flex justify-end gap-3">
              <CustomButton
                text="Cancel"
                className="btn-cancel"
                onClick={() => setMessageDialogOpen(false)}
              />

              <CustomButton
                text="Send Message"
                className="btn-primary"
                onClick={() => handleSendMessage()}
              />
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

export default BrandDiscover;
