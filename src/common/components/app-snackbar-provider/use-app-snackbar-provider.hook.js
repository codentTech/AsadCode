"use client";

import { closeSnackbar } from "notistack";
import { useCallback } from "react";

const ANCHOR_ORIGIN = { vertical: "bottom", horizontal: "right" };

export default function useAppSnackbarProvider() {
  const handleClose = useCallback((snackbarId) => {
    closeSnackbar(snackbarId);
  }, []);

  return { anchorOrigin: ANCHOR_ORIGIN, handleClose };
}
