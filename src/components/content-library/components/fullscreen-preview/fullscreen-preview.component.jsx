"use client";

import PropTypes from "prop-types";
import { Download, X } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";

export default function FullscreenPreview({
  asset,
  isDownloading,
  onClose,
  onDownload,
}) {
  if (!asset) return null;

  const previewUrl = asset.preview_url;
  const isVideo = asset.content_type === "video";
  const isImage = asset.content_type === "image";

  return (
    <div className="fixed inset-0 z-50 flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden bg-[#111319] text-white">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">
            {asset.original_filename || "Untitled asset"}
          </div>
          <div className="truncate text-xs text-slate-400">
            {asset.creator?.name || "Unknown creator"} ·{" "}
            {asset.campaign?.name || asset.campaign_name || "Campaign"}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <CustomButton
            text={isDownloading ? "Downloading…" : "Download"}
            className="btn-outline !border-slate-600 !bg-slate-800 !text-white"
            onClick={() => onDownload(asset)}
            disabled={isDownloading || !asset.content_url}
            startIcon={<Download className="h-3.5 w-3.5" />}
          />
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-600 bg-slate-800 text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden p-4 sm:p-6">
        {previewUrl && isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt={asset.original_filename || "Asset preview"}
            className="h-auto max-h-full w-auto max-w-full rounded-lg object-contain"
          />
        ) : previewUrl && isVideo ? (
          <video
            src={previewUrl}
            className="h-auto max-h-full w-auto max-w-full rounded-lg object-contain"
            controls
            autoPlay
            playsInline
          />
        ) : (
          <div className="text-sm text-slate-400">Preview unavailable</div>
        )}
      </div>

      <div className="shrink-0 px-4 py-3 text-center text-xs text-slate-400">
        Preview only. Metadata and rights remain in the detail panel.
      </div>
    </div>
  );
}

FullscreenPreview.propTypes = {
  asset: PropTypes.object,
  isDownloading: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
};

FullscreenPreview.defaultProps = {
  asset: null,
  isDownloading: false,
};
