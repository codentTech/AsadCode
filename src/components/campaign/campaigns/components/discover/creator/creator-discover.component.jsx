import CampaignFeed from "./components/campaign-feed/campaign-feed.component";
import CampaignFilters from "./components/campaign-filters/campaign-filters.component";
import PitchTemplate from "./components/pitch-template/pitch-template.component";

const CampaignDashboard = () => {
  return (
    <div className="mx-auto max-w-7xl relative flex flex-1 overflow-hidden pb-20">
      {/* Left Column - Campaign Filters */}
      <CampaignFilters />

      {/* Center Column - Campaign Feed */}
      <CampaignFeed />

      {/* Right Column - My Pitch Templates */}
      <PitchTemplate />
    </div>
  );
};

export default CampaignDashboard;
