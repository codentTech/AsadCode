"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  disconnectShopify,
  getShopifyConnection,
  getShopifyConnectUrl,
  resetShopifyConnectUrl,
  resetShopifyDisconnect,
  selectShopifyConnectionState,
  selectShopifyConnectUrlState,
  selectShopifyDisconnectState,
} from "@/provider/features/shopify/shopify.slice";

export default function useShopifyIntegration() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [shopInput, setShopInput] = useState("");
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const { data: connection, isLoading: connectionLoading } = useSelector(
    selectShopifyConnectionState
  );
  const {
    data: connectUrlData,
    isLoading: connectLoading,
    isSuccess: connectSuccess,
  } = useSelector(selectShopifyConnectUrlState);
  const { isLoading: disconnectLoading, data: disconnectData } = useSelector(
    selectShopifyDisconnectState
  );

  useEffect(() => {
    setHasMounted(true);
    dispatch(getShopifyConnection());

    const params = new URLSearchParams(window.location.search);
    if (params.get("connected") === "1") {
      dispatch(getShopifyConnection());
      router.replace("/settings/integrations/shopify", { scroll: false });
    }
  }, [dispatch, router]);

  useEffect(() => {
    if (connectSuccess && connectUrlData?.authUrl) {
      window.location.href = connectUrlData.authUrl;
      dispatch(resetShopifyConnectUrl());
    }
  }, [connectSuccess, connectUrlData, dispatch]);

  useEffect(() => {
    if (!disconnectData) return;

    if (disconnectData.disconnected) {
      setShowDisconnectConfirm(false);
      dispatch(getShopifyConnection());
      dispatch(resetShopifyDisconnect());
      return;
    }

    if (disconnectData.hasLiveAffiliateCampaigns && !disconnectData.disconnected) {
      setShowDisconnectConfirm(true);
      dispatch(resetShopifyDisconnect());
    }
  }, [disconnectData, dispatch]);

  const isConnected = connection?.connected === true;
  const isAccessLost = connection?.status === "access_lost";

  const statusConfig = useMemo(() => {
    if (connectionLoading && !connection) {
      return {
        badge: "Loading",
        badgeColor: "bg-gray-100 text-gray-700",
        description: "Checking your Shopify connection…",
      };
    }

    if (isConnected) {
      return {
        badge: "Connected",
        badgeColor: "bg-green-100 text-green-800",
        description: `Connected to ${connection?.shopName || connection?.shopDomain || "your Shopify store"}.`,
      };
    }

    if (isAccessLost) {
      return {
        badge: "Tracking paused",
        badgeColor: "bg-amber-100 text-amber-900",
        description:
          "We have lost connection to your Shopify. Sales tracking is paused. Reconnect the same store to resume.",
      };
    }

    return {
      badge: "Not connected",
      badgeColor: "bg-gray-100 text-gray-700",
      description:
        "Connect your Shopify store to create Affiliate campaigns, discount codes, and track sales on CleerCut.",
    };
  }, [connection, connectionLoading, isAccessLost, isConnected]);

  const handleShopInputChange = useCallback((event) => {
    setShopInput(event?.target?.value ?? "");
  }, []);

  const handleConnect = useCallback(() => {
    const shop = shopInput.trim();
    if (!shop) return;
    dispatch(getShopifyConnectUrl({ shop }));
  }, [dispatch, shopInput]);

  const handleDisconnectClick = useCallback(() => {
    setShowDisconnectConfirm(true);
  }, []);

  const handleConfirmDisconnect = useCallback(() => {
    dispatch(disconnectShopify({ confirm: true }));
  }, [dispatch]);

  const handleCloseDisconnectConfirm = useCallback(() => {
    if (disconnectLoading) return;
    setShowDisconnectConfirm(false);
  }, [disconnectLoading]);

  const disconnectConfirmSubText = connection?.hasLiveAffiliateCampaigns
    ? "You have a live campaign. Disconnecting will stop sales tracking. Are you sure?"
    : "Disconnecting will pause Shopify sales tracking for CleerCut. You can reconnect the same store later.";

  return {
    hasMounted,
    shopInput,
    handleShopInputChange,
    handleConnect,
    handleDisconnectClick,
    handleConfirmDisconnect,
    handleCloseDisconnectConfirm,
    showDisconnectConfirm,
    setShowDisconnectConfirm,
    disconnectConfirmSubText,
    isConnected,
    isAccessLost,
    statusConfig,
    connection,
    connectionLoading,
    connectLoading,
    disconnectLoading,
  };
}
