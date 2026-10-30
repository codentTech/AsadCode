import { useCallback, useEffect, useState } from "react";

const useShortlistView = ({
  sortedCreators,
  shortlistId,
  onBulkInvite,
  onRemoveFromShortlist,
  onBulkRemoveFromShortlist,
}) => {
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedCreatorIds, setSelectedCreatorIds] = useState(() => new Set());
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    setIsBulkMode(false);
    setSelectedCreatorIds(new Set());
    setShowRemoveConfirm(false);
  }, [shortlistId]);

  const selectedCount = selectedCreatorIds.size;

  const exitBulkMode = useCallback(() => {
    setIsBulkMode(false);
    setSelectedCreatorIds(new Set());
    setShowRemoveConfirm(false);
  }, []);

  const handleEnterBulkMode = useCallback(() => {
    if (isBulkMode) {
      exitBulkMode();
      return;
    }
    setSelectedCreatorIds(new Set(sortedCreators.map((creator) => creator.id)));
    setIsBulkMode(true);
  }, [isBulkMode, sortedCreators, exitBulkMode]);

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

  const handleClearSelection = useCallback(() => {
    exitBulkMode();
  }, [exitBulkMode]);

  const handleBulkInvite = useCallback(() => {
    if (selectedCount === 0) return;
    const selectedCreators = sortedCreators.filter((creator) =>
      selectedCreatorIds.has(creator.id)
    );
    onBulkInvite?.(selectedCreators, exitBulkMode);
  }, [selectedCount, sortedCreators, selectedCreatorIds, onBulkInvite, exitBulkMode]);

  const handleBulkRemove = useCallback(() => {
    if (selectedCount === 0) return;
    setShowRemoveConfirm(true);
  }, [selectedCount]);

  const confirmBulkRemove = useCallback(async () => {
    const creatorIds = Array.from(selectedCreatorIds);
    setIsRemoving(true);

    if (onBulkRemoveFromShortlist) {
      await onBulkRemoveFromShortlist(creatorIds);
    } else {
      for (const creatorId of creatorIds) {
        await onRemoveFromShortlist?.(creatorId);
      }
    }

    setIsRemoving(false);
    exitBulkMode();
  }, [selectedCreatorIds, onBulkRemoveFromShortlist, onRemoveFromShortlist, exitBulkMode]);

  return {
    isBulkMode,
    selectedCreatorIds,
    selectedCount,
    showRemoveConfirm,
    setShowRemoveConfirm,
    isRemoving,
    handleEnterBulkMode,
    handleCreatorToggle,
    handleClearSelection,
    handleBulkInvite,
    handleBulkRemove,
    confirmBulkRemove,
  };
};

export default useShortlistView;
