import { useCallback, useEffect, useRef, useState } from "react";
import {
  isImageUrlCached,
  markImageUrlCached,
  requestImageLoadSlot,
} from "@/common/utils/image-load-cache.util";

const DEFAULT_ROOT_MARGIN = "600px 0px";

function getScrollParent(node) {
  if (!node || typeof window === "undefined") return null;

  let parent = node.parentElement;
  while (parent) {
    const style = window.getComputedStyle(parent);
    const overflowY = style.overflowY;
    if (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") {
      return parent;
    }
    parent = parent.parentElement;
  }

  return null;
}

function parseRootMarginPx(rootMargin) {
  const marginMatch = /^(-?\d+)px/.exec(rootMargin || "");
  return marginMatch ? Number(marginMatch[1]) : 0;
}

function isNodeNearScrollRoot(node, rootMargin = DEFAULT_ROOT_MARGIN) {
  if (!node || typeof window === "undefined") return false;

  const margin = parseRootMarginPx(rootMargin);
  const rect = node.getBoundingClientRect();
  const scrollRoot = getScrollParent(node);

  if (scrollRoot) {
    const rootRect = scrollRoot.getBoundingClientRect();
    return rect.bottom >= rootRect.top - margin && rect.top <= rootRect.bottom + margin;
  }

  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  return rect.bottom >= -margin && rect.top <= viewportHeight + margin;
}

function useDeferredImage({ src, rootMargin = DEFAULT_ROOT_MARGIN, priority = false }) {
  const containerRef = useRef(null);
  const releaseSlotRef = useRef(null);
  const cancelRequestRef = useRef(null);
  const cachedInitially = Boolean(src && isImageUrlCached(src));
  const [shouldLoad, setShouldLoad] = useState(() => cachedInitially || priority);
  const [hasSlot, setHasSlot] = useState(() => cachedInitially || priority);
  const [hasError, setHasError] = useState(false);

  const releaseSlot = useCallback(() => {
    if (cancelRequestRef.current) {
      cancelRequestRef.current();
      cancelRequestRef.current = null;
    }
    if (releaseSlotRef.current) {
      releaseSlotRef.current();
      releaseSlotRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!src) {
      setShouldLoad(false);
      setHasSlot(false);
      setHasError(false);
      releaseSlot();
      return undefined;
    }

    if (isImageUrlCached(src) || priority) {
      setShouldLoad(true);
      setHasSlot(true);
      setHasError(false);
      releaseSlot();
      return undefined;
    }

    setHasError(false);
    return undefined;
  }, [src, priority, releaseSlot]);

  useEffect(() => {
    if (!src || hasError || shouldLoad) return undefined;

    const node = containerRef.current;
    if (!node) return undefined;

    if (isNodeNearScrollRoot(node, rootMargin)) {
      setShouldLoad(true);
      return undefined;
    }

    if (typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return undefined;
    }

    const scrollRoot = getScrollParent(node);
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { root: scrollRoot, rootMargin, threshold: 0 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [src, hasError, shouldLoad, rootMargin]);

  useEffect(() => {
    if (!src || hasError || !shouldLoad || hasSlot) return undefined;
    if (isImageUrlCached(src)) {
      setHasSlot(true);
      return undefined;
    }

    const { promise, cancel } = requestImageLoadSlot(src, { priority });
    cancelRequestRef.current = cancel;

    let cancelled = false;
    promise.then((release) => {
      cancelRequestRef.current = null;
      if (cancelled) {
        release();
        return;
      }
      releaseSlotRef.current = release;
      setHasSlot(true);
    });

    return () => {
      cancelled = true;
      cancel();
      cancelRequestRef.current = null;
    };
  }, [src, hasError, shouldLoad, hasSlot, priority]);

  useEffect(() => () => releaseSlot(), [releaseSlot]);

  const handleLoad = useCallback(() => {
    if (src) markImageUrlCached(src);
    releaseSlot();
  }, [src, releaseSlot]);

  const handleError = useCallback(() => {
    setHasError(true);
    releaseSlot();
  }, [releaseSlot]);

  const imageRef = useCallback(
    (img) => {
      if (img && img.naturalWidth > 0 && src) {
        markImageUrlCached(src);
        releaseSlot();
      }
    },
    [src, releaseSlot]
  );

  const shouldRenderImage = Boolean(src && !hasError && hasSlot);

  return {
    containerRef,
    imageRef,
    imageSrc: shouldRenderImage ? src : undefined,
    isVisible: shouldRenderImage,
    isCached: Boolean(src && isImageUrlCached(src)),
    hasError,
    handleLoad,
    handleError,
    showPlaceholder: Boolean(src && !hasError && !shouldRenderImage),
  };
}

export default useDeferredImage;
