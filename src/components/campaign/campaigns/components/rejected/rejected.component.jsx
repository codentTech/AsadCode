import CampaignOverview from "./components/campaign-overview/campaign-overview.component";
import CreatorSpendAnalysis from "./components/creator-spend-analysis/creator-spend-analysis.component";
import DeliverablesProgress from "./components/deliverables-progress/deliverables-progress.component.jsx";

function Rejected() {
  return (
    <div className="relative flex flex-1 overflow-hidden pb-20">
      {/* Chat list */}
      <CampaignOverview />

      {/* Chat area */}
      <CreatorSpendAnalysis />

      {/* Right sidebar - Profile and connections */}
      <DeliverablesProgress isCreatorMode={false} />
    </div>
  );
}

export default Rejected;
