import { useCallback, useMemo } from "react";
import { mapBrandAppliedCreatorRow } from "@/common/utils/map-brand-applied-creator-row.util";
import { CONTENT_SUB_STATE_LABELS, BOARD_THEME } from "@/common/constants/creator-urgency.constant";
import { resolveCreatorTotalFollowers } from "@/common/utils/creator-platforms.utils";

function formatFollowerCount(value) {
  const count = Number(value) || 0;
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return String(count);
}

function useCampaignBoardCard({ creator, onSelect, phylloAccountsByCreatorId }) {
  const mapped = useMemo(() => mapBrandAppliedCreatorRow(creator), [creator]);

  const creatorUserId = creator?.creator?.id || mapped?.creatorUserId;

  const followerLabel = useMemo(() => {
    const phylloAccounts = creatorUserId
      ? phylloAccountsByCreatorId?.[creatorUserId]
      : null;
    const total = resolveCreatorTotalFollowers(creator, phylloAccounts);
    return `${formatFollowerCount(total)} followers`;
  }, [creator, creatorUserId, phylloAccountsByCreatorId]);

  const subStateLabel = mapped?.contentSubState
    ? CONTENT_SUB_STATE_LABELS[mapped.contentSubState]
    : null;

  const handleClick = useCallback(() => {
    if (onSelect && mapped) {
      onSelect(mapped);
    }
  }, [mapped, onSelect]);

  const urgencyTier = mapped?.urgencyTier;

  return {
    name: mapped?.name || "Creator",
    image: mapped?.image,
    followerLabel,
    urgencyLabel: mapped?.urgencyLabel,
    urgencyTier,
    cardClass: BOARD_THEME.card,
    avatarRingClass: BOARD_THEME.avatarRing,
    subStateChipClass: BOARD_THEME.subStateChip,
    subStateLabel,
    handleClick,
  };
}

export default useCampaignBoardCard;
