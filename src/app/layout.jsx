"use client";

import "@/common/styles/dashboard/dashboard.style.css";
import "@/common/styles/globals.style.css";
import "@/common/styles/home.style.scss";
import { persistor, store } from "@/provider/store";
import styled from "@emotion/styled";
import { StyledEngineProvider } from "@mui/material";
import { Loader } from "lucide-react";
import { usePathname } from "next/navigation";
import { MaterialDesignContent, SnackbarProvider } from "notistack";
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

function LayoutWrapper({ children }) {
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Next.js App Router doesn’t expose router events like Pages Router
    // but we can use the usePathname hook to detect route changes

    setLoading(true); // start loading on path change
    // Delay hiding loading state a bit for smoothness
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <React.Fragment>
      {loading && (
        <div className="fixed inset-0 w-screen h-screen bg-white/90 flex justify-center items-center z-[9999]">
          <Loader className="animate-spin" />
        </div>
      )}
      <React.Fragment>{children}</React.Fragment>
    </React.Fragment>
  );
}

/**
 * It is a root wrapper for all pages
 * @param {children} props
 * @returns page component with html wrapped around it
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Cleercut</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
      </head>
      <body>
        <StyledEngineProvider injectFirst>
          <SnackbarProvider
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            autoHideDuration={3000}
            maxSnack={2}
            Components={{
              success: StyledMaterialDesignContent,
              error: StyledMaterialDesignContent,
            }}
          >
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <LayoutWrapper>{children}</LayoutWrapper>
              </PersistGate>
            </Provider>
          </SnackbarProvider>
        </StyledEngineProvider>
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.element.isRequired,
};
