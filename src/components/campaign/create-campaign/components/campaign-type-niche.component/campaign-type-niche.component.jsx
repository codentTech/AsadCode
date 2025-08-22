import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Niche from "@/components/niche/niche";
import { X } from "lucide-react";

function CampaignTypeNiche({
  register,
  errors = {},
  watch,
  setValue,
  handleChange,
  handleCheckboxToggle,
  addDeliverable,
  removeDeliverable,
}) {
  const watchedValues = watch ? watch() : {};
  const selectedDeliverables = watchedValues.deliverables || [];

  const campaignTypeOptions = [
    { label: "Sponsored Post", value: "Sponsored Post" },
    { label: "UGC", value: "UGC" },
    { label: "Gifted", value: "Gifted" },
    { label: "Affiliate", value: "Affiliate" },
  ];

  const deliverableOptions = ["Feed Post", "Story: 3+ Frames", "Reel"];

  return (
    <div className="space-y-6">
      {/* Campaign Title */}
      <div className="space-y-2">
        <CustomInput
          label="Campaign Title"
          name="campaign_title"
          register={register}
          errors={errors}
          placeholder="Enter campaign title"
          isRequired={true}
          className="w-full"
        />
      </div>

      {/* Campaign Type */}
      <div className="space-y-2">
        <SimpleSelect
          label="Campaign Type"
          placeHolder="Select campaign type"
          options={campaignTypeOptions}
          value={watchedValues.campaign_type || ""}
          onChange={(option) => setValue && setValue("campaign_type", option.value)}
          isRequired={true}
        />
        {errors.campaign_type && (
          <p className="text-sm text-red-600">{errors.campaign_type.message}</p>
        )}
      </div>

      {/* Niche Selection */}
      <div className="space-y-2">
        <div className="p-4 bg-gray-50 rounded-lg border">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">Select Niche(s)</h4>
          <div className="flex flex-wrap gap-2">
            <Niche />
          </div>
        </div>
        {errors.niches && <p className="text-sm text-red-600">{errors.niches.message}</p>}
      </div>

      {/* Deliverables */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-600">
          Select Deliverables{" "}
          <span className="text-xs text-gray-400">(Click multiple times for duplicates)</span>
        </label>

        <div className="flex flex-wrap gap-2">
          {deliverableOptions.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => addDeliverable && addDeliverable(item)}
              className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-sm hover:bg-indigo-100 transition-colors"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Selected Deliverables Preview */}
        {selectedDeliverables.length > 0 && (
          <div className="mt-3">
            <h4 className="text-xs font-semibold text-gray-600 mb-2">Selected Deliverables:</h4>
            <div className="flex flex-wrap gap-2 text-sm">
              {selectedDeliverables.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="relative px-3 py-1 items-center bg-white border text-gray-600 rounded-md shadow-sm pr-10"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => removeDeliverable && removeDeliverable(index)}
                    className="absolute top-1.5 right-1 text-gray-400 hover:text-gray-900 transition-colors"
                    aria-label="Remove deliverable"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {errors.deliverables && (
          <p className="text-sm text-red-600">{errors.deliverables.message}</p>
        )}
      </div>
    </div>
  );
}

export default CampaignTypeNiche;
