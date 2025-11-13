import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import React from "react";
import CustomCheckboxGroup from "@/common/components/custom-checkbox/custom-checkbox.component";

/**
 * Audience Requirements & Experience Component
 *
 * Handles follower requirements, platform-specific minimums,
 * and required platform selection for campaigns.
 */
function AudienceRequirementsExperience({ campaignData, errors = {}, register, setValue, watch }) {
  // Available social media platforms
  const platformOptions = [
    { label: "Instagram", value: "Instagram" },
    { label: "TikTok", value: "TikTok" },
    { label: "YouTube", value: "YouTube" },
    { label: "Facebook", value: "Facebook" },
    { label: "Pinterest", value: "Pinterest" },
    { label: "Other", value: "Other" },
  ];

  // Platform minimums configuration
  const platformMinimums = [
    { key: "instagram", label: "Instagram" },
    { key: "tiktok", label: "TikTok" },
    { key: "youtube", label: "YouTube" },
    { key: "facebook", label: "Facebook" },
    { key: "pinterest", label: "Pinterest" },
  ];

  // Handle platform minimum changes
  const handlePlatformMinimumChange = (platformKey, value) => {
    if (setValue) {
      setValue(`platformMinimums.${platformKey}`, value);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Follower Requirement */}
      <div className="space-y-2">
        <h4 className="text-sm font-bold text-gray-800">Follower Requirements</h4>
        <div className="w-full max-w-xs">
          <CustomInput
            label="Minimum Combined Followers"
            type="number"
            isRequired={true}
            name="min_combined_followers"
            placeholder="e.g., 2000"
            errors={errors}
            register={register}
          />
        </div>
      </div>

      {/* Platform-Specific Minimums */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-gray-800">
          Platform-Specific Minimums
          <span className="text-xs text-gray-500 font-normal ml-1">(Optional)</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {platformMinimums.map((platform) => (
            <CustomInput
              key={platform.key}
              label={platform.label}
              type="number"
              name={`platformMinimums.${platform.key}`}
              register={register}
              errors={errors}
              placeholder="e.g., 1000"
            />
          ))}
        </div>
      </div>

      {/* Required Platforms */}
      <div className="space-y-2">
        <div className="border rounded-lg p-4">
          <CustomCheckboxGroup
            label="Required Platforms"
            options={platformOptions}
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
