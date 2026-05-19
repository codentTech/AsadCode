import { X, AlertTriangle } from "lucide-react";
import { Dialog } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";
import CustomButton from "../custom-button/custom-button.component";

function DeleteConfirmationModal({
  id,
  confirmationRef,
  openConfirmationPopup,
  setOpenConfirmationPopup,
  mainText,
  mainStyling,
  subText,
  subStyling,
  confirmText,
  confirmLoading = false,
  confirmLoadingText = "",
  closeText,
  action,
  type,
}) {
  const dismiss = () => {
    if (confirmLoading) return;
    setOpenConfirmationPopup(false);
  };

  const handleDialogClose = (_event, reason) => {
    if (confirmLoading && (reason === "backdropClick" || reason === "escapeKeyDown")) {
      return;
    }
    dismiss();
  };

  return (
    <Dialog
      className="scrol-bar"
      ref={confirmationRef}
      open={openConfirmationPopup}
      onClose={handleDialogClose}
      maxWidth="sm"
      fullWidth
    >
      <div className="bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-50 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-3 h-3 text-red-600" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">Delete Confirmation</h3>
          </div>
          <button
            type="button"
            onClick={dismiss}
            disabled={confirmLoading}
            className="p-1 hover:bg-gray-100 rounded transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Warning Icon */}

            {/* Text Content */}
            <div className="flex-1">
              {mainText && (
                <div className={`text-sm font-medium text-gray-900 mb-1 ${mainStyling}`}>
                  {mainText}
                </div>
              )}
              {subText && <div className={`text-xs text-gray-600 ${subStyling}`}>{subText}</div>}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200">
          <CustomButton
            className="btn-cancel"
            text={closeText}
            onClick={dismiss}
            disabled={confirmLoading}
          />
          <CustomButton
            className="btn-danger"
            text={confirmText}
            onClick={() => action(id)}
            disabled={confirmLoading}
            loading={confirmLoading}
            loadingText={confirmLoadingText}
          />
        </div>
      </div>
    </Dialog>
  );
}

// Adding prop-types validation
DeleteConfirmationModal.propTypes = {
  id: PropTypes.number.isRequired,
  confirmationRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(React.Element) }),
  ]),
  openConfirmationPopup: PropTypes.bool.isRequired,
  setOpenConfirmationPopup: PropTypes.func.isRequired,
  mainText: PropTypes.string.isRequired,
  mainStyling: PropTypes.string,
  subText: PropTypes.string,
  subStyling: PropTypes.string,
  confirmText: PropTypes.string.isRequired,
  confirmLoading: PropTypes.bool,
  confirmLoadingText: PropTypes.string,
  closeText: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default DeleteConfirmationModal;
