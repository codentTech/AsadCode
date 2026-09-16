export const CREATOR_CARD_WIDTH_REM = 18;
export const CREATOR_CARD_WIDTH_PX = CREATOR_CARD_WIDTH_REM * 16;
export const CREATOR_CARD_GRID_GAP_CLASS = "gap-3 sm:gap-4";

/** Packs fixed-width creator cards left-to-right with consistent gutters (no 1fr stretch). */
export const CREATOR_CARD_GRID_CLASS = `grid grid-cols-1 justify-items-start ${CREATOR_CARD_GRID_GAP_CLASS} sm:[grid-template-columns:repeat(auto-fill,${CREATOR_CARD_WIDTH_REM}rem)]`;
