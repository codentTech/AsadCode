import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

function useCampaign() {
  const isCreatorMode = useSelector(({ auth }) => auth.isCreatorMode);
  const [activeTab, setActiveTab] = useState(1);

  const mainTabs = useMemo(() => {
    const tabs = [
      { id: 1, label: "Discover+" },
      { id: 2, label: "Active" },
      { id: 3, label: "Completed" },
      { id: 4, label: "Applications" },
      { id: 5, label: "Rejected" },
    ];

    if (isCreatorMode) {
      return tabs.filter((tab) => tab.label !== "Rejected");
    }

    return tabs;
  }, [isCreatorMode]);

  return {
    activeTab,
    setActiveTab,
    mainTabs,
  };
}

export default useCampaign;
