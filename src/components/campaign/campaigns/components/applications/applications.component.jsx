import { isCreatorMode } from "@/common/utils/users.util";
import CreatorApplications from "./creator/creator.component";
import BrandApplications from "./brand/applications.component";
import Rejected from "../rejected/rejected.component";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function CampaignApplication() {
  const searchParams = useSearchParams();
  const view = Number(searchParams.get("view")) || 1;
  const [activeView, setActiveView] = useState(1);

  if (isCreatorMode()) {
    return <CreatorApplications />;
  }

  useEffect(() => {
    setActiveView(view || 1);
  }, [view]);

  return (
    <>
      {activeView === 1 ? (
        <BrandApplications onSwitchToRejected={() => setActiveView(2)} />
      ) : (
        <Rejected onSwitchToApplications={() => setActiveView(1)} />
      )}
    </>
  );
}

export default CampaignApplication;
