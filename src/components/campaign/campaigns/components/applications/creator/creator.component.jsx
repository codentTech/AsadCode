import React from "react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import ConfirmationDialog from "@/common/components/custom-dialog-confirmation/ConfirmationDialog";
import { Package } from "lucide-react";
import CampaignBriefModal from "./components/campaign-brief-modal/campaign-brief-modal.component";
import MessageThreadModal from "../../message-thread-modal/message-thread-modal.component";
import useMessageThread from "../../message-thread-modal/use-message-thread.hook";
import useCreatorApplications from "./use-creator-applications.hook";
import OffersModal from "./components/offers-modal/offers-modal.component";
import ApplicationCard from "./components/application-card/application-card.component";

const CreatorApplications = () => {
  const {
    // State
    activeTab,
    allApplications,
    selectedCampaign,
    showCampaignBrief,
    showWithdrawConfirmation,
    showOffersModal,
    setShowOffersModal,

    // Redux state
    applicationsLoading,
    applicationsError,
    withdrawLoading,

    // Computed data
    filteredData,

    // Handlers
    handleTabChange,
    handleViewCampaign,
    handleCloseCampaignBrief,
    handleWithdraw,
    handleConfirmWithdraw,
    handleCancelWithdraw,
    handleMessageClick,
    handleCloseMessageModal,

    // Message thread state
    messageModalState,

    // Functions
    fetchAllApplications,

    // Helper functions
    formatCompensationType,
  } = useCreatorApplications();

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto p-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Campaign Applications</h1>
              <p className="text-gray-600">Track and manage your brand applications</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center space-x-3">
              {/* My Offers Button - Blue and Distinct */}
              <CustomButton
                text="My Offers"
                onClick={() => setShowOffersModal(true)}
                className="px-5 py-3 text-sm font-semibold rounded-lg transition-all duration-200 bg-primary text-white shadow-md hover:shadow-lg"
              />

              {/* Other Tabs */}
              <div className="flex items-center space-x-1 bg-gray-100 p-1.5 rounded-xl shadow-inner">
                <CustomButton
                  text={
                    <div className="flex items-center space-x-2 text-xs">
                      <span>Responded</span>
                      <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full min-w-[1.5rem] flex items-center justify-center">
                        {allApplications.responded?.length || 0}
                      </span>
                    </div>
                  }
                  onClick={() => handleTabChange("responded")}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === "responded"
                      ? "bg-white text-gray-900 shadow-md ring-1 ring-gray-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`}
                />
                <CustomButton
                  text={
                    <div className="flex items-center space-x-2 text-xs">
                      <span>Pending</span>
                      <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full min-w-[1.5rem] flex items-center justify-center">
                        {allApplications.pending?.length || 0}
                      </span>
                    </div>
                  }
                  onClick={() => handleTabChange("pending")}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === "pending"
                      ? "bg-white text-gray-900 shadow-md ring-1 ring-gray-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`}
                />
                <CustomButton
                  text={
                    <div className="flex items-center space-x-2 text-xs">
                      <span>Rejected</span>
                      <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full min-w-[1.5rem] flex items-center justify-center">
                        {allApplications.rejected?.length || 0}
                      </span>
                    </div>
                  }
                  onClick={() => handleTabChange("rejected")}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === "rejected"
                      ? "bg-white text-gray-900 shadow-md ring-1 ring-gray-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {applicationsLoading ? (
            <EmptyState
              icon={<Package className="w-8 h-8 text-gray-400" />}
              title="Loading applications..."
              description="Please wait while we fetch the campaign applications."
            />
          ) : applicationsError ? (
            <EmptyState
              icon={<Package className="w-8 h-8 text-gray-400" />}
              title="Error loading applications"
              description="Failed to fetch campaign applications. Please try again later."
            />
          ) : filteredData.length === 0 ? (
            <EmptyState
              icon={<Package className="w-8 h-8 text-gray-400" />}
              title={`No ${
                activeTab === "offers"
                  ? "offers"
                  : activeTab === "responded"
                    ? "responded"
                    : activeTab === "pending"
                      ? "pending"
                      : "rejected"
              } applications`}
              description={
                activeTab === "offers"
                  ? "You don't have any offers at the moment. Keep applying to campaigns!"
                  : activeTab === "responded"
                    ? "Brands haven't started conversations about your applications yet."
                    : activeTab === "pending"
                      ? "You don't have any pending applications at the moment."
                      : "You don't have any rejected applications."
              }
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredData.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  formatCompensationType={formatCompensationType}
                  handleViewCampaign={handleViewCampaign}
                  handleWithdraw={handleWithdraw}
                  handleMessageClick={handleMessageClick}
                  withdrawLoading={withdrawLoading}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedCampaign && (
        <CampaignBriefModal
          show={showCampaignBrief}
          onClose={handleCloseCampaignBrief}
          campaign={selectedCampaign}
        />
      )}

      <ConfirmationDialog
        show={showWithdrawConfirmation}
        onClose={handleCancelWithdraw}
        onConfirm={handleConfirmWithdraw}
        message="Withdraw Application"
        content={
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              Are you sure you want to withdraw your application?
            </p>
            <p className="text-sm text-gray-500">This action cannot be undone.</p>
          </div>
        }
      />

      {/* Message Thread Modal */}
      {messageModalState.isOpen && messageModalState.brandId && (
        <MessageThreadWithHook
          brandId={messageModalState.brandId}
          application={messageModalState.application}
          onClose={handleCloseMessageModal}
        />
      )}

      {/* Offers Modal */}
      <OffersModal
        show={showOffersModal}
        onClose={() => setShowOffersModal(false)}
        onContractAction={fetchAllApplications}
      />
    </div>
  );
};

// ==================== SUB-COMPONENTS ====================

const EmptyState = ({ icon, title, description }) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// Message Thread Component with Hook
const MessageThreadWithHook = ({ brandId, onClose, application }) => {
  const messageThreadHook = useMessageThread(brandId);
  const hasOpenedRef = React.useRef(false);

  // Open modal when component mounts
  React.useEffect(() => {
    if (brandId && messageThreadHook.openMessageModal && !hasOpenedRef.current) {
      hasOpenedRef.current = true;
      messageThreadHook.openMessageModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandId]); // Only depend on brandId, not the function

  // Handle close
  const handleClose = () => {
    messageThreadHook.closeMessageModal();
    onClose();
  };

  // Prepare brand/creator object for the modal
  const brand = {
    id: brandId,
    name:
      application?.campaign?.created_by?.first_name && application?.campaign?.created_by?.last_name
        ? `${application.campaign.created_by.first_name} ${application.campaign.created_by.last_name}`
        : application?.campaign?.created_by?.first_name || "Brand",
    avatar: application?.campaign?.created_by?.brand_profile?.logo || null,
  };

  return (
    <MessageThreadModal
      isOpen={messageThreadHook.isModalOpen}
      onClose={handleClose}
      creator={brand}
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
      showEmojiPicker={messageThreadHook.showEmojiPicker}
      toggleEmojiPicker={messageThreadHook.toggleEmojiPicker}
      handleEmojiClick={messageThreadHook.handleEmojiClick}
      isUploading={messageThreadHook.isUploading}
      attachmentPreview={messageThreadHook.attachmentPreview}
      handleFileSelect={messageThreadHook.handleFileSelect}
      removeAttachment={messageThreadHook.removeAttachment}
      openFilePicker={messageThreadHook.openFilePicker}
      fileInputRef={messageThreadHook.fileInputRef}
    />
  );
};

export default CreatorApplications;
