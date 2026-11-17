"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  disconnectShopify,
  getShopifyConnection,
  getShopifyConnectUrl,
  getShopifyInstallUrl,
  resetShopifyConnectUrl,
  resetShopifyDisconnect,
  resetShopifyInstallUrl,
  selectShopifyConnectionState,
  selectShopifyConnectUrlState,
  selectShopifyDisconnectState,
  selectShopifyInstallUrlState,
} from "@/provider/features/shopify/shopify.slice";

export default function useShopifyIntegration() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const autoConnectStarted = useRef(false);

  const { data: connection, isLoading: connectionLoading } = useSelector(
    selectShopifyConnectionState
  );
  const {
    data: connectUrlData,
    isLoading: connectLoading,
    isSuccess: connectSuccess,
  } = useSelector(selectShopifyConnectUrlState);
  const {
    data: installUrlData,
    isLoading: installLoading,
    isSuccess: installSuccess,
  } = useSelector(selectShopifyInstallUrlState);
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

  const isConnected = connection?.connected === true;
  const isAccessLost = connection?.status === "access_lost";
  const previousShopDomain = connection?.shopDomain || connection?.shopName || "";

  useEffect(() => {
    if (connectionLoading || !connection || autoConnectStarted.current) return;
    if (isConnected) return;

    const params = new URLSearchParams(window.location.search);
    const shop = params.get("shop");
    if (!shop) return;

    autoConnectStarted.current = true;
    const payload = { shop };
    const hmac = params.get("hmac");
    const timestamp = params.get("timestamp");
    const host = params.get("host");
    if (hmac) payload.hmac = hmac;
    if (timestamp) payload.timestamp = timestamp;
    if (host) payload.host = host;

    dispatch(getShopifyConnectUrl(payload));
    router.replace("/settings/integrations/shopify", { scroll: false });
  }, [connection, connectionLoading, dispatch, isConnected, router]);

  useEffect(() => {
    if (connectSuccess && connectUrlData?.authUrl) {
      window.location.href = connectUrlData.authUrl;
      dispatch(resetShopifyConnectUrl());
    }
  }, [connectSuccess, connectUrlData, dispatch]);

  useEffect(() => {
    if (installSuccess && installUrlData?.installUrl) {
      window.location.href = installUrlData.installUrl;
      dispatch(resetShopifyInstallUrl());
    }
  }, [installSuccess, installUrlData, dispatch]);

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
        "Install CleerCut from Shopify to create Affiliate campaigns, discount codes, and track sales.",
    };
  }, [connection, connectionLoading, isAccessLost, isConnected]);

  const handleReconnect = useCallback(() => {
    const shop = previousShopDomain?.trim();
    if (!shop) return;
    dispatch(getShopifyConnectUrl({ shop }));
  }, [dispatch, previousShopDomain]);

  const handleInstallFromShopify = useCallback(() => {
    dispatch(getShopifyInstallUrl());
  }, [dispatch]);

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
    handleReconnect,
    handleInstallFromShopify,
    handleDisconnectClick,
    handleConfirmDisconnect,
    handleCloseDisconnectConfirm,
    showDisconnectConfirm,
    setShowDisconnectConfirm,
    disconnectConfirmSubText,
    isConnected,
    isAccessLost,
    previousShopDomain,
    statusConfig,
    connection,
    connectionLoading,
    connectLoading,
    installLoading,
    disconnectLoading,
  };
}
