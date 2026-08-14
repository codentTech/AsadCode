"use client";

import AppSnackbarProvider from "@/common/components/app-snackbar-provider/app-snackbar-provider.component";
import FullPageLoader from "@/common/components/loader/full-page-loader.component";
import ImpersonationBanner from "@/common/components/impersonation-banner/impersonation-banner.component";
import ChatProvider from "@/provider/chat-provider";
import { persistor, store } from "@/provider/store";
import { StyledEngineProvider } from "@mui/material";
import { usePathname } from "next/navigation";
import { useSnackbar } from "notistack";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

function SnackbarExposer() {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    window.enqueueSnackbar = enqueueSnackbar;
    return () => {
      delete window.enqueueSnackbar;
    };
  }, [enqueueSnackbar]);

  return null;
}

function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <React.Fragment>
      <SnackbarExposer />
      <ImpersonationBanner />
      {loading ? <FullPageLoader /> : <React.Fragment>{children}</React.Fragment>}
    </React.Fragment>
  );
}

/**
 * PersistGate must not block children during SSR. With loading={null}, the
 * gate returns null on the server, so crawlers receive an empty <body> shell
 * even when page.jsx is a Server Component. Always render children for SSR
 * and the initial paint; persist rehydration still runs in the background.
 */
function PersistGateSSR({ children }) {
  return (
    <PersistGate loading={children} persistor={persistor}>
      {children}
    </PersistGate>
  );
}

export default function AppProviders({ children }) {
  return (
    <StyledEngineProvider injectFirst>
      <AppSnackbarProvider>
        <Provider store={store}>
          <PersistGateSSR>
            <ChatProvider>
              <LayoutWrapper>{children}</LayoutWrapper>
            </ChatProvider>
          </PersistGateSSR>
        </Provider>
      </AppSnackbarProvider>
    </StyledEngineProvider>
  );
}

AppProviders.propTypes = {
  children: PropTypes.node.isRequired,
};
