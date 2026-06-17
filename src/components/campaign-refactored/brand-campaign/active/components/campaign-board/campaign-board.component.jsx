import React from "react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import { Skeleton } from "@/common/components/loader/skeleton-loader.component";
import NotFound from "@/common/components/not-found/not-found.component";
import { X } from "lucide-react";
import CampaignBoardColumn from "./components/campaign-board-column/campaign-board-column.component";
import useCampaignBoard from "./use-campaign-board.hook";

const CampaignBoard = ({
  selectedCampaign,
  onCloseBoard,
  onCreatorSelect,
  onClearCreator,
  selectedCreator,
  detailPanel,
  pipelineRefreshToken,
}) => {
  const { columnOrder, columns, isLoading, isSuccess, isError, handleCreatorSelect, phylloAccountsByCreatorId } =
    useCampaignBoard({
      selectedCampaign,
      onCreatorSelect,
      pipelineRefreshToken,
    });

  const showDetailPanel = Boolean(selectedCreator && detailPanel);

  return (
    <div className="relative flex h-full min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-gradient-to-b from-primary/5 via-gray-100 to-gray-50/90">
      <div className="shrink-0 border-b border-gray-200 bg-white/95 px-2.5 py-2 backdrop-blur-sm sm:px-4">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-semibold text-gray-900 sm:text-lg md:text-xl">
              Campaign Board
            </h1>
            <p className="truncate text-[10px] leading-snug text-gray-500 sm:text-xs md:text-sm">
              {selectedCampaign?.campaign_title || "Pipeline overview"}
            </p>
          </div>
          <CustomButton
            text="Close"
            title="Close board"
            className="btn-outline shrink-0 !min-w-0 px-2.5 sm:px-3 sm:!min-w-[106px]"
            startIcon={<X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
            onClick={onCloseBoard}
          />
        </div>
        {!isLoading && isSuccess && columnOrder.length > 0 ? (
          <p className="mt-1.5 text-[10px] text-gray-400 sm:hidden">
            Swipe sideways to browse pipeline stages
          </p>
        ) : null}
      </div>

      <div className="min-h-0 min-w-0 flex-1 overflow-hidden p-2 sm:p-3">
        {isLoading ? (
          <div className="flex h-full min-h-0 min-w-0 w-full max-w-full flex-nowrap gap-2 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth pb-2 [touch-action:pan-x] [-webkit-overflow-scrolling:touch] snap-x snap-proximity md:overflow-x-hidden md:snap-none md:gap-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <Skeleton
                key={item}
                className="h-full min-h-[12rem] w-[85vw] max-w-[18.5rem] shrink-0 snap-center rounded-lg sm:w-[16rem] md:min-w-0 md:w-0 md:max-w-none md:flex-1 md:snap-align-none"
              />
            ))}
          </div>
        ) : isError || (isSuccess && !columnOrder.length) ? (
          <NotFound
            title="Unable to load board"
            description="Select a campaign with creators to view the pipeline board."
          />
        ) : (
          <div className="flex h-full min-h-0 min-w-0 w-full max-w-full flex-nowrap gap-2 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth pb-2 [touch-action:pan-x] [-webkit-overflow-scrolling:touch] snap-x snap-proximity md:overflow-x-hidden md:snap-none sm:gap-2.5 md:gap-3">
            {columnOrder.map((columnKey) => (
              <CampaignBoardColumn
                key={columnKey}
                columnKey={columnKey}
                creators={columns[columnKey] || []}
                onCreatorSelect={handleCreatorSelect}
                showSubState={columnKey === "content_in_progress"}
                phylloAccountsByCreatorId={phylloAccountsByCreatorId}
              />
            ))}
          </div>
        )}
      </div>

      {showDetailPanel ? (
        <>
          <button
            type="button"
            className="absolute inset-0 z-40 bg-black/40 sm:hidden"
            onClick={onClearCreator}
            aria-label="Close creator details"
          />
          <div className="absolute inset-0 z-50 flex min-h-0 flex-col overflow-hidden bg-white sm:inset-y-0 sm:left-auto sm:right-0 sm:w-full sm:max-w-md sm:border-l sm:border-gray-200 sm:shadow-xl lg:max-w-lg">
            {detailPanel}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default CampaignBoard;
