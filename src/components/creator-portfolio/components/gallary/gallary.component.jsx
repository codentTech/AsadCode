import {
  RefreshCw,
  Eye,
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
  ExternalLink,
} from "lucide-react";
import useGallary from "./use-gallary.hook";
import { formatNumber } from "@/common/utils/format.utils";
import { format } from "date-fns";
import useGetplatform from "@/common/hooks/use-social-platform.hook";
import {
  getGalleryVideoEmbedSrc,
  getGalleryVideoPlaybackSrc,
} from "@/common/utils/gallery-media.util";
import { isCreatorMode } from "@/common/utils/users.util";

const Gallary = ({ refreshKey, creatorId = null }) => {
  const {
    activeTab,
    setActiveTab,
    selectedNiche,
    setSelectedNiche,
    filteredPortfolio,
    galleryItems,
    niches,
    isLoading,
    refreshGallery,
    handleRefreshMetrics,
    canRefreshMetrics,
  } = useGallary(refreshKey, creatorId);

  const { getPlatformIcon, getPlatformColor } = useGetplatform();

  if (isLoading) {
    return (
      <section className="rounded-2xl bg-white p-3 shadow-lg sm:p-6 md:p-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl bg-white p-3 shadow-lg sm:p-6 md:p-8">
      <div className="mb-4 flex items-center justify-between gap-3 sm:mb-6">
        <div className="flex items-center gap-2">
          <h3 className="shrink-0 text-sm font-semibold text-primary sm:text-lg md:text-xl">
            Portfolio Gallery
          </h3>
          <button
            type="button"
            onClick={refreshGallery}
            className="shrink-0 rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-50 hover:text-indigo-600"
            title="Refresh gallery"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {["all", "video", "image"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-3 py-1.5 text-xs capitalize transition-colors sm:px-4 sm:text-sm ${
                activeTab === tab
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab === "all" ? "All" : `${tab}s`}
            </button>
          ))}
        </div>
      </div>

      {niches.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            type="button"
            onClick={() => setSelectedNiche("all")}
            className={`rounded-lg px-2 py-1 text-[10px] font-medium border transition-colors sm:px-3 sm:py-1.5 sm:text-xs ${
              selectedNiche === "all"
                ? "bg-indigo-100 text-indigo-700 border-indigo-300 shadow-sm"
                : "bg-white border border-gray-200 text-gray-700 hover:border-indigo-300"
            }`}
          >
            All niches
          </button>
          {niches.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => setSelectedNiche(n.id)}
              className={`rounded-lg px-2 py-1 text-[10px] font-medium border transition-colors sm:px-3 sm:py-1.5 sm:text-xs ${
                selectedNiche === n.id
                  ? "bg-indigo-100 text-indigo-700 border-indigo-300 shadow-sm"
                  : "bg-white border border-gray-200 text-gray-700 hover:border-indigo-300"
              }`}
            >
              {n.name}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filteredPortfolio.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
          {filteredPortfolio.map((item) => {
            const videoEmbedSrc =
              item.media_type === "video" ? getGalleryVideoEmbedSrc(item) : null;
            const videoPlaybackSrc =
              item.media_type === "video" ? getGalleryVideoPlaybackSrc(item) : null;
            return (
              <div
                key={item.id}
                className="rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow bg-white border border-gray-100"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[9/16] w-full bg-black overflow-hidden">
                  {item.media_type === "video" && videoEmbedSrc ? (
                    <iframe
                      key={videoEmbedSrc}
                      src={videoEmbedSrc}
                      className="absolute inset-0 h-full w-full border-0 bg-black"
                      title={item.caption_text || item.title || "Video"}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                      allowFullScreen
                      loading="lazy"
                    />
                  ) : item.media_type === "video" && videoPlaybackSrc ? (
                    <video
                      key={videoPlaybackSrc}
                      src={videoPlaybackSrc}
                      className="absolute inset-0 h-full w-full object-contain bg-black"
                      preload="metadata"
                      controls
                      playsInline
                      poster={item.thumbnail_url || undefined}
                    />
                  ) : item.media_type === "video" &&
                    item.source_type === "post_link" &&
                    !videoEmbedSrc &&
                    !videoPlaybackSrc ? (
                    <>
                      <img
                        src={item.thumbnail_url || undefined}
                        alt={item.caption_text || item.title || "Video preview"}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
                        <span className="text-white text-xs font-medium px-3 py-1.5 rounded-full bg-black/60 text-center max-w-[90%]">
                          Preparing hosted preview… this updates automatically (or use refresh).
                        </span>
                      </div>
                    </>
                  ) : item.media_type === "video" && !videoEmbedSrc ? (
                    <img
                      src={item.thumbnail_url || item.file_url || ""}
                      alt={item.caption_text || item.title || ""}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <img
                      src={item.thumbnail_url || item.file_url}
                      alt={item.caption_text || item.title}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  )}

                  {item.source_type === "file_upload" && (
                    <div className="pointer-events-none absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-lg font-medium">
                      Unpublished Sample
                    </div>
                  )}

                  {item.source_type === "post_link" && item.platform && (
                    <div
                      className={`pointer-events-none absolute top-2 left-2 ${getPlatformColor(item.platform)} p-1.5 rounded-full`}
                    >
                      {getPlatformIcon(item.platform)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3 space-y-2">
                  <p className="text-sm font-medium text-gray-800 line-clamp-2">
                    {item.caption_text || item.title || "Untitled"}
                  </p>

                  {item.source_type === "post_link" && item.metrics_snapshot && (
                    <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-gray-200">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Eye className="w-3 h-3 shrink-0 text-primary" />
                        <span>{formatNumber(item.metrics_snapshot.views ?? 0)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <ThumbsUp className="w-3 h-3 shrink-0 text-primary" />
                        <span>{formatNumber(item.metrics_snapshot.likes ?? 0)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <MessageCircle className="w-3 h-3 shrink-0 text-primary" />
                        <span>{formatNumber(item.metrics_snapshot.comments ?? 0)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Share2 className="w-3 h-3 shrink-0 text-primary" />
                        <span>{formatNumber(item.metrics_snapshot.shares ?? 0)}</span>
                      </div>
                      {(item.metrics_snapshot.saves ?? 0) > 0 && (
                        <div className="flex items-center gap-1 text-xs text-gray-600 col-span-2">
                          <Bookmark className="w-3 h-3 shrink-0 text-primary" />
                          <span>{formatNumber(item.metrics_snapshot.saves)}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2 justify-between">
                    {item.niche_name && (
                      <p className="bg-indigo-100 text-black w-fit px-2 py-1 rounded-lg text-xs text-center font-semibold uppercase tracking-wide">
                        {item.niche_name}
                      </p>
                    )}
                    {item.source_type === "post_link" && item.published_at && (
                      <p className="text-xs text-gray-400">
                        {format(new Date(item.published_at), "MMM d, yyyy")}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5 pt-1">
                    <div className="flex gap-2">
                      {item.source_type === "post_link" && item.post_url && (
                        <a
                          href={item.post_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Opens the original post on the social network"
                          className="flex flex-1 min-w-0 items-center justify-center gap-1 px-3 py-1.5 text-xs bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          View Post
                        </a>
                      )}
                      {isCreatorMode() &&
                        item.source_type === "post_link" &&
                        canRefreshMetrics(item) && (
                          <button
                            type="button"
                            onClick={() => handleRefreshMetrics(item.id)}
                            className="shrink-0 flex items-center justify-center gap-1 px-3 py-1.5 text-xs bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
                            title="Refresh metrics"
                          >
                            <RefreshCw className="w-3 h-3" />
                          </button>
                        )}
                    </div>
                    {item.source_type === "post_link" &&
                      item.post_url &&
                      (videoEmbedSrc || videoPlaybackSrc) &&
                      String(item.platform || "").toLowerCase() === "instagram" && (
                        <p className="text-[10px] text-gray-400 leading-snug text-center">
                          Opening on Instagram may require login; the preview player is the reliable
                          way to watch.
                        </p>
                      )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No media found</div>
          <p className="text-gray-500 text-sm">
            {galleryItems?.length === 0
              ? activeTab === "all"
                ? "This gallery is empty."
                : `No ${activeTab}s found.`
              : selectedNiche !== "all"
                ? "No posts in this niche for the current filters."
                : activeTab === "all"
                  ? "This gallery is empty."
                  : `No ${activeTab}s found.`}
          </p>
        </div>
      )}
    </section>
  );
};

export default Gallary;
