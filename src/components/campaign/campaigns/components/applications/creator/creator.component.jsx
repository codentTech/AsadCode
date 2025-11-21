import React from "react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import ConfirmationDialog from "@/common/components/custom-dialog-confirmation/ConfirmationDialog";
import { Calendar, Package } from "lucide-react";
import CampaignBriefModal from "./components/campaign-brief-modal.component";
import MessageThreadModal from "../../message-thread-modal/message-thread-modal.component";
import useMessageThread from "../../message-thread-modal/use-message-thread.hook";
import useCreatorApplications from "./use-creator-applications.hook";
import { campiagnDeliverable } from "@/common/utils/campaign.utils";

const CreatorApplications = () => {
  const {
    // State
    activeTab,
    allApplications,
    selectedCampaign,
    showCampaignBrief,
    showWithdrawConfirmation,

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

    // Helper functions
    formatCompensationType,
    formatDate,
    getBrandLogo,
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
                activeTab === "responded"
                  ? "responded"
                  : activeTab === "pending"
                    ? "pending"
                    : "rejected"
              } applications`}
              description={
                activeTab === "responded"
                  ? "Brands haven't started conversations about your applications yet."
                  : activeTab === "pending"
                    ? "You don't have any pending applications at the moment."
                    : "You don't have any rejected applications."
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredData.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  formatCompensationType={formatCompensationType}
                  formatDate={formatDate}
                  getBrandLogo={getBrandLogo}
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

const ApplicationCard = ({
  application,
  formatCompensationType,
  formatDate,
  getBrandLogo,
  handleViewCampaign,
  handleWithdraw,
  handleMessageClick,
  withdrawLoading,
}) => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
    {/* Card Header */}
    <div className="p-4 border-b border-gray-100">
      <div className="flex items-center space-x-3 mb-1">
        <img
          src={getBrandLogo(application.campaign?.created_by)}
          alt={`${application.campaign?.created_by?.first_name || "Brand"} logo`}
          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {application.campaign?.created_by?.first_name || "Brand"}
          </h3>
          <h4 className="text-xs font-medium text-gray-600 leading-tight mb-3 line-clamp-2">
            {application.campaign?.campaign_title || "Campaign Title"}
          </h4>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <span
          className={`inline-flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium ${
            formatCompensationType(application.campaign?.compensation_type) === "Paid"
              ? "bg-green-100 text-green-700"
              : formatCompensationType(application.campaign?.compensation_type) === "Gifted"
                ? "bg-blue-100 text-blue-700"
                : "bg-purple-100 text-purple-700"
          }`}
        >
          <span>{formatCompensationType(application.campaign?.compensation_type)}</span>
        </span>
        <span
          className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${
            application.status === "PENDING"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {application.status === "PENDING" ? "Pending" : "Rejected"}
        </span>
      </div>
    </div>

    {/* Card Body */}
    <div className="p-4 flex-1 flex flex-col">
      {/* Date Applied */}
      <div className="flex items-center space-x-1 text-xs text-gray-600 mb-3">
        <Calendar className="w-3 h-3" />
        <span className="text-xs text-gray-600 font-semibold">
          Applied on {formatDate(application.applied_at)}
        </span>
      </div>

      {/* Deliverables */}
      <div className="flex-1">
        <h5 className="text-xs font-semibold text-gray-600 mb-2">Deliverables</h5>

        <div className="flex flex-wrap gap-1">
          {application.campaign?.deliverables.map((item) => (
            <span key={item} className="px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs">
              {campiagnDeliverable(item)}
            </span>
          ))}
        </div>
      </div>
    </div>

    {/* Card Footer */}
    <div className="p-4 border-t border-gray-100">
      <div className="flex flex-col space-y-2">
        <CustomButton
          text="Message"
          className="btn-primary"
          onClick={() => handleMessageClick(application)}
        />
        {application.status === "PENDING" && (
          <CustomButton
            text="Withdraw"
            className="btn-secondary"
            onClick={() => handleWithdraw(application.campaign.id)}
            disabled={withdrawLoading}
          />
        )}
        <CustomButton
          text="View Campaign"
          className="btn-outline"
          onClick={() => handleViewCampaign(application.campaign)}
        />
      </div>
    </div>
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
