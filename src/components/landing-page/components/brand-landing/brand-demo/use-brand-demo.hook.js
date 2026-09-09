import { useEffect, useRef, useState } from "react";
import { BRAND_LANDING_WATCH_DEMO_EVENT } from "@/common/constants/brand-landing.constant";

function useBrandDemo() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setPrefersReducedMotion(mediaQuery.matches);
    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);
    return () => mediaQuery.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onWatchDemo = () => {
      setShouldLoad(true);
      setShowControls(true);
    };

    window.addEventListener(BRAND_LANDING_WATCH_DEMO_EVENT, onWatchDemo);
    return () => window.removeEventListener(BRAND_LANDING_WATCH_DEMO_EVENT, onWatchDemo);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad || showControls) return;

    if (prefersReducedMotion) {
      video.pause();
      return;
    }

    video.muted = true;
    video.play().catch(() => {});
  }, [shouldLoad, prefersReducedMotion, showControls]);

  useEffect(() => {
    if (!showControls || !shouldLoad) return;

    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    video.controls = true;
    video.play().catch(() => {});
  }, [showControls, shouldLoad]);

  return {
    containerRef,
    videoRef,
    shouldLoad,
    prefersReducedMotion,
    showControls,
  };
}

export default useBrandDemo;
