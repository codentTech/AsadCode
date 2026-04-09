import CustomButton from "@/common/components/custom-button/custom-button.component";
import DeleteConfirmationModal from "@/common/components/delete-confirmation-modal/delete-confirmation-modal.component";
import useGetplatform from "@/common/hooks/use-social-platform.hook";
import { formatNumber } from "@/common/utils/format.utils";
import { getGalleryVideoPlaybackSrc } from "@/common/utils/gallery-media.util";
import { format } from "date-fns";
import {
  Bookmark,
  ExternalLink,
  Eye,
  FolderUp,
  Images,
  Link as LinkIcon,
  Loader2,
  MessageCircle,
  RefreshCw,
  Share2,
  ThumbsUp,
  Trash2,
  Upload,
} from "lucide-react";
import BulkUploadModal from "../../../gallary/components/bulk-upload-modal/bulk-upload-modal.component";
import ImportPostModal from "../../../gallary/components/import-post-modal/import-post-modal.component";
import UploadFileModal from "../../../gallary/components/upload-file-modal/upload-file-modal.component";
import useGalleryTab from "./use-gallery-tab.hook";

const GalleryTab = ({ activeTab, creatorCategories = [] }) => {
  const {
    galleryItems,
    galleryNiches,
    galleryGroupedByNiche,
    isGalleryLoading,
    refreshGallery,
    showImportModal,
    setShowImportModal,
    showUploadModal,
    setShowUploadModal,
    showBulkUploadModal,
    setShowBulkUploadModal,
    galleryDeleteItemId,
    openGalleryDeleteModal,
    setOpenGalleryDeleteModal,
    galleryConfirmationRef,
    handleOpenGalleryDeleteModal,
    handleGalleryDeleteItem,
    handleRefreshMetrics,
    canRefreshMetrics,
    isRefreshingMetricsFor,
  } = useGalleryTab({ activeTab, creatorCategories });

  const { getPlatformIcon, getPlatformColor } = useGetplatform();

  return (
    <>
      <div className="space-y-4 max-w-4xl">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          {/* Header + CTAs */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900">Gallery</h3>
              <button
                onClick={refreshGallery}
                className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                title="Refresh gallery"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              <CustomButton
                text="Add Post Link"
                className="btn-primary text-xs"
                startIcon={<LinkIcon className="w-3 h-3" />}
                onClick={() => setShowImportModal(true)}
              />
              <CustomButton
                text="Upload File"
                className="btn-outline text-xs"
                startIcon={<Upload className="w-3 h-3" />}
                onClick={() => setShowUploadModal(true)}
              />
              <CustomButton
                text="Bulk Upload"
                className="btn-secondary text-xs"
                startIcon={<FolderUp className="w-3 h-3" />}
                onClick={() => setShowBulkUploadModal(true)}
              />
            </div>
          </div>

          {/* Gallery items */}
          {isGalleryLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-36 bg-gray-200 rounded-lg" />
              ))}
            </div>
          ) : galleryItems?.length > 0 ? (
            <div className="space-y-8">
              {galleryGroupedByNiche.map((group) => (
                <div key={group.key}>
                  <h4 className="bg-primary text-white px-3 py-1.5 rounded-lg w-full max-w-fit text-xs font-semibold uppercase tracking-wide mb-3">
                    {group.label}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {group.items.map((item) => {
                      const videoPlaybackSrc = getGalleryVideoPlaybackSrc(item);
                      return (
                        <div
                          key={item.id}
                          className="relative group rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white border border-gray-100"
                        >
                          <button
                            onClick={() => handleOpenGalleryDeleteModal(item.id)}
                            className="absolute -top-2 -right-2 z-10 w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 shadow-md"
                            title="Delete"
                            type="button"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>

                          <div className="relative aspect-[4/3] w-full bg-black rounded-t-lg overflow-hidden">
                            {item.media_type === "video" && videoPlaybackSrc ? (
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
                              !videoPlaybackSrc ? (
                              <>
                                <img
                                  src={item.thumbnail_url || undefined}
                                  alt={item.caption_text || item.title || "Video preview"}
                                  className="absolute inset-0 h-full w-full object-cover"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
                                  <span className="text-white text-[10px] font-medium px-2 py-1 rounded-full bg-black/60 text-center max-w-[95%]">
                                    Preparing hosted preview… updates automatically.
                                  </span>
                                </div>
                              </>
                            ) : (
                              <img
                                src={item.thumbnail_url || item.file_url}
                                alt={item.caption_text || item.title}
                                className="absolute inset-0 h-full w-full object-cover"
                                loading="lazy"
                              />
                            )}

                            {item.source_type === "file_upload" && (
                              <div className="pointer-events-none absolute top-1.5 left-1.5 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-lg font-medium">
                                UGC
                              </div>
                            )}

                            {item.source_type === "post_link" && item.platform && (
                              <div
                                className={`pointer-events-none absolute top-1.5 left-1.5 ${getPlatformColor(item.platform)} p-1 rounded-full`}
                              >
                                {getPlatformIcon(item.platform)}
                              </div>
                            )}
                          </div>

                          <div className="p-2 space-y-1.5">
                            <p className="text-xs font-medium text-gray-800 line-clamp-1">
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

                            {item.source_type === "post_link" && item.published_at && (
                              <p className="text-xs text-gray-400">
                                {format(new Date(item.published_at), "MMM d, yyyy")}
                              </p>
                            )}

                            <div className="flex flex-col gap-1 pt-0.5">
                              <div className="flex gap-1">
                                {item.source_type === "post_link" && item.post_url && (
                                  <a
                                    href={item.post_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Opens the original post on the social network"
                                    className="flex flex-1 min-w-0 items-center justify-center gap-1 px-2 py-1 text-xs bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 transition-colors"
                                  >
                                    <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                                    View
                                  </a>
                                )}
                                {item.source_type === "post_link" && canRefreshMetrics(item) && (
                                  <button
                                    type="button"
                                    onClick={() => handleRefreshMetrics(item.id)}
                                    disabled={isRefreshingMetricsFor(item.id)}
                                    className="shrink-0 flex items-center justify-center px-2 py-1 text-xs bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 transition-colors disabled:opacity-60 disabled:pointer-events-none"
                                    title="Refresh metrics"
                                  >
                                    {isRefreshingMetricsFor(item.id) ? (
                                      <Loader2
                                        className="w-2.5 h-2.5 animate-spin shrink-0"
                                        aria-hidden
                                      />
                                    ) : (
                                      <RefreshCw className="w-2.5 h-2.5 shrink-0" />
                                    )}
                                  </button>
                                )}
                              </div>
                              {item.source_type === "post_link" &&
                                item.post_url &&
                                videoPlaybackSrc &&
                                String(item.platform || "").toLowerCase() === "instagram" && (
                                  <p className="text-[9px] text-gray-400 leading-snug text-center">
                                    Instagram may require login; the preview player is the reliable
                                    way to watch.
                                  </p>
                                )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Images className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No gallery items yet</p>
              <p className="text-xs mt-1">
                Add your first post link or upload a file using the buttons above.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ImportPostModal
        show={showImportModal}
        onClose={() => setShowImportModal(false)}
        niches={galleryNiches}
      />
      <UploadFileModal
        show={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        niches={galleryNiches}
      />
      <BulkUploadModal
        show={showBulkUploadModal}
        onClose={() => setShowBulkUploadModal(false)}
        niches={galleryNiches}
      />
      <DeleteConfirmationModal
        id={galleryDeleteItemId}
        confirmationRef={galleryConfirmationRef}
        openConfirmationPopup={openGalleryDeleteModal}
        setOpenConfirmationPopup={setOpenGalleryDeleteModal}
        mainText="Delete Gallery Item"
        subText="This action cannot be undone. The item will be permanently removed from your gallery."
        confirmText="Delete"
        closeText="Cancel"
        action={handleGalleryDeleteItem}
        type="gallery"
      />
    </>
  );
};

export default GalleryTab;
