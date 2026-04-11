import { useState, useEffect, useRef } from "react";
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
  const [shouldShowSeeMore, setShouldShowSeeMore] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const calculateVisibleCreators = () => {
      // Creator card width is w-64 = 256px (16rem)
      const cardWidth = 256;
      // Gap between cards is space-x-4 = 1rem = 16px
      const gap = 16;
      // Get the actual container width
      const container = containerRef.current;
      if (!container) return;

      const containerWidth = container.clientWidth;

      // Calculate how many cards can fit
      // Formula: (containerWidth + gap) / (cardWidth + gap)
      const visibleCount = Math.floor((containerWidth + gap) / (cardWidth + gap));

      // Show "See More" if there are more creators than can fit
      // Also ensure at least 2 creators are needed to show "See More"
      setShouldShowSeeMore(category.creators.length > Math.max(visibleCount, 1));
    };

    // Calculate after a small delay to ensure DOM is ready
    const timeoutId = setTimeout(calculateVisibleCreators, 100);

    // Recalculate on window resize
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
