import ConfirmationDialog from "@/common/components/custom-dialog-confirmation/ConfirmationDialog";
import { SkeletonCardGrid } from "@/common/components/loader/skeleton-loader.component";
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

function MiddlePaneSkeleton() {
  return (
    <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col border-r border-gray-200 bg-white p-3 sm:p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-10 w-full max-w-[10rem] animate-pulse rounded bg-gray-200 sm:w-32" />
      </div>
      <SkeletonCardGrid count={6} gridClass="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3" />
    </div>
  );
}

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
    clearFilters,
    handleMessageClick,
    fetchIndividualCollaborations,
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
      <div className="relative flex min-h-0 flex-1 flex-col md:flex-row">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col md:max-w-none md:flex-[0_1_73%] lg:max-w-none">
          <MiddlePaneSkeleton />
        </div>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col border-l border-gray-200/80 bg-white md:max-w-md md:flex-[0_1_27%] lg:max-w-lg lg:flex-[0_1_27%]">
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
    <div className="relative flex min-h-0 flex-1 flex-col bg-slate-50/40 md:flex-row md:bg-transparent">
      <div
        className={`flex min-h-0 min-w-0 flex-1 flex-col transition-[opacity,transform] duration-200 ease-out md:max-w-none md:flex-[0_1_73%] lg:max-w-none ${
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
          onClearFilters={clearFilters}
          fetchIndividualCollaborations={fetchIndividualCollaborations}
          onSwitchToRejected={onSwitchToRejected}
        />
      </div>

      <div
        className={`flex min-h-0 min-w-0 flex-1 flex-col border-l border-gray-200/80 bg-white shadow-[0_0_24px_-8px_rgba(79,70,229,0.12)] md:shadow-none ${
          mobilePane === "list" ? "hidden md:flex md:max-w-md md:flex-[0_1_27%] lg:max-w-lg lg:flex-[0_1_27%]" : "flex"
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
