import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomSwitch from "@/common/components/custom-switch/custom-switch.component";
import Modal from "@/common/components/modal/modal.component";
import useReEngagementEmailModal from "./use-re-engagement-email-modal.hook";

const ReEngagementEmailModal = ({ show, onComplete }) => {
  const { popupToggleKeys, prefs, isSubmitting, handleToggle, handleSave, handleNoThanks } =
    useReEngagementEmailModal({ show, onComplete });

  return (
    <Modal show={show} onClose={handleNoThanks} title="Stay in the loop" size="md">
      <p className="bg-gray-200 p-4 rounded-lg mb-4 text-xs text-gray-600 sm:text-sm">
        Select which email notifications you would like to receive. You can update these at any time
        in Settings.
      </p>
      <ul className="mb-6 space-y-3">
        {popupToggleKeys.map((item) => (
          <li
            key={item.key}
            className="bg-gray-200 p-2 rounded-lg flex items-center justify-between gap-3"
          >
            <span className="text-xs text-gray-800 sm:text-sm">{item.label}</span>
            <CustomSwitch
              checked={Boolean(prefs[item.key])}
              onChange={(e) => handleToggle(item.key, e.target.checked)}
              disabled={isSubmitting}
            />
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <CustomButton
          text="No Thanks"
          className="btn-outline w-full sm:w-auto"
          onClick={handleNoThanks}
          disabled={isSubmitting}
          type="button"
        />
        <CustomButton
          text="Save Preferences"
          className="btn-primary w-full sm:w-auto"
          onClick={handleSave}
          disabled={isSubmitting}
          loading={isSubmitting}
          type="button"
        />
      </div>
    </Modal>
  );
};

export default ReEngagementEmailModal;
