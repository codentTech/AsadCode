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
      { id: 2, label: "Applications" },
      { id: 3, label: "Active" },
      { id: 4, label: "Completed" },
    ];

    return tabs;
  }, []);

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
