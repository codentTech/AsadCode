import { useEffect, useRef } from "react";
import CreatorCard from "@/components/campaign-refactored/creator-card/creator-card.component";
import { CREATOR_CARD_GRID_CLASS } from "@/common/constants/creator-card-layout.constant";

const CreatorGrid = ({
  creators,
  isShortlist = false,
  onCreatorPreview,
  onSaveToShortlist,
  onRemoveFromShortlist,
  onInviteClick,
  onEndReached,
  onRangeChanged,
}) => {
  const sentinelRef = useRef(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !onEndReached) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onEndReached();
          onRangeChanged?.(
            { startIndex: 0, endIndex: Math.max(creators.length - 1, 0) },
            creators.length
          );
        }
      },
      { root: null, rootMargin: "800px 0px", threshold: 0 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [onEndReached, onRangeChanged, creators.length]);

  return (
    <div className="w-full">
      <div className={`${CREATOR_CARD_GRID_CLASS} w-full items-start`}>
        {creators.map((creator) => (
          <div key={creator.id} className="w-[18rem] max-w-full">
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
      <div ref={sentinelRef} className="h-1 w-full" aria-hidden />
    </div>
  );
};

export default CreatorGrid;
