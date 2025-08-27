import React from "react";
import { isCreatorMode } from "@/common/utils/users.util";
import Brand from "./brand/brand.component";
import ActiveCampaign from "./creator/active/active.component";
import CompletedCampaign from "./creator/completed/completed.component";

function ActiveCompleted({ isCompleted }) {
  return (
    <div>
      {isCreatorMode() ? (
        <React.Fragment>{isCompleted ? <CompletedCampaign /> : <ActiveCampaign />}</React.Fragment>
      ) : (
        <Brand isCompleted={isCompleted} />
      )}
    </div>
  );
}

export default ActiveCompleted;
