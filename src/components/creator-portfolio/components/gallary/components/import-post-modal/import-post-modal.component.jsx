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
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <p className="-mt-3 text-xs text-gray-500">
          Paste a link to a post from your connected account. We&apos;ll automatically pull the
          caption and performance data.
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

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200">
          <CustomButton className="btn-cancel" text="Cancel" onClick={handleClose} type="button" />
          <CustomButton
            className="btn-primary"
            text="Import Post"
            type="submit"
            loading={isLoading}
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
