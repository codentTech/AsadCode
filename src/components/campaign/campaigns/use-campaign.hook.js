import { useEffect, useMemo, useState } from "react";
import { isCreatorMode } from "@/common/utils/users.util";
import { useSearchParams } from "next/navigation";

function useCampaign() {
  const searchParams = useSearchParams();
  const tab = Number(searchParams.get("tab")) || 1;
  const [activeTab, setActiveTab] = useState(tab || 1);

  const mainTabs = useMemo(() => {
<<<<<<< HEAD
    const brandTabs = [
      { id: 1, label: "Discover+" },
      { id: 2, label: "Applications" },
      { id: 3, label: "Active" },
      { id: 4, label: "Completed" },
    ];

    const creatorTabs = [
=======
    const tabs = [
>>>>>>> a5159f35022f88726e1d03be107e98f125d40fbc
      { id: 1, label: "Discover+" },
      { id: 2, label: "Active" },
      { id: 3, label: "Completed" },
      { id: 4, label: "Applications" },
    ];

    return isCreatorMode() ? creatorTabs : brandTabs;
  }, []);

  useEffect(() => {
    setActiveTab(tab || 1);
  }, [tab]);

  return {
    activeTab,
    setActiveTab,
    mainTabs,
    isCreatorMode,
  };
}

export default useCampaign;