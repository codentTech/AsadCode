import React from "react";
import CampaignBoardCard from "../campaign-board-card/campaign-board-card.component";
import useCampaignBoardColumn from "./use-campaign-board-column.hook";

const CampaignBoardColumn = ({ columnKey, creators, onCreatorSelect, showSubState, phylloAccountsByCreatorId }) => {
  const { title, headerClass, bodyClass, columnShellClass } = useCampaignBoardColumn({ columnKey });

  return (
    <div className={columnShellClass}>
      <div className={`sticky top-0 z-10 shrink-0 px-2.5 py-2 sm:px-3 sm:py-2.5 ${headerClass}`}>
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-[11px] font-semibold text-white sm:text-sm">{title}</h3>
          <span className="shrink-0 rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-white sm:px-2 sm:text-xs">
            {creators.length}
          </span>
        </div>
      </div>
      <div
        className={`min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-y-contain p-2 [-webkit-overflow-scrolling:touch] sm:space-y-2.5 sm:p-2.5 ${bodyClass}`}
      >
        {creators.length === 0 ? (
          <p className="px-1 py-6 text-center text-[10px] text-gray-400 sm:text-xs">
            No creators at this stage
          </p>
        ) : (
          creators.map((creator) => (
            <CampaignBoardCard
              key={creator.creator?.id || creator.id}
              creator={creator}
              onSelect={onCreatorSelect}
              showSubState={showSubState}
              phylloAccountsByCreatorId={phylloAccountsByCreatorId}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CampaignBoardColumn;
