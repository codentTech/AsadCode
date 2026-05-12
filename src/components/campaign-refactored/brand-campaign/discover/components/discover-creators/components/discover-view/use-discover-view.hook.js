import { useEffect, useMemo, useRef, useState } from "react";

function useDiscoverView({
  hasMoreCreators,
  scrollContainerRef,
  creators,
  nicheCategories,
  totalCreatorsCount,
  isDiscoverInitialLoading,
}) {
  const loadMoreAnchorRef = useRef(null);
  const [showLoadMoreAtEnd, setShowLoadMoreAtEnd] = useState(false);

  const shownCreatorsCount = creators.length;
  const totalCount = useMemo(
    () => totalCreatorsCount || shownCreatorsCount,
    [totalCreatorsCount, shownCreatorsCount]
  );
  const progressValue = useMemo(
    () => (totalCount > 0 ? Math.min((shownCreatorsCount / totalCount) * 100, 100) : 0),
    [shownCreatorsCount, totalCount]
  );

  useEffect(() => {
    if (!hasMoreCreators) {
      setShowLoadMoreAtEnd(false);
      return undefined;
    }
    const root = scrollContainerRef?.current;
    const target = loadMoreAnchorRef.current;
    if (!root || !target) {
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowLoadMoreAtEnd(entry.isIntersecting);
      },
      { root, rootMargin: "0px 0px 48px 0px", threshold: 0 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [
    hasMoreCreators,
    scrollContainerRef,
    creators.length,
    (nicheCategories ?? []).length,
    isDiscoverInitialLoading,
  ]);

  const showLoadMoreBar = Boolean(hasMoreCreators && showLoadMoreAtEnd);

  return {
    loadMoreAnchorRef,
    showLoadMoreBar,
    shownCreatorsCount,
    totalCount,
    progressValue,
  };
}

export default useDiscoverView;
