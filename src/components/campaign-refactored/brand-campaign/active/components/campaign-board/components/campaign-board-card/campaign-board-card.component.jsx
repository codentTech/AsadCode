import React from "react";
import UrgencyPill from "@/common/components/urgency-pill/urgency-pill.component";
import { User } from "lucide-react";
import useCampaignBoardCard from "./use-campaign-board-card.hook";

const CampaignBoardCard = ({ creator, onSelect, showSubState = false, phylloAccountsByCreatorId }) => {
  const {
    name,
    image,
    followerLabel,
    urgencyLabel,
    urgencyTier,
    cardClass,
    avatarRingClass,
    subStateChipClass,
    subStateLabel,
    handleClick,
  } = useCampaignBoardCard({ creator, onSelect, phylloAccountsByCreatorId });

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`w-full rounded-lg border border-gray-200/80 p-2.5 text-left shadow-sm transition-all duration-200 active:scale-[0.99] active:shadow-md sm:p-3 sm:hover:-translate-y-px sm:hover:shadow-md ${cardClass}`}
    >
      <div className="flex items-start gap-2 sm:gap-2.5">
        {image ? (
          <img
            src={image}
            alt={name}
            className={`h-8 w-8 shrink-0 rounded-full border-2 border-white object-cover shadow-sm ring-1 sm:h-9 sm:w-9 ${avatarRingClass}`}
          />
        ) : (
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-sm ring-2 ring-white sm:h-9 sm:w-9 ${avatarRingClass}`}
          >
            <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="mb-0.5 flex items-center justify-between gap-1 sm:mb-1 sm:gap-1.5">
            <p className="min-w-0 flex-1 truncate text-xs font-semibold text-gray-900 sm:flex-none sm:text-sm">
              {name}
            </p>
            <UrgencyPill label={urgencyLabel} tier={urgencyTier} />
          </div>
          <p className="text-[10px] text-gray-500 sm:text-xs">{followerLabel}</p>
          {showSubState && subStateLabel ? (
            <p
              className={`mt-1 line-clamp-2 rounded-md px-1.5 py-0.5 text-[10px] font-medium leading-snug sm:text-xs ${subStateChipClass}`}
            >
              {subStateLabel}
            </p>
          ) : null}
        </div>
      </div>
    </button>
  );
};

export default CampaignBoardCard;
