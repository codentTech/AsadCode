import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
import {
  Add as AddIcon,
  Cancel,
  ListAlt as ListIcon,
} from "@mui/icons-material";
import { Chip, IconButton, Tooltip } from "@mui/material";
import usePrivateCampaignForm from "./use-private-compaign-form";

export function PrivateCampaignForm({ onClose }) {
  const {
    currentDeliverable,
    setCurrentDeliverable,
    campaignData,
    handleChange,
    handleSubmit,
    campaignTypes,
    handleAddDeliverable,
    handleRemoveDeliverable,
    handleKeyPress,
    addSuggestion,
  } = usePrivateCampaignForm();

  return (
    <Modal title="Create a campaign" show={true} onClose={onClose}>
      <div className="w-full grid grid-cols-2 md:grid-cols-2 gap-4">
        <CustomInput
          label="Campaign Title"
          placeholder="Enter campaign title"
          isRequired={true}
        />
        <CustomInput
          label="Due Date"
          type="date"
          placeholder="Enter due date"
          isRequired={false}
        />

        <SimpleSelect
          label="Select Type"
          placeHolder="Select"
          options={campaignTypes}
          isMulti={false}
          onChange={handleChange}
        />

        <div className="flex flex-col gap-1">
          <CustomInput
            label="Payment"
            placeholder="Enter payment"
            isRequired={false}
          />
          <p className="text-xs text-gray-500 mt-1">
            This amount will be held in escrow until campaignData.deliverables
            are approved
          </p>
        </div>
      </div>
      <div>
        <TextArea
          label="Description"
          placeholder="Enter description"
          isRequired={false}
        />
      </div>

      <div className="space-y-3">
        <div className="flex flex-col">
          <div className="flex items-center">
            <div className="relative flex-1">
              <CustomInput
                label="Deliverables"
                placeholder="Enter deliverables"
                value={currentDeliverable}
                onChange={(e) => {
                  setCurrentDeliverable(e.target.value);
                }}
                onKeyPress={handleKeyPress}
                startAdornment={
                  <ListIcon className="text-gray-400 mr-2" fontSize="small" />
                }
              />
            </div>

            <Tooltip title="Add deliverable">
              <IconButton
                onClick={handleAddDeliverable}
                className="ml-2 mt-5 bg-primary hover:bg-indigo-600 text-white shadow-sm"
                size="small"
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        </div>

        {/* Quick add suggestions */}
        {campaignData.deliverables && (
          <div className="mt-2">
            <div className="flex flex-wrap gap-2">
              {campaignData.deliverables.map((suggestion, index) => (
                <Chip
                  key={suggestion}
                  label={suggestion}
                  onDelete={() => handleRemoveDeliverable(index)}
                  variant="outlined"
                  deleteIcon={
                    <Cancel
                      fontSize="small"
                      className="text-gray-500 hover:text-red-500"
                    />
                  }
                  size="small"
                  onClick={() => addSuggestion(suggestion)}
                  className="bg-gray-100 hover:bg-gray-200 cursor-pointer text-xs"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <CustomButton text="Cancel" onClick={onClose} className="btn-cancel" />
        <CustomButton
          text="Create campaign"
          onClick={handleSubmit}
          className="btn-primary"
        />
      </div>
    </Modal>
  );
}
