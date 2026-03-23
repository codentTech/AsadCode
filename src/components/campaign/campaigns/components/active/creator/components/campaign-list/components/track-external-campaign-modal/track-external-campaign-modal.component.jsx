import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Modal from "@/common/components/modal/modal.component";
import SearchableNicheInput from "@/components/campaign/create-campaign/components/searchable-niche-input/searchable-niche-input.component";
import QuantityDeliverableInput from "@/components/campaign/create-campaign/components/quantity-deliverable-input/quantity-deliverable-input.component";
import { X } from "lucide-react";
import { CAMPAIGN_TYPE_OPTIONS } from "@/common/constants/options.constant";

/**
 * Track External Campaign Modal Component
 *
 * Allows creators to track campaigns from outside CleerCut to use content planner and calendar tools.
 * Uses the same niche and deliverable UI/functionality as CampaignTypeNiche component.
 * Form validation handled by React Hook Form in the parent hook.
 */
const TrackExternalCampaignModal = ({
  show,
  onClose,
  register,
  handleSubmit,
  onSubmit,
  setValue,
  formData,
  errors,
  createLoading,
}) => {
  // Platform Options
  const platformOptions = [
    { label: "TikTok", value: "tiktok" },
    { label: "Instagram", value: "instagram" },
    { label: "YouTube", value: "youtube" },
    { label: "Other", value: "other" },
  ];

  // Handle niche selection (updates React Hook Form)
  const handleNicheChange = (niches) => {
    setValue("niches", niches, { shouldValidate: true });
  };

  // Handle niche removal
  const handleNicheRemove = (nicheToRemove) => {
    const newNiches = (formData.niches || []).filter((niche) => niche !== nicheToRemove);
    handleNicheChange(newNiches);
  };

  // Handle deliverable selection (updates React Hook Form)
  const handleDeliverableChange = (deliverables) => {
    setValue("deliverables", deliverables);
  };

  // Handle platform change (updates React Hook Form)
  const handlePlatformChange = (platform) => {
    const currentPlatforms = formData.platforms || [];
    const newPlatforms = currentPlatforms.includes(platform)
      ? currentPlatforms.filter((p) => p !== platform)
      : [...currentPlatforms, platform];
    setValue("platforms", newPlatforms, { shouldValidate: true });
  };

  return (
    <Modal show={show} title="Track External Campaign" onClose={onClose} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-sm text-gray-600 mb-4">
          Add campaigns from outside CleerCut to use our content planner and calendar tools.
        </p>

        {/* Campaign Title & Brand Name (Most Important Info) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <CustomInput
              label="Campaign Title"
              name="campaignTitle"
              register={register}
              errors={errors}
              placeholder="e.g., Summer Collection Launch"
              isRequired={true}
            />
          </div>
          <div>
            <CustomInput
              label="Brand Name"
              name="brandName"
              register={register}
              errors={errors}
              placeholder="e.g., Nike"
              isRequired={true}
            />
          </div>
        </div>

        {/* Type of Work & Niche */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <SimpleSelect
              label="Type of Work"
              placeHolder="Select work type"
              options={CAMPAIGN_TYPE_OPTIONS}
              onChange={(option) => {
                // SimpleSelect returns entire option object, extract value
                const value = option?.value || option;
                setValue("typeOfWork", value, { shouldValidate: true });
              }}
              required
            />
            {errors.typeOfWork && (
              <p className="text-red-500 text-xs mt-1">{errors.typeOfWork.message}</p>
            )}
          </div>
          <div>
            <SearchableNicheInput
              selectedNiches={formData.niches || []}
              onNichesChange={handleNicheChange}
              placeholder="Type to search niches..."
              handleNicheRemove={handleNicheRemove}
            />
            {errors.niches && <p className="text-red-500 text-xs mt-1">{errors.niches.message}</p>}
          </div>
        </div>

        {/* Selected Niches */}
        {formData.niches && formData.niches.length > 0 && (
          <div className="space-y-1">
            <h5 className="text-xs font-semibold text-gray-600">Selected:</h5>
            <div className="flex flex-wrap gap-1">
              {formData.niches.map((niche) => (
                <span
                  key={niche}
                  className="inline-flex items-center gap-1 px-2 bg-gray-100 text-gray-600 text-xs rounded-lg border border-primary"
                >
                  {niche}
                  <CustomButton
                    text=""
                    type="button"
                    onClick={() => handleNicheRemove(niche)}
                    className="hover:bg-white hover:bg-opacity-20 rounded-lg p-0.5 transition-colors bg-transparent shadow-none min-w-0"
                    startIcon={<X className="text-black w-3 h-3 ml-4" />}
                  />
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Platform(s) */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Platform(s) <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {platformOptions.map((platform) => (
              <label key={platform.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={(formData.platforms || []).includes(platform.value)}
                  onChange={() => handlePlatformChange(platform.value)}
                  className="w-4 h-4 text-slate-600 rounded mr-2"
                />
                <span className="text-sm text-gray-700">{platform.label}</span>
              </label>
            ))}
          </div>
          {errors.platforms && (
            <p className="text-red-500 text-xs mt-1">{errors.platforms.message}</p>
          )}
        </div>

        {/* Completion Date & Compensation */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <CustomInput
              label="Completion Date"
              name="completionDate"
              type="date"
              register={register}
              errors={errors}
            />
          </div>
          <div>
            <CustomInput
              label="Compensation (Optional)"
              name="compensation"
              register={register}
              errors={errors}
              placeholder="e.g., $500, Gifted"
            />
          </div>
        </div>

        {/* Deliverables */}
        <div className="space-y-2">
          <QuantityDeliverableInput
            deliverables={formData.deliverables || []}
            onDeliverablesChange={handleDeliverableChange}
          />
        </div>

        <p className="text-xs text-gray-500 italic">
          *For your reference only – not added to CleerCut income totals
        </p>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 border-t pt-4">
          <CustomButton
            type="button"
            text="Cancel"
            className="btn-cancel"
            onClick={onClose}
            disabled={createLoading}
          />
          <CustomButton
            type="submit"
            text={createLoading ? "Adding..." : "Add Campaign"}
            className="btn-primary"
            disabled={createLoading}
          />
        </div>
      </form>
    </Modal>
  );
};

export default TrackExternalCampaignModal;
