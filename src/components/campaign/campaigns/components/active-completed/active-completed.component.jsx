import ActiveCampaign from "./creator/active/active.component";
import CompletedCampaign from "./creator/completed/completed.component";

function ActiveCompleted({ isCompleted }) {
  return (
    <div>
      {isCompleted ? <CompletedCampaign /> : <ActiveCampaign />}

      {/* <Brand isCompleted={isCompleted} /> */}
    </div>
  );
}

export default ActiveCompleted;
