function useAppliedCreatorsSection({ pinnedCreators, unpinnedCreators }) {
  const hasPinned = Array.isArray(pinnedCreators) && pinnedCreators.length > 0;
  const hasUnpinned = Array.isArray(unpinnedCreators) && unpinnedCreators.length > 0;

  return {
    showAppliedSection: hasUnpinned,
    // Only distinguish sections when invited creators exist above applied ones.
    showAppliedBanner: hasPinned && hasUnpinned,
  };
}

export default useAppliedCreatorsSection;
