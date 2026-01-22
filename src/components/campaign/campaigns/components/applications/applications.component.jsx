import { isCreatorMode } from "@/common/utils/users.util";
import CreatorApplications from "./creator/creator.component";
import BrandApplications from "./brand/applications.component";
import Rejected from "../rejected/rejected.component";
import { useState } from "react";

function CampaignApplication() {
  const [activeView, setActiveView] = useState("applications");

  if (isCreatorMode()) {
    return <CreatorApplications />;
  }

  return (
    <>
      {activeView === "applications" ? (
        <BrandApplications onSwitchToRejected={() => setActiveView("rejected")} />
      ) : (
        <Rejected onSwitchToApplications={() => setActiveView("applications")} />
      )}
    </>
  );
}

export default CampaignApplication;
