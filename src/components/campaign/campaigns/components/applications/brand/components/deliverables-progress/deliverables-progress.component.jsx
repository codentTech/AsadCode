import CustomButton from "@/common/components/custom-button/custom-button.component";
import AudienceDemographics from "@/components/audience-demographics/audience-demographics.component";
import { Avatar } from "@mui/material";
import RightPaneSkeleton from "../../../../right-pane-skeleton/right-pane-skeleton.component";
import CollaborationHistory from "../campaign-history/campaign-history.component";
import useDeliverablesProgress from "./use-deliverables-progress.hook";
import useGetplatform from "@/common/hooks/use-social-platform.hook";
import capitalizeFirstLetter from "@/common/utils/capitalize-first-letter";
import { formatNumber } from "@/common/utils/format.utils";
import { getPlatformProfileUrl } from "@/common/utils/platform.utils";
import { ExternalLink } from "lucide-react";

const DeliverablesProgress = ({
  selectedCreator,
  onHireClick,
  onRejectClick,
  onMessageClick,
  isIndividualCreator = false,
}) => {
  const {
    creatorData,
    creatorProfileId,
    handleViewCreatorPortfolio,
    performanceMetrics,
    performanceMetricsLoading,
    audienceData,
    audienceLoading,
    selectedPlatform,
    setSelectedPlatform,
    connectedPlatforms,
    platforms,
  } = useDeliverablesProgress(selectedCreator, isIndividualCreator);

  const { getPlatformColor, getPlatformIcon } = useGetplatform();

  if (!creatorData) {
    return <RightPaneSkeleton />;
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
          <button
            onClick={handleViewCreatorPortfolio}
            className="hover:text-primary transition-colors cursor-pointer"
          >
            {creatorData.name}
          </button>
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

        {connectedPlatforms.length > 0 && (
          <div className="flex flex-col gap-2 w-full">
            {platforms.map((platform) => {
              const isConnected = platform.isConnected;
              const isSelected =
                selectedPlatform?.toLowerCase() === platform.name?.toLowerCase();
              return (
                <button
                  key={platform.name}
                  type="button"
                  disabled={!isConnected}
                  onClick={() => setSelectedPlatform(platform.name)}
                  className={`relative flex items-center justify-between rounded-lg p-2 pr-3 transition-all w-full
                    ${!isConnected ? "opacity-50 cursor-not-allowed bg-gray-100" : "cursor-pointer hover:shadow-md"}
                    ${isSelected ? "bg-indigo-50 border-2 border-indigo-600 shadow-md" : "bg-gray-100 border-2 border-transparent hover:border-gray-300"}
                  `}
                >
                  <div className="flex items-center space-x-2">
                    <span className={`${getPlatformColor(platform.name)} p-1 rounded-md`}>
                      {getPlatformIcon(platform.name)}
                    </span>
                    <div className="flex flex-col items-start">
                      <span className="text-xs capitalize font-semibold text-primary">
                        {capitalizeFirstLetter(platform.name)}
                      </span>
                      {platform.username && (
                        <span className="text-[10px] text-gray-500">
                          @{platform.username}
                        </span>
                      )}
                    </div>
                  </div>
                  {isConnected && (
                    <div className="text-sm font-bold text-gray-900">
                      {formatNumber(platform.followers)}
                    </div>
                  )}
                  {(() => {
                    const url = getPlatformProfileUrl(
                      platform.name,
                      platform.username,
                      platform.profileUrl
                    );
                    return url && isConnected ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-1 top-3 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : null;
                  })()}
                </button>
              );
            })}
          </div>
        )}

        <>
          <div className="bg-white rounded-lg border p-3">
            <h4 className="text-sm font-bold text-gray-800 mb-2">Performance Metrics</h4>
            {performanceMetricsLoading ? (
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="border rounded p-2 animate-pulse">
                    <div className="h-3 bg-gray-200 rounded w-16 mb-1" />
                    <div className="h-4 bg-gray-100 rounded w-12" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <div className="border rounded p-2">
                  <p className="text-[11px] text-gray-500">Engagement Rate</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {performanceMetrics?.engagement_rate ??
                      creatorData?.profile?.engagement_rate ??
                      "N/A"}
                  </p>
                </div>
                <div className="border rounded p-2">
                  <p className="text-[11px] text-gray-500">Average Reach</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {performanceMetrics?.average_reach ??
                      creatorData?.profile?.average_reach ??
                      "N/A"}
                  </p>
                </div>
                <div className="border rounded p-2">
                  <p className="text-[11px] text-gray-500">Average Views</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {performanceMetrics?.average_views ??
                      creatorData?.profile?.average_views ??
                      "N/A"}
                  </p>
                </div>
                <div className="border rounded p-2">
                  <p className="text-[11px] text-gray-500">Posting Frequency</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {performanceMetrics?.posting_frequency ??
                      creatorData?.profile?.posting_frequency ??
                      "N/A"}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white border rounded-lg p-3">
            <h3 className="text-sm font-bold text-gray-800 mb-2">Audience Demographics</h3>
            <AudienceDemographics
              audienceData={audienceData}
              loading={audienceLoading}
              platform={selectedPlatform}
              className="flex flex-col"
            />
          </div>
        </>

        {creatorProfileId && <CollaborationHistory creatorProfileId={creatorProfileId} />}
      </div>
    </div>
  );
};

export default DeliverablesProgress;
