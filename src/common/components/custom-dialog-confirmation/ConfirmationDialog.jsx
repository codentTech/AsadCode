import React from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmationDialog({
  show,
  onClose,
  onConfirm,
  message,
  content,
  confirmLoading = false,
}) {
  const handleClose = () => {
    if (confirmLoading) return;
    onClose();
  };

  return (
    <Dialog
      open={show}
      onClose={(_, reason) => {
        if (confirmLoading) return;
        onClose(_, reason);
      }}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "420px",
          borderRadius: "12px",
          padding: "0",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        },
      }}
    >
      <div className="my-scroll max-h-full max-w-full overflow-y-auto">
        <DialogContent sx={{ padding: "0px" }}>
          <div className="relative bg-white rounded-xl">
            {/* Close button */}
            <button
              type="button"
              onClick={handleClose}
              disabled={confirmLoading}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              <X size={18} className="text-gray-400" />
            </button>

            {/* Header with animated icon */}
            <div className="flex items-center justify-center pt-8 pb-4 px-6">
              <div className="relative">
                <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-30 animate-pulse"></div>
                <div className="relative flex items-center justify-center w-16 h-16 bg-primary rounded-full shadow-lg">
                  <AlertTriangle
                    size={32}
                    className="text-white animate-bounce"
                    style={{ animationDuration: "2s" }}
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-6">
              <h3 className="text-lg font-bold text-center mb-2 text-primary">{message}</h3>
              {content && (
                <p className="text-sm text-gray-600 text-center mb-6 leading-relaxed">{content}</p>
              )}

              {/* Action buttons */}
              <div className="flex gap-3">
                <CustomButton
                  onClick={handleClose}
                  text="Cancel"
                  className="btn-cancel w-full"
                  disabled={confirmLoading}
                />
                <CustomButton
                  text="Confirm"
                  type="button"
                  onClick={onConfirm}
                  className="btn-primary w-full"
                  loading={confirmLoading}
                  disabled={confirmLoading}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}

ConfirmationDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
  confirmLoading: PropTypes.bool,
};
