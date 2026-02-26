import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBrandCampaigns,
  getAppliedCreators,
  getAppliedCreatorsForBudget,
} from "@/provider/features/campaigns/campaigns.slice";
import { setSelectedCampaign as setSelectedCampaignContext } from "@/provider/features/campaign-context/campaign-context.slice";

export default function useBrandCampaignCompleted(disableAutoSelect = false) {
  const dispatch = useDispatch();
  const hasAutoSelected = useRef(false);
  const hasRestoredFromContext = useRef(false);
  const lastRestoredCampaignIdRef = useRef(null);

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

  const { isSuccess: budgetCreatorsSuccess, data: budgetCreatorsData } = useSelector(
    (state) => state.campaigns.getAppliedCreatorsForBudget || {}
  );

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

  useEffect(() => {
    dispatch(getAllBrandCampaigns());
  }, [dispatch]);

  useEffect(() => {
    // Reset restoration flag if selectedCampaignId from Redux changed
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
      // Reset when Redux context is cleared
      lastRestoredCampaignIdRef.current = null;
      hasRestoredFromContext.current = false;
    }
  }, [campaignsSuccess, campaignsData, selectedCampaignId]);

  // Memoize campaigns array – completed tab: campaign COMPLETE or has at least one creator COMPLETED
  const allCampaigns = useMemo(() => {
    if (!campaignsSuccess || !campaignsData?.data) return [];
    const list = Array.isArray(campaignsData.data) ? campaignsData.data : [];
    return list.filter(
      (c) =>
        c.status === "COMPLETE" ||
        (Array.isArray(c.creators) && c.creators.some((cr) => cr.status === "COMPLETED"))
    );
  }, [campaignsSuccess, campaignsData?.data]);

  // Set campaign options when we have data (same pattern as active tab)
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
  }, [campaignsSuccess, campaignsData?.data, allCampaigns]);

  // Handle auto-selection separately to avoid loops
  useEffect(() => {
    if (!campaignsSuccess || allCampaigns.length === 0) return;

    const selectedCampaignId = selectedCampaign?.id;

    // If selected campaign is no longer in the list, select first one
    if (selectedCampaignId && !allCampaigns.some((c) => c.id === selectedCampaignId)) {
      if (!hasAutoSelected.current) {
        setSelectedCampaign(allCampaigns[0]);
        hasAutoSelected.current = true;
      }
      return;
    }

    // Auto-select first campaign if none selected and auto-select is enabled
    if (
      !disableAutoSelect &&
      !selectedCampaignId &&
      !hasAutoSelected.current &&
      !hasRestoredFromContext.current
    ) {
      setSelectedCampaign(allCampaigns[0]);
      hasAutoSelected.current = true;
      dispatch(
        setSelectedCampaignContext({
          campaignId: allCampaigns[0].id,
          collaborationType: allCampaigns[0].collaboration_type || null,
        })
      );
    }
  }, [campaignsSuccess, allCampaigns, selectedCampaign?.id, disableAutoSelect, dispatch]);

  useEffect(() => {
    if (selectedCampaign?.id) {
      dispatch(
        getAppliedCreators({ campaignId: selectedCampaign.id, filters: { status: "COMPLETED" } })
      );
      dispatch(getAppliedCreatorsForBudget(selectedCampaign.id));
    }
  }, [selectedCampaign?.id, dispatch]);

  // Budget: use getAppliedCreatorsForBudget (all creators) so spent matches active tab
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

  // List, deliverables, performance: use getAppliedCreators (COMPLETED only)
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

  return {
    campaignsLoading,
    campaignsSuccess,
    campaignsError,
    campaignOptions,
    selectedCampaign,
    creatorsLoading,
    creatorsSuccess,
    creatorsError,
    creators: Array.isArray(creatorsData?.data) ? creatorsData.data : [],
    budgetData,
    deliverables,
    performanceMetrics,
    handleCampaignSelect,
    formatCurrency,
    formatNumber,
    isLoading: campaignsLoading || creatorsLoading,
    hasData: selectedCampaign && Array.isArray(creatorsData?.data) && creatorsData.data.length > 0,
  };
}
