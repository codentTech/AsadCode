import CustomButton from "@/common/components/custom-button/custom-button.component";
import Loading from "@/common/components/loader/loading.component";
import { Skeleton } from "@/common/components/loader/skeleton-loader.component";
import { avatar } from "@/common/constants/auth.constant";
import useGetplatform from "@/common/hooks/use-social-platform.hook";
import capitalizeFirstLetter from "@/common/utils/capitalize-first-letter";
import { formatNumber } from "@/common/utils/format.utils";
import { getPlatformProfileUrl } from "@/common/utils/platform.utils";
import { HIDE_CREATOR_RATING_UI } from "@/common/utils/campaign.utils";
import AudienceDemographics from "@/components/audience-demographics/audience-demographics.component";
import { VerifiedRounded } from "@mui/icons-material";
import { ExternalLink, MapPin, Shield, Star } from "lucide-react";
import useCreatorPreview from "./use-creator-preview.hook";

function CreatorPreview({ previewCreator, setIsPreviewOpen }) {
  const { getPlatformColor, getPlatformIcon } = useGetplatform();
  const {
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
      <div className="border-b border-gray-200 px-2 pb-3 sm:pb-4">
        <div className="mb-3 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <img
              src={previewCreator.profileImage || avatar}
              alt={previewCreator.name}
              className="h-20 w-20 rounded-full border border-gray-200 object-cover ring-1 ring-primary sm:h-32 sm:w-32 sm:border-2 sm:ring-2"
            />
            <div className="flex flex-col gap-1 items-start">
              <h3 className="text-sm font-semibold sm:text-xl">{previewCreator.name}</h3>
              <div className="flex items-center gap-1 text-[10px] text-gray-600 sm:text-xs">
                <MapPin className="w-3 h-3" />
                <span>{previewCreator.location}</span>
              </div>
              {!HIDE_CREATOR_RATING_UI ? (
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
                  <span className="ml-1 mt-[0.6px] text-[10px] text-gray-700 sm:text-xs">
                    {previewCreator.rating || 0} ({previewCreator.reviewCount || 0})
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Authentic Audience Badge */}
          <div className="mt-1 text-left sm:mt-2 sm:text-right">
            <div className="flex items-center gap-1.5 rounded-lg bg-green-900 px-2 py-1 sm:gap-2 sm:px-3">
              <Shield className="w-4 h-4 text-white" />
              <span className="text-[10px] font-medium text-white sm:text-sm">
                {metricsLoading
                  ? "Loading..."
                  : authenticAudience != null
                    ? `Authentic Audience: ${Number(authenticAudience).toFixed(0)}%`
                    : "Authentic Audience: N/A"}
              </span>
            </div>
          </div>
        </div>

        {platformData.length > 0 ? (
        <div className="mt-3 grid grid-cols-1 gap-2.5 sm:mt-4 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
          {platformData.map((platform) => {
            const isSelected = selectedPlatform?.toLowerCase() === platform.key?.toLowerCase();

            return (
              <button
                key={platform.key}
                type="button"
                disabled={platform.loading}
                onClick={() => setSelectedPlatform(platform.key)}
                className={`relative flex items-center justify-between rounded-lg p-2 pr-2.5 text-left transition-all sm:pr-3
                  ${platform.loading ? "opacity-50 cursor-not-allowed bg-gray-100" : "cursor-pointer hover:shadow-md"}
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
                    <span className="text-xs font-bold text-gray-900 sm:text-sm">
                      {formatNumber(platform.followers)}
                    </span>
                  )}
                  {(() => {
                    const url = getPlatformProfileUrl(
                      platform.key,
                      platform.username,
                      platform.profileUrl
                    );
                    return url ? (
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
        ) : (
          <p className="mt-3 text-[10px] text-gray-500 sm:text-xs">No social accounts connected</p>
        )}
      </div>

      {/* Metrics Section */}
      <div className="border-b border-gray-200 px-2 py-3 sm:py-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
          {metricsLoading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border rounded-lg p-2">
                  <Skeleton className="mb-2 h-3 w-16 sm:w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="text-left border rounded-lg p-2">
                <p className="text-[10px] font-semibold text-primary sm:text-xs">Typical Views</p>
                <p className="mt-1 text-[10px] sm:text-xs">{metricsData.typicalViews}</p>
              </div>
              <div className="text-left border rounded-lg p-2">
                <p className="text-[10px] font-semibold text-primary sm:text-xs">Engagement Rate</p>
                <p className="mt-1 text-[10px] sm:text-xs">{metricsData.engagementRate}</p>
              </div>
              <div className="text-left border rounded-lg p-2">
                <p className="text-[10px] font-semibold text-primary sm:text-xs">Performance Consistency</p>
                <p className="mt-1 text-[10px] sm:text-xs">{metricsData.performanceConsistency}</p>
              </div>
              <div className="text-left border rounded-lg p-2">
                <p className="text-[10px] font-semibold text-primary sm:text-xs">30 Day Growth Rate</p>
                <p className="mt-1 text-[10px] sm:text-xs">{metricsData.growthRate30d}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Audience Demographics */}
      <div className="px-2 py-3 sm:py-4">
        <h3 className="mb-3 text-sm font-semibold text-primary sm:mb-4 sm:text-lg">Audience Demographics</h3>
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
      <div className="sticky bottom-0 flex w-full flex-col gap-2 rounded-lg border-t bg-gray-100 p-3 sm:flex-row sm:justify-between sm:p-4">
        <CustomButton text="Close" className="btn-cancel w-full sm:w-auto" onClick={() => setIsPreviewOpen(false)} />
        <CustomButton
          text="View Full Profile"
          className="btn-primary w-full sm:w-auto"
          onClick={() => window.open(`/creator-profile/${previewCreator.id}`, "_blank")}
        />
      </div>
    </div>
  );
}

export default CreatorPreview;
