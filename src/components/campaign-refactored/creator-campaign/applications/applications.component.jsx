import ConfirmationDialog from "@/common/components/custom-dialog-confirmation/ConfirmationDialog";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import { Skeleton } from "@/common/components/loader/skeleton-loader.component";
import NotFound from "@/common/components/not-found/not-found.component";
import MessageThreadModal from "@/components/campaign-refactored/shared/message-thread-modal/message-thread-modal.component";
import { pickMessageThreadModalProps } from "@/components/campaign-refactored/shared/message-thread-modal/use-message-thread.hook";
import { Gift, RefreshCw } from "lucide-react";
import ApplicationCard from "./components/application-card/application-card.component";
import CampaignBriefModal from "./components/campaign-brief-modal/campaign-brief-modal.component";
import OffersModal from "./components/offers-modal/offers-modal.component";
import useApplications from "./use-applications.hook";

export default function CreatorApplications() {
  const {
    activeTab,
    allApplications,
    selectedCampaign,
    showCampaignBrief,
    showWithdrawConfirmation,
    showOffersModal,
    setShowOffersModal,
    applicationsLoading,
    applicationsError,
    withdrawLoading,
    filteredData,
    paginatedData,
    hasMoreItems,
    totalFilteredItems,
    handleLoadMore,
    handleTabChange,
    handleViewCampaign,
    handleCloseCampaignBrief,
    handleWithdraw,
    handleConfirmWithdraw,
    handleCancelWithdraw,
    handleMessageClick,
    handleCloseMessageModal,
    handleCloseMessageThread,
    messageModalState,
    messageThreadHook,
    messageThreadBrand,
    fetchAllApplications,
    formatCompensationType,
    offersData,
  } = useApplications();

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-10">
        <div className="mx-auto max-w-7xl p-2.5 sm:p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h1 className="text-sm font-semibold text-gray-900 sm:text-lg md:text-xl">
                  Campaign Applications
                </h1>
                <p className="text-[10px] leading-snug text-gray-600 sm:text-xs md:text-sm">
                  Track and manage your brand applications
                </p>
              </div>
              <button
                type="button"
                onClick={fetchAllApplications}
                disabled={applicationsLoading}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60 sm:hidden"
                aria-label="Refresh applications"
                title="Refresh applications"
              >
                <RefreshCw className={`h-4 w-4 ${applicationsLoading ? "animate-spin" : ""}`} />
              </button>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:gap-3">
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={fetchAllApplications}
                  disabled={applicationsLoading}
                  className="hidden h-6 w-6 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60 sm:inline-flex sm:h-8 sm:w-8"
                  aria-label="Refresh applications"
                  title="Refresh applications"
                >
                  <RefreshCw className={`h-4 w-4 ${applicationsLoading ? "animate-spin" : ""}`} />
                </button>
                <button
                  onClick={() => setShowOffersModal(true)}
                  className="w-full relative flex h-8 items-center justify-center gap-2 rounded-lg bg-primary px-3 text-xs font-semibold text-white shadow-md transition-all duration-200 hover:shadow-lg sm:h-8 sm:px-4 sm:text-sm"
                >
                  <Gift className="w-4 h-4" />
                  <span>My Offers</span>
                  {(offersData?.length || 0) > 0 && (
                    <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-white/20 text-white text-xs font-bold rounded-full">
                      {offersData?.length || 0}
                    </span>
                  )}
                </button>
              </div>

              <div className="-mx-0.5 flex items-center gap-1 overflow-x-auto pb-0.5 sm:mx-0 sm:gap-2 sm:overflow-visible sm:pb-0">
                <button
                  onClick={() => handleTabChange(1)}
                  className={`inline-flex h-8 min-w-[86px] shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-[10px] transition-all duration-200 sm:min-w-[100px] sm:px-4 sm:text-xs ${
                    activeTab === 1
                      ? "bg-primary text-white shadow"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <span>Invites</span>
                  {allApplications.invites?.length > 0 && (
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        activeTab === 1 ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {allApplications.invites?.length || 0}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleTabChange(2)}
                  className={`inline-flex h-8 min-w-[86px] shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-[10px] transition-all duration-200 sm:min-w-[100px] sm:px-4 sm:text-xs ${
                    activeTab === 2
                      ? "bg-primary text-white shadow"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <span>Negotiations</span>
                  {allApplications.negotiations?.length > 0 && (
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        activeTab === 2 ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {allApplications.negotiations?.length || 0}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleTabChange(3)}
                  className={`inline-flex h-8 min-w-[86px] shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-[10px] transition-all duration-200 sm:min-w-[100px] sm:px-4 sm:text-xs ${
                    activeTab === 3
                      ? "bg-primary text-white shadow"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <span>Pending</span>
                  {allApplications.pending?.length > 0 && (
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        activeTab === 3 ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {allApplications.pending?.length || 0}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleTabChange(4)}
                  className={`inline-flex h-8 min-w-[86px] shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-[10px] transition-all duration-200 sm:min-w-[100px] sm:px-4 sm:text-xs ${
                    activeTab === 4
                      ? "bg-primary text-white shadow"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <span>Rejected</span>
                  {allApplications.rejected?.length > 0 && (
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        activeTab === 4 ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {allApplications.rejected?.length || 0}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        <div className="mx-auto max-w-7xl px-2.5 py-3 sm:px-6 sm:py-8">
          {applicationsLoading ? (
            <div className="grid grid-cols-1 gap-3 sm:gap-6 lg:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`application-skeleton-${index}`}
                  className="rounded-xl border border-gray-200 bg-white p-4"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <div className="space-y-2">
                        <Skeleton className="h-3 w-28" />
                        <Skeleton className="h-2.5 w-20" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-11/12" />
                    <Skeleton className="h-3 w-9/12" />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Skeleton className="h-8 w-full rounded-md" />
                    <Skeleton className="h-8 w-full rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          ) : applicationsError ? (
            <NotFound
              title="Error loading applications"
              description="Failed to fetch campaign applications. Please try again later."
            />
          ) : filteredData.length === 0 ? (
            <NotFound
              title={`No ${
                activeTab === 1
                  ? "invites"
                  : activeTab === 2
                    ? "negotiations"
                    : activeTab === 5
                      ? "offers"
                      : activeTab === 3
                        ? "pending"
                        : "rejected"
              } ${activeTab === 1 ? "" : "applications"}`}
              description={
                activeTab === 1
                  ? "You don't have any invitations from brands yet. Brands will send you invitations to collaborate."
                  : activeTab === 2
                    ? "Brands haven't started conversations about your applications yet."
                    : activeTab === "offers"
                      ? "You don't have any offers at the moment. Keep applying to campaigns!"
                      : activeTab === 3
                        ? "You don't have any pending applications at the moment."
                        : "You don't have any rejected applications."
              }
            />
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:gap-6 lg:grid-cols-2">
                {paginatedData.map((item) => (
                  <ApplicationCard
                    key={item.id}
                    application={item}
                    formatCompensationType={formatCompensationType}
                    handleViewCampaign={handleViewCampaign}
                    handleWithdraw={handleWithdraw}
                    handleMessageClick={handleMessageClick}
                    withdrawLoading={withdrawLoading}
                  />
                ))}
              </div>
              {hasMoreItems && (
                <div className="rounded-xl border border-gray-200 bg-white p-3 sm:p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-[10px] text-gray-600 sm:text-xs md:text-sm">
                      Showing {paginatedData.length} of {totalFilteredItems} applications
                    </p>
                    <CustomButton
                      text="Load More"
                      className="btn-outline w-full sm:w-auto"
                      onClick={handleLoadMore}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

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

      <MessageThreadModal
        key={`${messageModalState.brandId ?? ""}-${messageModalState.application?.campaign?.id ?? messageModalState.application?.campaign_id ?? messageModalState.application?.id ?? ""}`}
        isOpen={messageModalState.isOpen && messageThreadHook.isModalOpen}
        onClose={handleCloseMessageThread}
        creator={messageThreadBrand}
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

      <OffersModal
        show={showOffersModal}
        onClose={() => setShowOffersModal(false)}
        onContractAction={fetchAllApplications}
      />
    </div>
  );
}
