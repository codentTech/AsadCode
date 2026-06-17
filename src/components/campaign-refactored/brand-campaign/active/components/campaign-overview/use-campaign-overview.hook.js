import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import { getIndividualCollaborationContracts } from "@/provider/features/contracts/contracts.slice";
import { getAllBrandCampaigns, getAppliedCreators } from "@/provider/features/campaigns/campaigns.slice";
import { setSelectedCampaign as setSelectedCampaignContext } from "@/provider/features/campaign-context/campaign-context.slice";
import {
  fetchCreatorAudience,
  fetchCampaignCombinedDemographics,
  resetCampaignDemographics,
  resetAudience,
  selectCreatorAudience,
  selectCampaignCombinedDemographics,
} from "@/provider/features/phyllo/phyllo.slice";

const campaignIdKey = (id) => (id == null || id === "" ? null : String(id));

export default function useCampaignOverview(onCampaignSelect, onToggleChange) {
  const dispatch = useDispatch();
  const isMultiCreator = useSelector(
    (state) => state.campaignContext?.isBrandCampaignMultiCreatorMode ?? true
  );

  // Refs (brand + overview)
  const hasAutoSelected = useRef(false);
  const hasRestoredFromContext = useRef(false);
  const lastRestoredCampaignIdRef = useRef(null);
  const hasNotifiedParent = useRef(false);
  const hasAutoSelectedFiltered = useRef(false);
  const lastSelectedCampaignId = useRef(null);
  const hasAutoSelectedIndividual = useRef(false);
  const onCampaignSelectRef = useRef(onCampaignSelect);
  const onToggleChangeRef = useRef(onToggleChange);

  useEffect(() => {
    onCampaignSelectRef.current = onCampaignSelect;
  }, [onCampaignSelect]);

  useEffect(() => {
    onToggleChangeRef.current = onToggleChange;
  }, [onToggleChange]);

  const { selectedCampaignId } = useSelector((state) => state.campaignContext || {});
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
  } = useSelector((state) => state.campaigns.getAppliedCreators || {});

  const {
    data: individualContractsData,
    isSuccess: individualContractsSuccess,
    isLoading: individualContractsLoading,
  } = useSelector((state) => state.contracts.getIndividualCollaborationContracts || {});

  const normalizedIndividualContracts = Array.isArray(individualContractsData)
    ? individualContractsData
    : Array.isArray(individualContractsData?.data)
      ? individualContractsData.data
      : [];

  const campaignDemographics = useSelector(selectCampaignCombinedDemographics);
  const creatorAudience = useSelector(selectCreatorAudience);

  // Local state (from brand hook)
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [budgetData, setBudgetData] = useState({
    totalBudget: 0,
    spent: 0,
    remaining: 0,
    saved: 0,
  });
  const [deliverables, setDeliverables] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    totalViews: 0,
    totalEngagement: 0,
    engagementRate: 0,
    costPerEngagement: 0,
  });

  const campaignOptions = useMemo(() => {
    if (!campaignsSuccess || !campaignsData?.data) return [];
    const allCampaigns = Array.isArray(campaignsData.data) ? campaignsData.data : [];
    const activeCampaigns = allCampaigns.filter((campaign) => campaign.status !== "COMPLETE");
    return activeCampaigns.map((campaign) => ({
      value: campaign.id,
      label: campaign.campaign_title || "Untitled Campaign",
      campaign: campaign,
    }));
  }, [campaignsSuccess, campaignsData?.data]);

  // --- Brand: fetch campaigns on mount ---
  useEffect(() => {
    dispatch(getAllBrandCampaigns());
  }, [dispatch]);

  // --- Brand: reset restoration flag when context id changes ---
  useEffect(() => {
    const nextKey = campaignIdKey(selectedCampaignId);
    const prevKey = campaignIdKey(lastRestoredCampaignIdRef.current);
    if (nextKey !== prevKey) {
      hasRestoredFromContext.current = false;
    }
  }, [selectedCampaignId]);

  // --- Brand: restore selection from context (once per context id) ---
  useEffect(() => {
    if (!isMultiCreator) return;
    if (!campaignsSuccess || !campaignsData?.data || !selectedCampaignId) {
      if (!selectedCampaignId) {
        lastRestoredCampaignIdRef.current = null;
        hasRestoredFromContext.current = false;
      }
      return;
    }
    if (hasRestoredFromContext.current) return;

    const allCampaigns = Array.isArray(campaignsData.data) ? campaignsData.data : [];
    const activeCampaigns = allCampaigns.filter((campaign) => campaign.status !== "COMPLETE");
    const ctxKey = campaignIdKey(selectedCampaignId);
    const restoredCampaign = activeCampaigns.find((c) => campaignIdKey(c.id) === ctxKey);

    if (restoredCampaign) {
      setSelectedCampaign(restoredCampaign);
      hasAutoSelected.current = true;
      hasRestoredFromContext.current = true;
      lastRestoredCampaignIdRef.current = selectedCampaignId;
    }
  }, [campaignsSuccess, campaignsData?.data, selectedCampaignId, isMultiCreator]);

  // --- Brand: auto-select / reconcile selected campaign when list loads ---
  useEffect(() => {
    if (!isMultiCreator) return;
    if (!campaignsSuccess || !campaignsData?.data) return;

    const allCampaigns = Array.isArray(campaignsData.data) ? campaignsData.data : [];
    const activeCampaigns = allCampaigns.filter((campaign) => campaign.status !== "COMPLETE");

    if (
      selectedCampaign &&
      activeCampaigns.length > 0 &&
      !activeCampaigns.some((c) => campaignIdKey(c.id) === campaignIdKey(selectedCampaign.id))
    ) {
      if (selectedCampaign.status === "COMPLETE") {
        setSelectedCampaign(null);
        hasAutoSelected.current = false;
        hasRestoredFromContext.current = false;
        dispatch(
          setSelectedCampaignContext({
            campaignId: null,
            collaborationType: null,
          })
        );
      } else {
        const fallback = activeCampaigns[0];
        setSelectedCampaign(fallback);
        hasAutoSelected.current = true;
        hasRestoredFromContext.current = true;
        lastRestoredCampaignIdRef.current = fallback.id;
        dispatch(
          setSelectedCampaignContext({
            campaignId: fallback.id,
            collaborationType: fallback.collaboration_type || null,
          })
        );
      }
      return;
    }

    if (
      activeCampaigns.length > 0 &&
      !selectedCampaign &&
      !hasAutoSelected.current &&
      !hasRestoredFromContext.current
    ) {
      setSelectedCampaign(activeCampaigns[0]);
      hasAutoSelected.current = true;
      dispatch(
        setSelectedCampaignContext({
          campaignId: activeCampaigns[0].id,
          collaborationType: activeCampaigns[0].collaboration_type || null,
        })
      );
    }
  }, [
    isMultiCreator,
    campaignsSuccess,
    campaignsData?.data,
    selectedCampaign?.id,
    selectedCampaign?.status,
    dispatch,
  ]);

  // --- Brand: fetch applied creators when campaign selected ---
  useEffect(() => {
    if (selectedCampaign?.id) {
      dispatch(getAppliedCreators({ campaignId: selectedCampaign.id, filters: {} }));
    }
  }, [selectedCampaign?.id, dispatch]);

  // --- Brand: derive budget and performance from creators ---
  useEffect(() => {
    if (creatorsSuccess && creatorsData?.data && selectedCampaign) {
      const creators = Array.isArray(creatorsData.data) ? creatorsData.data : [];
      const totalBudget = Number(selectedCampaign.budget) || 0;
      const spent = creators.reduce((sum, creator) => {
        const raw =
          creator.contract?.total_compensation ??
          creator.contract?.totalCompensation ??
          creator.total_spent ??
          0;
        const comp = Array.isArray(raw)
          ? raw.reduce((a, b) => Number(a) + (Number(b) || 0), 0)
          : Number(raw) || 0;
        return Number(sum) + comp;
      }, 0);
      const remaining = Math.max(0, totalBudget - Number(spent));

      setBudgetData({
        totalBudget: Number(totalBudget),
        spent: Number(spent),
        remaining: Number(remaining),
        saved: 0,
      });

      setDeliverables(selectedCampaign.deliverables || []);

      const totalViews = creators.reduce((sum, creator) => sum + (creator.total_views || 0), 0);
      const totalEngagement = creators.reduce(
        (sum, creator) => sum + (creator.total_engagement || 0),
        0
      );
      const engagementRate = totalViews > 0 ? (totalEngagement / totalViews) * 100 : 0;
      const costPerEngagement = totalEngagement > 0 ? spent / totalEngagement : 0;

      setPerformanceMetrics({
        totalViews,
        totalEngagement,
        engagementRate,
        costPerEngagement,
      });
    } else if (creatorsSuccess && !creatorsData?.data && selectedCampaign) {
      const total = Number(selectedCampaign.budget) || 0;
      setBudgetData({
        totalBudget: total,
        spent: 0,
        remaining: total,
        saved: 0,
      });
      setDeliverables(selectedCampaign.deliverables || []);
      setPerformanceMetrics({
        totalViews: 0,
        totalEngagement: 0,
        engagementRate: 0,
        costPerEngagement: 0,
      });
    }
  }, [creatorsSuccess, creatorsData, selectedCampaign]);

  // Internal select (used by overview logic)
  const internalHandleCampaignSelect = useCallback(
    (selectedOption) => {
      if (selectedOption) {
        setSelectedCampaign(selectedOption.campaign);
        dispatch(
          setSelectedCampaignContext({
            campaignId: selectedOption.campaign.id,
            collaborationType: selectedOption.campaign.collaboration_type || null,
          })
        );
      } else {
        setSelectedCampaign(null);
        dispatch(
          setSelectedCampaignContext({
            campaignId: null,
            collaborationType: null,
          })
        );
      }
    },
    [dispatch]
  );

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

  // --- Overview: filtered options and validity ---
  const filteredCampaignOptions = useMemo(() => {
    return campaignOptions.filter((option) => {
      if (!option.campaign) return false;
      const collaborationType =
        option.campaign.collaboration_type || COLLABORATION_TYPE.MULTI_CREATOR;
      return isMultiCreator
        ? collaborationType === COLLABORATION_TYPE.MULTI_CREATOR
        : collaborationType === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;
    });
  }, [campaignOptions, isMultiCreator]);

  const isSelectedCampaignValid =
    selectedCampaign &&
    (isMultiCreator
      ? (selectedCampaign.collaboration_type || COLLABORATION_TYPE.MULTI_CREATOR) ===
        COLLABORATION_TYPE.MULTI_CREATOR
      : selectedCampaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR);

  const campaignSimpleSelectValue = useMemo(() => {
    if (!isSelectedCampaignValid || !selectedCampaign?.campaign_title) {
      return null;
    }
    return {
      value: selectedCampaign.id,
      label: selectedCampaign.campaign_title,
    };
  }, [isSelectedCampaignValid, selectedCampaign?.id, selectedCampaign?.campaign_title]);

  const showMultiCreatorUI = isMultiCreator && isSelectedCampaignValid;

  const isLoadingBrand = campaignsLoading || creatorsLoading;

  const hasIndividualData = !isMultiCreator && normalizedIndividualContracts.length > 0;

  const computedHasData = useMemo(() => {
    if (!selectedCampaign) return false;
    if (isMultiCreator && isSelectedCampaignValid) {
      return Array.isArray(creatorsData?.data) && creatorsData.data.length > 0;
    }
    return hasIndividualData;
  }, [selectedCampaign, isMultiCreator, isSelectedCampaignValid, creatorsData?.data, hasIndividualData]);

  const overviewLoading = useMemo(() => {
    if (!isMultiCreator) {
      return individualContractsLoading;
    }
    if (isSelectedCampaignValid && selectedCampaign) {
      return campaignsLoading;
    }
    return isLoadingBrand;
  }, [
    isMultiCreator,
    individualContractsLoading,
    isSelectedCampaignValid,
    selectedCampaign,
    campaignsLoading,
    isLoadingBrand,
  ]);

  const budgetStatsLoading = useMemo(
    () =>
      showMultiCreatorUI &&
      !!selectedCampaign &&
      !creatorsSuccess &&
      !creatorsError,
    [showMultiCreatorUI, selectedCampaign, creatorsSuccess, creatorsError]
  );

  const isLoadingIndividual = !isMultiCreator && individualContractsLoading;

  // --- Overview: notify parent when selected campaign changes ---
  useEffect(() => {
    const currentCampaignId = selectedCampaign?.id;
    if (currentCampaignId !== lastSelectedCampaignId.current) {
      hasNotifiedParent.current = false;
      lastSelectedCampaignId.current = currentCampaignId;
    }
    if (selectedCampaign && onCampaignSelectRef.current && !hasNotifiedParent.current) {
      onCampaignSelectRef.current(selectedCampaign);
      hasNotifiedParent.current = true;
    }
  }, [selectedCampaign]);

  // --- Overview: fetch individual contracts when in individual mode ---
  useEffect(() => {
    if (!isMultiCreator) {
      dispatch(getIndividualCollaborationContracts(false));
    }
  }, [isMultiCreator, dispatch]);

  // --- Overview: auto-select first individual contract ---
  useEffect(() => {
    if (isMultiCreator) {
      hasAutoSelectedIndividual.current = false;
      return;
    }
    if (
      !isMultiCreator &&
      !hasAutoSelectedIndividual.current &&
      individualContractsSuccess &&
      normalizedIndividualContracts.length > 0 &&
      !selectedCampaign
    ) {
      hasAutoSelectedIndividual.current = true;
      const firstContract = normalizedIndividualContracts[0];
      const campaignId = firstContract.campaignId || firstContract.campaign?.id;
      if (campaignId) {
        const individualCampaign = {
          id: campaignId,
          collaboration_type: COLLABORATION_TYPE.INDIVIDUAL_CREATOR,
          campaign_title: firstContract.campaign?.campaign_title || "Individual Collaboration",
          contract: firstContract,
          creator: firstContract.creator,
          campaign: firstContract.campaign,
          created_by: firstContract.brand,
          brand: firstContract.brand,
        };
        setSelectedCampaign(individualCampaign);
        if (onCampaignSelectRef.current) {
          onCampaignSelectRef.current(individualCampaign);
        }
      }
    }
  }, [
    isMultiCreator,
    individualContractsSuccess,
    normalizedIndividualContracts,
    selectedCampaign,
  ]);

  // --- Overview: auto-select first filtered multi-creator option ---
  useEffect(() => {
    if (isMultiCreator && filteredCampaignOptions.length > 0 && !isLoadingBrand) {
      if (!isSelectedCampaignValid && !hasAutoSelectedFiltered.current) {
        const firstFilteredOption = filteredCampaignOptions[0];
        if (firstFilteredOption && firstFilteredOption.campaign) {
          internalHandleCampaignSelect(firstFilteredOption);
          if (onCampaignSelectRef.current) {
            onCampaignSelectRef.current(firstFilteredOption.campaign);
          }
          hasAutoSelectedFiltered.current = true;
        }
      }
    } else {
      hasAutoSelectedFiltered.current = false;
    }
  }, [
    isMultiCreator,
    filteredCampaignOptions,
    isSelectedCampaignValid,
    isLoadingBrand,
    internalHandleCampaignSelect,
  ]);

  const handleCampaignSelect = useCallback(
    (selectedOption) => {
      if (selectedOption) {
        internalHandleCampaignSelect(selectedOption);
        if (onCampaignSelect) {
          onCampaignSelect(selectedOption.campaign);
        }
      } else {
        internalHandleCampaignSelect(null);
        if (onCampaignSelect) {
          onCampaignSelect(null);
        }
      }
    },
    [internalHandleCampaignSelect, onCampaignSelect]
  );

  const handleToggleChange = useCallback(
    (eventOrValue) => {
      const newIsMultiCreator =
        typeof eventOrValue === "boolean"
          ? eventOrValue
          : (eventOrValue?.target?.checked ?? !isMultiCreator);
      hasAutoSelectedFiltered.current = false;
      hasAutoSelectedIndividual.current = false;

      if (onToggleChange) {
        onToggleChange(newIsMultiCreator);
      }

      if (selectedCampaign) {
        const campaignType = selectedCampaign.collaboration_type || COLLABORATION_TYPE.MULTI_CREATOR;
        const shouldReset =
          (newIsMultiCreator && campaignType !== COLLABORATION_TYPE.MULTI_CREATOR) ||
          (!newIsMultiCreator && campaignType !== COLLABORATION_TYPE.INDIVIDUAL_CREATOR);
        if (shouldReset) {
          internalHandleCampaignSelect(null);
          if (onCampaignSelect) {
            onCampaignSelect(null);
          }
        }
      }
    },
    [isMultiCreator, selectedCampaign, onToggleChange, onCampaignSelect, internalHandleCampaignSelect]
  );

  // Resolve creator user id for individual campaigns
  const individualCreatorId =
    selectedCampaign?.creator?.id ??
    selectedCampaign?.creator_id ??
    selectedCampaign?.contract?.creatorId ??
    selectedCampaign?.contract?.creator_id ??
    selectedCampaign?.contract?.creator?.id ??
    normalizedIndividualContracts.find((contract) => {
      const contractCampaignId = contract?.campaignId || contract?.campaign?.id;
      return contractCampaignId === selectedCampaign?.id;
    })?.creatorId ??
    normalizedIndividualContracts.find((contract) => {
      const contractCampaignId = contract?.campaignId || contract?.campaign?.id;
      return contractCampaignId === selectedCampaign?.id;
    })?.creator?.id;


  useEffect(() => {
    if (!selectedCampaign?.id) {
      dispatch(resetCampaignDemographics());
      dispatch(resetAudience());
      return;
    }
    if (isMultiCreator) {
      dispatch(fetchCampaignCombinedDemographics({ campaignId: selectedCampaign.id }));
      dispatch(resetAudience());
      return;
    }
    if (individualCreatorId) {
      dispatch(resetCampaignDemographics());
      dispatch(fetchCreatorAudience({ creatorId: individualCreatorId }));
    }
  }, [selectedCampaign?.id, isMultiCreator, individualCreatorId, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetCampaignDemographics());
      dispatch(resetAudience());
    };
  }, [dispatch]);

  const demographicsData = isMultiCreator ? campaignDemographics?.data : creatorAudience?.data;
  const awaitingIndividualDemographicsContext =
    !isMultiCreator && !!selectedCampaign?.id && !individualCreatorId;
  const demographicsFetchSettled = isMultiCreator
    ? campaignDemographics?.isSuccess || campaignDemographics?.isError
    : creatorAudience?.isSuccess || creatorAudience?.isError;
  const demographicsLoading =
    !!(isMultiCreator ? campaignDemographics?.isLoading : creatorAudience?.isLoading) ||
    awaitingIndividualDemographicsContext ||
    (!!selectedCampaign?.id &&
      (isMultiCreator || !!individualCreatorId) &&
      !demographicsFetchSettled);
  const hasDemographicsData = isMultiCreator
    ? campaignDemographics?.isSuccess &&
      (demographicsData?.has_data || demographicsData?.no_connection)
    : creatorAudience?.isSuccess && (demographicsData?.has_data || demographicsData?.no_connection);

  return {
    isMultiCreator,
    filteredCampaignOptions,
    isSelectedCampaignValid,
    showMultiCreatorUI,
    selectedCampaign,
    budgetData,
    performanceMetrics,
    formatCurrency,
    formatNumber,
    isLoading: isMultiCreator ? overviewLoading : isLoadingIndividual,
    budgetStatsLoading,
    hasData: computedHasData,
    handleCampaignSelect,
    handleToggleChange,
    campaignSimpleSelectValue,
    demographicsData,
    demographicsLoading,
    hasDemographicsData,
  };
}
