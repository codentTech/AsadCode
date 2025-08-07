import CampaignOverview from "./components/campaign-overview/campaign-overview.component";
import CreatorSpendAnalysis from "./components/creator-spend-analysis/creator-spend-analysis.component";
import DeliverablesProgress from "./components/deliverables-progress/deliverables-progress.component.jsx";

function BrandApplications() {
  return (
    <div className="relative flex">
      {/* Chat list */}
      <CampaignOverview />

      {/* Chat area */}
      <CreatorSpendAnalysis />

      {/* Right sidebar - Profile and connections */}
      <DeliverablesProgress isCreatorMode={false} />
    </div>
  );
}

export default BrandApplications;
