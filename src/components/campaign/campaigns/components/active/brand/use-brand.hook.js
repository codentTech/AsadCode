import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBrandCampaigns,
  getAppliedCreators,
  resetGetAppliedCreators,
} from "@/provider/features/campaigns/campaigns.slice";
import { setSelectedCampaign as setSelectedCampaignContext } from "@/provider/features/campaign-context/campaign-context.slice";

export default function useBrandCampaign(isCompleted = false) {
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
    if (campaignsSuccess && campaignsData?.data && selectedCampaignId) {
      const allCampaigns = Array.isArray(campaignsData.data) ? campaignsData.data : [];
      const restoredCampaign = allCampaigns.find((c) => c.id === selectedCampaignId);

      // Allow re-selection if campaign ID changed or if not yet restored
      const shouldRestore =
        !hasRestoredFromContext.current || selectedCampaign?.id !== selectedCampaignId;

      if (restoredCampaign && shouldRestore) {
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
  }, [campaignsSuccess, campaignsData, selectedCampaignId, selectedCampaign]);

  useEffect(() => {
    if (!hasRestoredFromContext.current) {
      setSelectedCampaign(null);
      hasAutoSelected.current = false;
    }
    setCampaignOptions([]);
    dispatch(resetGetAppliedCreators());
  }, [isCompleted, dispatch]);

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
  }, [campaignsSuccess, campaignsData, selectedCampaign, dispatch]);

  useEffect(() => {
    if (selectedCampaign?.id) {
      // No status filter: include HIRED and COMPLETED so budget spent stays correct after marking creators complete
      const filters = isCompleted ? {} : {};
      dispatch(getAppliedCreators({ campaignId: selectedCampaign.id, filters }));
    }
  }, [selectedCampaign, dispatch, isCompleted]);

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
      const saved = isCompleted ? Math.max(0, remaining) : 0;

      setBudgetData({
        totalBudget: Number(totalBudget),
        spent: Number(spent),
        remaining: isCompleted ? 0 : Number(remaining),
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
  }, [creatorsSuccess, creatorsData, selectedCampaign, isCompleted]);

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
    hasData: selectedCampaign && Array.isArray(creatorsData?.data),
  };
}
