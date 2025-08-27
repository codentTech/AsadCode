import { CancelOutlined, Delete } from "@mui/icons-material";
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
  closeText,
  action,
  type,
}) {
  return (
    <div>
      <Dialog className="scrol-bar" ref={confirmationRef} open={openConfirmationPopup}>
        <div className="max-h-full w-[471px] max-w-full pb-6">
          <div className="flex h-14 items-center justify-between px-5">
            <div className="text-xl font-medium not-italic leading-[30px] text-text-dark-gray" />
            <div className="hover:cursor-pointer" onClick={() => setOpenConfirmationPopup(false)}>
              <CancelOutlined />
            </div>
          </div>
          <div className="flex flex-col items-center gap-6">
            <div>
              <div className="flex items-center justify-center rounded-full bg-red-500 w-14 h-14">
                <Delete sx={{ color: "white" }} />
              </div>
            </div>
            <div className="mt-2">
              {mainText && <div className={mainStyling}>{mainText}</div>}
              {subText && <div className={subStyling}>{subText}</div>}
            </div>
            <div className="mt-[14px] flex gap-5">
              <CustomButton
                className="border border-solid border-text-ultra-light-gray px-6 py-2 text-sm font-bold leading-[21px] text-text-medium-gray"
                text={closeText}
                onClick={() => setOpenConfirmationPopup(false)}
              />
              <CustomButton
                className={`btn-${type} items-center px-6 py-2 text-sm font-semibold not-italic leading-[normal]`}
                text={confirmText}
                onClick={() => action(id)}
              />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
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
  closeText: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default DeleteConfirmationModal;
