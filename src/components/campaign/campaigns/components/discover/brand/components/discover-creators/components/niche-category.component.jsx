import { ChevronRight } from "lucide-react";
import CreatorCard from "@/components/campaign/campaigns/components/creator-card/creator-card.component";

const NicheCategory = ({
  category,
  scrollRef,
  onSeeMoreClick,
  onCreatorPreview,
  onSaveToShortlist,
  onRemoveFromShortlist,
  onInviteClick,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-gray-900">{category.name}</h4>
        <button
          onClick={() => onSeeMoreClick(category)}
          className="flex items-center space-x-1 text-primary hover:text-indigo-800 text-sm font-medium transition-colors"
        >
          <span>See More</span>
          <ChevronRight size={14} />
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scroll-smooth snap-x"
      >
        {category.creators.map((creator) => (
          <CreatorCard
            key={creator.id}
            creator={creator}
            onCreatorPreview={onCreatorPreview}
            onSaveToShortlist={onSaveToShortlist}
            onRemoveFromShortlist={onRemoveFromShortlist}
            onInviteClick={onInviteClick}
            tab="discover"
          />
        ))}
      </div>
      <hr className="border-gray-200" />
    </div>
  );
};

export default NicheCategory;

