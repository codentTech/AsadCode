import CustomInput from "@/common/components/custom-input/custom-input.component";
import React from "react";

function AudienceRequirementsExperience({
  campaignData,
  setCampaignData,
  handleChange,
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <CustomInput
          label="Minimum Combined Followers"
          type="number"
          name="minCombinedFollowers"
          value={campaignData.minCombinedFollowers}
          onChange={handleChange}
          placeholder="10000"
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
    </div>
  );
}

export default AudienceRequirementsExperience;
