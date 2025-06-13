import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Niche from "@/components/niche/niche";
import { X } from "lucide-react";
import { useState } from "react";

function CampaignTypeNiche({ campaignData, handleChange, handleCheckboxToggle }) {
  const [selectedDeliverables, setSelectedDeliverables] = useState([]);

  const addDeliverable = (deliverable) => {
    setSelectedDeliverables((prev) => [...prev, deliverable]);
  };

  const removeDeliverable = (index) => {
    setSelectedDeliverables((prev) => prev.filter((_, i) => i !== index));
  };

  const deliverableOptions = ["Feed Post", "Story: 3+ Frames", "Reel"];

  return (
    <div className="space-y-4">
      {/* Campaign Title and Type */}
      <div className="flex w-1/2 flex-col md:flex-row md:items-end gap-4">
        <CustomInput
          label="Campaign Title"
          name="campaignTitle"
          value={campaignData.campaignTitle}
          onChange={handleChange}
          placeholder="Enter campaign title"
          className="w-full md:w-1/2"
        />
      </div>

      {/* Niche */}
      <div className="space-y-2">
        <div className="p-4 bg-gray-50 rounded-lg border">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">Select Niche(s)</h4>
          <div className="flex flex-wrap gap-2">
            <Niche />
          </div>
        </div>
      </div>

      {/* Deliverables */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Select Deliverables{" "}
          <span className="text-xs text-gray-400">(Click multiple times for duplicates)</span>
        </label>

        <div className="flex flex-wrap gap-2">
          {deliverableOptions.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => addDeliverable(item)}
              className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-sm hover:bg-indigo-100"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Selected Deliverables Preview */}
        {selectedDeliverables.length > 0 && (
          <div className="mt-3">
            <h4 className="text-xs font-semibold text-gray-600 mb-1">Selected Deliverables:</h4>
            <div className="flex flex-wrap gap-2 text-sm">
              {selectedDeliverables.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="relative px-3 py-1 items-center bg-white border text-gray-600 rounded-md shadow-sm pr-10"
                >
                  {item}
                  <button
                    onClick={() => removeDeliverable(index)}
                    className="absolute top-1.5 right-1 text-gray-400 hover:text-gray-900"
                    aria-label="Remove deliverable"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CampaignTypeNiche;
