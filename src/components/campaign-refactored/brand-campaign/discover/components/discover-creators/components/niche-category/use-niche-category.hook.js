import { useState, useEffect, useRef } from "react";

export default function useNicheCategory({ categoryCreatorsLength }) {
  // ============================================
  // 1. REFS
  // ============================================
  const containerRef = useRef(null);

  // ============================================
  // 3. LOCAL STATE
  // ============================================
  const [shouldShowSeeMore, setShouldShowSeeMore] = useState(false);

  // ============================================
  // 4. USEEFFECTS
  // ============================================
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
      setShouldShowSeeMore(categoryCreatorsLength > Math.max(visibleCount, 1));
    };

    // Calculate after a small delay to ensure DOM is ready
    const timeoutId = setTimeout(calculateVisibleCreators, 100);

    // Recalculate on window resize
    window.addEventListener("resize", calculateVisibleCreators);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", calculateVisibleCreators);
    };
  }, [categoryCreatorsLength]);

  // ============================================
  // 7. RETURN OBJECT
  // ============================================
  return {
    containerRef,
    shouldShowSeeMore,
  };
}
