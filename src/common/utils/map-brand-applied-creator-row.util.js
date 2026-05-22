import { getAge } from "@/common/utils/date.utils";
import { formatCreatorLocation } from "@/common/utils/creator-location.util";
import {
  buildPlatformsFromSocialAccounts,
  ratingAndReviewCountFromCreatorUser,
} from "@/common/utils/creator-platforms.utils";

export function mapBrandAppliedCreatorRow(creator) {
  if (!creator) return null;

  const { rating, reviewCount } = ratingAndReviewCountFromCreatorUser(creator.creator);
  const contract = creator.contract;

  return {
    ...creator,
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
    platforms: (() => {
      const fromAccounts = buildPlatformsFromSocialAccounts(creator.creator);
      const c = creator.creator;
      if (
        !Array.isArray(c?.social_accounts) ||
        (c.social_accounts && c.social_accounts.length === 0)
      ) {
        return {
          instagram: {
            followers: c?.instagram_followers ?? 0,
            verified: c?.instagram_verified ?? false,
          },
          youtube: {
            followers: c?.youtube_followers ?? 0,
            verified: c?.youtube_verified ?? false,
          },
          twitter: {
            followers: c?.twitter_followers ?? 0,
            verified: c?.twitter_verified ?? false,
          },
          tiktok: { followers: 0, verified: false },
        };
      }
      return fromAccounts;
    })(),
    projects: creator.creator?.total_projects || 0,
    successRate: creator.creator?.success_rate || 0,
    avgDeliveryTime: creator.creator?.avg_delivery_time || "N/A",
    specialty: creator.creator?.specialty || "General",
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
