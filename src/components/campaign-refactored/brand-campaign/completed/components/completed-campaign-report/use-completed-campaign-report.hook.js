import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  downloadCompletedCampaignReportPdf,
  getCompletedCampaignReport,
  resetCompletedReport,
  resetDownloadPdf,
  selectCompletedCampaignReport,
  selectDownloadCampaignReportPdf,
} from "@/provider/features/campaign-report/campaign-report.slice";
import {
  DEMO_MUTATION_MESSAGES,
  isDemoCampaign,
} from "@/common/utils/demo-campaign.util";

export default function useCompletedCampaignReport(campaignId) {
  const dispatch = useDispatch();
  const { data, isLoading, isError, isSuccess, message } = useSelector(
    selectCompletedCampaignReport
  );
  const { isLoading: isPdfLoading } = useSelector(selectDownloadCampaignReportPdf);
  const [activeTab, setActiveTab] = useState("overview");
  const [pdfDemoMessage, setPdfDemoMessage] = useState("");
  const brandCampaigns =
    useSelector((state) => state.campaigns?.getAllBrandCampaigns?.data?.data) || [];
  const matchedBrandCampaign = brandCampaigns.find(
    (campaign) => String(campaign.id) === String(campaignId),
  );
  const isDemo =
    isDemoCampaign(matchedBrandCampaign) ||
    Boolean(data?.meta?.isDemo) ||
    isDemoCampaign({
      campaign_title: data?.header?.campaignTitle,
      is_demo: data?.meta?.isDemo,
    });

  useEffect(() => {
    if (!campaignId) return;
    dispatch(resetCompletedReport());
    dispatch(resetDownloadPdf());
    dispatch(getCompletedCampaignReport(campaignId));
    setPdfDemoMessage("");
  }, [dispatch, campaignId]);

  const showLoader = Boolean(campaignId) && (isLoading || (!isSuccess && !isError));

  const tabs = useMemo(() => {
    const items = [{ id: "overview", label: "Overview" }];
    if (data?.meta?.trackingEnabled && data?.salesAndRoi) {
      items.push({ id: "sales", label: "Sales & ROI" });
    }
    items.push(
      { id: "creators", label: "Creators & Content" },
      { id: "rehire", label: "Re-Hire Opportunities" }
    );
    return items;
  }, [data?.meta?.trackingEnabled, data?.salesAndRoi]);

  useEffect(() => {
    if (!tabs.some((t) => t.id === activeTab)) {
      setActiveTab("overview");
    }
  }, [tabs, activeTab]);

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  const handleDownloadPdf = useCallback(() => {
    if (!campaignId || isPdfLoading) return;
    if (isDemo || data?.meta?.pdfExportAvailable === false) {
      setPdfDemoMessage(DEMO_MUTATION_MESSAGES.pdfExport);
      return;
    }
    dispatch(downloadCompletedCampaignReportPdf(campaignId));
  }, [campaignId, dispatch, isPdfLoading, isDemo, data?.meta?.pdfExportAvailable]);

  const formatCurrency = useCallback((value) => {
    if (value == null || !Number.isFinite(Number(value))) return "N/A";
    return `$${Number(value).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  }, []);

  const formatNumber = useCallback((value) => {
    if (value == null || !Number.isFinite(Number(value))) return "N/A";
    return Number(value).toLocaleString();
  }, []);

  const formatPercent = useCallback((value) => {
    if (value == null || !Number.isFinite(Number(value))) return "N/A";
    return `${Number(value).toFixed(2)}%`;
  }, []);

  const formatDate = useCallback((iso) => {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "-";
    }
  }, []);

  return {
    data,
    isLoading: showLoader,
    isError,
    message,
    activeTab,
    tabs,
    isPdfLoading,
    pdfDemoMessage,
    isDemo,
    handleTabChange,
    handleDownloadPdf,
    formatCurrency,
    formatNumber,
    formatPercent,
    formatDate,
  };
}
