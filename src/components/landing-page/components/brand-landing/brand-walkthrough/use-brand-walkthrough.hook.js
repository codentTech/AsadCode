import { useCallback, useState } from "react";
import {
  BRAND_LANDING_DEFAULT_TAB,
  BRAND_LANDING_WALKTHROUGH_TABS,
} from "@/common/constants/brand-landing.constant";

function useBrandWalkthrough() {
  const [activeTab, setActiveTab] = useState(BRAND_LANDING_DEFAULT_TAB);

  const handleTabChange = useCallback((index) => {
    setActiveTab(index);
  }, []);

  return {
    tabs: BRAND_LANDING_WALKTHROUGH_TABS,
    activeTab,
    handleTabChange,
  };
}

export default useBrandWalkthrough;
