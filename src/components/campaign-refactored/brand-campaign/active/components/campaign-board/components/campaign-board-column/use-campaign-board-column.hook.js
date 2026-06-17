import { useMemo } from "react";
import { BOARD_COLUMN_LABELS, BOARD_THEME } from "@/common/constants/creator-urgency.constant";

function useCampaignBoardColumn({ columnKey }) {
  const title = BOARD_COLUMN_LABELS[columnKey] || columnKey;

  const columnShellClass = useMemo(
    () =>
      `flex h-full max-h-full min-h-0 w-[85vw] max-w-[18.5rem] shrink-0 snap-center flex-col overflow-hidden rounded-lg border bg-white shadow-md ring-1 sm:w-[16rem] md:min-w-0 md:w-0 md:max-w-none md:flex-1 md:shrink md:snap-align-none ${BOARD_THEME.border} ${BOARD_THEME.ring}`,
    [],
  );

  return {
    title,
    headerClass: BOARD_THEME.header,
    bodyClass: BOARD_THEME.body,
    columnShellClass,
  };
}

export default useCampaignBoardColumn;
