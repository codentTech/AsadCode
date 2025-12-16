import React from "react";
import CampaignList from "./components/campaign-list/campaign-list.component";
import CampaignDetail from "./components/campaign-detail/campaign-detail.component";
import ContentPlanning from "./components/content-planning/content-planning.component";
import NotFound from "@/common/components/not-found/not-found.component";
import useActiveCampaign from "./use-creator.hook";
import Loading from "@/common/components/loadar/loading.component";

const ActiveCampaign = () => {
  const {
    selectedCampaign,
    activeCampaigns,
    getApplicationsState,
    handleCampaignSelect,
    formatCampaignData,
  } = useActiveCampaign();

  // Format campaigns for display
  const formattedCampaigns = activeCampaigns.map((campaign) => formatCampaignData(campaign));

  // Show loading state
  if (getApplicationsState.isLoading) {
    return (
      <div className="relative flex h-screen">
        <div className="w-[23%] bg-white border-r border-gray-200 flex items-center justify-center">
          <Loading />
        </div>
        <div className="flex-1 bg-white border-r border-gray-200 flex items-center justify-center">
          <Loading />
        </div>
        <div className="w-[27%] bg-white flex items-center justify-center">
          <Loading />
        </div>
      </div>
    );
  }

  // Show not found state when no campaigns
  if (!getApplicationsState.isLoading && formattedCampaigns.length === 0) {
    return (
      <div className="relative flex h-screen">
        {/* Left Column - Campaign List */}
        <div className="w-[23%] bg-white border-r border-gray-200">
          <NotFound
            title="No Active Campaigns"
            description="No campaigns available."
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

        {/* Right Column - Content Planning */}
        <div className="w-[27%] bg-white">
          <NotFound
            title="No Content Planner"
            description="Content tools not available."
            className="h-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex">
      {/* Left Column - Campaign List */}
      <CampaignList
        campaigns={formattedCampaigns}
        selectedCampaign={selectedCampaign}
        onCampaignSelect={handleCampaignSelect}
        isLoading={getApplicationsState.isLoading}
      />

      {/* Center Column - Campaign Details */}
      <CampaignDetail
        selectedCampaign={selectedCampaign}
        isLoading={getApplicationsState.isLoading}
      />

      {/* Right Column - Content Planning + Deadlines */}
      <ContentPlanning selectedCampaign={selectedCampaign} />
    </div>
  );
};

export default ActiveCampaign;
