import ConfirmationDialog from "@/common/components/custom-dialog-confirmation/ConfirmationDialog";
import MiddlePaneSkeleton from "@/common/components/brand-campaign-panes-skeleton/middle-pane-skeleton.component";
import NotFound from "@/common/components/not-found/not-found.component";
import { isCreatorMode } from "@/common/utils/users.util";
import { useCampaignTabBarMobileSlot } from "@/components/campaign-refactored/campaign-tab-bar-mobile-slot.context";
import MessageThreadModal from "@/components/campaign-refactored/shared/message-thread-modal/message-thread-modal.component";
import { pickMessageThreadModalProps } from "@/components/campaign-refactored/shared/message-thread-modal/use-message-thread.hook";
import Rejected from "@/components/campaign-refactored/shared/rejected/rejected.component";
import RightPaneSkeleton from "@/components/campaign-refactored/shared/right-pane-skeleton/right-pane-skeleton.component";
import { ChevronLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CreatorSpendAnalysis from "./components/creator-spend-analysis/creator-spend-analysis.component";
import DeliverablesProgress from "./components/deliverables-progress/deliverables-progress.component.jsx";
import HireCreatorModal from "./components/hire-creator-modal/hire-creator-modal.component";
import useBrandApplications from "./use-applications.hook";

function BrandApplicationsContent({ onSwitchToRejected }) {
  const {
    appliedCreatorsData,
    appliedCreatorsLoading,
    isLoading,
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
    creator,
    messageThreadHook,
    rightPaneState,
    handleCampaignSelect,
    handleCreatorSelectWithPane,
    handleClearCreator,
    mobilePane,
    backToApplicationList,
    handleHireClick,
    handleSendOffer,
    handleRejectClick,
    handleConfirmReject,
    handleFilterChange,
    handleFiltersReplace,
    clearFilters,
    handleMessageClick,
    fetchIndividualCollaborations,
    applicationsSubTab,
    subTabCounts,
    handleApplicationsSubTabChange,
    creators: displayCreators,
  } = useBrandApplications();

  const tabBarMobileSlot = useCampaignTabBarMobileSlot();
  const registerMobileSlot = tabBarMobileSlot?.registerMobileSlot;
  const clearMobileSlot = tabBarMobileSlot?.clearMobileSlot;

  useEffect(() => {
    if (!registerMobileSlot || !clearMobileSlot) return;
    if (mobilePane !== "detail") {
      clearMobileSlot();
      return;
    }
    registerMobileSlot(
      <button
        type="button"
        onClick={backToApplicationList}
        className="inline-flex min-h-[30px] w-10 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 sm:min-h-8 md:min-h-9"
        aria-label="Back to applications list"
      >
        <ChevronLeft className="h-4 w-4 text-primary" strokeWidth={2.25} aria-hidden />
      </button>
    );
    return () => {
      clearMobileSlot();
    };
  }, [mobilePane, registerMobileSlot, clearMobileSlot, backToApplicationList]);

  if (isLoading && !selectedCampaign) {
    return (
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row md:items-stretch">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden md:h-full md:max-w-none md:flex-[0_1_73%] lg:max-w-none">
          <MiddlePaneSkeleton variant="applications" />
        </div>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-l border-gray-200/80 bg-white md:h-full md:max-w-md md:flex-[0_1_27%] lg:max-w-lg lg:flex-[0_1_27%]">
          <RightPaneSkeleton layout="fluid" />
        </div>
      </div>
    );
  }

  const rightColumn = (
    <>
      {rightPaneState.type === "loading" ? (
        <RightPaneSkeleton layout="fluid" />
      ) : rightPaneState.type === "notFound" ? (
        <div className="flex h-full min-h-0 w-full flex-1 flex-col items-center justify-center border-l border-gray-100 bg-gradient-to-b from-gray-50/80 to-white px-4 text-center md:h-full md:max-w-md md:flex-[0_1_27%] lg:flex-[0_1_27%]">
          <NotFound
            title="No Data Available"
            description="Please select a campaign and creator."
            className="flex-1 w-full !p-0"
          />
        </div>
      ) : (
        <DeliverablesProgress
          selectedCreator={selectedCreator}
          onHireClick={handleHireClick}
          onRejectClick={handleRejectClick}
          onMessageClick={handleMessageClick}
          isIndividualCreator={rightPaneState.isIndividualCreator}
        />
      )}
    </>
  );

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50/40 md:flex-row md:items-stretch md:bg-transparent">
      <div
        className={`flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden transition-[opacity,transform] duration-200 ease-out md:h-full md:max-w-none md:flex-[0_1_73%] lg:max-w-none ${
          mobilePane === "detail" ? "hidden md:flex" : "flex"
        }`}
      >
        <CreatorSpendAnalysis
          onCampaignSelect={handleCampaignSelect}
          selectedCampaign={selectedCampaign}
          appliedCreatorsData={appliedCreatorsData}
          appliedCreatorsLoading={appliedCreatorsLoading}
          onCreatorSelect={handleCreatorSelectWithPane}
          onClearCreator={handleClearCreator}
          selectedCreator={selectedCreator}
          filters={filters}
          onFilterChange={handleFilterChange}
          onFiltersReplace={handleFiltersReplace}
          onClearFilters={clearFilters}
          fetchIndividualCollaborations={fetchIndividualCollaborations}
          onSwitchToRejected={onSwitchToRejected}
          applicationsSubTab={applicationsSubTab}
          onApplicationsSubTabChange={handleApplicationsSubTabChange}
          subTabCounts={subTabCounts}
          displayCreators={displayCreators}
        />
      </div>

      <div
        className={`flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-l border-gray-200/80 bg-white shadow-[0_0_24px_-8px_rgba(79,70,229,0.12)] md:h-full md:shadow-none ${
          mobilePane === "list"
            ? "hidden md:flex md:max-w-md md:flex-[0_1_27%] lg:max-w-lg lg:flex-[0_1_27%]"
            : "flex"
        }`}
      >
        {rightColumn}
      </div>

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
        {...pickMessageThreadModalProps(messageThreadHook)}
      />

      <ConfirmationDialog
        show={showRejectConfirmation}
        onClose={() => setShowRejectConfirmation(false)}
        onConfirm={handleConfirmReject}
        message="Reject Creator"
        content={
          <div className="text-center">
            <p className="mb-2 text-gray-600">
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

function BrandApplications() {
  const searchParams = useSearchParams();
  const view = Number(searchParams.get("view")) || 1;
  const [activeView, setActiveView] = useState(1);

  if (isCreatorMode()) {
    return null;
  }

  useEffect(() => {
    setActiveView(view || 1);
  }, [view]);

  return (
    <>
      {activeView === 1 ? (
        <BrandApplicationsContent onSwitchToRejected={() => setActiveView(2)} />
      ) : (
        <Rejected onSwitchToApplications={() => setActiveView(1)} />
      )}
    </>
  );
}

export default BrandApplications;
