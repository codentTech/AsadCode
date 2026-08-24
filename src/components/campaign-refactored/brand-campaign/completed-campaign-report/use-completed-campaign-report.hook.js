import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCompletedCampaignReport,
  selectCompletedCampaignReport,
} from "@/provider/features/campaign-report/campaign-report.slice";

export default function useCompletedCampaignReport(campaignId) {
  const dispatch = useDispatch();
  const { data, isLoading, isError, message } = useSelector(selectCompletedCampaignReport);
  const [activeTab, setActiveTab] = useState("overview");
  const [pdfNotice, setPdfNotice] = useState(false);
  const [mobilePane, setMobilePane] = useState("center");

  useEffect(() => {
    if (campaignId) {
      dispatch(getCompletedCampaignReport(campaignId));
    }
  }, [dispatch, campaignId]);

  const tabs = useMemo(() => {
    const items = [{ id: "overview", label: "Overview", shortLabel: "Overview" }];
    if (data?.meta?.trackingEnabled && data?.salesAndRoi) {
      items.push({ id: "sales", label: "Sales & ROI", shortLabel: "Sales" });
    }
    items.push(
      { id: "creators", label: "Creators & Content", shortLabel: "Creators" },
      { id: "rehire", label: "Re-Hire Opportunities", shortLabel: "Re-Hire" }
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
    setMobilePane("center");
  }, []);

  const handleDownloadPdf = useCallback(() => {
    setPdfNotice(true);
  }, []);

  const dismissPdfNotice = useCallback(() => {
    setPdfNotice(false);
  }, []);

  const goToLeftPane = useCallback(() => setMobilePane("left"), []);
  const goToCenterPane = useCallback(() => setMobilePane("center"), []);
  const goToRightPane = useCallback(() => setMobilePane("right"), []);

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
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "—";
    }
  }, []);

  return {
    data,
    isLoading,
    isError,
    message,
    activeTab,
    tabs,
    pdfNotice,
    mobilePane,
    handleTabChange,
    handleDownloadPdf,
    dismissPdfNotice,
    goToLeftPane,
    goToCenterPane,
    goToRightPane,
    formatCurrency,
    formatNumber,
    formatPercent,
    formatDate,
  };
}
