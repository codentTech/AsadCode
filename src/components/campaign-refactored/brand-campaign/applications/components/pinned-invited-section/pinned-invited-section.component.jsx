import ApplicationsSectionBanner from "../applications-section-banner/applications-section-banner.component";
import usePinnedInvitedSection from "./use-pinned-invited-section.hook";

function PinnedInvitedSection({ pinnedCreators, renderCreatorCard, gridClass }) {
  const { showPinnedSection } = usePinnedInvitedSection({ pinnedCreators });

  if (!showPinnedSection) {
    return null;
  }

  return (
    <div className="mb-4">
      <ApplicationsSectionBanner label="Invited" sticky={false} />
      <div className={gridClass}>
        {pinnedCreators.map((creator) => renderCreatorCard(creator))}
      </div>
    </div>
  );
}

export default PinnedInvitedSection;
