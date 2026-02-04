import ConfirmationDialog from "@/common/components/custom-dialog-confirmation/ConfirmationDialog";
import { Gift, Package } from "lucide-react";
import ApplicationCard from "./components/application-card/application-card.component";
import CampaignBriefModal from "./components/campaign-brief-modal/campaign-brief-modal.component";
import ApplicationMessageThread from "./components/message-thread-modal/application-message-thread.component";
import OffersModal from "./components/offers-modal/offers-modal.component";
import useCreatorApplications from "./use-creator-applications.hook";

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

    offersData,
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

            {/* Tab Navigation - Enhanced Color Design */}
            <div className="flex items-center gap-3">
              {/* My Offers - Simple Distinct Button */}
              <button
                onClick={() => setShowOffersModal(true)}
                className="relative flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Gift className="w-4 h-4" />
                <span>My Offers</span>
                {(offersData?.length || 0) > 0 && (
                  <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-white/20 text-white text-xs font-bold rounded-full">
                    {offersData?.length || 0}
                  </span>
                )}
              </button>

              {/* Tab Pills - Simple Theme Design */}
              <div className="flex items-center gap-0 bg-gray-100 rounded-lg p-0.5">
                <button
                  onClick={() => handleTabChange("invites")}
                  className={`relative flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium transition-all duration-150 ${
                    activeTab === "invites"
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
                  }`}
                >
                  <span>Invites</span>
                  {allApplications.invites?.length > 0 && (
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        activeTab === "invites"
                          ? "bg-white/20 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {allApplications.invites?.length || 0}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleTabChange("negotiations")}
                  className={`relative flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium transition-all duration-150 ${
                    activeTab === "negotiations"
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
                  }`}
                >
                  <span>Negotiations</span>
                  {allApplications.negotiations?.length > 0 && (
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        activeTab === "negotiations"
                          ? "bg-white/20 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {allApplications.negotiations?.length || 0}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleTabChange("pending")}
                  className={`relative flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium transition-all duration-150 ${
                    activeTab === "pending"
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
                  }`}
                >
                  <span>Pending</span>
                  {allApplications.pending?.length > 0 && (
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        activeTab === "pending"
                          ? "bg-white/20 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {allApplications.pending?.length || 0}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleTabChange("rejected")}
                  className={`relative flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium transition-all duration-150 ${
                    activeTab === "rejected"
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
                  }`}
                >
                  <span>Rejected</span>
                  {allApplications.rejected?.length > 0 && (
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        activeTab === "rejected"
                          ? "bg-white/20 text-white"
                          : "bg-gray-200 text-gray-600"
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
