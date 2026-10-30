import { useCallback, useEffect, useState } from "react";

const useDiscoverView = ({ creators, onBulkInvite, onBulkSaveToShortlist }) => {
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedCreatorIds, setSelectedCreatorIds] = useState(() => new Set());

  useEffect(() => {
    if (!isBulkMode) return;
    setSelectedCreatorIds((prev) => {
      const visibleIds = new Set(creators.map((creator) => creator.id));
      const next = new Set();
      prev.forEach((id) => {
        if (visibleIds.has(id)) next.add(id);
      });
      return next;
    });
  }, [creators, isBulkMode]);

  const selectedCount = selectedCreatorIds.size;
  const shownCount = creators.length;
  const allShownSelected =
    shownCount > 0 && creators.every((creator) => selectedCreatorIds.has(creator.id));

  const exitBulkMode = useCallback(() => {
    setIsBulkMode(false);
    setSelectedCreatorIds(new Set());
  }, []);

  const handleEnterBulkMode = useCallback(() => {
    if (isBulkMode) {
      exitBulkMode();
      return;
    }
    setSelectedCreatorIds(new Set(creators.map((creator) => creator.id)));
    setIsBulkMode(true);
  }, [isBulkMode, creators, exitBulkMode]);

  const handleCreatorToggle = useCallback((creatorId) => {
    setSelectedCreatorIds((prev) => {
      const next = new Set(prev);
      if (next.has(creatorId)) {
        next.delete(creatorId);
      } else {
        next.add(creatorId);
      }
      return next;
    });
  }, []);

  const handleSelectAllShown = useCallback(() => {
    if (allShownSelected) {
      setSelectedCreatorIds(new Set());
      return;
    }
    setSelectedCreatorIds(new Set(creators.map((creator) => creator.id)));
  }, [allShownSelected, creators]);

  const handleClearSelection = useCallback(() => {
    exitBulkMode();
  }, [exitBulkMode]);

  const handleBulkInvite = useCallback(() => {
    if (selectedCount === 0) return;
    const selectedCreators = creators.filter((creator) => selectedCreatorIds.has(creator.id));
    onBulkInvite?.(selectedCreators, exitBulkMode);
  }, [selectedCount, creators, selectedCreatorIds, onBulkInvite, exitBulkMode]);

  const handleBulkSaveToShortlist = useCallback(() => {
    if (selectedCount === 0) return;
    const selectedCreators = creators.filter((creator) => selectedCreatorIds.has(creator.id));
    onBulkSaveToShortlist?.(selectedCreators, exitBulkMode);
  }, [selectedCount, creators, selectedCreatorIds, onBulkSaveToShortlist, exitBulkMode]);

  return {
    isBulkMode,
    selectedCreatorIds,
    selectedCount,
    shownCount,
    allShownSelected,
    handleEnterBulkMode,
    handleCreatorToggle,
    handleSelectAllShown,
    handleClearSelection,
    handleBulkInvite,
    handleBulkSaveToShortlist,
  };
};

export default useDiscoverView;
