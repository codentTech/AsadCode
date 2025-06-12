import { useSelector } from "react-redux";
import BrandDiscover from "./brand/brand-discover.component";
import CampaignDashboard from "./creator/creator-discover.component";

function Discover() {
  const isCreatorMode = useSelector(({ auth }) => auth.isCreatorMode);

  return (
    <div className="bg-gray-100">{isCreatorMode ? <CampaignDashboard /> : <BrandDiscover />}</div>
  );
}

export default Discover;
