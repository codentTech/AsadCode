import React from "react";
import { useSelector } from "react-redux";
import Brand from "./brand/brand.component";
import ActiveCampaign from "./creator/active/active.component";
import CompletedCampaign from "./creator/completed/completed.component";

function ActiveCompleted({ isCompleted }) {
  const isCreatorMode = useSelector(({ auth }) => auth.isCreatorMode);

  return (
    <div>
      {isCreatorMode ? (
        <React.Fragment>{isCompleted ? <CompletedCampaign /> : <ActiveCampaign />}</React.Fragment>
      ) : (
        <Brand isCompleted={isCompleted} />
      )}
    </div>
  );
}

export default ActiveCompleted;
