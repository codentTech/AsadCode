import { isCreatorMode } from "@/common/utils/users.util";
import CampaignOverview from "./components/campaign-overview/campaign-overview.component";
import CreatorSpendAnalysis from "./components/creator-spend-analysis/creator-spend-analysis.component";
import DeliverablesProgress from "./components/deliverables-progress/deliverables-progress.component.jsx";

function Rejected() {
  return (
    <div className="relative flex">
      <CampaignOverview />

      <CreatorSpendAnalysis />

      <DeliverablesProgress isCreatorMode={isCreatorMode()} />
    </div>
  );
}

export default Rejected;
