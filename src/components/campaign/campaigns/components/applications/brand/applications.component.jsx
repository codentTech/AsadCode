import ConfirmationDialog from "@/common/components/custom-dialog-confirmation/ConfirmationDialog";
import { isCreatorMode } from "@/common/utils/users.util";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import MessageThreadModal from "../../message-thread-modal/message-thread-modal.component";
import CreatorSpendAnalysis from "./components/creator-spend-analysis/creator-spend-analysis.component";
import DeliverablesProgress from "./components/deliverables-progress/deliverables-progress.component.jsx";
import HireCreatorModal from "./components/hire-creator-modal/hire-creator-modal.component";
import Loader from "@/common/components/loader/loader.component";
import NotFound from "@/common/components/not-found/not-found.component";
import useBrandApplications from "./use-brand-applications.hook";

function BrandApplications() {
  const {
    appliedCreatorsData,
    appliedCreatorsLoading,
    selectedCampaign,
    selectedCreator,
    hireModalOpen,
    setHireModalOpen,
    hireCreatorData,
    selectedCampaignForHire,
    showRejectConfirmation,
    setShowRejectConfirmation,
    createContractLoading,
    sendContractLoading,
    createContractSuccess,
    sendContractSuccess,
    createContractError,
    sendContractError,
    filters,
    creators,
    creator,
    messageThreadHook,
    handleCampaignSelect,
    handleCreatorSelect,
    handleHireClick,
    handleSendOffer,
    handleRejectClick,
    handleConfirmReject,
    handleFilterChange,
    clearFilters,
    handleMessageClick,
    fetchIndividualCollaborations,
  } = useBrandApplications();

  const renderRightPane = () => {
    if (appliedCreatorsLoading) {
      return (
        <div className="w-[27%] bg-white flex flex-col border-l h-screen items-center justify-center">
          <Loader loading={true} />
          <p className="text-xs text-gray-500 mt-2">Loading creators...</p>
        </div>
      );
    }

    if (!selectedCampaign) {
      return (
        <div className="w-[27%] bg-transparent flex flex-col border-l h-screen items-center justify-center">
          <NotFound title="No Campaign Selected" description="Select a campaign to view details." />
        </div>
      );
    }

    const isIndividualCreator =
      selectedCampaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;

    if (selectedCampaign && creators.length === 0) {
      return (
        <div className="w-[27%] bg-transparent flex flex-col border-l h-screen items-center justify-center">
          <NotFound
            title="No Creators Found"
            description={
              isIndividualCreator
                ? "No individual collaborations found."
                : "No creators have applied to this campaign yet."
            }
          />
        </div>
      );
    }

    return (
      <DeliverablesProgress
        isCreatorMode={isCreatorMode()}
        selectedCampaign={selectedCampaign}
        selectedCreator={selectedCreator}
        onHireClick={handleHireClick}
        onRejectClick={handleRejectClick}
        onMessageClick={handleMessageClick}
        isIndividualCreator={isIndividualCreator}
      />
    );
  };

  return (
    <div className="relative flex">
      <CreatorSpendAnalysis
        onCampaignSelect={handleCampaignSelect}
        selectedCampaign={selectedCampaign}
        appliedCreatorsData={appliedCreatorsData}
        appliedCreatorsLoading={appliedCreatorsLoading}
        onCreatorSelect={handleCreatorSelect}
        selectedCreator={selectedCreator}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        onMessageClick={handleMessageClick}
        fetchIndividualCollaborations={fetchIndividualCollaborations}
      />

      {renderRightPane()}

      <HireCreatorModal
        show={hireModalOpen}
        onClose={() => setHireModalOpen(false)}
        creatorData={hireCreatorData}
        campaignData={selectedCampaignForHire}
        onSendOffer={handleSendOffer}
        isLoading={createContractLoading || sendContractLoading}
        isSuccess={createContractSuccess && sendContractSuccess}
        isError={createContractError || sendContractError}
      />

      <MessageThreadModal
        isOpen={messageThreadHook.isModalOpen}
        onClose={messageThreadHook.closeMessageModal}
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

      <ConfirmationDialog
        show={showRejectConfirmation}
        onClose={() => setShowRejectConfirmation(false)}
        onConfirm={handleConfirmReject}
        message="Reject Creator"
        content={
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              Are you sure you want to reject this creator's application?
            </p>
            <p className="text-sm text-gray-500">
              This action will move the application to the rejected list.
            </p>
          </div>
        }
      />
    </div>
  );
}

export default BrandApplications;
