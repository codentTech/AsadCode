import CustomButton from "@/common/components/custom-button/custom-button.component";
import AudienceDemographics from "@/components/audience-demographics/audience-demographics.component";
import { Avatar } from "@mui/material";
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

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden border-l border-gray-200 bg-white">
      <div className="shrink-0 z-10 flex flex-col items-start gap-1 border-b border-gray-100 bg-white px-2.5 pb-3 pt-3 text-left sm:items-center sm:px-4 sm:text-center">
        <div className="relative self-center sm:self-auto">
          <Avatar
            src={creatorData?.image}
            alt={creatorData?.image}
            className="h-16 w-16 border-4 border-white shadow-md ring-2 ring-primary sm:h-20 sm:w-20"
          >
            {creatorData.name?.charAt(0) || "C"}
          </Avatar>
        </div>
        <h3 className="w-full text-left sm:text-center">
          <button
            type="button"
            onClick={handleViewCreatorPortfolio}
            className="text-sm font-semibold transition-colors hover:text-primary sm:text-lg"
          >
            {creatorData.name}
          </button>
          <span className="ml-1 text-sm text-gray-500 sm:text-lg">{creatorData.rating}</span>
          <span className="ml-1 text-sm text-gray-500 sm:text-lg">
            ({creatorData.reviewCount || 0})
          </span>
        </h3>
        <p className="-mt-1 flex w-full flex-wrap items-center justify-start gap-x-1 text-[10px] text-gray-500 sm:justify-center sm:text-sm">
          <span>{creatorData.age}</span>
          <span aria-hidden>•</span>
          <span>{creatorData.location}</span>
        </p>
        <p className="-mt-1 line-clamp-2 max-w-md text-left text-[10px] text-gray-500 sm:text-center sm:text-sm">
          {creatorData?.bio}
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain p-3 sm:gap-4 sm:p-4">
        <div className="grid w-full grid-cols-3 gap-2">
          <CustomButton text="Message" className="btn-primary" onClick={onMessageClick} />
          <CustomButton text="Hire" className="btn-outline" onClick={onHireClick} />
          <CustomButton text="Reject" className="btn-danger" onClick={onRejectClick} />
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
