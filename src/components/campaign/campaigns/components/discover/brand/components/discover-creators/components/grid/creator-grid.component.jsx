import CreatorCard from "@/components/campaign/campaigns/components/creator-card/creator-card.component";

const CreatorGrid = ({
  creators,
  isShortlist = false,
  onCreatorPreview,
  onSaveToShortlist,
  onRemoveFromShortlist,
  onInviteClick,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5 gap-4">
      {creators.map((creator) => (
        <CreatorCard
          key={creator.id}
          creator={creator}
          isShortlist={isShortlist}
          onCreatorPreview={onCreatorPreview}
          onSaveToShortlist={onSaveToShortlist}
          onRemoveFromShortlist={onRemoveFromShortlist}
          onInviteClick={onInviteClick}
          tab="discover"
        />
      ))}
    </div>
  );
};

export default CreatorGrid;
