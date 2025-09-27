import React from "react";
import CampaignList from "./components/campaign-list/campaign-list.component";
import CampaignDetail from "./components/campaign-detail/campaign-detail.component";
import ContentPlanning from "./components/content-planning/content-planning.component";
import useActiveCampaign from "./use-active-campaign.hook";

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
