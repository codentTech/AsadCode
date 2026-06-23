import { useCallback, useMemo } from "react";

function useApplicationsSubtabToggle({ activeSubTab, onSubTabChange, counts }) {
  const applicationsCount = counts?.applications ?? 0;
  const negotiationsCount = counts?.negotiations ?? 0;

  const segments = useMemo(
    () => [
      { id: "applications", label: `Applications (${applicationsCount})` },
      { id: "negotiations", label: `Negotiations (${negotiationsCount})` },
    ],
    [applicationsCount, negotiationsCount]
  );

  const handleSelect = useCallback(
    (subTab) => {
      if (subTab !== activeSubTab && onSubTabChange) {
        onSubTabChange(subTab);
      }
    },
    [activeSubTab, onSubTabChange]
  );

  return {
    segments,
    handleSelect,
  };
}

export default useApplicationsSubtabToggle;
