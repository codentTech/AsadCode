import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CAMPAIGN_TYPE } from "@/common/constants/campaign.constant";
import {
  deactivateShopifyDiscountCode,
  getShopifyDiscountCodes,
  killAndReissueShopifyDiscountCode,
  reactivateShopifyDiscountCode,
  renameShopifyDiscountCode,
  resetShopifyKillAndReissueDiscountCode,
  resetShopifyRenameDiscountCode,
  selectShopifyDiscountCodesState,
} from "@/provider/features/shopify/shopify.slice";

const LIVE_STATUSES = new Set(["active", "pending", "deactivated"]);

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
  const manageMenuRef = useRef(null);
  const renameRequestedRef = useRef(false);
  const killRequestedRef = useRef(false);

  const [isCodeCopied, setIsCodeCopied] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [showKillConfirm, setShowKillConfirm] = useState(false);

  const data = discountCodesState?.data;
  const isLoading = Boolean(discountCodesState?.isLoading);
  const isRenameLoading = Boolean(renameState?.isLoading);
  const isDeactivateLoading = Boolean(deactivateState?.isLoading);
  const isReactivateLoading = Boolean(reactivateState?.isLoading);
  const isKillLoading = Boolean(killState?.isLoading);
  const isManageActionLoading =
    isDeactivateLoading || isReactivateLoading || isKillLoading;

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

  const canRename =
    isManageEnabled &&
    liveCode &&
    !liveCode.hasAttributedSales &&
    LIVE_STATUSES.has(liveCode.status) &&
    liveCode.status !== "deactivated";

  return {
    isAffiliate,
    isLoading,
    liveCode,
    historyCodes,
    isCodeCopied,
    manageOpen,
    manageMenuRef,
    showRenameModal,
    renameValue,
    setRenameValue,
    showKillConfirm,
    handleCloseKillConfirm,
    isRenameLoading,
    isManageActionLoading,
    isKillLoading,
    canRename,
    isManageEnabled,
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
  };
}
