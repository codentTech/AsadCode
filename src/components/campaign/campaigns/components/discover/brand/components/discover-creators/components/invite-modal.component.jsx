import { X } from "lucide-react";

const InviteModal = ({ show, onClose, selectedCreator, userCampaigns = [], onInviteToApply }) => {
  if (!show) return null;

  const handleCampaignSelect = (campaign) => {
    if (onInviteToApply) {
      onInviteToApply(selectedCreator, campaign);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Invite {selectedCreator?.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {userCampaigns.length === 0 ? (
            <p className="text-gray-500">No active campaigns available</p>
          ) : (
            userCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => handleCampaignSelect(campaign)}
              >
                <h4 className="font-medium">{campaign.name}</h4>
                <p className="text-sm text-gray-600">{campaign.description}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
