import useGetplatform from "@/common/hooks/use-social-platform.hook";
import { useState } from "react";
import CampaignDetails from "./components/campaign-detail/campaign-detail.component";
import CompletedCampaignList from "./components/campaign-list/campaign-list.component";
import FinanceDashboard from "./components/finance-dashboard/finance-dashboard.component";
import NotFound from "@/common/components/not-found/not-found.component";
import useCompletedCampaign from "./use-creator.hook";

const CompletedCampaign = () => {
  const { getPlatformIcon, getPlatformColor } = useGetplatform();

  // Use the custom hook for completed campaign functionality
  const {
    selectedCampaign,
    completedCampaigns,
    searchQuery,
    expandedMonths,
    applicationsLoading,
    applicationsSuccess,
    applicationsError,
    paymentHistory,
    upcomingPayments,
    handleCampaignSelect,
    setSearchQuery,
    setExpandedMonths,
  } = useCompletedCampaign();

  // Local state for reviews
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  // Show loading state
  if (applicationsLoading) {
    return (
      <div className="relative flex h-screen">
        <div className="w-[23%] bg-white border-r border-gray-200 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
            <div className="text-sm text-gray-500">Loading campaigns...</div>
          </div>
        </div>
        <div className="flex-1 bg-white border-r border-gray-200 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
            <div className="text-sm text-gray-500">Loading campaign details...</div>
          </div>
        </div>
        <div className="w-[27%] bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
            <div className="text-sm text-gray-500">Loading finance data...</div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (applicationsError) {
    return (
      <div className="relative flex h-screen">
        <div className="w-[23%] bg-white border-r border-gray-200 flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm text-red-500">Failed to load campaigns</div>
          </div>
        </div>
        <div className="flex-1 bg-white border-r border-gray-200 flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm text-red-500">Error loading campaign details</div>
          </div>
        </div>
        <div className="w-[27%] bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm text-red-500">Error loading finance data</div>
          </div>
        </div>
      </div>
    );
  }

  // Show not found state when no campaigns
  if (!applicationsLoading && applicationsSuccess && completedCampaigns.length === 0) {
    return (
      <div className="relative flex h-screen">
        {/* Left Column - Campaign List */}
        <div className="w-[23%] bg-white border-r border-gray-200">
          <NotFound
            title="No Completed Campaigns"
            description="No completed campaigns available."
            className="h-full"
          />
        </div>

        {/* Center Column - Campaign Details */}
        <div className="flex-1 bg-white border-r border-gray-200">
          <NotFound
            title="No Campaign Selected"
            description="Select a campaign to view details."
            className="h-full"
          />
        </div>

        {/* Right Column - Finance Dashboard */}
        <div className="w-[27%] bg-white">
          <NotFound
            title="No Finance Data"
            description="No payment data available."
            className="h-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 overflow-hidden">
      <CompletedCampaignList
        campaigns={completedCampaigns}
        selectedCampaign={selectedCampaign}
        onSelect={handleCampaignSelect}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
      />
      <CampaignDetails
        campaign={selectedCampaign}
        reviewRating={reviewRating}
        reviewText={reviewText}
        setReviewRating={setReviewRating}
        setReviewText={setReviewText}
        getPlatformIcon={getPlatformIcon}
        getPlatformColor={getPlatformColor}
      />
      <FinanceDashboard
        paymentHistory={paymentHistory}
        upcomingPayments={upcomingPayments}
        expandedMonths={expandedMonths}
        setExpandedMonths={setExpandedMonths}
        selectedCampaign={selectedCampaign?.campaign}
      />
    </div>
  );
};

export default CompletedCampaign;
