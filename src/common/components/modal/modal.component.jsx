import { CancelOutlined } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import PropTypes from "prop-types";
import useModal from "./use-modal.hook";

export default function Modal({
  show = false,
  title,
  children,
  onClose,
  size,
  height,
}) {
  const { open, register, handleSubmit, setValue, errors, handleClose } =
    useModal(show);

  return (
    <Dialog
      open={show}
      onClose={onClose}
      className="custom_modal_design"
      PaperProps={{
        className: "rounded-2xl",
        sx: {
          maxWidth:
            size === "xl"
              ? "1300px"
              : size === "lg"
                ? "800px"
                : size === "md"
                  ? "600px"
                  : "420px",
          width: "100%",
          height: height ? "90vh" : "auto",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-primary px-4 py-[14px]">
        <DialogTitle className="px-0 py-0 font-dm text-xl font-bold leading-8 text-white">
          {title}
        </DialogTitle>
        {onClose && (
          <div className="hover:cursor-pointer" onClick={onClose}>
            <CancelOutlined sx={{ color: "white" }} />
          </div>
        )}
      </div>

      {/* Content */}
      <DialogContent
        dividers
        sx={{
          position: "relative",
          overflowY: "auto",
          flex: 1,
          px: 2,
          pb: 2,
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
};
