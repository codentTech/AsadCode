"use client";

import FullPageLoader from "@/common/components/loader/full-page-loader.component";
import ImpersonationBanner from "@/common/components/impersonation-banner/impersonation-banner.component";
import ChatProvider from "@/provider/chat-provider";
import { persistor, store } from "@/provider/store";
import styled from "@emotion/styled";
import { StyledEngineProvider } from "@mui/material";
import { usePathname } from "next/navigation";
import { MaterialDesignContent, SnackbarProvider, useSnackbar } from "notistack";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
  "&.notistack-MuiContent-success": {
    backgroundColor: "rgb(222 255 228)",
    color: "green",
  },
  "&.notistack-MuiContent-error": {
    backgroundColor: "rgb(255 222 222)",
    color: "red",
  },
}));

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

export default function AppProviders({ children }) {
  return (
    <StyledEngineProvider injectFirst>
      <SnackbarProvider
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        autoHideDuration={8000}
        maxSnack={3}
        Components={{
          success: StyledMaterialDesignContent,
          error: StyledMaterialDesignContent,
        }}
      >
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ChatProvider>
              <LayoutWrapper>{children}</LayoutWrapper>
            </ChatProvider>
          </PersistGate>
        </Provider>
      </SnackbarProvider>
    </StyledEngineProvider>
  );
}

AppProviders.propTypes = {
  children: PropTypes.node.isRequired,
};
