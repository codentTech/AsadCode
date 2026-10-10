"use client";

import PropTypes from "prop-types";
import {
  Calendar,
  FolderOpen,
  Globe,
  Image as ImageIcon,
  Package,
  Play,
  User,
} from "lucide-react";

function rightsChipLabel(status) {
  if (status === "expiring_soon") return "Expiring soon";
  if (status === "expired") return "Expired";
  if (status === "unknown") return "Rights unknown";
  return "Active rights";
}

function formatApprovedDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function publishedLabel(count) {
  const n = Number(count) || 0;
  if (n <= 0) return "Not published";
  return `Published in ${n} place${n === 1 ? "" : "s"}`;
}

function MetaPill({ icon: Icon, label, className }) {
  if (!label) return null;
  return (
    <span
      className={`inline-flex max-w-full items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium leading-none ${className}`}
    >
      {Icon ? <Icon className="h-3 w-3 shrink-0" aria-hidden /> : null}
      <span className="truncate">{label}</span>
    </span>
  );
}

MetaPill.propTypes = {
  icon: PropTypes.elementType,
  label: PropTypes.string,
  className: PropTypes.string,
};

MetaPill.defaultProps = {
  icon: null,
  label: null,
  className: "",
};

export default function AssetCard({ asset, isSelected, onSelect }) {
  const previewUrl = asset.preview_url;
  const isVideo = asset.content_type === "video";
  const isImage = asset.content_type === "image";
  const approvedLabel = formatApprovedDate(asset.approved_at);
  const placementCount = asset.published_placement_count ?? 0;
  const isPublished = placementCount > 0;

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onSelect(asset.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(asset.id);
        }
      }}
      className={`group cursor-pointer overflow-hidden rounded-xl border bg-white text-left shadow-sm transition-shadow hover:shadow-md ${
        isSelected ? "border-primary ring-2 ring-primary/20" : "border-gray-100"
      }`}
    >
      <div className="relative grid aspect-[3/4] place-items-center overflow-hidden bg-slate-100">
        {previewUrl && isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt={asset.original_filename || "Content asset"}
            className="h-full w-full object-cover"
          />
        ) : previewUrl && isVideo ? (
          <video
            src={previewUrl}
            className="h-full w-full object-cover"
            muted
            playsInline
            preload="metadata"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 px-4 text-center text-slate-500">
            {isVideo ? <Play className="h-8 w-8" /> : <ImageIcon className="h-8 w-8" />}
            <span className="text-[11px]">
              {asset.ingest_status === "pending"
                ? "Preview processing"
                : isVideo
                  ? "Video"
                  : isImage
                    ? "Image"
                    : "File"}
            </span>
          </div>
        )}
        <span className="absolute left-2 top-2 inline-flex h-5 items-center justify-center rounded-full bg-primary px-2.5 text-[10px] font-medium leading-none text-white">
          {rightsChipLabel(asset.rights_status)}
        </span>
        {isVideo && previewUrl ? (
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-primary">
              <Play className="h-4 w-4 fill-current" />
            </span>
          </span>
        ) : null}
      </div>

      <div className="space-y-2 p-3">
        <div className="truncate text-xs font-semibold text-gray-900">
          {asset.original_filename || "Untitled asset"}
        </div>

        <div className="flex flex-col items-start gap-1.5">
          <MetaPill
            icon={User}
            label={asset.creator?.name || "Unknown creator"}
            className="bg-violet-50 text-violet-700"
          />
          <MetaPill
            icon={FolderOpen}
            label={asset.campaign?.name || asset.campaign_name || "Campaign"}
            className="bg-sky-50 text-sky-700"
          />
          {asset.product_name ? (
            <MetaPill
              icon={Package}
              label={asset.product_name}
              className="bg-amber-50 text-amber-800"
            />
          ) : null}
          {approvedLabel ? (
            <MetaPill
              icon={Calendar}
              label={`Approved ${approvedLabel}`}
              className="bg-emerald-50 text-emerald-700"
            />
          ) : null}
          <MetaPill
            icon={Globe}
            label={publishedLabel(placementCount)}
            className={
              isPublished
                ? "bg-primary/10 text-primary"
                : "bg-gray-100 text-gray-500"
            }
          />
        </div>
      </div>
    </article>
  );
}

AssetCard.propTypes = {
  asset: PropTypes.object.isRequired,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
};

AssetCard.defaultProps = {
  isSelected: false,
};
