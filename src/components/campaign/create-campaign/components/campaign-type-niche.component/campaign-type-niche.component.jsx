import CustomInput from "@/common/components/custom-input/custom-input.component";
import SearchableNicheInput from "../searchable-niche-input/searchable-niche-input.component";
import QuantityDeliverableInput from "../quantity-deliverable-input/quantity-deliverable-input.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import { X } from "lucide-react";
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
  const selectedNiches = watchedValues.niches || [];
  const selectedDeliverables = watchedValues.deliverables || [];

  console.log("Current form values:", watchedValues);
  console.log("Selected niches from form:", selectedNiches);

  // Handle niche selection
  const handleNicheChange = (niches) => {
    console.log("Parent handleNicheChange called with:", niches);
    if (!setValue) return;
    setValue("niches", niches);
    console.log("Set niches in form:", niches);
  };

  // Handle deliverable selection
  const handleDeliverableChange = (deliverables) => {
    if (!setValue) return;
    setValue("deliverables", deliverables);
  };

  // Handle niche removal
  const handleNicheRemove = (nicheToRemove) => {
    const newNiches = selectedNiches.filter((niche) => niche !== nicheToRemove);
    handleNicheChange(newNiches);
  };

  return (
    <div className="space-y-4">
      {/* Campaign Title and Niche Selection - Same Line */}
      <div className="flex gap-4">
        {/* Campaign Title */}
        <div className="flex-1">
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
        <div className="flex-1">
          <SearchableNicheInput
            selectedNiches={selectedNiches}
            onNichesChange={handleNicheChange}
            placeholder="Type to search niches..."
            handleNicheRemove={handleNicheRemove}
          />
        </div>
      </div>

      {/* Selected Niches */}
      {selectedNiches.length > 0 && (
        <div className="space-y-1">
          <h5 className="text-xs font-semibold text-gray-600">Selected:</h5>
          <div className="flex flex-wrap gap-1">
            {selectedNiches.map((niche) => (
              <span
                key={niche}
                className="inline-flex items-center gap-1 px-2 bg-gray-100 text-gray-600 text-xs rounded-lg border border-primary"
              >
                {niche}
                <CustomButton
                  text=""
                  onClick={() => handleNicheRemove(niche)}
                  className="hover:bg-white hover:bg-opacity-20 rounded-lg p-0.5 transition-colors bg-transparent shadow-none min-w-0"
                  startIcon={<X className="text-black w-3 h-3 ml-4" />}
                />
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Deliverables */}
      <div className="space-y-2">
        <QuantityDeliverableInput
          deliverables={selectedDeliverables}
          onDeliverablesChange={handleDeliverableChange}
          error={errors.deliverables?.message}
        />
      </div>
    </div>
  );
}

export default CampaignTypeNiche;
