import CustomCheckboxGroup from "@/common/components/custom-checkbox/custom-checkbox.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import { PLATFORM_OPTIONS } from "@/common/constants/options.constant";

function AudienceRequirementsExperience({ errors = {}, register, setValue, watch }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-bold text-gray-800">Follower Requirements</h4>
        <div className="w-full max-w-[200px]">
          <CustomInput
            label="Minimum Combined Followers"
            type="number"
            isRequired={true}
            name="min_combined_followers"
            placeholder="e.g., 2000"
            errors={errors}
            register={register}
            className="w-full max-w-[200px]"
          />
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-bold text-gray-800">
          Platform-Specific Minimums
          <span className="text-xs text-gray-500 font-normal ml-1">(Optional)</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PLATFORM_OPTIONS.map((platform) => (
            <CustomInput
              key={platform.value}
              label={platform.label}
              type="number"
              name={`platformMinimums.${platform.value}`}
              register={register}
              errors={errors}
              placeholder="e.g., 1000"
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="border rounded-lg p-4">
          <CustomCheckboxGroup
            label="Required Platforms"
            options={PLATFORM_OPTIONS}
            name="required_platforms"
            setValue={setValue}
            watch={watch}
            errors={errors}
            isRequired={true}
          />
        </div>
      </div>
    </div>
  );
}

export default AudienceRequirementsExperience;
