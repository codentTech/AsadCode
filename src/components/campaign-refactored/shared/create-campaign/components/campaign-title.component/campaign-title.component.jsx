import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import FieldLabel from "@/common/components/field-label/field-label.component";
import RequirementToggle from "@/common/components/requirement-toggle/requirement-toggle.component";
import {
  EXCLUSIVITY_CLAUSE_OPTIONS,
  USAGE_RIGHTS_OPTIONS,
} from "@/common/constants/options.constant";
import { RIGHTS_TOGGLE_OPTIONS } from "../../requirement-toggle.options";
import QuantityDeliverableInput from "../quantity-deliverable-input/quantity-deliverable-input.component";
import SearchableNicheInput from "../searchable-niche-input/searchable-niche-input.component";
import useCampaignTitle from "./use-campaign-title.hook";

function RightsField({
  label,
  name,
  options,
  defaultValue,
  error,
  requirementValue,
  onSelectChange,
  onRequirementChange,
}) {
  return (
    <div className="min-w-0">
      <FieldLabel label={label} />
      <div className="mt-1.5 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <div className="min-w-0 flex-1">
          <SimpleSelect
            placeHolder={`Select ${label.toLowerCase()}`}
            options={options}
            defaultValue={defaultValue}
            onChange={onSelectChange}
            errors={error ? { [name]: { message: error } } : null}
            name={name}
          />
        </div>
        <RequirementToggle
          prefix="Requirement:"
          className="!mt-0 shrink-0 sm:justify-end"
          value={requirementValue}
          options={RIGHTS_TOGGLE_OPTIONS}
          onChange={onRequirementChange}
        />
      </div>
    </div>
  );
}

function CampaignTitle({ register, errors = {}, watch, setValue }) {
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
  } = useCampaignTitle({ watch, setValue });

  return (
    <div className="flex flex-col gap-3">
      <section className="rounded-lg border border-gray-200 p-3">
        <div className="flex flex-col gap-2.5">
          <CustomInput
            label="Campaign Title"
            name="campaign_title"
            register={register}
            errors={errors}
            placeholder="Enter a descriptive campaign title"
            isRequired={true}
            className="w-full"
          />
          <SearchableNicheInput
            selectedNiches={selectedNiches}
            onNichesChange={handleNicheChange}
            placeholder="Type to search niches..."
            handleNicheRemove={handleNicheRemove}
          />
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 p-3">
        <QuantityDeliverableInput
          deliverables={selectedDeliverables}
          onDeliverablesChange={handleDeliverableChange}
          error={errors.deliverables?.message}
        />
      </section>

      <section className="rounded-lg border border-gray-200 p-3">
        <div className="flex flex-col gap-3">
          <RightsField
            label="Usage Rights"
            name="usageRights"
            options={USAGE_RIGHTS_OPTIONS}
            defaultValue={usageRightsValue}
            error={errors.usageRights?.message}
            requirementValue={usageRightsRequirement}
            onSelectChange={(option) =>
              setValue("usageRights", option.value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            onRequirementChange={(status) =>
              setValue("usageRightsRequirement", status, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
          <RightsField
            label="Exclusivity Clause"
            name="exclusivityClause"
            options={EXCLUSIVITY_CLAUSE_OPTIONS}
            defaultValue={exclusivityValue}
            error={errors.exclusivityClause?.message}
            requirementValue={exclusivityRequirement}
            onSelectChange={(option) =>
              setValue("exclusivityClause", option.value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            onRequirementChange={(status) =>
              setValue("exclusivityClauseRequirement", status, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
        </div>
      </section>
    </div>
  );
}

export default CampaignTitle;
