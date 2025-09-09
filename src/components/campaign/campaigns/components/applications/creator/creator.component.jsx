import CustomButton from "@/common/components/custom-button/custom-button.component";
import { Calendar, Package } from "lucide-react";
import { useState } from "react";
import useCreatorApplications from "./use-creator-applications.hook";
import CampaignBriefModal from "./campaign-brief-modal.component";
import ConfirmationDialog from "@/common/components/custom-dialog-confirmation/ConfirmationDialog";

const CreatorApplications = () => {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showCampaignBrief, setShowCampaignBrief] = useState(false);
  const [showWithdrawConfirmation, setShowWithdrawConfirmation] = useState(false);
  const [campaignToWithdraw, setCampaignToWithdraw] = useState(null);

  const {
    activeTab,
    handleTabChange,
    applicationsData,
    applicationsLoading,
    applicationsSuccess,
    applicationsError,
    filteredData,
    handleWithdrawApplication,
    withdrawLoading,
    withdrawSuccess,
    withdrawError,
  } = useCreatorApplications();

  // Helper function to format compensation type
  const formatCompensationType = (type) => {
    switch (type) {
      case "FIXED":
        return "Paid";
      case "GIFTED":
        return "Gifted";
      case "COMMISSION":
        return "Commission";
      default:
        return type;
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Helper function to get brand logo (fallback to default)
  const getBrandLogo = (brand) => {
    return (
      brand?.profile_photo_url ||
      "https://images.unsplash.com/photo-1549924231-f129b911e442?w=40&h=40&fit=crop&crop=center"
    );
  };

  // Handle view campaign
  const handleViewCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setShowCampaignBrief(true);
  };

  // Handle close campaign brief
  const handleCloseCampaignBrief = () => {
    setShowCampaignBrief(false);
    setSelectedCampaign(null);
  };

  // Handle withdraw application
  const handleWithdraw = async (campaignId) => {
    setCampaignToWithdraw(campaignId);
    setShowWithdrawConfirmation(true);
  };

  // Handle confirm withdraw
  const handleConfirmWithdraw = async () => {
    if (campaignToWithdraw) {
      await handleWithdrawApplication(campaignToWithdraw);
      setShowWithdrawConfirmation(false);
      setCampaignToWithdraw(null);
    }
  };

  // Handle cancel withdraw
  const handleCancelWithdraw = () => {
    setShowWithdrawConfirmation(false);
    setCampaignToWithdraw(null);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Top Section - Toggle */}
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
                    <span>Pending</span>
                    <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full min-w-[1.5rem] flex items-center justify-center">
                      {applicationsData?.data?.filter((app) => app.status === "PENDING")?.length ||
                        0}
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
                      {applicationsData?.data?.filter((app) => app.status === "REJECTED")?.length ||
                        0}
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

      {/* Scrollable Grid View - Applications */}
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {applicationsLoading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Loading applications...</h3>
              <p className="text-gray-600">Please wait while we fetch the campaign applications.</p>
            </div>
          ) : applicationsError ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading applications</h3>
              <p className="text-gray-600">
                Failed to fetch campaign applications. Please try again later.
              </p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {activeTab === "pending" ? "pending" : "rejected"} applications
              </h3>
              <p className="text-gray-600">
                {activeTab === "pending"
                  ? "You don't have any pending applications at the moment."
                  : "You don't have any rejected applications."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredData.map((application) => (
                <div
                  key={application.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                >
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
                            : formatCompensationType(application.campaign?.compensation_type) ===
                                "Gifted"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        <span>
                          {formatCompensationType(application.campaign?.compensation_type)}
                        </span>
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
                        {application.campaign?.deliverables?.slice(0, 3).map((item, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md flex items-center gap-1"
                          >
                            <div className="w-1 h-1 bg-indigo-600 rounded-full" />
                            {item}
                          </span>
                        ))}
                        {application.campaign?.deliverables?.length > 3 && (
                          <span className="text-xs text-gray-500 px-2 py-1">
                            +{application.campaign.deliverables.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-4 border-t border-gray-100">
                    <div className="flex flex-col space-y-2">
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
              ))}
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

      {/* Withdraw Confirmation Modal */}
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
    </div>
  );
};

export default CreatorApplications;
