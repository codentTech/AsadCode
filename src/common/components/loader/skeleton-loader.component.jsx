import React from "react";
import { CREATOR_CARD_GRID_CLASS } from "@/common/constants/creator-card-layout.constant";

const BASE_CLASSES = "bg-gray-200 animate-pulse";

/**
 * Base skeleton block. Use className to control size and shape.
 * @param {string} [className] - Tailwind classes (e.g. "h-4 w-32", "w-12 h-12 rounded-full")
 * @param {boolean} [circle] - If true, applies rounded-full (for avatars)
 */
export function Skeleton({ className = "", circle = false, ...props }) {
  return (
    <div
      className={`${BASE_CLASSES} ${circle ? "rounded-full" : "rounded"} ${className}`.trim()}
      aria-hidden
      {...props}
    />
  );
}

/**
 * Multiple lines of text skeleton.
 * @param {number} [lines=3] - Number of lines
 * @param {string} [className] - Wrapper className
 */
export function SkeletonText({ lines = 3, className = "" }) {
  return (
    <div className={`space-y-2 ${className}`.trim()}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-3 ${i === lines - 1 && lines > 1 ? "w-2/3" : "w-full"}`.trim()}
        />
      ))}
    </div>
  );
}

/**
 * Card-style skeleton (image + avatar + title + text). Good for creator cards, content cards.
 * @param {boolean} [hasImage=true] - Show top image block
 * @param {boolean} [hasAvatar=true] - Show circle avatar
 * @param {string} [className] - Wrapper className
 */
export function SkeletonCard({ hasImage = true, hasAvatar = true, className = "" }) {
  return (
    <div
      className={`w-full max-w-[18rem] rounded-lg border border-gray-200 bg-white overflow-hidden ${className}`.trim()}
    >
      {hasImage && <Skeleton className="h-32 w-full rounded-none" />}
      <div className="relative px-4 pb-4 space-y-3">
        {hasAvatar && (
          <div className="absolute top-[-70px] left-1/2 -translate-x-1/2">
            <Skeleton circle className="w-16 h-16" />
          </div>
        )}
        <div className="text-center pt-2">
          <Skeleton className="h-4 w-3/4 mx-auto mb-2" />
          <Skeleton className="h-3 w-1/2 mx-auto" />
        </div>
        <div className="flex justify-center gap-1 flex-wrap">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-14" />
        </div>
        <SkeletonText lines={2} className="pt-1" />
      </div>
    </div>
  );
}

/**
 * Table row skeleton.
 * @param {number} [cols=4] - Number of columns
 * @param {string} [className] - Row className
 */
export function SkeletonTableRow({ cols = 4, className = "" }) {
  return (
    <div className={`flex items-center gap-4 py-3 border-b border-gray-100 ${className}`.trim()}>
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className={`h-4 flex-1 ${i === 0 ? "max-w-[40px]" : ""}`} />
      ))}
    </div>
  );
}

/**
 * Full table skeleton (header + rows).
 * @param {number} [rows=5] - Number of body rows
 * @param {number} [cols=4] - Number of columns
 * @param {string} [className] - Wrapper className
 */
export function SkeletonTable({ rows = 5, cols = 4, className = "" }) {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white overflow-hidden ${className}`.trim()}>
      <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonTableRow key={i} cols={cols} />
      ))}
    </div>
  );
}

/**
 * Profile/section skeleton (avatar + title + lines). Good for profile overview, section headers.
 * @param {string} [className] - Wrapper className
 */
export function SkeletonProfile({ className = "" }) {
  return (
    <section className={`bg-white rounded-lg shadow-md p-6 ${className}`.trim()}>
      <Skeleton circle className="h-32 w-32 mx-auto mb-4" />
      <Skeleton className="h-4 w-1/3 mx-auto mb-2" />
      <Skeleton className="h-3 w-1/4 mx-auto mb-4" />
      <SkeletonText lines={4} />
    </section>
  );
}

/**
 * Grid of card skeletons (e.g. discover / applications creator grids).
 * @param {number} [count=6] - Number of cards
 * @param {string} [gridClass] - Grid classes; defaults to packed creator-card layout
 */
export function SkeletonCardGrid({ count = 6, gridClass = CREATOR_CARD_GRID_CLASS }) {
  return (
    <div className={gridClass}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default Skeleton;
