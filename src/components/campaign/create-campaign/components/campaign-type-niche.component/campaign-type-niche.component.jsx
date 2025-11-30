import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import RequirementToggle from "@/common/components/requirement-toggle/requirement-toggle.component";
import {
  EXCLUSIVITY_CLAUSE_OPTIONS,
  NEGOTIATION_TOGGLE_OPTIONS,
  USAGE_RIGHTS_OPTIONS,
} from "@/common/constants/options.constant";
import QuantityDeliverableInput from "../quantity-deliverable-input/quantity-deliverable-input.component";
import SearchableNicheInput from "../searchable-niche-input/searchable-niche-input.component";
import useCampaignTypeNiche from "./use-campaign-type-niche.hook";

/**
 * Campaign Type & Niche Selection Component
 *
 * Handles campaign title input, niche selection, and deliverable management.
 * First step in the campaign creation wizard.
 */
function CampaignTypeNiche({ register, errors = {}, watch, setValue }) {
  const {
    selectedNiches,
    selectedDeliverables,
    usageRightsValue,
    usageRightsRequirement,
    exclusivityValue,
    exclusivityRequirement,
    handleNicheChange,
    handleDeliverableChange,
    handleNicheRemove,
  } = useCampaignTypeNiche({ watch, setValue });

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

      {/* Deliverables */}
      <div className="space-y-4">
        <QuantityDeliverableInput
          deliverables={selectedDeliverables}
          onDeliverablesChange={handleDeliverableChange}
          error={errors.deliverables?.message}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SimpleSelect
            label="Usage Rights"
            placeHolder="Select usage rights"
            options={USAGE_RIGHTS_OPTIONS}
            defaultValue={usageRightsValue}
            onChange={(option) =>
              setValue("usageRights", option.value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            error={errors.usageRights?.message}
            name="usageRights"
          />
          <RequirementToggle
            prefix="Requirement:"
            value={usageRightsRequirement}
            options={NEGOTIATION_TOGGLE_OPTIONS}
            onChange={(status) =>
              setValue("usageRightsRequirement", status, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SimpleSelect
            label="Exclusivity Clause"
            placeHolder="Select exclusivity period"
            options={EXCLUSIVITY_CLAUSE_OPTIONS}
            defaultValue={exclusivityValue}
            onChange={(option) =>
              setValue("exclusivityClause", option.value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            error={errors.exclusivityClause?.message}
            name="exclusivityClause"
          />
          <RequirementToggle
            prefix="Requirement:"
            value={exclusivityRequirement}
            options={NEGOTIATION_TOGGLE_OPTIONS}
            onChange={(status) =>
              setValue("exclusivityClauseRequirement", status, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
        </div>
      </div>
    </div>
  );
}

export default CampaignTypeNiche;
