import CustomButton from "@/common/components/custom-button/custom-button.component";
import Loading from "@/common/components/loader/loading.component";
import { Skeleton } from "@/common/components/loader/skeleton-loader.component";
import { avatar } from "@/common/constants/auth.constant";
import useGetplatform from "@/common/hooks/use-social-platform.hook";
import capitalizeFirstLetter from "@/common/utils/capitalize-first-letter";
import { formatNumber } from "@/common/utils/format.utils";
import { getPlatformProfileUrl } from "@/common/utils/platform.utils";
import AudienceDemographics from "@/components/audience-demographics/audience-demographics.component";
import { VerifiedRounded } from "@mui/icons-material";
import { ExternalLink, MapPin, Shield, Star } from "lucide-react";
import useCreatorPreview from "./use-creator-preview.hook";

function CreatorPreview({ previewCreator, setIsPreviewOpen }) {
  const { getPlatformColor, getPlatformIcon } = useGetplatform();
  const {
    stats,
    audience,
    platformData,
    metricsData,
    isInitialLoading,
    metricsLoading,
    audienceLoading,
    selectedPlatform,
    setSelectedPlatform,
    connectedPlatforms,
    creatorMetrics,
  } = useCreatorPreview(previewCreator);

  if (!previewCreator) return null;
  if (isInitialLoading) return <Loading />;

  const authenticAudience = metricsData.authenticAudience;

  return (
    <div className="bg-white flex flex-col">
      {/* Creator Profile Section */}
      <div className="px-2 pb-4 border-b border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={previewCreator.profileImage || avatar}
              alt={previewCreator.name}
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-200 ring-2 ring-primary"
            />
            <div className="flex flex-col gap-1 items-start">
              <h3 className="text-xl font-bold">{previewCreator.name}</h3>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <MapPin className="w-3 h-3" />
                <span>{previewCreator.location}</span>
              </div>
              <div className="flex items-center justify-start text-xs text-yellow-500">
                {[...Array(5)].map((_, i) => {
                  const rating = previewCreator.rating || 0;
                  const isFilled = i < Math.floor(rating);
                  return (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${isFilled ? "fill-current" : "fill-none"}`}
                    />
                  );
                })}
                <span className="text-xs text-gray-700 ml-1 mt-[0.6px]">
                  {previewCreator.rating || 0} ({previewCreator.reviewCount || 0})
                </span>
              </div>
            </div>
          </div>

          {/* Authentic Audience Badge */}
          <div className="text-right mt-2">
            <div className="flex items-center gap-2 bg-green-900 px-3 py-1 rounded-lg">
              <Shield className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">
                {metricsLoading
                  ? "Loading..."
                  : authenticAudience != null
                    ? `Authentic Audience: ${Number(authenticAudience).toFixed(0)}%`
                    : "Authentic Audience: N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Platform Tiles — clickable selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          {platformData.map((platform) => {
            const isSelected = selectedPlatform?.toLowerCase() === platform.key?.toLowerCase();
            const isConnected = connectedPlatforms.includes(platform.key);

            return (
              <button
                key={platform.key}
                type="button"
                disabled={platform.loading || !isConnected}
                onClick={() => setSelectedPlatform(platform.key)}
                className={`relative flex items-center justify-between rounded-lg p-2 pr-3 transition-all text-left
                  ${!isConnected || platform.loading ? "opacity-50 cursor-not-allowed bg-gray-100" : "cursor-pointer hover:shadow-md"}
                  ${isSelected ? "bg-indigo-50 border-2 border-indigo-600 shadow-md" : "bg-gray-100 border-2 border-transparent hover:border-gray-300"}
                `}
              >
                <div className="flex items-center space-x-2">
                  <span className={`${getPlatformColor(platform.key)} p-1 rounded-md`}>
                    {getPlatformIcon(platform.key)}
                  </span>
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-1">
                      <span className="text-xs capitalize font-semibold text-primary">
                        {capitalizeFirstLetter(platform.key)}
                      </span>
                      {platform.isVerified && <VerifiedRounded className="w-3 h-3 text-blue-500" />}
                    </div>
                    {platform.username && (
                      <span className="text-[10px] text-gray-500 max-w-[90px] truncate">
                        @{platform.username}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {platform.loading ? (
                    <div className="h-4 w-12 bg-gray-200 animate-pulse rounded" />
                  ) : (
                    <span className="text-sm font-bold text-gray-900">
                      {formatNumber(platform.followers)}
                    </span>
                  )}
                  {(() => {
                    const url = getPlatformProfileUrl(
                      platform.key,
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
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Metrics Section */}
      <div className="px-2 py-4 border-b border-gray-200">
        <div className="grid grid-cols-4 gap-4">
          {metricsLoading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border rounded-lg p-2">
                  <Skeleton className="h-3 w-24 mb-2" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="text-left border rounded-lg p-2">
                <p className="text-sm font-semibold text-primary">Engagement Rate</p>
                <p className="text-xs">{metricsData.engagementRate}</p>
              </div>
              <div className="text-left border rounded-lg p-2">
                <p className="text-sm font-semibold text-primary">Average Reach</p>
                <p className="text-xs">{metricsData.averageReach}</p>
              </div>
              <div className="text-left border rounded-lg p-2">
                <p className="text-sm font-semibold text-primary">Average Views</p>
                <p className="text-xs">{metricsData.averageViews}</p>
              </div>
              <div className="text-left border rounded-lg p-2">
                <p className="text-sm font-semibold text-primary">Posting Frequency</p>
                <p className="text-xs">{metricsData.postingFrequency}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Audience Demographics */}
      <div className="px-2 py-4">
        <h3 className="text-lg font-semibold text-primary mb-4">Audience Demographics</h3>
        {audienceLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-3">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <Skeleton className="h-4 w-1/2 mb-3" />
              <Skeleton className="h-32 w-full rounded" />
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <Skeleton className="h-4 w-1/2 mb-3" />
              <Skeleton className="h-32 w-full rounded" />
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 lg:col-span-2">
              <Skeleton className="h-4 w-1/2 mb-3" />
              <Skeleton className="h-32 w-full rounded" />
            </div>
          </div>
        ) : (
          <AudienceDemographics
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2"
            audienceData={audience.data ?? null}
            loading={false}
            platform={selectedPlatform}
          />
        )}
      </div>

      {/* Footer Actions */}
      <div className="bg-gray-100 rounded-lg sticky w-full bottom-0 p-4 border-t flex justify-between">
        <CustomButton text="Close" className="btn-cancel" onClick={() => setIsPreviewOpen(false)} />
        <CustomButton
          text="View Full Profile"
          className="btn-primary"
          onClick={() => window.open(`/creator-profile/${previewCreator.id}`, "_blank")}
        />
      </div>
    </div>
  );
}

export default CreatorPreview;
