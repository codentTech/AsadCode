import React from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import CustomButton from "@/common/components/custom-button/custom-button.component";

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
  img,
  crossImg,
  cancelText,
  confirmText,
  cancelTextStyling,
  confirmTextStyling,
  qrCode = false,
  qrCodeImage,
}) {
  return (
    <Dialog
      open={show}
      onClose
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "474px",
          borderRadius: "20px",
          padding: "0",
        },
      }}
    >
      <div className="my-scroll max-h-full max-w-full overflow-y-auto ">
        {crossImg && (
          <div className="flex justify-between">
            <div></div>
            <div
              className="mx-6 mt-6 hover:cursor-pointer"
              onClick={() => close(false)}
            >
              <img src={crossImg} alt="img" />
            </div>
          </div>
        )}
        <DialogContent sx={{ padding: "0px 0px 0px 0px" }}>
          <div className="flex flex-col items-center rounded-[20px] bg-white px-6 py-10">
            <div className="">
              <img src={img} alt="img" />
            </div>
            {message && <h3 className={messageStyling}>{message}</h3>}
            {content && <div className={contentStyling}>{content}</div>}
            {subContent && (
              <div className={subContentStyling}>{subContent}</div>
            )}
            {qrCode ? (
              <div className="mt-[39px] h-[135px] w-[134px]">
                <img
                  src={qrCodeImage}
                  alt="img"
                  className="h-[135px] w-[134px]"
                />
              </div>
            ) : (
              <div className="mt-8 flex justify-center gap-8">
                <CustomButton
                  onClick={onCancel}
                  text={cancelText}
                  className={cancelTextStyling}
                />
                <CustomButton
                  text={confirmText}
                  type="submit"
                  className={confirmTextStyling}
                  onClick={onConfirm}
                />
              </div>
            )}
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
  img: PropTypes.string,
  crossImg: PropTypes.string,
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
  cancelTextStyling: PropTypes.string,
  confirmTextStyling: PropTypes.string,
  qrCode: PropTypes.bool,
  qrCodeImage: PropTypes.string,
};
