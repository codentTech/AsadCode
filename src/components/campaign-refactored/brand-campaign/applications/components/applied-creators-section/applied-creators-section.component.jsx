import ApplicationsSectionBanner from "../applications-section-banner/applications-section-banner.component";
import useAppliedCreatorsSection from "./use-applied-creators-section.hook";

function AppliedCreatorsSection({
  pinnedCreators,
  unpinnedCreators,
  renderCreatorCard,
  gridClass,
}) {
  const { showAppliedSection, showAppliedBanner } = useAppliedCreatorsSection({
    pinnedCreators,
    unpinnedCreators,
  });

  if (!showAppliedSection) {
    return null;
  }

  return (
    <div className="mb-4">
      {showAppliedBanner ? (
        <ApplicationsSectionBanner label="Applied" sticky />
      ) : null}
      <div className={gridClass}>
        {unpinnedCreators.map((creator) => renderCreatorCard(creator))}
      </div>
    </div>
  );
}

export default AppliedCreatorsSection;
