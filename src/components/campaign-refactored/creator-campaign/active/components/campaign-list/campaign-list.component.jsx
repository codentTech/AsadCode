import CustomButton from "@/common/components/custom-button/custom-button.component";
import Loading from "@/common/components/loader/loading.component";
import { formatDate, getDaysUntilDeadline } from "@/common/utils/date.utils";
import TrackExternalCampaignModal from "./components/track-external-campaign-modal/track-external-campaign-modal.component";
import useTrackExternalCampaign from "./components/track-external-campaign-modal/use-track-external-campaign.hook";

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
    <div className="w-full bg-white">
      <div className="border-b border-gray-200 p-3 sm:p-4">
        <h2 className="text-sm font-semibold text-gray-900 sm:text-lg md:text-xl">Campaigns by Deadline</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <Loading />
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

            const deadline =
              campaign.application_deadline ||
              campaign.contract?.completionDeadline ||
              campaign.contract?.completion_deadline;
            const daysLeft = getDaysUntilDeadline(deadline);
            const isSelected = selectedCampaign?.id === campaign.id;

            return (
              <div
                key={campaign.id}
                onClick={() => onCampaignSelect(campaign)}
                className={`cursor-pointer border-b border-gray-100 p-3 transition-colors hover:bg-gray-50 sm:p-4 ${
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
                    <h3 className="truncate text-sm font-semibold text-gray-900">{campaign.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-600 sm:text-xs">{formatDate(deadline)}</span>
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] sm:px-2 sm:text-xs ${
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

      <div className="p-3 sm:p-4">
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
