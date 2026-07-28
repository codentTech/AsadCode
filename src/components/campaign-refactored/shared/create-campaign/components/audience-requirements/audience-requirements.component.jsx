import CustomInput from "@/common/components/custom-input/custom-input.component";
import FieldError from "@/common/components/field-error/field-error.component";
import FieldLabel from "@/common/components/field-label/field-label.component";
import { PLATFORM_OPTIONS } from "@/common/constants/options.constant";
import { Check } from "lucide-react";
import useAudienceRequirements from "./use-audience-requirements.hook";

function AudienceRequirementsExperience({ errors = {}, register, setValue, watch }) {
  const { platformCards, handlePlatformToggle, getPlatformIcon, getPlatformColor } =
    useAudienceRequirements({ setValue, watch });

  return (
    <div className="flex flex-col gap-3">
      <section className="rounded-lg border border-gray-200 p-3">
        <FieldLabel label="Min. Combined Followers" isRequired />
        <div className="mt-1.5 max-w-xs">
          <CustomInput
            type="number"
            name="min_combined_followers"
            placeholder="e.g., 2000"
            errors={errors}
            register={register}
            className="w-full"
          />
        </div>
        <p className="mt-1 text-[10px] leading-snug text-gray-500">
          Across all required platforms.
        </p>
      </section>

      <section className="rounded-lg border border-gray-200 p-3">
        <FieldLabel label="Required Platforms" isRequired />
        <p className="mt-1 text-[10px] leading-snug text-gray-500">
          Creators must be active on at least one selected platform.
        </p>
        <div className="mt-1.5 grid grid-cols-1 gap-1.5 sm:grid-cols-3">
          {platformCards.map((platform) => (
            <button
              key={platform.value}
              type="button"
              onClick={() => handlePlatformToggle(platform.value)}
              className={`relative flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition-colors ${
                platform.isSelected
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 bg-gray-100 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <span className={`rounded-md p-1 ${platform.colorClasses}`}>{platform.icon}</span>
              <span className="min-w-0 flex-1 text-xs font-semibold text-black">
                {platform.label}
              </span>
              {platform.isSelected ? (
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <Check className="h-2.5 w-2.5" />
                </span>
              ) : (
                <span className="h-4 w-4 shrink-0 rounded-full border border-gray-300" />
              )}
            </button>
          ))}
        </div>
        {errors?.required_platforms ? (
          <FieldError className="mt-1.5" error={errors.required_platforms.message} />
        ) : null}
      </section>

      <section className="rounded-lg border border-gray-200 p-3">
        <FieldLabel label="Platform-Specific Minimums" />
        <p className="mt-1 text-[10px] leading-snug text-gray-500">
          Optional. Set a floor for each platform if needed.
        </p>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
          {PLATFORM_OPTIONS.map((platform) => (
            <div key={platform.value} className="min-w-0">
              <div className="mb-1 flex items-center gap-1.5">
                <span className={`rounded-md p-1 ${getPlatformColor(platform.value)}`}>
                  {getPlatformIcon(platform.value)}
                </span>
                <span className="text-xs font-medium text-gray-700">{platform.label}</span>
              </div>
              <CustomInput
                type="number"
                name={`platformMinimums.${platform.value}`}
                register={register}
                errors={errors}
                placeholder="e.g., 1000"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AudienceRequirementsExperience;
