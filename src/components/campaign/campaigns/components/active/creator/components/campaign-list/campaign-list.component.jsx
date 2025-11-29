import CustomButton from "@/common/components/custom-button/custom-button.component";
import TrackExternalCampaignModal from "./components/track-external-campaign-modal/track-external-campaign-modal.component";
import useTrackExternalCampaign from "./components/track-external-campaign-modal/use-track-external-campaign.hook";
import { formatDate, getDaysUntilDeadline } from "@/common/utils/date.utils";

const CampaignList = ({ campaigns, selectedCampaign, onCampaignSelect, isLoading }) => {
  // Use track external campaign hook
  const {
    showModal,
    openModal,
    closeModal,
    onSubmit,
    register,
    handleSubmit,
    setValue,
    formData,
    errors,
    createLoading,
  } = useTrackExternalCampaign();

  return (
    <div className="bg-white w-[23%]">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Campaigns by Deadline</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-gray-500">Loading campaigns...</div>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center px-4">
            <div className="text-sm text-gray-500 mb-2">No active campaigns</div>
            <div className="text-xs text-gray-400">
              You don't have any active campaigns at the moment.
            </div>
          </div>
        ) : (
          campaigns.map((campaign) => {
            if (!campaign) return null;

            const daysLeft = getDaysUntilDeadline(campaign.application_deadline);
            const isSelected = selectedCampaign?.id === campaign.id;

            return (
              <div
                key={campaign.id}
                onClick={() => onCampaignSelect(campaign)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  isSelected ? "bg-gray-100 border-l-4 border-l-primary" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg border border-gray-200 flex-shrink-0">
                    <img
                      src={campaign.logo}
                      alt="Brand Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm truncate">{campaign.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">
                        {formatDate(campaign.application_deadline)}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          daysLeft <= 3
                            ? "bg-red-100 text-red-800"
                            : daysLeft <= 7
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {daysLeft}d left
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="p-4">
        <CustomButton
          text="Track External Campaign +"
          className="btn-primary w-full"
          onClick={openModal}
          disabled={createLoading}
        />
      </div>

      {/* Track External Campaign Modal */}
      <TrackExternalCampaignModal
        show={showModal}
        onClose={closeModal}
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        setValue={setValue}
        formData={formData}
        errors={errors}
        createLoading={createLoading}
      />
    </div>
  );
};

export default CampaignList;
