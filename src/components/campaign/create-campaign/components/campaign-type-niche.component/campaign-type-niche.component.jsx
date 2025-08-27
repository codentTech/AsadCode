import CustomInput from "@/common/components/custom-input/custom-input.component";
import Niche from "@/components/niche/niche";
import { X, AlertCircle } from "lucide-react";

/**
 * Campaign Type & Niche Selection Component
 *
 * Handles campaign title input, niche selection, and deliverable management.
 * First step in the campaign creation wizard.
 */
function CampaignTypeNiche({
  register,
  errors = {},
  watch,
  setValue,
  addDeliverable,
  removeDeliverable,
}) {
  const watchedValues = watch?.() || {};
  const selectedDeliverables = watchedValues.deliverables || [];

  const deliverableOptions = ["Feed Post", "Story: 3+ Frames", "Reel"];

  // Handle niche selection
  const handleNicheChange = (niche) => {
    if (!setValue) return;

    if (niche === "all") {
      setValue("niches", []);
    } else {
      const currentNiches = watch?.("niches") || [];
      const updatedNiches = currentNiches.includes(niche)
        ? currentNiches.filter((n) => n !== niche)
        : [...currentNiches, niche];
      setValue("niches", updatedNiches);
    }
  };

  return (
    <div className="space-y-6">
      {/* Campaign Title */}
      <div className="space-y-2">
        <CustomInput
          label="Campaign Title"
          name="campaign_title"
          register={register}
          errors={errors}
          placeholder="Enter a descriptive campaign title"
          isRequired={true}
          className="w-full"
        />
      </div>

      {/* Niche Selection */}
      <div className="space-y-2">
        <div className="p-4 bg-gray-50 rounded-lg border">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">Select Niche(s) *</h4>
          <div className="flex flex-wrap gap-2">
            <Niche selectedNiche="all" onNicheChange={handleNicheChange} />
          </div>

          {/* Selected Niches Display */}
          {watch?.("niches")?.length > 0 && (
            <div className="mt-3">
              <h5 className="text-xs font-semibold text-gray-600 mb-2">Selected Niches:</h5>
              <div className="flex flex-wrap gap-2">
                {watch("niches").map((niche) => (
                  <span
                    key={niche}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {niche}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        {errors.niches && <p className="text-sm text-red-600">{errors.niches.message}</p>}
      </div>

      {/* Deliverables */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-600">
          Select Deliverables
          <span className="text-xs text-gray-400 ml-1">(Click multiple times for duplicates)</span>
        </label>

        {/* Deliverable Options */}
        <div className="flex flex-wrap gap-2">
          {deliverableOptions.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => addDeliverable?.(item)}
              className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-sm hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Selected Deliverables */}
        {selectedDeliverables.length > 0 && (
          <div className="mt-3">
            <h4 className="text-xs font-semibold text-gray-600 mb-2">Selected Deliverables:</h4>
            <div className="flex flex-wrap gap-2 text-sm">
              {selectedDeliverables.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="relative flex items-center px-3 py-1 bg-white border text-gray-600 rounded-md shadow-sm pr-10"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => removeDeliverable?.(index)}
                    className="absolute top-1.5 right-1 text-gray-400 hover:text-red-600 transition-colors"
                    aria-label={`Remove ${item}`}
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
