import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";

export function resolveEffectiveCollaborationType(campaign, contextCollaborationType) {
  return (
    campaign?.collaboration_type ||
    campaign?.collaborationType ||
    contextCollaborationType ||
    null
  );
}

export function isIndividualCollaborationFlow(isMultiCreator, effectiveCollaborationType) {
  return (
    !isMultiCreator ||
    effectiveCollaborationType === COLLABORATION_TYPE.INDIVIDUAL_CREATOR
  );
}

export function isCampaignCompatibleWithOverviewToggle(
  isMultiCreator,
  effectiveCollaborationType
) {
  if (isMultiCreator) {
    return (
      (effectiveCollaborationType || COLLABORATION_TYPE.MULTI_CREATOR) ===
      COLLABORATION_TYPE.MULTI_CREATOR
    );
  }
  return isIndividualCollaborationFlow(isMultiCreator, effectiveCollaborationType);
}

export function creatorRowHasIdentity(row) {
  if (!row || typeof row !== "object") return false;
  return !!(
    row.creatorUserId ||
    row.creator?.id ||
    row.contract?.creatorId ||
    row.contract?.creator_id ||
    row.contract?.creator?.id ||
    row.name
  );
}

export function individualCreatorDisplayLabel(campaign, creatorRow) {
  const fromCampaign = [
    campaign?.creator?.first_name ?? campaign?.contract?.creator?.first_name,
    campaign?.creator?.last_name ?? campaign?.contract?.creator?.last_name,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();
  if (fromCampaign) return fromCampaign;
  const fromRow = [creatorRow?.creator?.first_name, creatorRow?.creator?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
  return fromRow || (typeof creatorRow?.name === "string" ? creatorRow.name.trim() : "") || "";
}
