import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { getAge } from "@/common/utils/date.utils";
import {
  buildPlatformsFromPhylloAccounts,
  buildPlatformsFromSocialAccounts,
  ratingAndReviewCountFromCreatorUser,
} from "@/common/utils/creator-platforms.utils";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import {
  resolveEffectiveCollaborationType,
  isIndividualCollaborationFlow,
} from "@/common/utils/brand-campaign-context.utils";
import useGetplatform from "@/common/hooks/use-social-platform.hook";
import usersService from "@/provider/features/users/users.service";
import phylloService from "@/provider/features/phyllo/phyllo.service";

export const useCreatorSpendAnalysis = (
  selectedCampaign,
  isCompleted = false,
  _isMultiCreatorProp = true,
  onClearCreator,
  selectedCreator,
  onCreatorSelect,
  onSortChange
) => {
  const [showBrandCalendar, setShowBrandCalendar] = useState(false);
  const [showTaskManager, setShowTaskManager] = useState(false);
  const [hydratedUsersById, setHydratedUsersById] = useState({});
  const [phylloAccountsByCreatorId, setPhylloAccountsByCreatorId] = useState({});
  const { getPlatformIcon, formatFollowers, getPlatformColor } = useGetplatform();
  const autoSelectedRef = useRef(null);

  const isMultiCreator = useSelector(
    (state) => state.campaignContext?.isBrandCampaignMultiCreatorMode ?? true
  );

  const selectedCollaborationTypeFromContext = useSelector(
    (state) => state.campaignContext?.selectedCollaborationType ?? null
  );

  const {
    isLoading: creatorsLoading,
    isSuccess: creatorsSuccess,
    isError: creatorsError,
    data: creatorsData,
    campaignId: creatorsListCampaignId,
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

  const normalizedIndividualContracts = useMemo(() => {
    if (Array.isArray(individualContractsData)) return individualContractsData;
    if (Array.isArray(individualContractsData?.data)) return individualContractsData.data;
    return [];
  }, [individualContractsData]);

  const effectiveCollaborationType = useMemo(
    () =>
      resolveEffectiveCollaborationType(selectedCampaign, selectedCollaborationTypeFromContext),
    [selectedCampaign, selectedCollaborationTypeFromContext]
  );

  const isIndividualMode = useMemo(
    () => isIndividualCollaborationFlow(isMultiCreator, effectiveCollaborationType),
    [isMultiCreator, effectiveCollaborationType]
  );

  const individualCreators = useMemo(() => {
    if (!isIndividualMode || normalizedIndividualContracts.length === 0) {
      return [];
    }

    return normalizedIndividualContracts
      .filter((contract) => {
        const contractCampaignId = contract.campaignId || contract.campaign?.id;

        if (!isMultiCreator && selectedCampaign?.id) {
          return String(contractCampaignId) === String(selectedCampaign.id);
        }

        if (
          isMultiCreator &&
          selectedCampaign?.id &&
          effectiveCollaborationType === COLLABORATION_TYPE.INDIVIDUAL_CREATOR
        ) {
          return String(contractCampaignId) === String(selectedCampaign.id);
        }

        return true;
      })
      .map((contract) => {
        const creator = contract.creator;
        const hydratedCreator = creator?.id ? hydratedUsersById[creator.id] : null;
        const mergedCreator = hydratedCreator || creator;
        const creatorProfile = mergedCreator?.creator_profile || creator?.creator_profile;

        const { rating, reviewCount } = ratingAndReviewCountFromCreatorUser(mergedCreator);

        return {
          id: contract.id,
          contractId: contract.id,
          campaign_id: contract.campaignId || contract.campaign?.id,
          campaign: contract.campaign,
          age: getAge(mergedCreator?.date_of_birth),
          creatorUserId: mergedCreator?.id || creator?.id,
          creator: mergedCreator || creator,
          name:
            `${mergedCreator?.first_name || ""} ${mergedCreator?.last_name || ""}`.trim() ||
            "Unknown Creator",
          bio: creatorProfile?.bio || "No bio available",
          image: creatorProfile?.profile_photo_url,
          location:
            `${mergedCreator?.city || ""}, ${mergedCreator?.country || ""}`.replace(
              /^,\s*|,\s*$/g,
              ""
            ) ||
            "Location not specified",
          totalSpent: contract.totalCompensation || 0,
          rating,
          reviewCount,
          platforms:
            mergedCreator?.id && phylloAccountsByCreatorId[mergedCreator.id]
              ? buildPlatformsFromPhylloAccounts(phylloAccountsByCreatorId[mergedCreator.id])
              : buildPlatformsFromSocialAccounts(mergedCreator),
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
    normalizedIndividualContracts,
    hydratedUsersById,
    phylloAccountsByCreatorId,
    selectedCampaign?.id,
    effectiveCollaborationType,
    isMultiCreator,
  ]);

  useEffect(() => {
    if (!isIndividualMode || individualCreators.length === 0) {
      return;
    }

    individualCreators.forEach((entry) => {
      const creatorId = entry?.creatorUserId;
      if (!creatorId || hydratedUsersById[creatorId]) {
        return;
      }

      usersService.getUserById(creatorId).then(
        (response) => {
          const userPayload = response?.data || null;
          if (!userPayload?.id) {
            return;
          }
          setHydratedUsersById((prev) => ({
            ...prev,
            [userPayload.id]: userPayload,
          }));
        },
        () => {}
      );
    });
  }, [isIndividualMode, individualCreators, hydratedUsersById]);

  useEffect(() => {
    if (!isIndividualMode || individualCreators.length === 0) {
      return;
    }

    individualCreators.forEach((entry) => {
      const creatorId = entry?.creatorUserId;
      if (!creatorId || phylloAccountsByCreatorId[creatorId]) {
        return;
      }

      phylloService.fetchCreatorSocialAccounts(creatorId).then(
        (response) => {
          const payload = Array.isArray(response?.data) ? response.data : [];
          setPhylloAccountsByCreatorId((prev) => ({
            ...prev,
            [creatorId]: payload,
          }));
        },
        () => {}
      );
    });
  }, [isIndividualMode, individualCreators, phylloAccountsByCreatorId]);

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

  const handleSortChange = useCallback(
    (option) => {
      if (onSortChange && option?.value) {
        onSortChange(option.value);
      }
    },
    [onSortChange]
  );

  const openBrandCalendar = useCallback(() => setShowBrandCalendar(true), []);
  const closeBrandCalendar = useCallback(() => setShowBrandCalendar(false), []);
  const openTaskManagerModal = useCallback(() => setShowTaskManager(true), []);
  const closeTaskManagerModal = useCallback(() => setShowTaskManager(false), []);

  const handleCreatorRowClick = useCallback(
    (creator) => {
      if (onCreatorSelect) {
        onCreatorSelect(creator);
      }
    },
    [onCreatorSelect]
  );

  const displayCreators = isIndividualMode ? individualCreators : creators;

  const awaitingAppliedCreators =
    !!selectedCampaign?.id &&
    !isIndividualMode &&
    !creatorsSuccess &&
    !creatorsError &&
    !creatorsLoading;

  const showStaleCreatorsList =
    !!selectedCampaign?.id &&
    !isIndividualMode &&
    creatorsListCampaignId === selectedCampaign?.id &&
    Array.isArray(creatorsData?.data) &&
    creatorsData.data.length > 0;

  const awaitingIndividualContracts =
    !!selectedCampaign?.id &&
    isIndividualMode &&
    !individualContractsSuccess &&
    !individualContractsError &&
    !individualContractsLoading;

  const displayLoading = isIndividualMode
    ? individualContractsLoading || awaitingIndividualContracts
    : (creatorsLoading && !showStaleCreatorsList) || awaitingAppliedCreators;
  const displaySuccess = isIndividualMode ? individualContractsSuccess : creatorsSuccess;
  const displayError = isIndividualMode ? individualContractsError : creatorsError;

  const appliedCreatorsFingerprint = useMemo(() => {
    if (isIndividualMode) {
      return normalizedIndividualContracts.map((c) => c.id).join("|");
    }
    const list = creatorsData?.data;
    if (!Array.isArray(list)) return "";
    return list.map((row) => row?.creator?.id ?? row?.id ?? "").join("|");
  }, [isIndividualMode, normalizedIndividualContracts, creatorsData?.data]);

  useEffect(() => {
    if (onClearCreator) {
      onClearCreator();
    }
  }, [isIndividualMode]);

  useEffect(() => {
    const campaignKey = selectedCampaign?.id || "none";
    if (
      displaySuccess &&
      displayCreators.length > 0 &&
      !selectedCreator &&
      selectedCampaign &&
      autoSelectedRef.current !== campaignKey
    ) {
      autoSelectedRef.current = campaignKey;
      if (onCreatorSelect) {
        onCreatorSelect(
          displayCreators[0],
          isCompleted ? { suppressMobileDetail: true } : undefined
        );
      }
    }

    if (!selectedCampaign) {
      autoSelectedRef.current = null;
    }
  }, [
    displaySuccess,
    appliedCreatorsFingerprint,
    selectedCreator,
    selectedCampaign,
    onCreatorSelect,
    isMultiCreator,
    isCompleted,
  ]);

  return {
    creators: displayCreators,
    creatorsLoading: displayLoading,
    creatorsSuccess: displaySuccess,
    creatorsError: displayError,
    creatorsListCampaignId,
    isMultiCreator,
    isIndividualMode,
    getSuccessRateColor,
    formatFollowers,
    getPlatformIcon,
    getPlatformColor,
    handleSortChange,
    openBrandCalendar,
    closeBrandCalendar,
    openTaskManagerModal,
    closeTaskManagerModal,
    handleCreatorRowClick,
    showBrandCalendar,
    setShowBrandCalendar,
    showTaskManager,
    setShowTaskManager,
  };
};
