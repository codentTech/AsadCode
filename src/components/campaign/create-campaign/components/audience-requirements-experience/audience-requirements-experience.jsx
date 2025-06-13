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
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <CustomInput
          label="Minimum Combined Followers"
          type="number"
          isRequired={true}
          name="minCombinedFollowers"
          value={campaignData.minCombinedFollowers}
          onChange={handleChange}
          placeholder="2000"
        />
      </div>

      <div>
        <h4 className="font-bold mb-3">Platform-Specific Minimum (Optional)</h4>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <CustomInput
            label="Instagram"
            type="number"
            name="platformMinimums.instagram"
            value={campaignData.platformMinimums.instagram}
            onChange={(e) =>
              setCampaignData((prev) => ({
                ...prev,
                platformMinimums: {
                  ...prev.platformMinimums,
                  instagram: e.target.value,
                },
              }))
            }
            placeholder="Min followers"
          />

          <CustomInput
            label="TikTok"
            type="number"
            name="platformMinimums.tiktok"
            value={campaignData.platformMinimums.tiktok}
            onChange={(e) =>
              setCampaignData((prev) => ({
                ...prev,
                platformMinimums: {
                  ...prev.platformMinimums,
                  tiktok: e.target.value,
                },
              }))
            }
            placeholder="Min followers"
          />

          <CustomInput
            label="YouTube"
            type="number"
            name="platformMinimums.youtube"
            value={campaignData.platformMinimums.youtube}
            onChange={(e) =>
              setCampaignData((prev) => ({
                ...prev,
                platformMinimums: {
                  ...prev.platformMinimums,
                  youtube: e.target.value,
                },
              }))
            }
            placeholder="Min subscribers"
          />

          <CustomInput
            label="Facebook"
            type="number"
            name="platformMinimums.facebook"
            value={campaignData.platformMinimums.facebook}
            onChange={(e) =>
              setCampaignData((prev) => ({
                ...prev,
                platformMinimums: {
                  ...prev.platformMinimums,
                  facebook: e.target.value,
                },
              }))
            }
            placeholder="Min followers"
          />

          <CustomInput
            label="Pinterest"
            type="number"
            name="platformMinimums.pinterest"
            value={campaignData.platformMinimums.pinterest}
            onChange={(e) =>
              setCampaignData((prev) => ({
                ...prev,
                platformMinimums: {
                  ...prev.platformMinimums,
                  pinterest: e.target.value,
                },
              }))
            }
            placeholder="Min followers"
          />
        </div>
      </div>

      <div className="w-full max-w-[235px]">
        <SimpleSelect
          label="Required platforms"
          placeHolder="Select an option"
          options={socialMediaPlatformOptions}
          isMulti={true}
          isSearchable={true}
        />
      </div>
    </div>
  );
}

export default AudienceRequirementsExperience;
