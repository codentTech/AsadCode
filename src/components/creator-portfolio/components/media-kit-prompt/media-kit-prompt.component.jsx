import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Modal from "@/common/components/modal/modal.component";
import useMediaKitPrompt from "./use-media-kit-prompt.hook";

const MediaKitPrompt = ({ onSaved }) => {
  const { isVisible, url, handleUrlChange, handleDismiss, handleSave, canSave, isLoading } =
    useMediaKitPrompt({ onSaved });

  if (!isVisible) return null;

  return (
    <Modal show={isVisible} title="Add your media kit" onClose={handleDismiss} size="sm">
      <p className="text-xs leading-snug text-gray-700 sm:text-sm">
        Help brands understand what you offer by linking your media kit directly to your profile. It
        only takes a second.
      </p>
      <div className="mt-3">
        <CustomInput
          name="mediaKitUrl"
          type="url"
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://"
        />
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <CustomButton
          text="Dismiss"
          className="btn-outline flex-1 sm:flex-none"
          onClick={handleDismiss}
          disabled={isLoading}
          loading={isLoading}
        />
        <CustomButton
          text="Save"
          className="btn-primary flex-1 sm:flex-none"
          onClick={handleSave}
          disabled={!canSave || isLoading}
          loading={isLoading}
        />
      </div>
    </Modal>
  );
};

export default MediaKitPrompt;
