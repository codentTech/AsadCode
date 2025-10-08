import React from "react";
import { isCreatorMode } from "@/common/utils/users.util";
import ActiveBrandCampaign from "./brand/brand.component";
import ActiveCampaign from "./creator/creator.component";

function Active() {
  return <div>{isCreatorMode() ? <ActiveCampaign /> : <ActiveBrandCampaign />}</div>;
}

export default Active;
