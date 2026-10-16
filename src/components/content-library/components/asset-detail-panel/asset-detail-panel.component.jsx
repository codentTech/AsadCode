"use client";

import PropTypes from "prop-types";
import { Archive, Maximize2, Play, RotateCcw, X } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import { Skeleton } from "@/common/components/loader/skeleton-loader.component";
import {
  CONTENT_LIBRARY_RIGHTS_LABELS,
  CONTENT_LIBRARY_USAGE_RIGHTS_LABELS,
} from "@/common/constants/content-library.constant";

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function KvRow({ label, value }) {
  return (
    <>
      <span className="text-gray-500">{label}</span>
      <b className="break-words font-medium text-gray-900">{value || "—"}</b>
    </>
  );
}

KvRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node,
};

function DetailSkeleton() {
  return (
    <aside className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-white">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-gray-100 px-4 py-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
        <Skeleton className="mx-auto mb-4 aspect-[9/16] w-full max-w-[260px] rounded-lg" />
        <Skeleton className="mb-5 h-8 w-full rounded-lg" />
        <div className="space-y-3">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
        </div>
      </div>
    </aside>
  );
}

export default function AssetDetailPanel({
  asset,
  isLoading,
  isDownloading,
  isArchiving,
  onClose,
  onDownload,
  onFullscreen,
  onArchive,
  onUnarchive,
}) {
  if (isLoading && !asset) {
    return <DetailSkeleton />;
  }

  if (!asset) return null;

  const previewUrl = asset.preview_url;
  const isVideo = asset.content_type === "video";
  const isImage = asset.content_type === "image";
  const isArchived = asset.library_status === "archived";
  const rightsLabel =
    CONTENT_LIBRARY_RIGHTS_LABELS[asset.rights_status] || "Unknown";
  const usageLabel =
    CONTENT_LIBRARY_USAGE_RIGHTS_LABELS[asset.usage_rights] ||
    asset.usage_rights ||
    "Not specified";
  const showExpiryWarning =
    asset.rights_status === "expired" || asset.rights_status === "expiring_soon";

  return (
    <aside className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-white">
      <div className="flex w-full shrink-0 items-start justify-between gap-3 bg-primary px-4 py-3">
        <h3 className="min-w-0 flex-1 break-all text-sm font-semibold leading-snug text-white">
          {asset.original_filename || "Untitled asset"}
        </h3>
        <button
          type="button"
          aria-label="Close details"
          onClick={onClose}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-white/20 text-white hover:bg-white/30"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
        <div className="relative mx-auto mb-4 grid aspect-[9/16] w-full max-w-[260px] place-items-center overflow-hidden rounded-xl bg-slate-100">
          {previewUrl && isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt={asset.original_filename || "Asset preview"}
              className="h-full w-full object-cover"
            />
          ) : previewUrl && isVideo ? (
            <video
              src={previewUrl}
              className="h-full w-full object-cover"
              controls
              playsInline
              preload="metadata"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-500">
              <Play className="h-8 w-8" />
              <span className="text-[11px]">
                {asset.ingest_status === "pending" ? "Preview processing" : "No preview"}
              </span>
            </div>
          )}
        </div>

        <div className="mb-4 grid grid-cols-[1fr_40px] gap-2">
          <CustomButton
            text={isDownloading ? "Downloading…" : "Download original"}
            className="btn-primary w-full"
            onClick={() => onDownload(asset)}
            disabled={isDownloading || !asset.content_url}
          />
          <button
            type="button"
            aria-label="Open fullscreen"
            onClick={onFullscreen}
            className="grid place-items-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        {showExpiryWarning ? (
          <div
            className={`mb-4 rounded-lg px-3 py-2 text-xs ${
              asset.rights_status === "expired"
                ? "bg-red-50 text-red-700"
                : "bg-amber-50 text-amber-800"
            }`}
          >
            {asset.rights_status === "expired"
              ? "Usage rights appear expired. Review the recorded agreement before new usage."
              : "Usage rights are expiring soon. Review before scheduling new usage."}
          </div>
        ) : null}

        <section className="mb-5">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
            Creator and origin
          </h4>
          <div className="grid grid-cols-[96px_1fr] gap-x-3 gap-y-2 text-xs">
            <KvRow label="Creator" value={asset.creator?.name} />
            <KvRow label="Campaign" value={asset.campaign?.name || asset.campaign_name} />
            <KvRow label="Deliverable" value={asset.deliverable_description} />
            <KvRow label="Product" value={asset.product_name} />
            <KvRow label="Approved" value={formatDate(asset.approved_at)} />
          </div>
        </section>

        <section className="mb-5">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
            Usage rights
          </h4>
          <div className="grid grid-cols-[96px_1fr] gap-x-3 gap-y-2 text-xs">
            <KvRow label="Status" value={rightsLabel} />
            <KvRow label="Rights type" value={usageLabel} />
            <KvRow label="Start date" value={formatDate(asset.rights_start_date)} />
            <KvRow label="End date" value={formatDate(asset.rights_end_date)} />
          </div>
        </section>

        <section className="mb-5">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
            Publication
          </h4>
          <p className="text-xs text-gray-700">
            {(asset.published_placement_count ?? 0) > 0
              ? `Published in ${asset.published_placement_count} place${
                  asset.published_placement_count === 1 ? "" : "s"
                }`
              : "Not published"}
          </p>
          {(asset.published_placement_count ?? 0) === 0 ? (
            <p className="mt-1 text-[11px] text-gray-400">
              Linked social posts will appear here when available.
            </p>
          ) : null}
        </section>

        <div className="pb-2">
          {isArchived ? (
            <CustomButton
              text="Unarchive"
              className="btn-outline w-full"
              onClick={onUnarchive}
              disabled={isArchiving}
              loading={isArchiving}
              startIcon={<RotateCcw className="h-3.5 w-3.5" />}
            />
          ) : (
            <CustomButton
              text="Archive"
              className="btn-outline w-full"
              onClick={onArchive}
              disabled={isArchiving}
              loading={isArchiving}
              startIcon={<Archive className="h-3.5 w-3.5" />}
            />
          )}
        </div>
      </div>
    </aside>
  );
}

AssetDetailPanel.propTypes = {
  asset: PropTypes.object,
  isLoading: PropTypes.bool,
  isDownloading: PropTypes.bool,
  isArchiving: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
  onFullscreen: PropTypes.func.isRequired,
  onArchive: PropTypes.func.isRequired,
  onUnarchive: PropTypes.func.isRequired,
};

AssetDetailPanel.defaultProps = {
  asset: null,
  isLoading: false,
  isDownloading: false,
  isArchiving: false,
};
