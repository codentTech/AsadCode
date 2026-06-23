function usePinnedInvitedSection({ pinnedCreators }) {
  const showPinnedSection = Array.isArray(pinnedCreators) && pinnedCreators.length > 0;

  return {
    showPinnedSection,
  };
}

export default usePinnedInvitedSection;
