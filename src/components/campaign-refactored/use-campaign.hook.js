import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isCreatorMode } from "@/common/utils/users.util";
import { useSearchParams } from "next/navigation";
import {
  selectCampaignActiveTab,
  setCampaignActiveTab,
} from "@/provider/features/campaign-context/campaign-context.slice";

import BrandDiscover from "./brand-campaign/discover/discover.component";
import BrandApplications from "./brand-campaign/applications/applications.component";
import BrandActive from "./brand-campaign/active/active.component";
import BrandCompleted from "./brand-campaign/completed/completed.component";

import CreatorDiscover from "./creator-campaign/discover/discover.component";
import CreatorApplications from "./creator-campaign/applications/applications.component";
import CreatorActive from "./creator-campaign/active/active.component";
import CreatorCompleted from "./creator-campaign/completed/completed.component";

export default function useCampaign() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const tab = Number(searchParams.get("tab")) || 1;
  const activeTab = useSelector(selectCampaignActiveTab) || 1;

  const componentMap = useMemo(
    () => ({
      brand: {
        1: BrandDiscover,
        2: BrandApplications,
        3: BrandActive,
        4: BrandCompleted,
      },
      creator: {
        1: CreatorDiscover,
        2: CreatorActive,
        3: CreatorCompleted,
        4: CreatorApplications,
      },
    }),
    []
  );

  const mainTabs = useMemo(() => {
    const brandTabs = [
      { id: 1, label: "Discover+" },
      { id: 2, label: "Applications" },
      { id: 3, label: "Active" },
      { id: 4, label: "Completed" },
    ];

    const creatorTabs = [
      { id: 1, label: "Discover+" },
      { id: 2, label: "Active" },
      { id: 3, label: "Completed" },
      { id: 4, label: "Applications" },
    ];

    return isCreatorMode() ? creatorTabs : brandTabs;
  }, []);

  const userRole = useMemo(() => (isCreatorMode() ? "creator" : "brand"), []);
  const ActiveComponent = componentMap[userRole][activeTab];

  const setActiveTab = useCallback(
    (tabId) => {
      dispatch(setCampaignActiveTab(tabId));
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(setCampaignActiveTab(tab || 1));
  }, [tab, dispatch]);

  return {
    activeTab,
    setActiveTab,
    mainTabs,
    ActiveComponent,
  };
}
