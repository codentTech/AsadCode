import { useState, useEffect, useLayoutEffect, useCallback, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBrandCampaigns,
  getAppliedCreators,
  getAppliedCreatorsForBudget,
} from "@/provider/features/campaigns/campaigns.slice";
import {
  setSelectedCampaign as setSelectedCampaignContext,
  setBrandCampaignMultiCreatorMode,
} from "@/provider/features/campaign-context/campaign-context.slice";
import { getIndividualCollaborationContracts } from "@/provider/features/contracts/contracts.slice";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import {
  resolveEffectiveCollaborationType,
  isIndividualCollaborationFlow,
} from "@/common/utils/brand-campaign-context.utils";
import { isMobileViewport } from "@/common/utils/viewport.utils";
import {
  resetCampaignDemographics,
  resetAudience,
  resetPerformanceMetrics,
} from "@/provider/features/phyllo/phyllo.slice";

export default function useCompleted(disableAutoSelect = false) {
  const dispatch = useDispatch();

  const hasAutoSelected = useRef(false);
  const hasRestoredFromContext = useRef(false);
  const lastRestoredCampaignIdRef = useRef(null);
  const hasRequestedBrandCampaignsRef = useRef(false);

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
  } = useSelector((state) => state.campaigns.getAppliedCreators || {});

  const { isSuccess: budgetCreatorsSuccess, data: budgetCreatorsData } = useSelector(
    (state) => state.campaigns.getAppliedCreatorsForBudget || {}
  );

  const {
    data: individualContractsData,
    isSuccess: individualContractsSuccess,
    isLoading: individualContractsLoading,
  } = useSelector((state) => state.contracts.getIndividualCollaborationContracts || {});

  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [currentSort, setCurrentSort] = useState("newest");
  const [campaignOptions, setCampaignOptions] = useState([]);
  const [budgetData, setBudgetData] = useState({
    totalBudget: 0,
    spent: 0,
    remaining: 0,
    saved: 0,
  });
  const [deliverables, setDeliverables] = useState([]);
  const [mobilePane, setMobilePane] = useState("creators");
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
    if (!selectedCreator && mobilePane === "detail") {
      setMobilePane("creators");
    }
  }, [selectedCreator, mobilePane]);

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
      const restoredCampaign = allCampaigns.find((c) => c.id === selectedCampaignId);
      if (restoredCampaign) {
        setSelectedCampaign(restoredCampaign);
        hasAutoSelected.current = true;
        hasRestoredFromContext.current = true;
        lastRestoredCampaignIdRef.current = selectedCampaignId;
      }
    } else if (!selectedCampaignId) {
      lastRestoredCampaignIdRef.current = null;
      hasRestoredFromContext.current = false;
    }
  }, [campaignsSuccess, campaignsData, selectedCampaignId]);

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
      !hasRestoredFromContext.current
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
  }, [campaignsSuccess, campaignsData?.data, selectedCampaign?.id, disableAutoSelect, dispatch, isMultiCreator]);

  useEffect(() => {
    if (!selectedCampaign?.id) return;
    const effectiveType = resolveEffectiveCollaborationType(
      selectedCampaign,
      selectedCollaborationType
    );
    if (isIndividualCollaborationFlow(isMultiCreator, effectiveType)) return;

    dispatch(
      getAppliedCreators({ campaignId: selectedCampaign.id, filters: { status: "COMPLETED" } })
    );
    dispatch(getAppliedCreatorsForBudget(selectedCampaign.id));
  }, [selectedCampaign, selectedCollaborationType, isMultiCreator, dispatch]);

  useEffect(() => {
    if (!budgetCreatorsSuccess || !selectedCampaign) return;
    const budgetCreators = budgetCreatorsData?.data?.data ?? budgetCreatorsData?.data ?? [];
    const creators = Array.isArray(budgetCreators) ? budgetCreators : [];
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
    const saved = Math.max(0, remaining);

    setBudgetData({
      totalBudget: Number(totalBudget),
      spent: Number(spent),
      remaining: 0,
      saved: Number(saved),
    });
  }, [budgetCreatorsSuccess, budgetCreatorsData, selectedCampaign?.id, selectedCampaign?.budget]);

  useEffect(() => {
    if (creatorsSuccess && creatorsData?.data && selectedCampaign) {
      const creators = Array.isArray(creatorsData.data) ? creatorsData.data : [];
      setDeliverables(selectedCampaign.deliverables || []);

      const totalViews = creators.reduce((sum, creator) => sum + (creator.total_views || 0), 0);
      const totalEngagement = creators.reduce(
        (sum, creator) => sum + (creator.total_engagement || 0),
        0
      );
      const spent = creators.reduce((sum, creator) => {
        const raw =
          creator.contract?.total_compensation ??
          creator.contract?.totalCompensation ??
          creator.total_spent ??
          0;
        return Number(sum) + (Number(raw) || 0);
      }, 0);
      const engagementRate = totalViews > 0 ? (totalEngagement / totalViews) * 100 : 0;
      const costPerEngagement = totalEngagement > 0 ? spent / totalEngagement : 0;

      setPerformanceMetrics({
        totalViews,
        totalEngagement,
        engagementRate,
        costPerEngagement,
      });
    } else if (creatorsSuccess && !creatorsData?.data && selectedCampaign) {
      setDeliverables(selectedCampaign.deliverables || []);
      setPerformanceMetrics({
        totalViews: 0,
        totalEngagement: 0,
        engagementRate: 0,
        costPerEngagement: 0,
      });
    }
  }, [creatorsSuccess, creatorsData, selectedCampaign?.id, selectedCampaign?.deliverables]);

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

      if (campaign?.id) {
        dispatch(
          getAppliedCreators({
            campaignId: campaign.id,
            filters: { status: "COMPLETED" },
          })
        );
      }

      if (campaign && isMobileViewport()) {
        setMobilePane("creators");
      }
    },
    [dispatch]
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
    if (isMobileViewport()) {
      setMobilePane((prev) => (prev === "detail" ? "creators" : prev));
    }
  }, []);

  const handleToggleChange = useCallback(
    (newIsMultiCreator) => {
      dispatch(setBrandCampaignMultiCreatorMode(newIsMultiCreator));
      setSelectedCampaign(null);
      setSelectedCreator(null);
      hasAutoSelected.current = true;
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
      if (newIsMultiCreator === false) {
        dispatch(getIndividualCollaborationContracts(true));
      }
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
    [selectedCampaign, dispatch]
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
    creators: Array.isArray(creatorsData?.data) ? creatorsData.data : [],
    budgetData,
    deliverables,
    performanceMetrics,
    handleCampaignSelect,
    handleCreatorSelect,
    handleClearCreator,
    handleToggleChange,
    handleSortChange,
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
