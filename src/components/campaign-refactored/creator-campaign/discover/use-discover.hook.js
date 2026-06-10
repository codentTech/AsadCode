import { useCallback, useEffect, useState } from "react";
import useCampaignFilter from "./components/campaign-filters/use-campaign-filter.hook";
import { useCampaignFeed } from "./components/campaign-feed/use-campaign-feed.hook";

function useDiscover() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [pitchesOpen, setPitchesOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const campaignFilter = useCampaignFilter();
  const campaignFeed = useCampaignFeed({
    getAdvancedFilters: campaignFilter.getApiFilters,
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateViewport = () => setIsDesktop(mediaQuery.matches);
    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  const { refetchWithFilters } = campaignFeed;
  const { getApiFilters } = campaignFilter;

  const applyFiltersAndRefresh = useCallback(
    (filtersOverride) => {
      const advancedFilters = filtersOverride
        ? getApiFilters(filtersOverride)
        : undefined;
      refetchWithFilters(advancedFilters);
    },
    [getApiFilters, refetchWithFilters]
  );

  const closeFilters = useCallback(() => {
    setFiltersOpen(false);
    if (!isDesktop) {
      applyFiltersAndRefresh();
    }
  }, [isDesktop, applyFiltersAndRefresh]);

  const closePitches = useCallback(() => setPitchesOpen(false), []);

  const handleFiltersDone = useCallback(
    (filtersOverride) => {
      applyFiltersAndRefresh(filtersOverride);
    },
    [applyFiltersAndRefresh]
  );

  const handleClearAllFilters = useCallback(() => {
    campaignFeed.clearAllFilters();
    campaignFilter.resetFilters();
  }, [campaignFeed, campaignFilter]);

  return {
    filtersOpen,
    setFiltersOpen,
    pitchesOpen,
    setPitchesOpen,
    closeFilters,
    closePitches,
    handleFiltersDone,
    handleClearAllFilters,
    isDesktop,
    campaignFilter,
    campaignFeed,
  };
}

export default useDiscover;
