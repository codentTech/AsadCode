import CreatorCard from "@/components/campaign-refactored/creator-card/creator-card.component";

const CreatorGrid = ({
  creators,
  isShortlist = false,
  onCreatorPreview,
  onSaveToShortlist,
  onRemoveFromShortlist,
  onInviteClick,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5 items-stretch gap-4">
      {creators.map((creator) => (
        <div key={creator.id} className="flex h-full min-h-0">
          <CreatorCard
            creator={creator}
            creatorType={creator.creator_profile?.creator_type}
            isShortlist={isShortlist}
            onCreatorPreview={onCreatorPreview}
            onSaveToShortlist={onSaveToShortlist}
            onRemoveFromShortlist={onRemoveFromShortlist}
            onInviteClick={onInviteClick}
            tab="discover"
          />
        </div>
      ))}
    </div>
  );
};

export default CreatorGrid;
