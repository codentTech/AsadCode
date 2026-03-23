import { isCreatorMode } from "@/common/utils/users.util";
import BrandDiscover from "./brand/brand-discover.component";
import CampaignDashboard from "./creator/creator-discover.component";

function Discover() {
  return (
    <div className="bg-gray-100">{isCreatorMode() ? <CampaignDashboard /> : <BrandDiscover />}</div>
  );
}

export default Discover;
