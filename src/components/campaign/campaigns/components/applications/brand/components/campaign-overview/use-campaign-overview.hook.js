import { useState } from "react";

function useCampaignOverview() {
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);

  return { openFilterModal, setOpenFilterModal, messageDialogOpen, setMessageDialogOpen };
}

export default useCampaignOverview;
