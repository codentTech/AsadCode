import { getAge } from "@/common/utils/date.utils";
import { formatCreatorLocation } from "@/common/utils/creator-location.util";
import {
  buildConnectedPlatformsFromCreatorUser,
  ratingAndReviewCountFromCreatorUser,
} from "@/common/utils/creator-platforms.utils";
import { resolveCreatorUrgency } from "@/common/utils/creator-urgency.util";

function resolveBrandCreatorDeadlineLabel(creatorRow) {
  const status = creatorRow?.status;
  if (status === "REJECTED" || status === "CREATOR_REJECTED") {
    return "Cancelled";
  }

  const contract = creatorRow?.contract;
  const completionDeadline =
    contract?.completion_deadline || contract?.completionDeadline;
  if (!completionDeadline) {
    return creatorRow?.deadline ?? null;
  }

  const completedAt = creatorRow?.completed_at || creatorRow?.completedAt || null;
  if (!completedAt) {
    return new Date(completionDeadline) >= new Date() ? "On time" : "Overdue";
  }

  return new Date(completedAt) <= new Date(completionDeadline) ? "On time" : "Overdue";
}

export function mapBrandAppliedCreatorRow(creator) {
  if (!creator) return null;

  const { rating, reviewCount } = ratingAndReviewCountFromCreatorUser(creator.creator);
  const contract = creator.contract;
  const urgency = resolveCreatorUrgency(creator);
  const connectedPlatforms = buildConnectedPlatformsFromCreatorUser(creator.creator);

  return {
    ...creator,
    pipeline: creator.pipeline,
    urgencyLabel: urgency.label,
    urgencyTier: urgency.tier,
    boardColumn: urgency.boardColumn,
    contentSubState: urgency.contentSubState,
    id: creator?.creator?.creator_profile?.id,
    age: getAge(creator?.creator?.date_of_birth),
    creatorUserId: creator?.creator?.id,
    name:
      `${creator.creator?.first_name || ""} ${creator.creator?.last_name || ""}`.trim() ||
      "Unknown Creator",
    bio: creator.creator?.creator_profile?.bio || "No bio available",
    image: creator.creator?.creator_profile?.profile_photo_url,
    location:
      formatCreatorLocation({
        city: creator.creator?.city,
        country: creator.creator?.country,
        state: creator.creator?.state,
        stateShort: creator.creator?.state_short,
      }) || "Location not specified",
    totalSpent: creator.total_spent || 0,
    rating,
    reviewCount,
    platforms: connectedPlatforms.platforms,
    platformStats: connectedPlatforms.platformStats,
    hasConnectedSocialAccounts: connectedPlatforms.hasConnectedSocialAccounts,
    projects: creator.creator?.total_projects || 0,
    successRate: creator.creator?.success_rate || 0,
    avgDeliveryTime: creator.creator?.avg_delivery_time || "N/A",
    specialty: creator.creator?.specialty || "General",
    deadline:
      creator.status === "COMPLETED"
        ? resolveBrandCreatorDeadlineLabel(creator)
        : creator.deadline ?? null,
    status: creator.status,
    appliedAt: creator.applied_at,
    hiredAt: creator.hired_at,
    contract: contract
      ? {
          ...contract,
          totalCompensation: contract.total_compensation || contract.totalCompensation || 0,
          campaignId: contract.campaign_id || contract.campaignId,
          creatorId: contract.creator_id || contract.creatorId,
          brandId: contract.brand_id || contract.brandId,
          completionDeadline: contract.completion_deadline || contract.completionDeadline,
          startDate: contract.start_date || contract.startDate,
          firstDraftDeadline: contract.first_draft_deadline || contract.firstDraftDeadline,
          contentFormat: contract.content_format || contract.contentFormat,
          revisionsLimit: contract.revisions_limit || contract.revisionsLimit,
          compensationType: contract.compensation_type || contract.compensationType,
          productPrice: contract.product_price || contract.productPrice,
          usageRights: contract.usage_rights || contract.usageRights,
          exclusivityClause: contract.exclusivity_clause || contract.exclusivityClause,
          campaignType: contract.campaign_type || contract.campaignType,
          contentGuidelines: contract.content_guidelines || contract.contentGuidelines,
          sentAt: contract.sent_at || contract.sentAt,
          expiresAt: contract.expires_at || contract.expiresAt,
        }
      : null,
  };
}
