"use client";

import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { connectSocialMedia, getSocialAccounts } from "@/provider/features/users/users.slice";

export default function usePhylloConnect() {
  const dispatch = useDispatch();
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastMicrositeUrl, setLastMicrositeUrl] = useState(null);

  const openConnect = useCallback(
    async ({ onOpened } = {}) => {
      setIsConnecting(true);
      try {
        // Backend returns { success, data: { microsite_url, invite_id } }
        const result = await dispatch(connectSocialMedia()).unwrap();
        const micrositeUrl = result?.data?.microsite_url || null;

        if (!micrositeUrl) {
          throw new Error("microsite_url missing from response");
        }

        setLastMicrositeUrl(micrositeUrl);
        window.open(micrositeUrl, "_blank", "noopener,noreferrer");
        onOpened?.(micrositeUrl);
        return micrositeUrl;
      } finally {
        // Don't refresh accounts here; webhook ingestion will update the backend.
        // Callers can manually refresh using getSocialAccounts() after connect completes.
        setIsConnecting(false);
      }
    },
    [dispatch]
  );

  const refreshConnectedAccounts = useCallback(async () => {
    return await dispatch(getSocialAccounts()).unwrap();
  }, [dispatch]);

  return {
    isConnecting,
    lastMicrositeUrl,
    openConnect,
    refreshConnectedAccounts,
  };
}

