import CampaignOverview from "./components/campaign-overview/campaign-overview.component";
import CreatorSpendAnalysis from "./components/creator-spend-analysis/creator-spend-analysis.component";
import DeliverablesProgress from "./components/deliverables-progress/deliverables-progress.component.jsx";

function ActiveCompleted({ isCompleted }) {
  return (
    <div className="relative flex flex-1 overflow-hidden pb-20">
      {/* Chat list */}
      <CampaignOverview isCompleted={isCompleted} />

      {/* Chat area */}
      <CreatorSpendAnalysis isCompleted={isCompleted} />

      {/* Right sidebar - Profile and connections */}
      <DeliverablesProgress isCreatorMode={false} isCompleted={isCompleted} />
    </div>
  );
}

export default ActiveCompleted;
