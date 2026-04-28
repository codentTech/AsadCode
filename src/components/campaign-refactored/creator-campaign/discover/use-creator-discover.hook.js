import { useCallback, useState } from "react";

export default function useCreatorDiscover() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [pitchesOpen, setPitchesOpen] = useState(false);

  const closeFilters = useCallback(() => setFiltersOpen(false), []);
  const closePitches = useCallback(() => setPitchesOpen(false), []);

  return {
    filtersOpen,
    setFiltersOpen,
    pitchesOpen,
    setPitchesOpen,
    closeFilters,
    closePitches,
  };
}
