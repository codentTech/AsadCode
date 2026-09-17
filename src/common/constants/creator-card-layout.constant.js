export const CREATOR_CARD_WIDTH_REM = 18;
export const CREATOR_CARD_WIDTH_PX = CREATOR_CARD_WIDTH_REM * 16;
export const CREATOR_CARD_GRID_GAP_CLASS = "gap-3 sm:gap-4";

/**
 * Packs fixed-width creator cards left-to-right with consistent gutters (no 1fr stretch).
 * Keep this as a static string so Tailwind JIT can detect the auto-fill utility.
 */
export const CREATOR_CARD_GRID_CLASS =
  "grid grid-cols-1 justify-items-start gap-3 sm:gap-4 sm:grid-cols-[repeat(auto-fill,18rem)]";
