"use client";

import { createPortal } from "react-dom";
import { CheckCircle, Play, X } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import {
  BRAND_LANDING_DEMO_BULLETS,
  BRAND_LANDING_DEMO_POSTER_URL,
  BRAND_LANDING_DEMO_VIDEO_URL,
} from "@/common/constants/brand-landing.constant";
import useBrandDemo from "./use-brand-demo.hook";

export default function BrandDemo() {
  const {
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
    demoVideoMime,
  } = useBrandDemo();
  const poster = BRAND_LANDING_DEMO_POSTER_URL || undefined;
  const showPosterOnly = prefersReducedMotion && Boolean(poster);
  const showInlinePreview = shouldLoad && !isVideoModalOpen;
  const demoSourceProps = demoVideoMime
    ? { src: BRAND_LANDING_DEMO_VIDEO_URL, type: demoVideoMime }
    : { src: BRAND_LANDING_DEMO_VIDEO_URL };

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          <div className="w-full lg:w-1/2">
            <h2 className="text-xl md:text-3xl lg:text-4xl font-bold mb-4 text-primary leading-tight">
              CleerCut has no credit usage or limits
            </h2>
            <p className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed">
              CleerCut is a complete all-in-one tool that is never capped by credits or usage. Most
              platforms are built around a public database of scraped creator profiles with email
              integrations and API pulls, which forces them to limit what you can do at each tier.
            </p>
            <ul className="mb-6 space-y-3">
              {BRAND_LANDING_DEMO_BULLETS.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-start gap-3 text-sm md:text-base text-gray-700"
                >
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <CustomButton
              text="See how it works"
              className="btn-primary"
              onClick={openVideoModal}
              startIcon={<Play className="h-3.5 w-3.5" fill="currentColor" />}
            />
          </div>

          <div className="w-full lg:w-1/2">
            <div
              ref={containerRef}
              className="relative rounded-xl overflow-hidden bg-gradient-to-br from-indigo-100 to-indigo-200 border border-indigo-100 shadow-[0_8px_40px_rgba(129,140,248,0.25)] aspect-video"
            >
              {showPosterOnly ? (
                <img
                  src={poster}
                  alt="CleerCut product demo"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : showInlinePreview ? (
                <video
                  ref={videoRef}
                  className="absolute inset-0 h-full w-full object-cover"
                  muted
                  loop
                  playsInline
                  autoPlay={!prefersReducedMotion}
                  preload={prefersReducedMotion ? "metadata" : "auto"}
                  poster={poster}
                  controls={false}
                  aria-label="CleerCut product demo video"
                >
                  <source {...demoSourceProps} />
                </video>
              ) : poster ? (
                <img
                  src={poster}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  aria-hidden
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-indigo-200" />
              )}
            </div>
          </div>
        </div>
      </div>

      {typeof document !== "undefined" && isVideoModalOpen
        ? createPortal(
            <div
              className="fixed inset-0 z-[4000] flex items-center justify-center bg-black/70 p-3 sm:p-6"
              role="dialog"
              aria-modal="true"
              aria-label="See how it works"
              onClick={closeVideoModal}
            >
              <div
                className="relative w-full max-w-5xl overflow-hidden rounded-xl bg-black shadow-2xl"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex items-center justify-between gap-3 bg-primary px-3 py-2.5 sm:px-4">
                  <h3 className="min-w-0 truncate text-sm font-semibold text-white sm:text-base">
                    See how it works
                  </h3>
                  <button
                    type="button"
                    onClick={closeVideoModal}
                    className="shrink-0 rounded-full p-1.5 text-white transition-colors hover:bg-white/15"
                    aria-label="Close video"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="relative bg-black">
                  {isModalVideoLoading ? (
                    <div className="absolute inset-0 z-[1] flex items-center justify-center bg-black/60">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    </div>
                  ) : null}

                  {modalVideoError ? (
                    <div className="flex min-h-[200px] items-center justify-center px-4 py-10 text-center">
                      <p className="max-w-md text-sm text-white/90">{modalVideoError}</p>
                    </div>
                  ) : (
                    <video
                      ref={modalVideoRef}
                      key={BRAND_LANDING_DEMO_VIDEO_URL}
                      className="block max-h-[min(75vh,720px)] w-full bg-black"
                      controls
                      playsInline
                      preload="auto"
                      poster={poster}
                      controlsList="nodownload"
                      aria-label="CleerCut product demo video"
                    >
                      <source {...demoSourceProps} />
                    </video>
                  )}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </section>
  );
}
