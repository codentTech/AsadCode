import CustomButton from "@/common/components/custom-button/custom-button.component";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import PropTypes from "prop-types";

export default function ConfirmationModal({
  show,
  close,
  onConfirm,
  onCancel,
  message,
  messageStyling,
  content,
  subContent,
  contentStyling,
  subContentStyling,
  cancelText,
  confirmText,
  confirmLoading = false,
  confirmLoadingText = "",
}) {
  const dismiss = () => {
    if (confirmLoading) {
      return;
    }
    if (onCancel) {
      onCancel();
    } else if (close) {
      close(false);
    }
  };

  const handleDialogClose = (_event, reason) => {
    if (confirmLoading && (reason === "backdropClick" || reason === "escapeKeyDown")) {
      return;
    }
    dismiss();
  };

  return (
    <Dialog
      open={show}
      onClose={handleDialogClose}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "474px",
          borderRadius: "10px",
          padding: "0",
        },
      }}
    >
      <div className="my-scroll max-h-full max-w-full overflow-y-auto ">
        <DialogContent sx={{ padding: "0px 0px 0px 0px" }}>
          <div className="flex flex-col items-center rounded-[20px] bg-white px-4 py-6 sm:px-6 sm:py-10">
            {message && <h3 className={messageStyling}>{message}</h3>}
            {content && <div className={contentStyling}>{content}</div>}
            {subContent && <div className={subContentStyling}>{subContent}</div>}

            <div className="mt-6 flex w-full flex-col-reverse gap-2 sm:mt-8 sm:flex-row sm:justify-center sm:gap-4">
              <CustomButton
                onClick={dismiss}
                text={cancelText}
                disabled={confirmLoading}
                className="btn-cancel w-full"
              />
              <CustomButton
                text={confirmText}
                onClick={onConfirm}
                disabled={confirmLoading}
                loading={confirmLoading}
                loadingText={confirmLoadingText}
                className="btn-primary w-full"
              />
            </div>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}

ConfirmationModal.propTypes = {
  show: PropTypes.bool,
  close: PropTypes.func,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  message: PropTypes.string,
  messageStyling: PropTypes.string,
  content: PropTypes.string,
  subContent: PropTypes.string,
  contentStyling: PropTypes.string,
  subContentStyling: PropTypes.string,
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
  confirmLoading: PropTypes.bool,
  confirmLoadingText: PropTypes.string,
};
