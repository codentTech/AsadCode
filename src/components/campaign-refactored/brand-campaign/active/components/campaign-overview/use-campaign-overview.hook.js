import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import { getIndividualCollaborationContracts } from "@/provider/features/contracts/contracts.slice";
import {
  getAllBrandCampaigns,
  getAppliedCreators,
  resetGetAppliedCreators,
} from "@/provider/features/campaigns/campaigns.slice";
import { setSelectedCampaign as setSelectedCampaignContext } from "@/provider/features/campaign-context/campaign-context.slice";
import {
  fetchCampaignCombinedDemographics,
  resetCampaignDemographics,
  resetAudience,
  selectCampaignCombinedDemographics,
} from "@/provider/features/phyllo/phyllo.slice";

const IS_COMPLETED = false;

export default function useCampaignOverview(onCampaignSelect, onToggleChange) {
  const dispatch = useDispatch();
  const [isMultiCreator, setIsMultiCreator] = useState(true);

  // Refs (brand + overview)
  const hasAutoSelected = useRef(false);
  const hasRestoredFromContext = useRef(false);
  const lastRestoredCampaignIdRef = useRef(null);
  const hasNotifiedParent = useRef(false);
  const hasAutoSelectedFiltered = useRef(false);
  const lastSelectedCampaignId = useRef(null);
  const hasAutoSelectedIndividual = useRef(false);

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

  const campaignDemographics = useSelector(selectCampaignCombinedDemographics);

  // Local state (from brand hook)
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaignOptions, setCampaignOptions] = useState([]);
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

  // --- Brand: fetch campaigns on mount ---
  useEffect(() => {
    dispatch(getAllBrandCampaigns());
  }, [dispatch]);

  // --- Brand: reset restoration flag when context id changes ---
  useEffect(() => {
    if (selectedCampaignId !== lastRestoredCampaignIdRef.current) {
      hasRestoredFromContext.current = false;
    }
  }, [selectedCampaignId]);

  // --- Brand: restore selection from context ---
  useEffect(() => {
    if (campaignsSuccess && campaignsData?.data && selectedCampaignId) {
      const allCampaigns = Array.isArray(campaignsData.data) ? campaignsData.data : [];
      const restoredCampaign = allCampaigns.find((c) => c.id === selectedCampaignId);
      const shouldRestore =
        !hasRestoredFromContext.current || selectedCampaign?.id !== selectedCampaignId;

      if (restoredCampaign && shouldRestore) {
        setSelectedCampaign(restoredCampaign);
        hasAutoSelected.current = true;
        hasRestoredFromContext.current = true;
        lastRestoredCampaignIdRef.current = selectedCampaignId;
      }
    } else if (!selectedCampaignId) {
      lastRestoredCampaignIdRef.current = null;
      hasRestoredFromContext.current = false;
    }
  }, [campaignsSuccess, campaignsData, selectedCampaignId, selectedCampaign?.id]);

  // --- Brand: reset on isCompleted change ---
  useEffect(() => {
    if (!hasRestoredFromContext.current) {
      setSelectedCampaign(null);
      hasAutoSelected.current = false;
    }
    setCampaignOptions([]);
    dispatch(resetGetAppliedCreators());
  }, [IS_COMPLETED, dispatch]);

  // --- Brand: build options and auto-select first campaign ---
  useEffect(() => {
    if (campaignsSuccess && campaignsData?.data) {
      const allCampaigns = Array.isArray(campaignsData.data) ? campaignsData.data : [];
      const activeCampaigns = allCampaigns.filter((campaign) => campaign.status !== "COMPLETE");
      const options = activeCampaigns.map((campaign) => ({
        value: campaign.id,
        label: campaign.campaign_title || "Untitled Campaign",
        campaign: campaign,
      }));

      setCampaignOptions(options);

      if (
        selectedCampaign &&
        activeCampaigns.length > 0 &&
        !activeCampaigns.some((c) => c.id === selectedCampaign.id)
      ) {
        if (selectedCampaign.status === "COMPLETE") {
          setSelectedCampaign(null);
          hasAutoSelected.current = false;
        } else {
          setSelectedCampaign(activeCampaigns[0]);
          hasAutoSelected.current = true;
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
    } else if (campaignsSuccess) {
      setCampaignOptions([]);
    }
  }, [campaignsSuccess, campaignsData, selectedCampaign?.id, dispatch]);

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
      const saved = IS_COMPLETED ? Math.max(0, remaining) : 0;

      setBudgetData({
        totalBudget: Number(totalBudget),
        spent: Number(spent),
        remaining: IS_COMPLETED ? 0 : Number(remaining),
        saved: Number(saved),
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
  const filteredCampaignOptions = campaignOptions.filter((option) => {
    if (!option.campaign) return false;
    const collaborationType =
      option.campaign.collaboration_type || COLLABORATION_TYPE.MULTI_CREATOR;
    return isMultiCreator
      ? collaborationType === COLLABORATION_TYPE.MULTI_CREATOR
      : collaborationType === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;
  });

  const isSelectedCampaignValid =
    selectedCampaign &&
    (isMultiCreator
      ? (selectedCampaign.collaboration_type || COLLABORATION_TYPE.MULTI_CREATOR) ===
        COLLABORATION_TYPE.MULTI_CREATOR
      : selectedCampaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR);

  const showMultiCreatorUI = isMultiCreator && isSelectedCampaignValid;

  const isLoadingBrand = campaignsLoading || creatorsLoading;
  const hasDataBrand = selectedCampaign && Array.isArray(creatorsData?.data);

  const hasIndividualData =
    !isMultiCreator && Array.isArray(individualContractsData) && individualContractsData.length > 0;
  const isLoadingIndividual = !isMultiCreator && individualContractsLoading;

  // --- Overview: notify parent when selected campaign changes ---
  useEffect(() => {
    const currentCampaignId = selectedCampaign?.id;
    if (currentCampaignId !== lastSelectedCampaignId.current) {
      hasNotifiedParent.current = false;
      lastSelectedCampaignId.current = currentCampaignId;
    }
    if (selectedCampaign && onCampaignSelect && !hasNotifiedParent.current) {
      onCampaignSelect(selectedCampaign);
      hasNotifiedParent.current = true;
    }
  }, [selectedCampaign, onCampaignSelect]);

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
      Array.isArray(individualContractsData) &&
      individualContractsData.length > 0 &&
      !selectedCampaign
    ) {
      hasAutoSelectedIndividual.current = true;
      const firstContract = individualContractsData[0];
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
        if (onCampaignSelect) {
          onCampaignSelect(individualCampaign);
        }
      }
    }
  }, [
    isMultiCreator,
    individualContractsSuccess,
    individualContractsData,
    selectedCampaign,
    onCampaignSelect,
  ]);

  // --- Overview: auto-select first filtered multi-creator option ---
  useEffect(() => {
    if (isMultiCreator && filteredCampaignOptions.length > 0 && !isLoadingBrand) {
      if (!isSelectedCampaignValid && !hasAutoSelectedFiltered.current) {
        const firstFilteredOption = filteredCampaignOptions[0];
        if (firstFilteredOption && firstFilteredOption.campaign) {
          internalHandleCampaignSelect(firstFilteredOption);
          if (onCampaignSelect) {
            onCampaignSelect(firstFilteredOption.campaign);
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
    onCampaignSelect,
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
    (event) => {
      const newIsMultiCreator = event?.target?.checked ?? !isMultiCreator;
      setIsMultiCreator(newIsMultiCreator);
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
    selectedCampaign?.contract?.creator?.id ??
    selectedCampaign?.contract?.creator_id;

  useEffect(() => {
    if (!selectedCampaign?.id) {
      dispatch(resetCampaignDemographics());
      dispatch(resetAudience());
      return;
    }
    if (isMultiCreator) {
      dispatch(fetchCampaignCombinedDemographics({ campaignId: selectedCampaign.id }));
      dispatch(resetAudience());
    } else if (individualCreatorId) {
      dispatch(
        fetchCampaignCombinedDemographics({
          campaignId: selectedCampaign.id,
          creatorId: individualCreatorId,
        })
      );
      dispatch(resetAudience());
    } else {
      dispatch(resetCampaignDemographics());
      dispatch(resetAudience());
    }
  }, [selectedCampaign?.id, isMultiCreator, individualCreatorId, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetCampaignDemographics());
      dispatch(resetAudience());
    };
  }, [dispatch]);

  const demographicsData = campaignDemographics?.data;
  const demographicsLoading = campaignDemographics?.isLoading || false;
  const hasDemographicsData =
    campaignDemographics?.isSuccess &&
    (demographicsData?.has_data || demographicsData?.no_connection);

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
    isLoading: isMultiCreator ? isLoadingBrand : isLoadingIndividual,
    hasData: isMultiCreator ? hasDataBrand : hasIndividualData,
    handleCampaignSelect,
    handleToggleChange,
    demographicsData,
    demographicsLoading,
    hasDemographicsData,
  };
}
