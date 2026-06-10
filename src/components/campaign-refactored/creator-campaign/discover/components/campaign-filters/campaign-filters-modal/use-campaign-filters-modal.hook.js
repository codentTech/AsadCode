import { useCallback, useEffect, useState } from "react";
import { INITIAL_CAMPAIGN_FILTERS } from "../use-campaign-filter.hook";

export default function useCampaignFiltersModal({
  show,
  filters,
  setFilters,
  resetFilters,
  onDone,
  onClose,
}) {
  const [draftFilters, setDraftFilters] = useState(filters);

  useEffect(() => {
    if (show) {
      setDraftFilters(filters);
    }
  }, [show, filters]);

  const handleDone = useCallback(() => {
    setFilters(draftFilters);
    onDone(draftFilters);
    onClose();
  }, [draftFilters, setFilters, onDone, onClose]);

  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleClearAll = useCallback(() => {
    resetFilters();
    setDraftFilters(INITIAL_CAMPAIGN_FILTERS);
    onDone(INITIAL_CAMPAIGN_FILTERS);
    onClose();
  }, [resetFilters, onDone, onClose]);

  return {
    draftFilters,
    setDraftFilters,
    handleDone,
    handleCancel,
    handleClearAll,
  };
}
