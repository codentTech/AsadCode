import CustomButton from "@/common/components/custom-button/custom-button.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
import ConfirmationDialog from "@/common/components/custom-dialog-confirmation/ConfirmationDialog";
import { useState } from "react";
import useCampaignOverview from "./use-campaign-overview.hook";

export default function CampaignOverview({
  onCampaignSelect,
  selectedCampaign: externalSelectedCampaign,
  selectedCreator,
  filters,
  onFilterChange,
  onClearFilters,
  onReinstateCreator,
}) {
  const [hireModalOpen, setHireModalOpen] = useState(false);
  const [hireCreatorData, setHireCreatorData] = useState(null);
  const [selectedCampaignForHire, setSelectedCampaignForHire] = useState(null);
  const [showReinstateConfirmation, setShowReinstateConfirmation] = useState(false);

  const {
    messageDialogOpen,
    setMessageDialogOpen,
    campaignsData,
    campaignsLoading,
    campaignOptions,
  } = useCampaignOverview();

  // Use external selected campaign if provided
  const selectedCampaign = externalSelectedCampaign;

  // Handle campaign change and notify parent
  const handleCampaignChange = (selectedOption) => {
    const campaignId = selectedOption?.value;
    const campaign = campaignsData?.data?.find((c) => c.id === campaignId);

    if (onCampaignSelect && campaign) {
      onCampaignSelect(campaign);
    }
  };

  const handleHireClick = () => {
    // You'll need to get the selected creator and campaign data
    setHireCreatorData({
      id: 1,
      name: "Sam Waters",
      email: "sam@example.com",
    });
    setSelectedCampaignForHire(
      selectedCampaign || {
        title: "Summer Launch Campaign",
        brandName: "Brand Name",
        deliverables: "1 TikTok, 3 Instagram Stories",
        hashtags: "#summer #brand",
        mentions: "@brand",
      }
    );
    setHireModalOpen(true);
  };

  const handleSendOffer = (contractData) => {
    // Here you'll make API call to backend
    // createContract(contractData);
  };

  const handleReinstateClick = () => {
    setShowReinstateConfirmation(true);
  };

  const handleConfirmReinstate = () => {
    if (onReinstateCreator && selectedCampaign && selectedCreator) {
      onReinstateCreator(selectedCampaign.id, selectedCreator.id);
    }
    setShowReinstateConfirmation(false);
  };

  const handleCancelReinstate = () => {
    setShowReinstateConfirmation(false);
  };

  return (
    <div className="w-[23%] border-r flex flex-col bg-white p-4 gap-4">
      <SimpleSelect
        placeHolder="Select a campaign"
        options={campaignOptions}
        isSearchable={true}
        isMulti={false}
        onChange={handleCampaignChange}
        isLoading={campaignsLoading}
      />

      <hr />

      {/* Show Actions and Filters only when a campaign is selected */}
      {selectedCampaign ? (
        <></>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          </div>
          <h3 className="text-base font-medium text-gray-800 mb-2">Select a Campaign</h3>
          <p className="text-sm text-gray-600 max-w-xs mx-auto">
            Choose a campaign from the dropdown to view rejected creators and filters
          </p>
        </div>
      )}

      {/* Message Creator Dialog */}
      <Modal
        title={`Message to Sam Waters`}
        show={messageDialogOpen}
        onClose={() => setMessageDialogOpen(false)}
      >
        <TextArea label="Your Message" />
        <div className="w-full flex justify-end gap-3">
          <CustomButton
            text="Cancel"
            className="btn-cancel"
            onClick={() => setMessageDialogOpen(false)}
          />

          <CustomButton text="Send Message" className="btn-primary" />
        </div>
      </Modal>

      {/* Reinstate Confirmation Modal */}
      <ConfirmationDialog
        show={showReinstateConfirmation}
        onClose={handleCancelReinstate}
        onConfirm={handleConfirmReinstate}
        message="Reinstate Creator"
        content={
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              Are you sure you want to reinstate this creator's application?
            </p>
            <p className="text-sm text-gray-500">
              This action will move the application back to the pending list.
            </p>
          </div>
        }
      />
    </div>
  );
}
