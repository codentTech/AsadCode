import CreatorCard from "@/components/campaign-refactored/creator-card/creator-card.component";
import { CREATOR_CARD_GRID_CLASS } from "@/common/constants/creator-card-layout.constant";

const CreatorGrid = ({
  creators,
  isShortlist = false,
  onCreatorPreview,
  onSaveToShortlist,
  onRemoveFromShortlist,
  onInviteClick,
}) => {
  return (
    <div className={`${CREATOR_CARD_GRID_CLASS} items-stretch`}>
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
