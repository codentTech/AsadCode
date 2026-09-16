export const CREATOR_CARD_WIDTH_REM = 18;
export const CREATOR_CARD_WIDTH_PX = CREATOR_CARD_WIDTH_REM * 16;
export const CREATOR_CARD_GRID_GAP_CLASS = "gap-3 sm:gap-4";

/**
 * Packs fixed-width creator cards left-to-right with consistent gutters (no 1fr stretch).
 * `creator-card-grid` is real CSS; `sm:grid-cols-creator-card` is a complete Tailwind class.
 */
export const CREATOR_CARD_GRID_CLASS =
  "creator-card-grid grid w-full justify-items-start gap-3 sm:gap-4 sm:grid-cols-creator-card";
