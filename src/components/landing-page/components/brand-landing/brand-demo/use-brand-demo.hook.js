import { useCallback, useEffect, useRef, useState } from "react";
import { BRAND_LANDING_DEMO_VIDEO_URL } from "@/common/constants/brand-landing.constant";

/**
 * Chromium returns canPlayType("video/quicktime") === "" and skips that source.
 * For .mov, omit type so the browser sniffs the bitstream.
 */
export function getBrandDemoVideoMime(url = BRAND_LANDING_DEMO_VIDEO_URL) {
  const lower = String(url || "").toLowerCase().split("?")[0];
  if (lower.endsWith(".webm")) return "video/webm";
  if (lower.endsWith(".mp4")) return "video/mp4";
  return undefined;
}

function useBrandDemo() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const modalVideoRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isModalVideoLoading, setIsModalVideoLoading] = useState(false);
  const [modalVideoError, setModalVideoError] = useState("");

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
    const video = videoRef.current;
    if (!video || !shouldLoad || isVideoModalOpen) return;

    if (prefersReducedMotion) {
      video.pause();
      return;
    }

    video.muted = true;
    video.play().catch(() => {});
  }, [shouldLoad, prefersReducedMotion, isVideoModalOpen]);

  useEffect(() => {
    if (!isVideoModalOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsVideoModalOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isVideoModalOpen]);

  useEffect(() => {
    if (!isVideoModalOpen) {
      setIsModalVideoLoading(false);
      setModalVideoError("");
      return undefined;
    }

    const video = modalVideoRef.current;
    if (!video) return undefined;

    setIsModalVideoLoading(true);
    setModalVideoError("");

    const handleCanPlay = () => {
      setIsModalVideoLoading(false);
    };

    const handlePlaying = () => {
      setIsModalVideoLoading(false);
    };

    const handleError = () => {
      setIsModalVideoLoading(false);
      setModalVideoError(
        "This video could not be played in your browser. Try Chrome/Edge, or ask for an H.264 MP4 export.",
      );
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("error", handleError);

    video.load();

    const tryPlay = async () => {
      try {
        video.muted = false;
        await video.play();
        setIsModalVideoLoading(false);
      } catch {
        try {
          video.muted = true;
          await video.play();
          setIsModalVideoLoading(false);
        } catch {
          setIsModalVideoLoading(false);
        }
      }
    };

    void tryPlay();

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("error", handleError);
      video.pause();
    };
  }, [isVideoModalOpen]);

  const openVideoModal = useCallback((event) => {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    const preview = videoRef.current;
    if (preview) {
      preview.pause();
    }
    setModalVideoError("");
    setIsModalVideoLoading(true);
    setIsVideoModalOpen(true);
  }, []);

  const closeVideoModal = useCallback(() => {
    const modalVideo = modalVideoRef.current;
    if (modalVideo) {
      modalVideo.pause();
    }
    setIsVideoModalOpen(false);
    setIsModalVideoLoading(false);
    setModalVideoError("");
  }, []);

  return {
    containerRef,
    videoRef,
    modalVideoRef,
    shouldLoad,
    prefersReducedMotion,
    isVideoModalOpen,
    isModalVideoLoading,
    modalVideoError,
    openVideoModal,
    closeVideoModal,
    demoVideoMime: getBrandDemoVideoMime(),
  };
}

export default useBrandDemo;
