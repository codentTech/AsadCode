import React from "react";
import ImageIcon from "@mui/icons-material/Image";
import TextArea from "@/common/components/text-area/text-area.component";

function Description({ campaignData, handleChange, handleImageUpload }) {
  return (
    <div className="w-full flex flex-col gap-1">
      <TextArea
        label="Short Description"
        name="shortDescription"
        value={campaignData.shortDescription}
        onChange={handleChange}
        isRequired={true}
        className="w-full"
        placeholder="e.g., Looking for creators to showcase our new skincare line with educational content about ingredients and benefits."
      />

      <TextArea
        label="Long Description"
        name="longDescription"
        value={campaignData.longDescription}
        onChange={handleChange}
        className="w-full"
        placeholder="Provide detailed information about your campaign..."
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Attach a Campaign Image (Optional)
        </label>
        <div className="flex items-center">
          <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
            <div className="space-y-1 text-center">
              <ImageIcon className="h-6 w-6 mx-auto text-gray-400" />
              <div className="text-sm text-gray-600">
                <span>Click to upload</span>
              </div>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>

          {campaignData.campaignImage && (
            <div className="ml-4">
              <img
                src={campaignData.campaignImage}
                alt="Campaign preview"
                className="h-20 w-20 object-cover rounded-md"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Description;
