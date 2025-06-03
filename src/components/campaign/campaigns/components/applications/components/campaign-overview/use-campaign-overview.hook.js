import { useState } from "react";

function useCampaignOverview() {
  const [openFilterModal, setOpenFilterModal] = useState(false);

  return { openFilterModal, setOpenFilterModal };
}

export default useCampaignOverview;
