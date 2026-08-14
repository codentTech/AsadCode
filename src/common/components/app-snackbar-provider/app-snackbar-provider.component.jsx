"use client";

import styled from "@emotion/styled";
import { X } from "lucide-react";
import { MaterialDesignContent, SnackbarProvider } from "notistack";
import PropTypes from "prop-types";
import useAppSnackbarProvider from "./use-app-snackbar-provider.hook";

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

export default function AppSnackbarProvider({ children }) {
  const { anchorOrigin, handleClose } = useAppSnackbarProvider();

  return (
    <SnackbarProvider
      anchorOrigin={anchorOrigin}
      autoHideDuration={8000}
      maxSnack={3}
      action={(snackbarId) => (
        <button
          type="button"
          aria-label="Dismiss notification"
          className="ml-1 shrink-0 rounded p-1 opacity-70 hover:bg-black/5 hover:opacity-100"
          onClick={() => handleClose(snackbarId)}
        >
          <X className="h-4 w-4" />
        </button>
      )}
      Components={{
        success: StyledMaterialDesignContent,
        error: StyledMaterialDesignContent,
      }}
    >
      {children}
    </SnackbarProvider>
  );
}

AppSnackbarProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
