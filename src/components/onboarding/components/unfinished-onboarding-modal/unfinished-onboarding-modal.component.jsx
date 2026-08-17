"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import Modal from "@/common/components/modal/modal.component";
import PropTypes from "prop-types";
import useUnfinishedOnboardingModal from "./use-unfinished-onboarding-modal.hook";

export default function UnfinishedOnboardingModal({ show, onClose, resumeStep }) {
  const { title, message, buttonText, handleClose, show: isOpen } = useUnfinishedOnboardingModal({
    show,
    onClose,
    resumeStep,
  });

  return (
    <Modal show={isOpen} onClose={handleClose} title={title} size="sm">
      <div className="flex flex-col gap-4 py-1">
        <p className="text-left text-xs leading-snug text-gray-600 sm:text-sm">{message}</p>
        <div className="flex justify-end">
          <CustomButton text={buttonText} onClick={handleClose} className="btn-primary" />
        </div>
      </div>
    </Modal>
  );
}

UnfinishedOnboardingModal.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  resumeStep: PropTypes.number,
};
