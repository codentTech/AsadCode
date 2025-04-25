import Modal from "@/common/components/modal/modal.component";
import { Add as AddIcon, Business as BusinessIcon } from "@mui/icons-material";
import { Chip } from "@mui/material";
import useQuickHire from "./use-quick-hire";
import { PrivateCampaignForm } from "./components/private-campaign-form/private-campaign-form";

function QuickHire({ openQuickHire, handleCloseQuickHire }) {
  const { handleOptionSelect, publicCampaigns, selectedOption } =
    useQuickHire();
  return (
    <Modal
      show={openQuickHire}
      title="Quick Hire"
      onClose={handleCloseQuickHire}
    >
      {openQuickHire && selectedOption === "public" ? (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Select a campaign to hire:</p>
          {publicCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="p-2 border border-gray-200 hover:border-primary hover:bg-indigo-50 rounded-lg cursor-pointer transition-all flex items-center"
            >
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-800">
                  {campaign.title}
                </h4>
              </div>
              <div className="flex items-center mt-1">
                <Chip
                  label={campaign.status}
                  size="small"
                  color="primary"
                  variant="outlined"
                  className="text-xs"
                />
              </div>
            </div>
          ))}
        </div>
      ) : openQuickHire && selectedOption === "private" ? (
        <PrivateCampaignForm onClose={handleCloseQuickHire} />
      ) : (
        <div className="space-y-2">
          <div
            onClick={() => handleOptionSelect("public")}
            className="p-4 border border-gray-200 hover:border-primary hover:bg-indigo-50 rounded-lg cursor-pointer transition-all flex items-center"
          >
            <div className="bg-secondary-light-blue text-primary rounded-full p-2 mr-4">
              <BusinessIcon />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-800">
                Hire for existing campaign
              </h4>
              <p className="text-xs text-gray-600">
                Select from your active public campaigns
              </p>
            </div>
          </div>

          <div
            onClick={() => handleOptionSelect("private")}
            className="p-4 border border-gray-200 hover:border-primary hover:bg-indigo-50 rounded-lg cursor-pointer transition-all flex items-center"
          >
            <div className="bg-secondary-light-blue text-primary rounded-full p-2 mr-4">
              <AddIcon />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-800">
                Create private campaign
              </h4>
              <p className="text-xs text-gray-600">
                Create a custom private campaign
              </p>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default QuickHire;
