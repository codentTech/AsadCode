import { useCallback, useEffect, useRef, useState } from "react";
import {
  isImageUrlCached,
  markImageUrlCached,
  requestImageLoadSlot,
} from "@/common/utils/image-load-cache.util";

const DEFAULT_ROOT_MARGIN = "400px 0px";

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

function isImageReady(img) {
  return Boolean(img && img.naturalWidth > 0);
}

function useDeferredImage({ src, rootMargin = DEFAULT_ROOT_MARGIN, priority = false }) {
  const containerRef = useRef(null);
  const imgNodeRef = useRef(null);
  const releaseSlotRef = useRef(null);
  const cancelRequestRef = useRef(null);
  const cachedInitially = Boolean(src && isImageUrlCached(src));
  const [isNear, setIsNear] = useState(() => cachedInitially);
  const [hasSlot, setHasSlot] = useState(() => cachedInitially);
  const [isVisible, setIsVisible] = useState(() => cachedInitially);
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

  const markVisible = useCallback(() => {
    if (src) {
      markImageUrlCached(src);
    }
    setIsVisible(true);
    releaseSlot();
  }, [src, releaseSlot]);

  useEffect(() => {
    if (!src) {
      setIsNear(false);
      setHasSlot(false);
      setIsVisible(false);
      setHasError(false);
      releaseSlot();
      return undefined;
    }

    if (isImageUrlCached(src)) {
      setIsNear(true);
      setHasSlot(true);
      setIsVisible(true);
      setHasError(false);
      releaseSlot();
      return undefined;
    }

    setIsNear(false);
    setHasSlot(false);
    setIsVisible(false);
    setHasError(false);
    releaseSlot();
    return undefined;
  }, [src, releaseSlot]);

  useEffect(() => {
    if (!src || hasError) return undefined;
    if (isImageUrlCached(src)) {
      setIsNear(true);
      return undefined;
    }

    const node = containerRef.current;
    if (!node) return undefined;

    if (isNodeNearScrollRoot(node, rootMargin)) {
      setIsNear(true);
    }

    if (typeof IntersectionObserver === "undefined") {
      setIsNear(true);
      return undefined;
    }

    const scrollRoot = getScrollParent(node);
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setIsNear(entry.isIntersecting);
      },
      { root: scrollRoot, rootMargin, threshold: 0 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [src, hasError, rootMargin]);

  useEffect(() => {
    if (!src || hasError) return undefined;

    if (isImageUrlCached(src)) {
      setHasSlot(true);
      setIsVisible(true);
      return undefined;
    }

    if (!isNear) {
      if (!isVisible) {
        releaseSlot();
        setHasSlot(false);
      }
      return undefined;
    }

    if (hasSlot || isVisible) return undefined;

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
  }, [src, isNear, hasSlot, hasError, isVisible, priority, releaseSlot]);

  useEffect(() => () => releaseSlot(), [releaseSlot]);

  useEffect(() => {
    if (!hasSlot || !src || isVisible || hasError) return undefined;

    let cancelled = false;
    let rafId = 0;

    const checkReady = () => {
      if (cancelled) return;
      if (isImageReady(imgNodeRef.current)) {
        markVisible();
        return;
      }
      rafId = window.requestAnimationFrame(checkReady);
    };

    rafId = window.requestAnimationFrame(checkReady);

    // Free the concurrency slot even if a huge asset is still decoding,
    // so neighboring cards are not starved.
    const slotTimeoutId = window.setTimeout(() => {
      if (!cancelled) {
        releaseSlot();
      }
    }, 800);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(slotTimeoutId);
    };
  }, [hasSlot, src, isVisible, hasError, markVisible, releaseSlot]);

  const handleLoad = useCallback(() => {
    markVisible();
  }, [markVisible]);

  const handleError = useCallback(() => {
    setHasError(true);
    releaseSlot();
  }, [releaseSlot]);

  const imageRef = useCallback(
    (img) => {
      imgNodeRef.current = img;
      if (isImageReady(img)) {
        markVisible();
      }
    },
    [markVisible]
  );

  const keepRendered = isVisible || isImageUrlCached(src);
  const shouldRenderImage = Boolean(
    src && !hasError && (keepRendered || (isNear && hasSlot))
  );

  return {
    containerRef,
    imageRef,
    imageSrc: shouldRenderImage ? src : undefined,
    isVisible,
    hasError,
    handleLoad,
    handleError,
    showPlaceholder: Boolean(src && !hasError && !isVisible),
  };
}

export default useDeferredImage;
