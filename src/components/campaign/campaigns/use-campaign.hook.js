import { useEffect, useMemo, useState } from "react";
import { isCreatorMode } from "@/common/utils/users.util";
import { useSearchParams } from "next/navigation";

function useCampaign() {
  const searchParams = useSearchParams();
  const tab = Number(searchParams.get("tab")) || 1;
  const [activeTab, setActiveTab] = useState(tab || 1);

  const mainTabs = useMemo(() => {
    const tabs = [
      { id: 1, label: "Discover+" },
      { id: 2, label: "Active" },
      { id: 3, label: "Completed" },
      { id: 4, label: "Applications" },
      { id: 5, label: "Rejected" },
    ];

    if (isCreatorMode()) {
      return tabs.filter((tab) => tab.label !== "Rejected");
    }

    return tabs;
  }, [isCreatorMode()]);

  useEffect(() => {
    setActiveTab(tab || 1);
  }, [tab]);

  return {
    activeTab,
    setActiveTab,
    mainTabs,
  };
}

export default useCampaign;
