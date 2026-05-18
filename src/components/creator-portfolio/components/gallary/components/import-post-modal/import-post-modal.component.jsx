import Modal from "@/common/components/modal/modal.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import useImportPostModal from "./use-import-post-modal.hook";

export default function ImportPostModal({ show, onClose, niches = [] }) {
  const {
    formData,
    handleChange,
    handleSubmit,
    handleClose,
    platformOptions,
    nicheOptions,
    requiresNiche,
    isLoading,
  } = useImportPostModal({ show, onClose, niches });

  return (
    <Modal show={show} title="Add Post Link" onClose={handleClose} size="sm">
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <SimpleSelect
          label="Platform"
          options={platformOptions}
          value={formData.platform}
          onChange={(option) => handleChange("platform", option.value)}
          isRequired
        />

        <CustomInput
          name="post_url"
          label="Post URL"
          type="url"
          placeholder="https://..."
          value={formData.post_url}
          onChange={(e) => handleChange("post_url", e.target.value)}
          isRequired
        />
        <p className="-mt-3 text-[10px] leading-snug text-gray-500 sm:text-xs">
          Paste a link to a post from your connected account. We pull the caption, metrics, and
          (when available) top comments from the network. Instagram often blocks copying the video
          file to CleerCut; use Upload File for a hosted copy and transcription.
        </p>

        {nicheOptions.length > 0 && (
          <SimpleSelect
            label={requiresNiche ? "Niche" : "Niche (Optional)"}
            placeHolder="Select a niche"
            options={nicheOptions}
            value={formData.niche_id}
            onChange={(option) => handleChange("niche_id", option.value)}
            isRequired={requiresNiche}
          />
        )}

        <div className="flex flex-col-reverse justify-end gap-2 border-t border-gray-200 pt-2 sm:flex-row">
          <CustomButton className="btn-cancel" text="Cancel" onClick={handleClose} type="button" />
          <CustomButton
            className="btn-primary"
            text="Import Post"
            type="submit"
            loading={isLoading}
            loadingText="Importing your post..."
            disabled={
              isLoading ||
              !formData.post_url?.trim() ||
              (requiresNiche && !formData.niche_id)
            }
          />
        </div>
      </form>
    </Modal>
  );
}
