"use client";

import { CancelOutlined } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import PropTypes from "prop-types";

export default function Modal({
  show = false,
  title,
  children,
  onClose,
  size,
  height,
  fullScreenOnMobile = false,
}) {
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"), { noSsr: true });
  const fullScreen = Boolean(fullScreenOnMobile && isSmDown);

  const capMax =
    size === "xl" ? "1300px" : size === "lg" ? "800px" : size === "md" ? "600px" : "420px";

  const paperSx = fullScreen
    ? {
        margin: 0,
        maxWidth: "100%",
        width: "100%",
        height: height ? "100dvh" : "auto",
        maxHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        borderRadius: 0,
      }
    : {
        maxWidth: isSmDown ? `min(${capMax}, calc(100% - 48px))` : capMax,
        width: isSmDown ? "calc(100% - 48px)" : "100%",
        margin: isSmDown ? "20px auto" : undefined,
        display: "flex",
        flexDirection: "column",
        ...(height
          ? isSmDown
            ? {
                height: "auto",
                minHeight: 0,
                maxHeight: "min(88dvh, calc(100dvh - 64px))",
              }
            : {
                height: "90vh",
                maxHeight: "90vh",
              }
          : {
              height: "auto",
              maxHeight: isSmDown ? "min(92dvh, calc(100dvh - 48px))" : "90vh",
            }),
      };

  return (
    <Dialog
      open={show}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth={false}
      maxWidth={false}
      className="custom_modal_design"
      PaperProps={{
        className: fullScreen ? "" : "rounded-2xl",
        sx: paperSx,
      }}
    >
      <div className="flex items-center justify-between bg-primary px-3 py-3 sm:px-4 sm:py-[14px]">
        <DialogTitle className="px-0 py-0 font-dm text-base font-bold leading-snug text-white sm:text-lg sm:leading-8 md:text-xl pr-2">
          {title}
        </DialogTitle>
        {onClose && (
          <div className="hover:cursor-pointer" onClick={onClose}>
            <CancelOutlined sx={{ color: "white" }} />
          </div>
        )}
      </div>

      <DialogContent
        dividers
        sx={{
          position: "relative",
          overflowY: "auto",
          overflowX: "hidden",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          px: fullScreen ? 1.5 : 2,
          pb: 2,
          minHeight: 0,
        }}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}

Modal.propTypes = {
  show: PropTypes.bool,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  fullScreenOnMobile: PropTypes.bool,
};
