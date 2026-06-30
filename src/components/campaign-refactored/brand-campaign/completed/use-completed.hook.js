import { useState, useEffect, useLayoutEffect, useCallback, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBrandCampaigns, getAppliedCreators } from "@/provider/features/campaigns/campaigns.slice";
import {
  setSelectedCampaign as setSelectedCampaignContext,
  setBrandCampaignMultiCreatorMode,
} from "@/provider/features/campaign-context/campaign-context.slice";
import { getIndividualCollaborationContracts } from "@/provider/features/contracts/contracts.slice";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import {
  resolveEffectiveCollaborationType,
  isIndividualCollaborationFlow,
  isCampaignCompatibleWithOverviewToggle,
  isCompletedAppliedCreatorsFiltersKey,
} from "@/common/utils/brand-campaign-context.utils";
import { isMobileViewport } from "@/common/utils/viewport.utils";
import {
  resetCampaignDemographics,
  resetAudience,
  resetPerformanceMetrics,
} from "@/provider/features/phyllo/phyllo.slice";
import { mapBrandAppliedCreatorRow } from "@/common/utils/map-brand-applied-creator-row.util";
import { sortCreatorsByUrgency } from "@/common/utils/creator-urgency.util";
import { refreshBrandPipelineData } from "@/common/utils/pipeline-refresh.util";
import usePipelineBackgroundRefresh from "@/common/hooks/use-pipeline-background-refresh.hook";

export default function useCompleted(disableAutoSelect = false) {
  const dispatch = useDispatch();

  const hasAutoSelected = useRef(false);
  const hasRestoredFromContext = useRef(false);
  const lastRestoredCampaignIdRef = useRef(null);
  const hasRequestedBrandCampaignsRef = useRef(false);
  const skipMultiCreatorAutoSelectRef = useRef(false);
  const lastSelectedCampaignIdRef = useRef(null);

  const campaignCtx = useSelector((state) => state.campaignContext || {});
  const { selectedCampaignId, selectedCollaborationType } = campaignCtx;
  const isMultiCreator = campaignCtx.isBrandCampaignMultiCreatorMode ?? true;

  const {
    isLoading: campaignsLoading,
    isSuccess: campaignsSuccess,
    isError: campaignsError,
    data: campaignsData,
  } = useSelector((state) => state.campaigns.getAllBrandCampaigns || {});

  const {
    isLoading: creatorsLoading,
    isSuccess: creatorsSuccess,
    isError: creatorsError,
    data: creatorsData,
    campaignId: creatorsListCampaignId,
    filtersKey: creatorsListFiltersKey,
  } = useSelector((state) => state.campaigns.getAppliedCreators || {});

  const {
    data: individualContractsData,
    isSuccess: individualContractsSuccess,
    isError: individualContractsError,
    isLoading: individualContractsLoading,
    isCompleted: individualContractsIsCompleted,
  } = useSelector((state) => state.contracts.getIndividualCollaborationContracts || {});

  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [currentSort, setCurrentSort] = useState("urgency");
  const [campaignOptions, setCampaignOptions] = useState([]);
  const [budgetData, setBudgetData] = useState({
    totalBudget: 0,
    spent: 0,
    remaining: 0,
    saved: 0,
  });
  const [deliverables, setDeliverables] = useState([]);
  const [mobilePane, setMobilePane] = useState("creators");
  const [viewMode, setViewMode] = useState("standard");
  const [pipelineRefreshToken, setPipelineRefreshToken] = useState(0);
  const [isIndividualBootstrapping, setIsIndividualBootstrapping] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    totalViews: 0,
    totalEngagement: 0,
    engagementRate: 0,
    costPerEngagement: 0,
  });

  useLayoutEffect(() => {
    if (isMobileViewport()) {
      setMobilePane("creators");
    }
  }, []);

  useEffect(() => {
    if (campaignsLoading || campaignsSuccess || hasRequestedBrandCampaignsRef.current) return;
    hasRequestedBrandCampaignsRef.current = true;
    dispatch(getAllBrandCampaigns());
  }, [dispatch, campaignsLoading, campaignsSuccess]);

  useEffect(() => {
    if (disableAutoSelect) return;
    if (!isMultiCreator) {
      dispatch(getIndividualCollaborationContracts(true));
    }
  }, [dispatch, isMultiCreator, disableAutoSelect]);

  useEffect(() => {
    if (isMultiCreator) return;
    if (individualContractsIsCompleted !== true && !individualContractsLoading) {
      setIsIndividualBootstrapping(true);
    }
  }, [isMultiCreator, individualContractsIsCompleted, individualContractsLoading]);

  useEffect(() => {
    if (!selectedCreator && mobilePane === "detail") {
      setMobilePane("creators");
    }
  }, [selectedCreator, mobilePane]);

  useEffect(() => {
    const campaignId = selectedCampaign?.id ?? null;
    if (campaignId === lastSelectedCampaignIdRef.current) return;
    lastSelectedCampaignIdRef.current = campaignId;
    setSelectedCreator(null);
    skipMultiCreatorAutoSelectRef.current = false;
    hasAutoSelected.current = null;
  }, [selectedCampaign?.id]);

  useEffect(() => {
    if (!selectedCampaign) {
      setBudgetData({ totalBudget: 0, spent: 0, remaining: 0, saved: 0 });
      return;
    }
    const totalBudget = Number(selectedCampaign.budget) || 0;
    const spent = Number(selectedCampaign.used_budget) || 0;
    const remaining = Number(selectedCampaign.remaining_budget) || 0;
    setBudgetData({
      totalBudget,
      spent,
      remaining,
      saved: Math.max(0, remaining),
    });
  }, [
    selectedCampaign?.id,
    selectedCampaign?.budget,
    selectedCampaign?.used_budget,
    selectedCampaign?.remaining_budget,
  ]);

  useEffect(() => {
    if (selectedCampaign) return;
    setBudgetData({ totalBudget: 0, spent: 0, remaining: 0, saved: 0 });
    setPerformanceMetrics({
      totalViews: 0,
      totalEngagement: 0,
      engagementRate: 0,
      costPerEngagement: 0,
    });
  }, [selectedCampaign]);

  useEffect(() => {
    if (selectedCampaignId !== lastRestoredCampaignIdRef.current) {
      hasRestoredFromContext.current = false;
    }
  }, [selectedCampaignId]);

  useEffect(() => {
    if (
      campaignsSuccess &&
      campaignsData?.data &&
      selectedCampaignId &&
      !hasRestoredFromContext.current
    ) {
      const allCampaigns = Array.isArray(campaignsData.data) ? campaignsData.data : [];
      const completedCampaigns = allCampaigns.filter(
        (c) =>
          c.status === "COMPLETE" ||
          (Array.isArray(c.creators) && c.creators.some((cr) => cr.status === "COMPLETED"))
      );
      const restoredCampaign = completedCampaigns.find((c) => c.id === selectedCampaignId);
      if (restoredCampaign) {
        const effectiveType = resolveEffectiveCollaborationType(
          restoredCampaign,
          selectedCollaborationType
        );
        if (isCampaignCompatibleWithOverviewToggle(isMultiCreator, effectiveType)) {
          setSelectedCampaign(restoredCampaign);
          hasAutoSelected.current = true;
          hasRestoredFromContext.current = true;
          lastRestoredCampaignIdRef.current = selectedCampaignId;
        } else {
          hasRestoredFromContext.current = true;
          lastRestoredCampaignIdRef.current = selectedCampaignId;
        }
      } else {
        hasRestoredFromContext.current = true;
      }
    } else if (!selectedCampaignId) {
      lastRestoredCampaignIdRef.current = null;
      hasRestoredFromContext.current = false;
    }
  }, [
    campaignsSuccess,
    campaignsData,
    selectedCampaignId,
    selectedCollaborationType,
    isMultiCreator,
  ]);

  useEffect(() => {
    if (!selectedCampaign?.id) return;
    const effectiveType = resolveEffectiveCollaborationType(
      selectedCampaign,
      selectedCollaborationType
    );
    if (isCampaignCompatibleWithOverviewToggle(isMultiCreator, effectiveType)) return;

    setSelectedCampaign(null);
    setSelectedCreator(null);
    hasAutoSelected.current = false;
    skipMultiCreatorAutoSelectRef.current = false;
    dispatch(
      setSelectedCampaignContext({
        campaignId: null,
        collaborationType: null,
      })
    );
  }, [
    isMultiCreator,
    selectedCampaign?.id,
    selectedCampaign?.collaboration_type,
    selectedCollaborationType,
    dispatch,
  ]);

  useEffect(() => {
    if (campaignsSuccess && campaignsData?.data) {
      const options = allCampaigns.map((campaign) => ({
        value: campaign.id,
        label: campaign.campaign_title || "Untitled Campaign",
        campaign: campaign,
      }));
      setCampaignOptions(options);
    } else if (campaignsSuccess) {
      setCampaignOptions([]);
    }
  }, [campaignsSuccess, campaignsData?.data]);

  useEffect(() => {
    if (!campaignsSuccess || allCampaigns.length === 0) return;

    const localSelectedId = selectedCampaign?.id;

    if (localSelectedId && !allCampaigns.some((c) => c.id === localSelectedId)) {
      if (!hasAutoSelected.current) {
        setSelectedCampaign(allCampaigns[0]);
        hasAutoSelected.current = true;
      }
      return;
    }

    if (
      !disableAutoSelect &&
      isMultiCreator &&
      !localSelectedId &&
      !hasAutoSelected.current &&
      (hasRestoredFromContext.current || !selectedCampaignId)
    ) {
      const firstMulti = allCampaigns.find(
        (c) =>
          (c.collaboration_type || COLLABORATION_TYPE.MULTI_CREATOR) ===
          COLLABORATION_TYPE.MULTI_CREATOR
      );
      if (!firstMulti) return;
      setSelectedCampaign(firstMulti);
      hasAutoSelected.current = true;
      dispatch(
        setSelectedCampaignContext({
          campaignId: firstMulti.id,
          collaborationType: firstMulti.collaboration_type || null,
        })
      );
    }
  }, [campaignsSuccess, campaignsData?.data, selectedCampaign?.id, disableAutoSelect, dispatch, isMultiCreator, selectedCampaignId]);

  useEffect(() => {
    if (disableAutoSelect) return;
    if (!selectedCampaign?.id) return;
    const effectiveType = resolveEffectiveCollaborationType(
      selectedCampaign,
      selectedCollaborationType
    );
    if (isIndividualCollaborationFlow(isMultiCreator, effectiveType)) return;

    dispatch(
      getAppliedCreators({
        campaignId: selectedCampaign.id,
        filters: { status: "COMPLETED", sort: currentSort },
      })
    );
  }, [
    selectedCampaign,
    selectedCollaborationType,
    isMultiCreator,
    dispatch,
    disableAutoSelect,
    currentSort,
  ]);

  useEffect(() => {
    if (disableAutoSelect) return;
    if (!selectedCampaign?.id) return;
    const effectiveType = resolveEffectiveCollaborationType(
      selectedCampaign,
      selectedCollaborationType
    );
    if (isIndividualCollaborationFlow(isMultiCreator, effectiveType)) return;
    if (String(creatorsListCampaignId) !== String(selectedCampaign.id)) return;
    if (!creatorsSuccess && !creatorsError) return;

    const creators = Array.isArray(creatorsData?.data) ? creatorsData.data : [];
    setDeliverables(selectedCampaign.deliverables || []);

    const totalViews = creators.reduce((sum, creator) => sum + (creator.total_views || 0), 0);
    const totalEngagement = creators.reduce(
      (sum, creator) => sum + (creator.total_engagement || 0),
      0
    );
    const spent = Number(selectedCampaign.used_budget) || 0;
    const engagementRate = totalViews > 0 ? (totalEngagement / totalViews) * 100 : 0;
    const costPerEngagement = totalEngagement > 0 ? spent / totalEngagement : 0;

    setPerformanceMetrics({
      totalViews,
      totalEngagement,
      engagementRate,
      costPerEngagement,
    });

    if (creators.length === 0) {
      setSelectedCreator(null);
    }
  }, [
    disableAutoSelect,
    creatorsSuccess,
    creatorsError,
    creatorsData,
    creatorsListCampaignId,
    selectedCampaign?.id,
    selectedCampaign?.deliverables,
    selectedCampaign?.used_budget,
    selectedCollaborationType,
    isMultiCreator,
  ]);

  useEffect(() => {
    if (disableAutoSelect) return;
    if (viewMode === "board") return;
    if (!selectedCampaign?.id) return;
    const effectiveType = resolveEffectiveCollaborationType(
      selectedCampaign,
      selectedCollaborationType
    );
    if (!isIndividualCollaborationFlow(isMultiCreator, effectiveType)) return;
    if (!individualContractsSuccess && !individualContractsError) return;

    const contracts = (Array.isArray(individualContractsData)
      ? individualContractsData
      : Array.isArray(individualContractsData?.data)
        ? individualContractsData.data
        : []
    ).filter((contract) => {
      const contractCampaignId = contract.campaignId || contract.campaign?.id;
      return String(contractCampaignId) === String(selectedCampaign.id);
    });

    if (contracts.length === 0) {
      setSelectedCreator(null);
      return;
    }

    const firstContract = contracts[0];
    const creator = firstContract.creator;
    const profile = creator?.creator_profile;
    const mappedCreator = {
      id: firstContract.id,
      contractId: firstContract.id,
      contract: firstContract,
      campaign_id: firstContract.campaignId || firstContract.campaign?.id,
      campaign: firstContract.campaign,
      creatorUserId: creator?.id,
      creator,
      name: `${creator?.first_name || ""} ${creator?.last_name || ""}`.trim() || "Creator",
      image: profile?.profile_photo_url,
      bio: profile?.bio,
    };

    const selectionValid =
      selectedCreator &&
      contracts.some(
        (c) =>
          c.id === selectedCreator.contractId ||
          c.id === selectedCreator.id ||
          c.creator?.id === selectedCreator.creatorUserId
      );

    if (selectionValid) return;

    setSelectedCreator(mappedCreator);
    if (isMobileViewport()) {
      setMobilePane((prev) => (prev === "detail" ? "creators" : prev));
    }
  }, [
    disableAutoSelect,
    selectedCampaign?.id,
    selectedCollaborationType,
    isMultiCreator,
    individualContractsSuccess,
    individualContractsError,
    individualContractsData,
    selectedCreator,
    viewMode,
  ]);

  const handleCampaignSelect = useCallback(
    (campaign) => {
      setSelectedCampaign(campaign);
      setSelectedCreator(null);
      hasAutoSelected.current = null;

      if (campaign) {
        dispatch(
          setSelectedCampaignContext({
            campaignId: campaign.id || null,
            collaborationType: campaign.collaboration_type || null,
          })
        );
      } else {
        dispatch(
          setSelectedCampaignContext({
            campaignId: null,
            collaborationType: null,
          })
        );
      }

      if (!campaign) {
        if (isMobileViewport()) {
          setMobilePane("overview");
        }
      }

      if (campaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR) {
        if (isMobileViewport()) {
          setMobilePane("creators");
        }
        return;
      }

      if (campaign?.id && !disableAutoSelect) {
        dispatch(
          getAppliedCreators({
            campaignId: campaign.id,
            filters: { status: "COMPLETED", sort: currentSort },
          })
        );
      }

      if (campaign && isMobileViewport()) {
        setMobilePane("creators");
      }
    },
    [dispatch, disableAutoSelect, currentSort]
  );

  const handleCreatorSelect = useCallback(
    (creator, options) => {
      setSelectedCreator(creator);

      if (!isMultiCreator && creator?.campaign_id && !selectedCampaign) {
        const individualCampaign = {
          id: creator.campaign_id,
          collaboration_type: COLLABORATION_TYPE.INDIVIDUAL_CREATOR,
          campaign_title: creator.campaign?.campaign_title || "Individual Collaboration",
          campaign: creator.campaign,
          created_by: creator.campaign?.created_by,
          brand: creator.campaign?.created_by,
        };
        setSelectedCampaign(individualCampaign);
        dispatch(
          setSelectedCampaignContext({
            campaignId: individualCampaign.id,
            collaborationType: COLLABORATION_TYPE.INDIVIDUAL_CREATOR,
          })
        );
      }

      if (isMobileViewport() && !options?.suppressMobileDetail) {
        setMobilePane("detail");
      }
    },
    [isMultiCreator, selectedCampaign, dispatch]
  );

  const handleClearCreator = useCallback(() => {
    setSelectedCreator(null);
    hasAutoSelected.current = null;
    skipMultiCreatorAutoSelectRef.current = true;
    if (isMobileViewport()) {
      setMobilePane((prev) => (prev === "detail" ? "creators" : prev));
    }
  }, [selectedCampaign?.id]);

  const handleToggleChange = useCallback(
    (newIsMultiCreator) => {
      if (newIsMultiCreator === false) {
        setIsIndividualBootstrapping(true);
        dispatch(getIndividualCollaborationContracts(true));
      } else {
        setIsIndividualBootstrapping(false);
      }

      dispatch(setBrandCampaignMultiCreatorMode(newIsMultiCreator));
      setSelectedCampaign(null);
      setSelectedCreator(null);
      hasAutoSelected.current = false;
      hasRestoredFromContext.current = false;
      skipMultiCreatorAutoSelectRef.current = false;
      dispatch(
        setSelectedCampaignContext({
          campaignId: null,
          collaborationType: null,
        })
      );
      dispatch(resetCampaignDemographics());
      dispatch(resetAudience());
      dispatch(resetPerformanceMetrics());
      setMobilePane("creators");
    },
    [dispatch]
  );

  const goToCreatorsPane = useCallback(() => {
    setMobilePane("creators");
  }, []);

  const backFromCreatorsToOverview = useCallback(() => {
    setMobilePane("overview");
  }, []);

  const backFromDetailToCreators = useCallback(() => {
    setSelectedCreator(null);
    hasAutoSelected.current = null;
    setMobilePane("creators");
  }, []);

  const handleSortChange = useCallback(
    (sortValue) => {
      setCurrentSort(sortValue);
      if (
        selectedCampaign?.id &&
        resolveEffectiveCollaborationType(selectedCampaign, selectedCollaborationType) !==
          COLLABORATION_TYPE.INDIVIDUAL_CREATOR
      ) {
        dispatch(
          getAppliedCreators({
            campaignId: selectedCampaign.id,
            filters: { status: "COMPLETED", sort: sortValue },
          })
        );
      }
    },
    [selectedCampaign, selectedCollaborationType, dispatch]
  );

  const refreshPipelineData = useCallback(() => {
    refreshBrandPipelineData(dispatch, {
      campaignId: selectedCampaign?.id,
      collaborationType: selectedCampaign?.collaboration_type,
      isMultiCreator,
      completedFilters: { status: "COMPLETED", sort: currentSort },
      includeCompleted: true,
      includeActive: false,
      includeBoard: viewMode === "board",
      silent: true,
    });
    setPipelineRefreshToken((token) => token + 1);
  }, [
    dispatch,
    selectedCampaign?.id,
    selectedCampaign?.collaboration_type,
    isMultiCreator,
    currentSort,
    viewMode,
  ]);

  const handleOpenBoard = useCallback(() => {
    setViewMode("board");
    setSelectedCreator(null);
    skipMultiCreatorAutoSelectRef.current = true;
    setMobilePane("creators");
  }, []);

  const handleCloseBoard = useCallback(() => {
    setViewMode("standard");
    skipMultiCreatorAutoSelectRef.current = false;
    hasAutoSelected.current = false;
  }, []);

  usePipelineBackgroundRefresh({
    enabled: Boolean(selectedCampaign?.id),
    campaignId: selectedCampaign?.id,
    collaborationType: selectedCampaign?.collaboration_type,
    isMultiCreator,
    completedFilters: { status: "COMPLETED", sort: currentSort },
    includeCompleted: true,
    includeActive: false,
    includeBoard: viewMode === "board",
  });

  const formatCurrency = useCallback((amount) => {
    const value = Number(amount);
    if (value !== value) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }, []);

  const formatNumber = useCallback((num) => {
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(1)}M`;
    }
    if (num >= 1_000) {
      return `${(num / 1_000).toFixed(0)}K`;
    }
    return num.toString();
  }, []);

  const allCampaigns = useMemo(() => {
    if (!campaignsSuccess || !campaignsData?.data) return [];
    const list = Array.isArray(campaignsData.data) ? campaignsData.data : [];
    return list.filter(
      (c) =>
        c.status === "COMPLETE" ||
        (Array.isArray(c.creators) && c.creators.some((cr) => cr.status === "COMPLETED"))
    );
  }, [campaignsSuccess, campaignsData?.data]);

  const effectiveCollaborationType = useMemo(
    () => resolveEffectiveCollaborationType(selectedCampaign, selectedCollaborationType),
    [selectedCampaign, selectedCollaborationType]
  );

  const isIndividualCreator = useMemo(
    () => isIndividualCollaborationFlow(isMultiCreator, effectiveCollaborationType),
    [isMultiCreator, effectiveCollaborationType]
  );

  const isLoading = useMemo(
    () => (isIndividualCreator ? individualContractsLoading : creatorsLoading),
    [isIndividualCreator, individualContractsLoading, creatorsLoading]
  );

  const normalizedIndividualContracts = useMemo(() => {
    if (Array.isArray(individualContractsData)) return individualContractsData;
    if (Array.isArray(individualContractsData?.data)) return individualContractsData.data;
    return [];
  }, [individualContractsData]);

  const completedCreatorsForCampaign = useMemo(() => {
    if (!selectedCampaign?.id || isIndividualCreator) return [];
    if (String(creatorsListCampaignId) !== String(selectedCampaign.id)) return [];
    if (!creatorsSuccess || creatorsLoading) return [];
    if (!isCompletedAppliedCreatorsFiltersKey(creatorsListFiltersKey)) return [];
    return Array.isArray(creatorsData?.data) ? creatorsData.data : [];
  }, [
    selectedCampaign?.id,
    isIndividualCreator,
    creatorsListCampaignId,
    creatorsSuccess,
    creatorsLoading,
    creatorsListFiltersKey,
    creatorsData?.data,
  ]);

  const individualCreatorsForCampaign = useMemo(() => {
    if (!isIndividualCreator || !selectedCampaign?.id) return [];
    return normalizedIndividualContracts.filter((contract) => {
      const contractCampaignId = contract.campaignId || contract.campaign?.id;
      return String(contractCampaignId) === String(selectedCampaign.id);
    });
  }, [isIndividualCreator, selectedCampaign?.id, normalizedIndividualContracts]);

  const creatorsListReady = useMemo(() => {
    if (!selectedCampaign?.id && !isIndividualCreator) return false;
    if (isIndividualCreator) {
      return individualContractsSuccess || individualContractsError;
    }
    return (
      (creatorsSuccess || creatorsError) &&
      !creatorsLoading &&
      String(creatorsListCampaignId) === String(selectedCampaign.id) &&
      isCompletedAppliedCreatorsFiltersKey(creatorsListFiltersKey)
    );
  }, [
    selectedCampaign?.id,
    isIndividualCreator,
    individualContractsSuccess,
    individualContractsError,
    creatorsSuccess,
    creatorsError,
    creatorsLoading,
    creatorsListCampaignId,
    creatorsListFiltersKey,
  ]);

  const hasCompletedCreators = useMemo(
    () =>
      isIndividualCreator
        ? individualCreatorsForCampaign.length > 0
        : completedCreatorsForCampaign.length > 0,
    [isIndividualCreator, individualCreatorsForCampaign.length, completedCreatorsForCampaign.length]
  );

  const completedIndividualContracts = useMemo(
    () =>
      normalizedIndividualContracts.filter((contract) => contract.campaign?.status === "COMPLETE"),
    [normalizedIndividualContracts]
  );

  const hasCompletedIndividualContracts = completedIndividualContracts.length > 0;

  useEffect(() => {
    if (disableAutoSelect) return;
    if (isMultiCreator) return;
    if (selectedCampaign?.id) return;
    if (!individualContractsSuccess || individualContractsIsCompleted !== true) return;
    if (completedIndividualContracts.length === 0) return;
    if (hasAutoSelected.current) return;

    const firstContract = completedIndividualContracts[0];
    const firstCampaignId = firstContract.campaignId || firstContract.campaign?.id;
    const individualCampaign = {
      id: firstCampaignId || `individual-${firstContract.id}`,
      collaboration_type: COLLABORATION_TYPE.INDIVIDUAL_CREATOR,
      campaign_title: firstContract.campaign?.campaign_title || "Individual Collaboration",
      campaign: firstContract.campaign,
      contract: firstContract,
      creator: firstContract.creator,
      created_by: firstContract.campaign?.created_by,
      brand: firstContract.campaign?.created_by,
    };

    setSelectedCampaign(individualCampaign);
    hasAutoSelected.current = true;
    dispatch(
      setSelectedCampaignContext({
        campaignId: individualCampaign.id,
        collaborationType: COLLABORATION_TYPE.INDIVIDUAL_CREATOR,
      })
    );
  }, [
    disableAutoSelect,
    isMultiCreator,
    selectedCampaign?.id,
    individualContractsSuccess,
    individualContractsIsCompleted,
    completedIndividualContracts,
    dispatch,
  ]);

  useEffect(() => {
    if (disableAutoSelect) return;
    if (!selectedCampaign?.id) return;
    const effectiveType = resolveEffectiveCollaborationType(
      selectedCampaign,
      selectedCollaborationType
    );
    if (isIndividualCollaborationFlow(isMultiCreator, effectiveType)) return;
    if (creatorsListReady || creatorsLoading) return;
    if (
      String(creatorsListCampaignId) === String(selectedCampaign.id) &&
      isCompletedAppliedCreatorsFiltersKey(creatorsListFiltersKey)
    ) {
      return;
    }

    dispatch(
      getAppliedCreators({
        campaignId: selectedCampaign.id,
        filters: { status: "COMPLETED", sort: currentSort },
      })
    );
  }, [
    disableAutoSelect,
    selectedCampaign,
    selectedCollaborationType,
    isMultiCreator,
    dispatch,
    currentSort,
    creatorsListReady,
    creatorsLoading,
    creatorsListCampaignId,
    creatorsListFiltersKey,
  ]);

  const multiCompletedCampaigns = useMemo(
    () =>
      allCampaigns.filter(
        (c) =>
          (c.collaboration_type || COLLABORATION_TYPE.MULTI_CREATOR) ===
          COLLABORATION_TYPE.MULTI_CREATOR
      ),
    [allCampaigns]
  );

  const hasValidCompletedIndividualContracts =
    individualContractsSuccess && individualContractsIsCompleted === true;

  const isAwaitingInitialData = useMemo(() => {
    if (isIndividualBootstrapping) return true;

    if (isIndividualCreator) {
      if (individualContractsLoading) return true;
      if (!individualContractsSuccess && !individualContractsError) return true;
      if (!hasValidCompletedIndividualContracts) return true;
      if (hasCompletedIndividualContracts && !selectedCampaign) return true;
      return false;
    }

    if (!campaignsSuccess && !campaignsError) return true;
    if (!selectedCampaign) {
      return multiCompletedCampaigns.length > 0;
    }

    return creatorsLoading || !creatorsListReady;
  }, [
    isIndividualBootstrapping,
    isIndividualCreator,
    individualContractsLoading,
    individualContractsSuccess,
    individualContractsError,
    hasValidCompletedIndividualContracts,
    hasCompletedIndividualContracts,
    selectedCampaign,
    campaignsSuccess,
    campaignsError,
    multiCompletedCampaigns.length,
    creatorsLoading,
    creatorsListReady,
  ]);

  useEffect(() => {
    if (!isIndividualBootstrapping) return;

    if (!isIndividualCreator) {
      setIsIndividualBootstrapping(false);
      return;
    }

    if (individualContractsLoading) return;

    if (!individualContractsSuccess && !individualContractsError) return;

    if (!hasValidCompletedIndividualContracts) return;

    if (selectedCampaign || !hasCompletedIndividualContracts) {
      setIsIndividualBootstrapping(false);
    }
  }, [
    isIndividualBootstrapping,
    isIndividualCreator,
    individualContractsLoading,
    individualContractsSuccess,
    individualContractsError,
    hasValidCompletedIndividualContracts,
    hasCompletedIndividualContracts,
    selectedCampaign,
  ]);

  const showEmptyState = useMemo(() => {
    if (isAwaitingInitialData) return false;

    if (isIndividualCreator) {
      if (!individualContractsSuccess && !individualContractsError) return false;
      if (!selectedCampaign) {
        return !hasCompletedIndividualContracts;
      }
      return creatorsListReady && !hasCompletedCreators;
    }
    return Boolean(selectedCampaign?.id) && creatorsListReady && !hasCompletedCreators;
  }, [
    isAwaitingInitialData,
    isIndividualCreator,
    individualContractsSuccess,
    individualContractsError,
    selectedCampaign?.id,
    creatorsListReady,
    hasCompletedCreators,
    hasCompletedIndividualContracts,
  ]);

  const awaitingCreatorsList = isAwaitingInitialData;

  useEffect(() => {
    if (!awaitingCreatorsList) return;
    setSelectedCreator(null);
    skipMultiCreatorAutoSelectRef.current = false;
  }, [awaitingCreatorsList, selectedCampaign?.id]);

  useEffect(() => {
    if (disableAutoSelect) return;
    if (viewMode === "board") return;
    if (isIndividualCreator) return;
    if (!creatorsListReady || !hasCompletedCreators || creatorsLoading) return;
    if (selectedCreator) {
      const stillValid = completedCreatorsForCampaign.some((row) => {
        const creatorUserId = row?.creator?.id;
        const profileId = row?.creator?.creator_profile?.id;
        return (
          creatorUserId === selectedCreator.creatorUserId ||
          creatorUserId === selectedCreator.creator?.id ||
          profileId === selectedCreator.id
        );
      });
      if (!stillValid) {
        setSelectedCreator(null);
      }
      return;
    }
    if (skipMultiCreatorAutoSelectRef.current) return;

    const ordered =
      currentSort === "urgency"
        ? sortCreatorsByUrgency(completedCreatorsForCampaign)
        : completedCreatorsForCampaign;
    const mapped = mapBrandAppliedCreatorRow(ordered[0]);
    if (!mapped) return;

    handleCreatorSelect(mapped, { suppressMobileDetail: true });
  }, [
    disableAutoSelect,
    isIndividualCreator,
    creatorsListReady,
    hasCompletedCreators,
    creatorsLoading,
    selectedCreator,
    completedCreatorsForCampaign,
    handleCreatorSelect,
    selectedCampaign?.id,
    currentSort,
    viewMode,
  ]);

  return {
    campaignsLoading,
    campaignsSuccess,
    campaignsError,
    campaignOptions,
    selectedCampaign,
    selectedCreator,
    isMultiCreator,
    currentSort,
    mobilePane,
    creatorsLoading,
    creatorsSuccess,
    creatorsError,
    creators: completedCreatorsForCampaign,
    completedCreatorsForCampaign,
    creatorsListReady,
    hasCompletedCreators,
    showEmptyState,
    awaitingCreatorsList,
    isAwaitingInitialData,
    budgetData,
    deliverables,
    performanceMetrics,
    handleCampaignSelect,
    handleCreatorSelect,
    handleClearCreator,
    handleToggleChange,
    handleSortChange,
    refreshPipelineData,
    handleOpenBoard,
    handleCloseBoard,
    viewMode,
    pipelineRefreshToken,
    goToCreatorsPane,
    backFromCreatorsToOverview,
    backFromDetailToCreators,
    formatCurrency,
    formatNumber,
    isLoading,
    isIndividualCreator,
    hasData: selectedCampaign && Array.isArray(creatorsData?.data) && creatorsData.data.length > 0,
  };
}
