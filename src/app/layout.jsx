"use client";

import "@/common/styles/dashboard/dashboard.style.css";
import "@/common/styles/globals.style.css";
import "@/common/styles/home.style.scss";
import Header from "@/components/header/header";
import Footer from "@/components/home/footer/footer.component";
import { persistor, store } from "@/provider/store";
import styled from "@emotion/styled";
import { StyledEngineProvider } from "@mui/material";
import { MaterialDesignContent, SnackbarProvider } from "notistack";
import PropTypes from "prop-types";
import React from "react";
import { Provider, useSelector } from "react-redux";
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
  const isCreatorMode = useSelector(({ auth }) => auth.isCreatorMode);

  return (
    <>
      {isCreatorMode || isCreatorMode === false ? (
        <React.Fragment>
          <Header />
          <div className="pt-20">{children}</div>
          <Footer />
        </React.Fragment>
      ) : (
        <React.Fragment>{children}</React.Fragment>
      )}
    </>
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
