import React from "react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import ConfirmationDialog from "@/common/components/custom-dialog-confirmation/ConfirmationDialog";
import { Package } from "lucide-react";
import CampaignBriefModal from "./components/campaign-brief-modal/campaign-brief-modal.component";
import ApplicationMessageThread from "./components/message-thread-modal/application-message-thread.component";
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
                      <span>Invites</span>
                      <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full min-w-[1.5rem] flex items-center justify-center">
                        {allApplications.invites?.length || 0}
                      </span>
                    </div>
                  }
                  onClick={() => handleTabChange("invites")}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === "invites"
                      ? "bg-white text-gray-900 shadow-md ring-1 ring-gray-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`}
                />
                <CustomButton
                  text={
                    <div className="flex items-center space-x-2 text-xs">
                      <span>Negotiations</span>
                      <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full min-w-[1.5rem] flex items-center justify-center">
                        {allApplications.negotiations?.length || 0}
                      </span>
                    </div>
                  }
                  onClick={() => handleTabChange("negotiations")}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === "negotiations"
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
                activeTab === "invites"
                  ? "invites"
                  : activeTab === "negotiations"
                    ? "negotiations"
                    : activeTab === "offers"
                      ? "offers"
                      : activeTab === "pending"
                        ? "pending"
                        : "rejected"
              } ${activeTab === "invites" ? "" : "applications"}`}
              description={
                activeTab === "invites"
                  ? "You don't have any invitations from brands yet. Brands will send you invitations to collaborate."
                  : activeTab === "negotiations"
                    ? "Brands haven't started conversations about your applications yet."
                    : activeTab === "offers"
                      ? "You don't have any offers at the moment. Keep applying to campaigns!"
                      : activeTab === "pending"
                        ? "You don't have any pending applications at the moment."
                        : "You don't have any rejected applications."
              }
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredData.map((item) => (
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
        <ApplicationMessageThread
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

const EmptyState = ({ icon, title, description }) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default CreatorApplications;
