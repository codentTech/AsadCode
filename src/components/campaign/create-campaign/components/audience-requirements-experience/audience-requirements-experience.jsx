import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import React from "react";

function AudienceRequirementsExperience({ campaignData, setCampaignData, handleChange }) {
  const socialMediaPlatformOptions = [
    { label: "Instagram", value: "Instagram" },
    { label: "Facebook", value: "Facebook" },
    { label: "YouTube", value: "YouTube" },
    { label: "TikTok", value: "TikTok" },
    { label: "Twitter (X)", value: "Twitter" },
    { label: "LinkedIn", value: "LinkedIn" },
    { label: "Snapchat", value: "Snapchat" },
    { label: "Pinterest", value: "Pinterest" },
    { label: "Other", value: "Other" },
  ];

  return (
    <div className="space-y-4">
      {/* Overall Follower Requirement */}
      <div className="space-y-2 w-full max-w-[237px]">
        <h4 className="text-sm font-bold text-gray-800">Follower Requirements</h4>
        <CustomInput
          label="Minimum Combined Followers"
          type="number"
          isRequired={true}
          name="minCombinedFollowers"
          value={campaignData.minCombinedFollowers}
          onChange={handleChange}
          placeholder="e.g., 2000"
        />
      </div>

      {/* Platform-Specific Minimums */}
      <div className="space-y-2">
        <h4 className="text-sm font-bold text-gray-800">Platform-Specific Minimums (Optional)</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { key: "instagram", label: "Instagram" },
            { key: "tiktok", label: "TikTok" },
            { key: "youtube", label: "YouTube" },
            { key: "facebook", label: "Facebook" },
            { key: "pinterest", label: "Pinterest" },
          ].map((platform) => (
            <CustomInput
              key={platform.key}
              label={platform.label}
              type="number"
              name={`platformMinimums.${platform.key}`}
              value={campaignData.platformMinimums[platform.key]}
              onChange={(e) =>
                setCampaignData((prev) => ({
                  ...prev,
                  platformMinimums: {
                    ...prev.platformMinimums,
                    [platform.key]: e.target.value,
                  },
                }))
              }
              placeholder="e.g., 1000"
            />
          ))}
        </div>
      </div>

      {/* Required Platforms */}
      <div className="w-full max-w-[237px] space-y-2">
        <SimpleSelect
          label="Required Platforms"
          placeHolder="Select one or more"
          options={socialMediaPlatformOptions}
          isMulti={true}
          isSearchable={true}
          name="requiredPlatforms"
          onChange={(selected) =>
            setCampaignData((prev) => ({
              ...prev,
              requiredPlatforms: selected.map((s) => s.value),
            }))
          }
          value={socialMediaPlatformOptions.filter((opt) =>
            campaignData.requiredPlatforms?.includes(opt.value)
          )}
        />
      </div>
    </div>
  );
}

export default AudienceRequirementsExperience;
