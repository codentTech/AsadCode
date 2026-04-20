import { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { getAge } from "@/common/utils/date.utils";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";

const DEFAULT_PLATFORMS = {
  instagram: { followers: 0, verified: false },
  youtube: { followers: 0, verified: false },
  twitter: { followers: 0, verified: false },
  tiktok: { followers: 0, verified: false },
};

function ratingAndReviewCountFromCreatorUser(creatorUser) {
  const profile = creatorUser?.creator_profile;
  const rawRating = profile?.rating;
  const rating =
    rawRating != null && rawRating !== "" ? Number(rawRating) : 0;
  const rawCount = profile?.reviewCount ?? profile?.review_count;
  const reviewCount =
    rawCount != null && rawCount !== ""
      ? Number(rawCount)
      : Array.isArray(profile?.campaign_reviews)
        ? profile.campaign_reviews.length
        : 0;
  return {
    rating: Number.isFinite(rating) ? rating : 0,
    reviewCount: Number.isFinite(reviewCount) ? reviewCount : 0,
  };
}

function buildPlatformsFromSocialAccounts(creator) {
  const accounts = creator?.social_accounts || [];
  const out = { ...DEFAULT_PLATFORMS };
  for (const acc of accounts) {
    const platform = String(acc.platform || "").toLowerCase();
    if (!platform) continue;
    const pd = acc.profile_data || {};
    const followers =
      Number(pd.followers) ||
      Number(pd.followers_count) ||
      Number(pd.follower_count) ||
      Number(pd.subscriber_count) ||
      0;
    if (!out[platform]) out[platform] = { followers: 0, verified: false };
    out[platform] = {
      followers,
      verified: acc.is_verified ?? out[platform].verified ?? false,
    };
  }
  return out;
}

export const useCreatorSpendAnalysis = (
  selectedCampaign,
  isCompleted = false,
  isMultiCreator = true,
  onClearCreator
) => {
  const [showBrandCalendar, setShowBrandCalendar] = useState(false);
  const [showTaskManager, setShowTaskManager] = useState(false);

  const {
    isLoading: creatorsLoading,
    isSuccess: creatorsSuccess,
    isError: creatorsError,
    data: creatorsData,
  } = useSelector(
    (state) =>
      (isCompleted ? state.campaigns.getAppliedCreators : state.campaigns.getHiredCreators) || {}
  );

  const {
    isLoading: individualContractsLoading,
    isSuccess: individualContractsSuccess,
    isError: individualContractsError,
    data: individualContractsData,
  } = useSelector((state) => state.contracts.getIndividualCollaborationContracts || {});

  const isIndividualMode = useMemo(() => {
    return (
      !isMultiCreator ||
      selectedCampaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR
    );
  }, [isMultiCreator, selectedCampaign]);

  const individualCreators = useMemo(() => {
    if (!isIndividualMode || !Array.isArray(individualContractsData)) {
      return [];
    }

    return individualContractsData
      .filter((contract) => {
        // Only filter by campaign ID if:
        // 1. We're in multi-creator mode (isMultiCreator = true) AND
        // 2. A campaign is selected AND
        // 3. The selected campaign is specifically an individual creator campaign
        // When toggle is switched to individual creator (!isMultiCreator), show ALL individual creators
        if (
          isMultiCreator &&
          selectedCampaign?.id &&
          selectedCampaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR
        ) {
          const contractCampaignId = contract.campaignId || contract.campaign?.id;
          if (contractCampaignId !== selectedCampaign.id) {
            return false;
          }
        }

        if (isCompleted) {
          return contract.campaign?.status === "COMPLETE";
        }
        const now = new Date();
        const deadline = new Date(contract.completionDeadline);
        return deadline >= now && contract.campaign?.status !== "COMPLETE";
      })
      .map((contract) => {
        const creator = contract.creator;
        const creatorProfile = creator?.creator_profile;

        const { rating, reviewCount } = ratingAndReviewCountFromCreatorUser(creator);

        return {
          id: contract.id,
          contractId: contract.id,
          campaign_id: contract.campaignId || contract.campaign?.id,
          campaign: contract.campaign,
          age: getAge(creator?.date_of_birth),
          creatorUserId: creator?.id,
          creator: creator,
          name:
            `${creator?.first_name || ""} ${creator?.last_name || ""}`.trim() || "Unknown Creator",
          bio: creatorProfile?.bio || "No bio available",
          image: creatorProfile?.profile_photo_url,
          location:
            `${creator?.city || ""}, ${creator?.country || ""}`.replace(/^,\s*|,\s*$/g, "") ||
            "Location not specified",
          totalSpent: contract.totalCompensation || 0,
          rating,
          reviewCount,
          platforms: buildPlatformsFromSocialAccounts(creator),
          projects: 0,
          successRate: 0,
          avgDeliveryTime: "N/A",
          specialty: "General",
          deadline: new Date(contract.completionDeadline) > new Date() ? "On time" : "Completed",
          status: contract.status,
          appliedAt: contract.createdAt,
          hiredAt: contract.sentAt,
          contract: contract,
        };
      });
  }, [
    isIndividualMode,
    individualContractsData,
    selectedCampaign?.id,
    selectedCampaign?.collaboration_type,
    isMultiCreator,
    isCompleted,
  ]);

  const creators = Array.isArray(creatorsData?.data)
    ? creatorsData.data.map((creator) => {
        const { rating, reviewCount } = ratingAndReviewCountFromCreatorUser(
          creator.creator
        );

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
          `${creator.creator?.city || ""}, ${creator.creator?.country || ""}`.replace(
            /^,\s*|,\s*$/g,
            ""
          ) || "Location not specified",
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
        contract: creator.contract
          ? {
              ...creator.contract,
              totalCompensation:
                creator.contract.total_compensation || creator.contract.totalCompensation || 0,
              campaignId: creator.contract.campaign_id || creator.contract.campaignId,
              creatorId: creator.contract.creator_id || creator.contract.creatorId,
              brandId: creator.contract.brand_id || creator.contract.brandId,
              completionDeadline:
                creator.contract.completion_deadline || creator.contract.completionDeadline,
              startDate: creator.contract.start_date || creator.contract.startDate,
              firstDraftDeadline:
                creator.contract.first_draft_deadline || creator.contract.firstDraftDeadline,
              contentFormat: creator.contract.content_format || creator.contract.contentFormat,
              revisionsLimit: creator.contract.revisions_limit || creator.contract.revisionsLimit,
              compensationType:
                creator.contract.compensation_type || creator.contract.compensationType,
              productPrice: creator.contract.product_price || creator.contract.productPrice,
              usageRights: creator.contract.usage_rights || creator.contract.usageRights,
              exclusivityClause:
                creator.contract.exclusivity_clause || creator.contract.exclusivityClause,
              campaignType: creator.contract.campaign_type || creator.contract.campaignType,
              contentGuidelines:
                creator.contract.content_guidelines || creator.contract.contentGuidelines,
              sentAt: creator.contract.sent_at || creator.contract.sentAt,
              expiresAt: creator.contract.expires_at || creator.contract.expiresAt,
            }
          : null,
        };
      })
    : [];

  const getSuccessRateColor = (rate) => {
    if (rate >= 95) return "text-green-600 bg-green-50";
    if (rate >= 90) return "text-blue-600 bg-blue-50";
    return "text-orange-600 bg-orange-50";
  };

  const formatFollowers = (followers) => {
    if (!followers || followers === 0) return "0";
    if (followers >= 1000000) {
      return `${(followers / 1000000).toFixed(1)}M`;
    } else if (followers >= 1000) {
      return `${(followers / 1000).toFixed(0)}K`;
    }
    return followers.toString();
  };

  const displayCreators = isIndividualMode ? individualCreators : creators;
  const displayLoading = isIndividualMode ? individualContractsLoading : creatorsLoading;
  const displaySuccess = isIndividualMode ? individualContractsSuccess : creatorsSuccess;
  const displayError = isIndividualMode ? individualContractsError : creatorsError;

  useEffect(() => {
    if (onClearCreator) {
      onClearCreator();
    }
  }, [isIndividualMode]);

  return {
    creators: displayCreators,
    creatorsLoading: displayLoading,
    creatorsSuccess: displaySuccess,
    creatorsError: displayError,
    getSuccessRateColor,
    formatFollowers,
    showBrandCalendar,
    setShowBrandCalendar,
    showTaskManager,
    setShowTaskManager,
  };
};
