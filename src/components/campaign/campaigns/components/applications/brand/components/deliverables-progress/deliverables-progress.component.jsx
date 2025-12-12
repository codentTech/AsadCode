import CustomButton from "@/common/components/custom-button/custom-button.component";
import Loader from "@/common/components/loader/loader.component";
import AudienceDemographics from "@/components/audience-demographics/audience-demographics";
import { Avatar } from "@mui/material";
import CampaignHistory from "../campaign-history/campaign-history.component";
import useDeliverablesProgress from "./use-deliverables-progress.hook";

const DeliverablesProgress = ({
  selectedCampaign,
  selectedCreator,
  onHireClick,
  onRejectClick,
  onMessageClick,
  isIndividualCreator = false,
}) => {
  const {
    selectedContract,
    isContractsLoading,
    creatorData,
    formatDate,
    formatCompensation,
    getDeliverables,
  } = useDeliverablesProgress(selectedCreator, isIndividualCreator);

  if (!creatorData) {
    return (
      <div className="w-[27%] bg-white flex flex-col border-l h-screen items-center justify-center">
        <Loader loading={true} />
      </div>
    );
  }

  return (
    <div className="w-[27%] bg-white flex flex-col border-l h-screen">
      <div className="flex flex-col items-center pt-3 pb-4 px-4 border-b sticky gap-1 top-0 bg-white z-10">
        <div className="relative">
          <Avatar
            src={creatorData?.image}
            alt={creatorData?.image}
            className="h-20 w-20 border-4 border-white shadow-md ring-2 ring-primary"
          >
            {creatorData.name?.charAt(0) || "C"}
          </Avatar>
        </div>
        <h3>
          {creatorData.name}
          <span className="text-lg text-gray-500 ml-1">{creatorData.rating}</span>
          <span className="text-lg text-gray-500 ml-1">({creatorData.reviewCount || 0})</span>
        </h3>
        <p className="flex items-center text-sm text-gray-500 -mt-1">
          {creatorData.age} • <span className="ml-1">{creatorData.location}</span>
        </p>
        <p className="text-sm text-gray-500 -mt-1">{creatorData?.bio}</p>
      </div>

      <div className="flex flex-col overflow-y-auto p-4 gap-4">
        <div className="grid grid-cols-3 gap-2 w-full">
          <CustomButton text="Message" className="btn-primary !py-1" onClick={onMessageClick} />
          <CustomButton text="Hire" className="btn-outline !py-1" onClick={onHireClick} />
          <CustomButton text="Reject" className="btn-danger !py-1" onClick={onRejectClick} />
        </div>

        {isIndividualCreator && (
          <>
            {isContractsLoading ? (
              <div className="bg-white rounded-lg border p-3">
                <h4 className="text-sm font-semibold text-gray-800 mb-2 border-b pb-1">
                  Contract Agreement
                </h4>
                <div className="flex justify-center py-3">
                  <Loader loading={true} />
                </div>
              </div>
            ) : !selectedContract ? (
              <div className="bg-white rounded-lg border p-3">
                <h4 className="text-sm font-semibold text-gray-800 mb-2 border-b pb-1">
                  Contract Agreement
                </h4>
                <p className="text-xs text-gray-500">No contract found for this creator</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg border p-3">
                <h4 className="text-sm font-semibold text-gray-800 mb-2 border-b pb-1">
                  Contract Agreement
                </h4>
                <ul className="space-y-2 text-xs text-gray-600">
                  {getDeliverables(selectedContract).map((deliverable, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <span>{deliverable}</span>
                    </li>
                  ))}
                  <li className="flex items-center justify-between">
                    <span>
                      Deadline:
                      <span className="font-medium ml-1">
                        {formatDate(selectedContract.completionDeadline)}
                      </span>
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>
                      Payment:{" "}
                      <span className="font-medium">{formatCompensation(selectedContract)}</span>
                    </span>
                  </li>
                  {selectedContract.usageRights && (
                    <li className="flex items-center justify-between">
                      <span>
                        Usage Rights:{" "}
                        <span className="font-medium">
                          {selectedContract.usageRights?.replaceAll("_", " ")}
                        </span>
                      </span>
                    </li>
                  )}
                  {selectedContract.exclusivityClause && (
                    <li className="flex items-center justify-between">
                      <span>
                        Exclusivity:{" "}
                        <span className="font-medium">
                          {selectedContract.exclusivityClause?.replaceAll("_", " ")}
                        </span>
                      </span>
                    </li>
                  )}
                  {selectedContract.revisionsLimit && (
                    <li className="flex items-center justify-between">
                      <span>
                        Revisions:{" "}
                        <span className="font-medium">{selectedContract.revisionsLimit}</span>
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </>
        )}

        <>
          <div className="bg-white rounded-lg border p-3">
            <h4 className="text-sm font-bold text-gray-800 mb-2">Performance Metrics</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="border rounded p-2">
                <p className="text-[11px] text-gray-500">Engagement Rate</p>
                <p className="text-sm font-semibold text-gray-900">
                  {creatorData?.profile?.engagement_rate ?? "N/A"}
                </p>
              </div>
              <div className="border rounded p-2">
                <p className="text-[11px] text-gray-500">Average Reach</p>
                <p className="text-sm font-semibold text-gray-900">
                  {creatorData?.profile?.average_reach ?? "N/A"}
                </p>
              </div>
              <div className="border rounded p-2">
                <p className="text-[11px] text-gray-500">Average Views</p>
                <p className="text-sm font-semibold text-gray-900">
                  {creatorData?.profile?.average_views ?? "N/A"}
                </p>
              </div>
              <div className="border rounded p-2">
                <p className="text-[11px] text-gray-500">Posting Frequency</p>
                <p className="text-sm font-semibold text-gray-900">
                  {creatorData?.profile?.posting_frequency ?? "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-3">
            <h3 className="text-sm font-bold text-gray-800 mb-2">Audience Demographics</h3>
            <AudienceDemographics className="flex flex-col" />
          </div>
        </>

        {(() => {
          const campaignId = isIndividualCreator
            ? selectedCreator?.campaign_id || selectedCreator?.campaign?.id
            : selectedCampaign?.id;

          return campaignId ? <CampaignHistory campaignId={campaignId} /> : null;
        })()}
      </div>
    </div>
  );
};

export default DeliverablesProgress;
