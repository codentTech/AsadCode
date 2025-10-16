import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Modal from "@/common/components/modal/modal.component";
import { avatar } from "@/common/constants/auth.constant";
import MessageThreadModal from "../../message-thread-modal/message-thread-modal.component";
import useMessageThread from "../../message-thread-modal/use-message-thread.hook";
import CreatorPreview from "./components/creator-preview/creator-preview.component";
import DiscoverCreators from "./components/discover-creators/discover-creators.component";
import ShortlistSidebar from "./components/shortlist-sidebar/shortlist-sidebar.component";
import useDiscover from "./use-brand-discover.hook";
import { useEffect, useRef } from "react";

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
    handleEditShortlist,
    handleDeleteShortlist,
    handleSendMessage,
    shortlistState,
  } = useDiscover();

  // ==================== HOOKS ====================
  const lastOpenedCreatorIdRef = useRef(null);
  const messageThreadHook = useMessageThread(creatorToMessage?.id || null);

  const creator = {
    id: creatorToMessage?.id,
    name: creatorToMessage?.name,
    avatar: creatorToMessage?.profileImage || avatar,
    isOnline: true,
  };

  // ==================== EFFECTS ====================
  // Auto-open modal when creatorToMessage changes
  useEffect(() => {
    if (creatorToMessage?.id && creatorToMessage.id !== lastOpenedCreatorIdRef.current) {
      lastOpenedCreatorIdRef.current = creatorToMessage.id;
      messageThreadHook.openMessageModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creatorToMessage?.id]);

  // ==================== HANDLERS ====================
  const handleCloseModal = () => {
    messageThreadHook.closeMessageModal();
    setMessageDialogOpen(false);
    lastOpenedCreatorIdRef.current = null;
  };

  return (
    <div className="flex bg-white w-full h-[calc(100vh-48px)]">
      {/* Left Column - Shortlists Sidebar */}
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

      {/* Center Column - Discovery Feed or Shortlist View */}
      <DiscoverCreators
        selectedShortlist={selectedShortlist}
        setSelectedShortlist={setSelectedShortlist}
        handleCreatorPreview={handleCreatorPreview}
        handleSaveToShortlist={handleSaveToShortlist}
        handleMessageCreator={handleMessageCreator}
        getSortedCreators={getSortedCreators}
        handleRemoveFromShortlist={handleRemoveFromShortlist}
        handleInviteToApply={() => {}}
        userCampaigns={[]}
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

      <MessageThreadModal
        isOpen={messageThreadHook.isModalOpen}
        onClose={handleCloseModal}
        creator={creator}
        messages={messageThreadHook.messages || []}
        newMessage={messageThreadHook.newMessage || ""}
        setNewMessage={messageThreadHook.setNewMessage}
        sendMessage={messageThreadHook.sendMessage}
        isSending={messageThreadHook.isSending}
        isLoading={messageThreadHook.isLoading}
        isCreatorOnline={messageThreadHook.isCreatorOnline}
        isCreatorTyping={messageThreadHook.isCreatorTyping}
        messagesEndRef={messageThreadHook.messagesEndRef}
        messagesContainerRef={messageThreadHook.messagesContainerRef}
      />
    </div>
  );
}

export default BrandDiscover;
