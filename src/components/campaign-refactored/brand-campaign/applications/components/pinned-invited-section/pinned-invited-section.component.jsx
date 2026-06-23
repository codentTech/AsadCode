import usePinnedInvitedSection from "./use-pinned-invited-section.hook";

function PinnedInvitedSection({ pinnedCreators, renderCreatorCard }) {
  const { showPinnedSection } = usePinnedInvitedSection({ pinnedCreators });

  if (!showPinnedSection) {
    return null;
  }

  return (
    <div className="mb-4">
      <div className="sticky top-0 z-[1] mb-2">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-white sm:text-xs bg-primary rounded-lg px-2 py-1 shadow-sm">
          Invited creators
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:[grid-template-columns:repeat(auto-fit,minmax(17.5rem,1fr))]">
        {pinnedCreators.map((creator) => renderCreatorCard(creator))}
      </div>
    </div>
  );
}

export default PinnedInvitedSection;
