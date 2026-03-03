import CustomButton from "@/common/components/custom-button/custom-button.component";
import DeleteConfirmationModal from "@/common/components/delete-confirmation-modal/delete-confirmation-modal.component";
import useGetplatform from "@/common/hooks/use-social-platform.hook";
import { formatNumber } from "@/common/utils/format.utils";
import { format } from "date-fns";
import {
  Bookmark,
  ExternalLink,
  Eye,
  FolderUp,
  Images,
  Link as LinkIcon,
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

const GalleryTab = ({ activeTab }) => {
  const {
    galleryItems,
    galleryNiches,
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
  } = useGalleryTab({ activeTab });

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
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {galleryItems.map((item) => (
                <div
                  key={item.id}
                  className="relative group rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white border border-gray-100"
                >
                  {/* Hover delete button — red circle top-right */}
                  <button
                    onClick={() => handleOpenGalleryDeleteModal(item.id)}
                    className="absolute -top-2 -right-2 z-10 w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 shadow-md"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>

                  {/* Thumbnail */}
                  <div className="relative aspect-[4/3] w-full bg-gray-900 rounded-t-lg overflow-hidden">
                    {item.media_type === "video" ? (
                      <video
                        src={item.file_url || item.post_url}
                        className="w-full h-full object-contain bg-black"
                        preload="metadata"
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
                      <div className="absolute top-1.5 left-1.5 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-lg font-medium">
                        UGC
                      </div>
                    )}

                    {item.source_type === "post_link" && item.platform && (
                      <div
                        className={`absolute top-1.5 left-1.5 ${getPlatformColor(item.platform)} p-1 rounded-full`}
                      >
                        {getPlatformIcon(item.platform)}
                      </div>
                    )}
                  </div>

                  {/* Info + actions */}
                  <div className="p-2 space-y-1.5">
                    <p className="text-xs font-medium text-gray-800 line-clamp-1">
                      {item.caption_text || item.title || "Untitled"}
                    </p>

                    {/* Compact metrics for post_link */}
                    {item.source_type === "post_link" && item.metrics_snapshot && (
                      <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                        {item.metrics_snapshot.views > 0 && (
                          <span className="flex items-center gap-0.5 text-xs text-gray-500">
                            <Eye className="w-2.5 h-2.5" />
                            {formatNumber(item.metrics_snapshot.views)}
                          </span>
                        )}
                        {item.metrics_snapshot.likes > 0 && (
                          <span className="flex items-center gap-0.5 text-xs text-gray-500">
                            <ThumbsUp className="w-2.5 h-2.5" />
                            {formatNumber(item.metrics_snapshot.likes)}
                          </span>
                        )}
                        {item.metrics_snapshot.comments > 0 && (
                          <span className="flex items-center gap-0.5 text-xs text-gray-500">
                            <MessageCircle className="w-2.5 h-2.5" />
                            {formatNumber(item.metrics_snapshot.comments)}
                          </span>
                        )}
                        {item.metrics_snapshot.shares > 0 && (
                          <span className="flex items-center gap-0.5 text-xs text-gray-500">
                            <Share2 className="w-2.5 h-2.5" />
                            {formatNumber(item.metrics_snapshot.shares)}
                          </span>
                        )}
                        {item.metrics_snapshot.saves > 0 && (
                          <span className="flex items-center gap-0.5 text-xs text-gray-500">
                            <Bookmark className="w-2.5 h-2.5" />
                            {formatNumber(item.metrics_snapshot.saves)}
                          </span>
                        )}
                      </div>
                    )}

                    {item.source_type === "post_link" && item.published_at && (
                      <p className="text-xs text-gray-400">
                        {format(new Date(item.published_at), "MMM d, yyyy")}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-1 pt-0.5">
                      {item.source_type === "post_link" && item.post_url && (
                        <a
                          href={item.post_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 transition-colors"
                        >
                          <ExternalLink className="w-2.5 h-2.5" />
                          View
                        </a>
                      )}
                      {item.source_type === "post_link" && canRefreshMetrics(item) && (
                        <button
                          onClick={() => handleRefreshMetrics(item.id)}
                          className="flex items-center justify-center px-2 py-1 text-xs bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
                          title="Refresh metrics"
                        >
                          <RefreshCw className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
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
