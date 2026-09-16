import { useState, useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";
import CreatorCard from "@/components/campaign-refactored/creator-card/creator-card.component";
import { CREATOR_CARD_WIDTH_PX } from "@/common/constants/creator-card-layout.constant";

const CARD_GAP_PX = 16;

const NicheCategory = ({
  category,
  scrollRef,
  onSeeMoreClick,
  onCreatorPreview,
  onSaveToShortlist,
  onRemoveFromShortlist,
  onInviteClick,
}) => {
  const [shouldShowSeeMore, setShouldShowSeeMore] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const calculateVisibleCreators = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerWidth = container.clientWidth;
      const visibleCount = Math.floor(
        (containerWidth + CARD_GAP_PX) / (CREATOR_CARD_WIDTH_PX + CARD_GAP_PX)
      );

      setShouldShowSeeMore(category.creators.length > Math.max(visibleCount, 1));
    };

    const timeoutId = setTimeout(calculateVisibleCreators, 100);
    window.addEventListener("resize", calculateVisibleCreators);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", calculateVisibleCreators);
    };
  }, [category.creators.length]);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-gray-900">{category.name}</h4>
        {shouldShowSeeMore && (
          <button
            onClick={() => onSeeMoreClick(category)}
            className="flex items-center space-x-1 text-primary hover:text-indigo-800 text-sm font-medium transition-colors"
          >
            <span>See More</span>
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      <div
        ref={(el) => {
          containerRef.current = el;
          if (scrollRef) scrollRef(el);
        }}
        className="flex items-stretch overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scroll-smooth snap-x"
      >
        {category.creators.map((creator) => (
          <div key={creator.id} className="flex h-full min-h-0 shrink-0 self-stretch">
            <CreatorCard
              creator={creator}
              onCreatorPreview={onCreatorPreview}
              onSaveToShortlist={onSaveToShortlist}
              onRemoveFromShortlist={onRemoveFromShortlist}
              onInviteClick={onInviteClick}
              tab="discover"
            />
          </div>
        ))}
      </div>
      <hr className="border-gray-200" />
    </div>
  );
};

export default NicheCategory;
