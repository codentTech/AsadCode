import React from "react";
import { isCreatorMode } from "@/common/utils/users.util";
import CompletedBrandCampaign from "./brand/brand.component";
import CompletedCampaign from "./creator/creator.component";

function Completed() {
  return <div>{isCreatorMode() ? <CompletedCampaign /> : <CompletedBrandCampaign />}</div>;
}

export default Completed;
