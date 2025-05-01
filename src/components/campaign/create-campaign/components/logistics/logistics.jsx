import CustomCheckboxGroup from "@/common/components/custom-checkbox/custom-checkbox.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import TextArea from "@/common/components/text-area/text-area.component";

function Logistics({ campaignData, handleChange, handleCheckboxToggle }) {
  const platformOptions = [
    { label: "Instagram", value: "Instagram" },
    { label: "TikTok", value: "TikTok" },
    { label: "YouTube", value: "YouTube" },
    { label: "Facebook", value: "Facebook" },
    { label: "Pinterest", value: "Pinterest" },
    { label: "Other", value: "Other" },
  ];

  const locationOptions = [
    { label: "Remote (Default)", value: "isRemote" },
    { label: "In-Person Required", value: "inPersonRequired" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <CustomCheckboxGroup
        label="Location"
        name="locationOptions"
        options={locationOptions}
        checkedValues={{
          isRemote: campaignData.isRemote,
          inPersonRequired: campaignData.inPersonRequired,
        }}
        onChange={handleChange}
      />

      {campaignData.inPersonRequired && (
        <TextArea
          label="Location Details"
          name="locationDetails"
          value={campaignData.locationDetails}
          onChange={handleChange}
          placeholder="Provide location details"
        />
      )}

      <CustomCheckboxGroup
        label="Required Platforms"
        name="requiredPlatforms"
        options={platformOptions}
        checkedValues={true}
        onChange={(value) => handleCheckboxToggle("requiredPlatforms", value)}
      />

      <div className="grid grid-cols-3">
        <CustomInput
          label="Application Deadline"
          type="date"
          name="applicationDeadline"
          value={campaignData.applicationDeadline}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

export default Logistics;
