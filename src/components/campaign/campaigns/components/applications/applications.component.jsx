import { isCreatorMode } from "@/common/utils/users.util";
import CreatorApplications from "./creator/creator.component";
import BrandApplications from "./brand/applications.component";

function CampaignApplication() {
  return <div>{isCreatorMode() ? <CreatorApplications /> : <BrandApplications />}</div>;
}

export default CampaignApplication;
