import { useMemo, useState } from "react";
import { isCreatorMode } from "@/common/utils/users.util";

function useCampaign() {
  const [activeTab, setActiveTab] = useState(1);

  const mainTabs = useMemo(() => {
    const tabs = [
      { id: 1, label: "Discover+" },
      { id: 2, label: "Applications" },
      { id: 3, label: "Active" },
      { id: 4, label: "Completed" },
    ];

    return tabs;
  }, []);

  return {
    activeTab,
    setActiveTab,
    mainTabs,
  };
}

export default useCampaign;
