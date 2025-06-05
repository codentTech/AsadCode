import { useState } from "react";

function useCampaign() {
  const [activeTab, setActiveTab] = useState(1);

  const mainTabs = [
    { id: 1, label: "Discover+" },
    { id: 2, label: "Active" },
    { id: 3, label: "Completed" },
    { id: 4, label: "Applications" },
    { id: 5, label: "Rejected" },
  ];

  return {
    activeTab,
    setActiveTab,
    mainTabs,
  };
}

export default useCampaign;
