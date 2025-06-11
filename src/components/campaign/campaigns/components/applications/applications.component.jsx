import { useSelector } from "react-redux";
import CreatorApplications from "./creator/creator.component";
import BrandApplications from "./brand/applications.component";

function CampaignApplication() {
  const isCreatorMode = useSelector(({ auth }) => auth.isCreatorMode);

  return <div>{isCreatorMode ? <CreatorApplications /> : <BrandApplications />}</div>;
}

export default CampaignApplication;
