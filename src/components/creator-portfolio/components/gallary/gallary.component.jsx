import {
  RefreshCw,
  Eye,
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
  ExternalLink,
} from "lucide-react";
import Niche from "@/components/niche/niche";
import useGallary from "./use-gallary.hook";
import { formatNumber } from "@/common/utils/format.utils";
import { format } from "date-fns";
import useGetplatform from "@/common/hooks/use-social-platform.hook";
import { isCreatorMode } from "@/common/utils/users.util";

const Gallary = ({ refreshKey, creatorId = null }) => {
  const {
    activeTab,
    setActiveTab,
    selectedNiche,
    setSelectedNiche,
    filteredPortfolio,
    niches,
    isLoading,
    refreshGallery,
    handleRefreshMetrics,
    canRefreshMetrics,
  } = useGallary(refreshKey, creatorId);

  const { getPlatformIcon, getPlatformColor } = useGetplatform();

  if (isLoading) {
    return (
      <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
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
    <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-lg font-semibold text-primary">Portfolio Gallery</h3>
        <button
          onClick={refreshGallery}
          className="p-1 text-gray-500 hover:text-indigo-600 transition-colors"
          title="Refresh gallery"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {["all", "video", "image"].map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1 cursor-pointer rounded-full text-sm capitalize ${
              activeTab === tab
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab === "all" ? "All" : `${tab}s`}
          </div>
        ))}
      </div>

      {niches.length > 0 && (
        <div className="mb-3">
          <Niche
            categories={niches}
            onNicheChange={setSelectedNiche}
            selectedNiche={selectedNiche}
          />
        </div>
      )}

      {/* Grid */}
      {filteredPortfolio.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPortfolio.map((item) => (
            <div
              key={item.id}
              className="rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow bg-white border border-gray-100"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[9/16] w-full bg-gray-900 flex items-center justify-center">
                {item.media_type === "video" ? (
                  <video
                    src={item.file_url || item.post_url}
                    className="w-full h-full object-contain bg-black"
                    preload="metadata"
                    controls
                    playsInline
                    poster={item.thumbnail_url || undefined}
                  />
                ) : (
                  <img
                    src={item.thumbnail_url || item.file_url}
                    alt={item.caption_text || item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}

                {item.source_type === "file_upload" && (
                  <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Unpublished Sample
                  </div>
                )}

                {item.source_type === "post_link" && item.platform && (
                  <div
                    className={`absolute top-2 left-2 ${getPlatformColor(item.platform)} p-1.5 rounded-full`}
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

                {item.niche_name && (
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    {item.niche_name}
                  </p>
                )}

                {/* Metrics row — post_link only */}
                {item.source_type === "post_link" && item.metrics_snapshot && (
                  <div className="grid grid-cols-2 gap-1 pt-2 border-t border-gray-100">
                    {item.metrics_snapshot.views > 0 && (
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Eye className="w-3 h-3" />
                        <span>{formatNumber(item.metrics_snapshot.views)}</span>
                      </div>
                    )}
                    {item.metrics_snapshot.likes > 0 && (
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{formatNumber(item.metrics_snapshot.likes)}</span>
                      </div>
                    )}
                    {item.metrics_snapshot.comments > 0 && (
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <MessageCircle className="w-3 h-3" />
                        <span>{formatNumber(item.metrics_snapshot.comments)}</span>
                      </div>
                    )}
                    {item.metrics_snapshot.shares > 0 && (
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Share2 className="w-3 h-3" />
                        <span>{formatNumber(item.metrics_snapshot.shares)}</span>
                      </div>
                    )}
                    {item.metrics_snapshot.saves > 0 && (
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Bookmark className="w-3 h-3" />
                        <span>{formatNumber(item.metrics_snapshot.saves)}</span>
                      </div>
                    )}
                  </div>
                )}

                {item.source_type === "post_link" && item.published_at && (
                  <p className="text-xs text-gray-400">
                    {format(new Date(item.published_at), "MMM d, yyyy")}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  {item.source_type === "post_link" && item.post_url && (
                    <a
                      href={item.post_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View Post
                    </a>
                  )}
                  {isCreatorMode() &&
                    item.source_type === "post_link" &&
                    canRefreshMetrics(item) && (
                      <button
                        onClick={() => handleRefreshMetrics(item.id)}
                        className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
                        title="Refresh metrics"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No media found</div>
          <p className="text-gray-500 text-sm">
            {activeTab === "all" ? "This gallery is empty." : `No ${activeTab}s found.`}
          </p>
        </div>
      )}
    </section>
  );
};

export default Gallary;
