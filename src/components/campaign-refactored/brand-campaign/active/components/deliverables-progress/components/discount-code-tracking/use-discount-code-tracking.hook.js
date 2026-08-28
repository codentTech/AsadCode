import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CAMPAIGN_TYPE } from "@/common/constants/campaign.constant";
import {
  deactivateShopifyDiscountCode,
  extendShopifyDiscountTracking,
  getShopifyDiscountCodes,
  killAndReissueShopifyDiscountCode,
  reactivateShopifyDiscountCode,
  renameShopifyDiscountCode,
  resetShopifyExtendDiscountTracking,
  resetShopifyKillAndReissueDiscountCode,
  resetShopifyRenameDiscountCode,
  selectShopifyDiscountCodesState,
  selectShopifyExtendDiscountTrackingState,
} from "@/provider/features/shopify/shopify.slice";

const LIVE_STATUSES = new Set(["active", "pending", "deactivated"]);

function toDateInputValue(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function formatDisplayDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString();
}

function addDaysIso(dateValue, days) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString();
}

export default function useDiscountCodeTracking({
  selectedCampaign,
  selectedContract,
  isManageEnabled = true,
}) {
  const dispatch = useDispatch();
  const discountCodesState = useSelector(selectShopifyDiscountCodesState);
  const renameState = useSelector((state) => state.shopify?.renameDiscountCode);
  const deactivateState = useSelector((state) => state.shopify?.deactivateDiscountCode);
  const reactivateState = useSelector((state) => state.shopify?.reactivateDiscountCode);
  const killState = useSelector((state) => state.shopify?.killAndReissueDiscountCode);
  const extendState = useSelector(selectShopifyExtendDiscountTrackingState);
  const manageMenuRef = useRef(null);
  const renameRequestedRef = useRef(false);
  const killRequestedRef = useRef(false);
  const extendRequestedRef = useRef(false);

  const [isCodeCopied, setIsCodeCopied] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [showKillConfirm, setShowKillConfirm] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [extendDateValue, setExtendDateValue] = useState("");

  const data = discountCodesState?.data;
  const isLoading = Boolean(discountCodesState?.isLoading);
  const isRenameLoading = Boolean(renameState?.isLoading);
  const isDeactivateLoading = Boolean(deactivateState?.isLoading);
  const isReactivateLoading = Boolean(reactivateState?.isLoading);
  const isKillLoading = Boolean(killState?.isLoading);
  const isExtendLoading = Boolean(extendState?.isLoading);
  const isManageActionLoading =
    isDeactivateLoading || isReactivateLoading || isKillLoading || isExtendLoading;

  const isAffiliate = useMemo(() => {
    const type =
      selectedCampaign?.campaign_type ||
      selectedCampaign?.campaignType ||
      selectedCampaign?.type;
    const compensation =
      selectedContract?.compensationType ||
      selectedContract?.compensation_type ||
      selectedCampaign?.compensation_type;
    return type === CAMPAIGN_TYPE.AFFILIATE || compensation === "COMMISSION";
  }, [selectedCampaign, selectedContract]);

  const isCampaignComplete = useMemo(() => {
    const status = selectedCampaign?.status || selectedCampaign?.campaign_status;
    return String(status || "").toUpperCase() === "COMPLETE";
  }, [selectedCampaign]);

  const contractId = selectedContract?.id || null;

  useEffect(() => {
    if (!isAffiliate || !contractId) return;
    dispatch(getShopifyDiscountCodes(contractId));
  }, [dispatch, isAffiliate, contractId]);

  useEffect(() => {
    if (!manageOpen) return;

    const handlePointerDown = (event) => {
      if (!manageMenuRef.current?.contains(event.target)) {
        setManageOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [manageOpen]);

  useEffect(() => {
    if (!renameRequestedRef.current || !showRenameModal) return;

    if (renameState?.isSuccess) {
      renameRequestedRef.current = false;
      setShowRenameModal(false);
      setRenameValue("");
      dispatch(resetShopifyRenameDiscountCode());
      return;
    }

    if (renameState?.isError) {
      renameRequestedRef.current = false;
    }
  }, [dispatch, showRenameModal, renameState?.isSuccess, renameState?.isError]);

  useEffect(() => {
    if (!killRequestedRef.current) return;
    if (!killState?.isSuccess || isKillLoading) return;

    killRequestedRef.current = false;
    setShowKillConfirm(false);
    dispatch(resetShopifyKillAndReissueDiscountCode());
  }, [dispatch, killState?.isSuccess, isKillLoading]);

  useEffect(() => {
    if (!killRequestedRef.current) return;
    if (!killState?.isError || isKillLoading) return;
    killRequestedRef.current = false;
    if (contractId) {
      dispatch(getShopifyDiscountCodes(contractId));
    }
  }, [dispatch, contractId, killState?.isError, isKillLoading]);

  useEffect(() => {
    if (!extendRequestedRef.current || !showExtendModal) return;

    if (extendState?.isSuccess) {
      extendRequestedRef.current = false;
      setShowExtendModal(false);
      setExtendDateValue("");
      dispatch(resetShopifyExtendDiscountTracking());
      return;
    }

    if (extendState?.isError) {
      extendRequestedRef.current = false;
    }
  }, [dispatch, showExtendModal, extendState?.isSuccess, extendState?.isError]);

  const codes = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const liveCode = useMemo(() => {
    const byPriority = ["active", "pending", "deactivated"];
    for (const status of byPriority) {
      const match = codes.find((c) => c.status === status);
      if (match) return match;
    }
    return null;
  }, [codes]);

  useEffect(() => {
    if (!isAffiliate || !contractId) return;
    if (liveCode?.status !== "pending") return;

    const intervalId = setInterval(() => {
      dispatch(getShopifyDiscountCodes(contractId));
    }, 3000);

    return () => clearInterval(intervalId);
  }, [dispatch, isAffiliate, contractId, liveCode?.status]);

  const historyCodes = useMemo(
    () => codes.filter((c) => c.status === "replaced"),
    [codes]
  );

  const trackingPaused = useMemo(
    () => codes.some((c) => c.trackingPaused || c.tracking_paused),
    [codes]
  );

  const trackingEndDate =
    liveCode?.trackingEndDate ||
    liveCode?.tracking_end_date ||
    selectedContract?.tracking_end_date ||
    selectedContract?.trackingEndDate ||
    selectedCampaign?.tracking_end_date ||
    selectedCampaign?.trackingEndDate ||
    null;

  const payoutDate =
    liveCode?.payoutDate ||
    liveCode?.payout_date ||
    (trackingEndDate ? addDaysIso(trackingEndDate, 30) : null);

  const usageCount =
    liveCode?.usageCount ?? liveCode?.usage_count ?? null;
  const usageCap = liveCode?.usageCap ?? liveCode?.usage_cap ?? null;
  const hasUsageCap =
    usageCap != null && Number.isFinite(Number(usageCap)) && Number(usageCap) > 0;

  const trackingWindowOpen = useMemo(() => {
    if (!trackingEndDate) return false;
    const end = new Date(trackingEndDate);
    if (Number.isNaN(end.getTime())) return false;
    return end.getTime() > Date.now();
  }, [trackingEndDate]);

  const canExtendTracking =
    isManageEnabled &&
    isAffiliate &&
    !isCampaignComplete &&
    trackingWindowOpen &&
    Boolean(liveCode?.id) &&
    liveCode.status !== "replaced";

  const previewPayoutDate = useMemo(() => {
    if (!extendDateValue) return null;
    return addDaysIso(extendDateValue, 30);
  }, [extendDateValue]);

  const handleCopyCode = useCallback(async () => {
    if (!liveCode?.code || isManageActionLoading) return;
    await navigator.clipboard.writeText(liveCode.code);
    setIsCodeCopied(true);
    setTimeout(() => setIsCodeCopied(false), 2000);
  }, [liveCode?.code, isManageActionLoading]);

  const handleRefreshCodes = useCallback(() => {
    if (!contractId || isLoading) return;
    dispatch(getShopifyDiscountCodes(contractId));
  }, [dispatch, contractId, isLoading]);

  const handleToggleManage = useCallback(() => {
    if (isManageActionLoading) return;
    setManageOpen((open) => !open);
  }, [isManageActionLoading]);

  const handleOpenRename = useCallback(() => {
    if (isManageActionLoading) return;
    setManageOpen(false);
    renameRequestedRef.current = false;
    dispatch(resetShopifyRenameDiscountCode());
    setRenameValue(liveCode?.code || "");
    setShowRenameModal(true);
  }, [dispatch, liveCode?.code, isManageActionLoading]);

  const handleCloseRename = useCallback(() => {
    if (isRenameLoading) return;
    renameRequestedRef.current = false;
    setShowRenameModal(false);
    setRenameValue("");
    dispatch(resetShopifyRenameDiscountCode());
  }, [dispatch, isRenameLoading]);

  const handleConfirmRename = useCallback(() => {
    if (!liveCode?.id || !renameValue.trim() || isRenameLoading) return;
    renameRequestedRef.current = true;
    dispatch(
      renameShopifyDiscountCode({
        id: liveCode.id,
        code: renameValue.trim(),
      })
    );
  }, [dispatch, liveCode?.id, renameValue, isRenameLoading]);

  const handleTurnOff = useCallback(() => {
    if (!liveCode?.id || isManageActionLoading) return;
    setManageOpen(false);
    dispatch(deactivateShopifyDiscountCode(liveCode.id));
  }, [dispatch, liveCode?.id, isManageActionLoading]);

  const handleTurnOn = useCallback(() => {
    if (!liveCode?.id || isManageActionLoading) return;
    setManageOpen(false);
    dispatch(reactivateShopifyDiscountCode(liveCode.id));
  }, [dispatch, liveCode?.id, isManageActionLoading]);

  const handleOpenKillConfirm = useCallback(() => {
    if (isManageActionLoading) return;
    setManageOpen(false);
    killRequestedRef.current = false;
    dispatch(resetShopifyKillAndReissueDiscountCode());
    setShowKillConfirm(true);
  }, [dispatch, isManageActionLoading]);

  const handleCloseKillConfirm = useCallback(
    (open) => {
      if (isKillLoading) return;
      if (!open) {
        killRequestedRef.current = false;
        dispatch(resetShopifyKillAndReissueDiscountCode());
      }
      setShowKillConfirm(Boolean(open));
    },
    [dispatch, isKillLoading]
  );

  const handleConfirmKill = useCallback(() => {
    if (!liveCode?.id || isKillLoading) return;
    killRequestedRef.current = true;
    dispatch(killAndReissueShopifyDiscountCode(liveCode.id));
  }, [dispatch, liveCode?.id, isKillLoading]);

  const handleOpenExtend = useCallback(() => {
    if (!canExtendTracking || isManageActionLoading) return;
    extendRequestedRef.current = false;
    dispatch(resetShopifyExtendDiscountTracking());
    const minNextDay = trackingEndDate
      ? (() => {
          const d = new Date(trackingEndDate);
          d.setUTCDate(d.getUTCDate() + 1);
          return toDateInputValue(d);
        })()
      : "";
    setExtendDateValue(minNextDay);
    setShowExtendModal(true);
  }, [canExtendTracking, dispatch, isManageActionLoading, trackingEndDate]);

  const handleCloseExtend = useCallback(() => {
    if (isExtendLoading) return;
    extendRequestedRef.current = false;
    setShowExtendModal(false);
    setExtendDateValue("");
    dispatch(resetShopifyExtendDiscountTracking());
  }, [dispatch, isExtendLoading]);

  const handleConfirmExtend = useCallback(() => {
    if (!liveCode?.id || !extendDateValue || isExtendLoading) return;
    extendRequestedRef.current = true;
    dispatch(
      extendShopifyDiscountTracking({
        id: liveCode.id,
        trackingEndDate: new Date(`${extendDateValue}T23:59:59.999Z`).toISOString(),
      })
    );
  }, [dispatch, liveCode?.id, extendDateValue, isExtendLoading]);

  const canRename =
    isManageEnabled &&
    liveCode &&
    !liveCode.hasAttributedSales &&
    LIVE_STATUSES.has(liveCode.status) &&
    liveCode.status !== "deactivated";

  const minExtendDate = useMemo(() => {
    if (!trackingEndDate) return undefined;
    const d = new Date(trackingEndDate);
    d.setUTCDate(d.getUTCDate() + 1);
    return toDateInputValue(d);
  }, [trackingEndDate]);

  return {
    isAffiliate,
    isLoading,
    liveCode,
    historyCodes,
    isCodeCopied,
    trackingPaused,
    manageOpen,
    manageMenuRef,
    showRenameModal,
    renameValue,
    setRenameValue,
    showKillConfirm,
    handleCloseKillConfirm,
    showExtendModal,
    extendDateValue,
    setExtendDateValue,
    isRenameLoading,
    isManageActionLoading,
    isKillLoading,
    isExtendLoading,
    canRename,
    canExtendTracking,
    isManageEnabled,
    trackingEndDate,
    payoutDate,
    previewPayoutDate,
    formatDisplayDate,
    minExtendDate,
    usageCount,
    usageCap,
    hasUsageCap,
    handleCopyCode,
    handleRefreshCodes,
    handleToggleManage,
    handleOpenRename,
    handleCloseRename,
    handleConfirmRename,
    handleTurnOff,
    handleTurnOn,
    handleOpenKillConfirm,
    handleConfirmKill,
    handleOpenExtend,
    handleCloseExtend,
    handleConfirmExtend,
  };
}
