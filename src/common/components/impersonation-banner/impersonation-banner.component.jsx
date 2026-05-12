"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import { formatUserLabel } from "@/common/utils/user-display.util";
import { ChevronDown, ChevronUp } from "lucide-react";
import useImpersonationBanner from "./use-impersonation-banner.hook";

const ImpersonationBanner = () => {
  const {
    cardRef,
    currentUser,
    adminUser,
    isImpersonating,
    isExiting,
    isCollapsed,
    isDragging,
    isCustomPosition,
    position,
    handleExitImpersonation,
    toggleCollapsed,
    handleDragStart,
  } = useImpersonationBanner();

  if (!isImpersonating) {
    return null;
  }

  const currentLabel = formatUserLabel(currentUser);
  const currentEmail = currentUser?.email ? ` (${currentUser.email})` : "";
  const containerClass = isCustomPosition
    ? "fixed z-[80] w-[min(92vw,22rem)] rounded-xl border border-amber-600 bg-amber-500 p-2.5 shadow-2xl"
    : "fixed bottom-[6.25rem] left-1/2 z-[80] w-[min(92vw,22rem)] -translate-x-1/2 rounded-xl border border-amber-600 bg-amber-500 p-2.5 shadow-2xl md:bottom-6";
  const containerStyle = isCustomPosition
    ? { left: `${position.x}px`, top: `${position.y}px` }
    : undefined;

  return (
    <div
      ref={cardRef}
      className={`${containerClass} ${isDragging ? "cursor-grabbing" : "cursor-grab"} animate-in fade-in-0 duration-300`}
      style={containerStyle}
      onPointerDown={handleDragStart}
    >
      <div className="mb-1.5 flex items-center justify-between gap-2 rounded-md border border-amber-700/60 bg-amber-600 px-2 py-1">
        <div className="flex min-w-0 items-center gap-1.5 text-[10px] text-amber-50 sm:text-xs">
          <span className="inline-flex shrink-0 items-center rounded-lg border border-amber-200/70 bg-black px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-amber-100 shadow-[0_0_10px_rgba(251,191,36,0.45)]">
            LIVE
          </span>
          <span className="truncate font-semibold tracking-wide">IMPERSONATION MODE</span>
        </div>
        <button
          type="button"
          data-no-drag="true"
          onClick={toggleCollapsed}
          className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-amber-200/70 text-amber-50 hover:bg-amber-700/40"
          aria-label={isCollapsed ? "Expand impersonation card" : "Collapse impersonation card"}
        >
          {isCollapsed ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {isCollapsed ? null : (
        <div className="space-y-2">
          <div className="rounded-md border border-amber-700/60 bg-amber-600 px-2 py-1.5">
            <p className="truncate text-[10px] font-medium text-amber-50 sm:text-xs">
              <span className="text-amber-200">As:</span> {currentLabel}
              {currentEmail}
            </p>
          </div>
          <div className="shrink-0" data-no-drag="true">
            <CustomButton
              text={isExiting ? "Exiting" : "Exit impersonation"}
              onClick={handleExitImpersonation}
              disabled={isExiting}
              loading={isExiting}
              className="bg-black h-8 min-h-8 w-full px-2.5 text-[10px] sm:px-3 sm:text-xs"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImpersonationBanner;
