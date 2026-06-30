import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import useUrgencyTick from "@/common/hooks/use-urgency-tick.hook";
import { mapBrandAppliedCreatorRow } from "@/common/utils/map-brand-applied-creator-row.util";
import {
  applyLivePipelineUrgency,
  resolveCreatorUrgency,
  sortCreatorsByUrgency,
} from "@/common/utils/creator-urgency.util";
import { formatCreatorLocation } from "@/common/utils/creator-location.util";
import { getAge } from "@/common/utils/date.utils";
import {
  buildConnectedPlatformsFromCreatorUser,
  buildConnectedPlatformsFromPhylloAccounts,
  ratingAndReviewCountFromCreatorUser,
} from "@/common/utils/creator-platforms.utils";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import {
  resolveEffectiveCollaborationType,
  isIndividualCollaborationFlow,
  isCompletedAppliedCreatorsFiltersKey,
  individualContractsScopeMatches,
  individualContractsForPhase,
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
  onSortChange,
  currentSort = "urgency"
) => {
  const [showBrandCalendar, setShowBrandCalendar] = useState(false);
  const [showTaskManager, setShowTaskManager] = useState(false);
  const urgencyTick = useUrgencyTick();
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

  const effectiveCollaborationType = useMemo(
    () => resolveEffectiveCollaborationType(selectedCampaign, selectedCollaborationTypeFromContext),
    [selectedCampaign, selectedCollaborationTypeFromContext]
  );

  const isIndividualMode = useMemo(
    () => isIndividualCollaborationFlow(isMultiCreator, effectiveCollaborationType),
    [isMultiCreator, effectiveCollaborationType]
  );

  const {
    isLoading: creatorsLoading,
    isSuccess: creatorsSuccess,
    isError: creatorsError,
    data: creatorsData,
    campaignId: creatorsListCampaignId,
    filtersKey: creatorsListFiltersKey,
  } = useSelector(
    (state) =>
      (isCompleted ? state.campaigns.getAppliedCreators : state.campaigns.getHiredCreators) || {}
  );

  const {
    isLoading: individualContractsLoading,
    isSuccess: individualContractsSuccess,
    isError: individualContractsError,
    data: individualContractsData,
    isCompleted: individualContractsIsCompleted,
  } = useSelector((state) => state.contracts.getIndividualCollaborationContracts || {});

  const normalizedIndividualContracts = useMemo(() => {
    if (Array.isArray(individualContractsData)) return individualContractsData;
    if (Array.isArray(individualContractsData?.data)) return individualContractsData.data;
    return [];
  }, [individualContractsData]);

  const scopedIndividualContracts = useMemo(() => {
    if (!isIndividualMode) return [];
    if (!individualContractsScopeMatches(isCompleted, individualContractsIsCompleted)) {
      return [];
    }
    return individualContractsForPhase(normalizedIndividualContracts, isCompleted);
  }, [
    isIndividualMode,
    isCompleted,
    individualContractsIsCompleted,
    normalizedIndividualContracts,
  ]);

  const individualContractsReady =
    individualContractsSuccess &&
    individualContractsScopeMatches(isCompleted, individualContractsIsCompleted);

  const prevIsIndividualModeRef = useRef(isIndividualMode);

  const individualCreators = useMemo(() => {
    if (!isIndividualMode || scopedIndividualContracts.length === 0) {
      return [];
    }

    return scopedIndividualContracts
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

        const pipeline = contract.pipeline;
        const urgency = resolveCreatorUrgency({ pipeline });

        const connectedPlatforms = buildConnectedPlatformsFromCreatorUser(mergedCreator);
        const phylloConnected =
          mergedCreator?.id && phylloAccountsByCreatorId[mergedCreator.id]
            ? buildConnectedPlatformsFromPhylloAccounts(phylloAccountsByCreatorId[mergedCreator.id])
            : null;
        const platformData = phylloConnected?.hasConnectedSocialAccounts
          ? phylloConnected
          : connectedPlatforms;

        return {
          id: contract.id,
          contractId: contract.id,
          campaign_id: contract.campaignId || contract.campaign?.id,
          campaign: contract.campaign,
          age: getAge(mergedCreator?.date_of_birth),
          creatorUserId: mergedCreator?.id || creator?.id,
          creator: mergedCreator || creator,
          pipeline,
          urgencyLabel: urgency.label,
          urgencyTier: urgency.tier,
          name:
            `${mergedCreator?.first_name || ""} ${mergedCreator?.last_name || ""}`.trim() ||
            "Unknown Creator",
          bio: creatorProfile?.bio || "No bio available",
          image: creatorProfile?.profile_photo_url,
          location:
            formatCreatorLocation({
              city: mergedCreator?.city,
              country: mergedCreator?.country,
              state: mergedCreator?.state,
              stateShort: mergedCreator?.state_short,
            }) || "Location not specified",
          totalSpent: contract.totalCompensation || 0,
          rating,
          reviewCount,
          platforms: platformData.platforms,
          platformStats: platformData.platformStats,
          hasConnectedSocialAccounts: platformData.hasConnectedSocialAccounts,
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
    scopedIndividualContracts,
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

  const mappedCreators = useMemo(() => {
    return Array.isArray(creatorsData?.data)
      ? creatorsData.data.map((row) => mapBrandAppliedCreatorRow(row)).filter(Boolean)
      : [];
  }, [creatorsData?.data]);

  const creators = useMemo(() => {
    urgencyTick;
    const withLiveUrgency = mappedCreators.map(applyLivePipelineUrgency);
    if (currentSort === "urgency") {
      return sortCreatorsByUrgency(withLiveUrgency);
    }
    return withLiveUrgency;
  }, [mappedCreators, urgencyTick, currentSort]);

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

  const sortedIndividualCreators = useMemo(() => {
    urgencyTick;
    const withLiveUrgency = individualCreators.map(applyLivePipelineUrgency);
    if (currentSort === "urgency") {
      return sortCreatorsByUrgency(withLiveUrgency);
    }
    return withLiveUrgency;
  }, [individualCreators, urgencyTick, currentSort]);

  const displayCreators = isIndividualMode ? sortedIndividualCreators : creators;

  const hasCompletedCreatorsList =
    isCompleted &&
    creatorsSuccess &&
    String(creatorsListCampaignId) === String(selectedCampaign?.id ?? "") &&
    isCompletedAppliedCreatorsFiltersKey(creatorsListFiltersKey);

  const resolvedCreatorsSuccess = isCompleted ? hasCompletedCreatorsList : creatorsSuccess;

  const awaitingAppliedCreators =
    !!selectedCampaign?.id &&
    !isIndividualMode &&
    !resolvedCreatorsSuccess &&
    !creatorsError &&
    !creatorsLoading;

  const showStaleCreatorsList =
    !!selectedCampaign?.id &&
    !isIndividualMode &&
    creatorsListCampaignId === selectedCampaign?.id &&
    Array.isArray(creatorsData?.data) &&
    creatorsData.data.length > 0 &&
    (!isCompleted || isCompletedAppliedCreatorsFiltersKey(creatorsListFiltersKey));

  const awaitingIndividualContracts =
    isIndividualMode &&
    !individualContractsReady &&
    !individualContractsError &&
    !individualContractsLoading;

  const displayLoading = isIndividualMode
    ? individualContractsLoading || awaitingIndividualContracts
    : (creatorsLoading && !showStaleCreatorsList) || awaitingAppliedCreators;
  const displaySuccess = isIndividualMode ? individualContractsReady : resolvedCreatorsSuccess;
  const displayError = isIndividualMode ? individualContractsError : creatorsError;

  const appliedCreatorsFingerprint = useMemo(() => {
    if (isIndividualMode) {
      return scopedIndividualContracts.map((c) => c.id).join("|");
    }
    const list = creatorsData?.data;
    if (!Array.isArray(list)) return "";
    return list.map((row) => row?.creator?.id ?? row?.id ?? "").join("|");
  }, [isIndividualMode, scopedIndividualContracts, creatorsData?.data]);

  useEffect(() => {
    if (prevIsIndividualModeRef.current === isIndividualMode) return;
    prevIsIndividualModeRef.current = isIndividualMode;
    onClearCreator?.();
  }, [isIndividualMode, onClearCreator]);

  useEffect(() => {
    const campaignKey = selectedCampaign?.id || "none";
    const creatorsMatchCampaign =
      isIndividualMode ||
      !selectedCampaign?.id ||
      String(creatorsListCampaignId) === String(selectedCampaign.id);

    if (
      displaySuccess &&
      creatorsMatchCampaign &&
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
    isIndividualMode,
    creatorsListCampaignId,
  ]);

  return {
    creators: displayCreators,
    creatorsLoading: displayLoading,
    creatorsSuccess: displaySuccess,
    creatorsError: displayError,
    creatorsListCampaignId,
    isMultiCreator,
    isIndividualMode,
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
