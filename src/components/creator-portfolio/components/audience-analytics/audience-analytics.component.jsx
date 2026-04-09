import Loading from "@/common/components/loader/loading.component";
import useGetplatform from "@/common/hooks/use-social-platform.hook";
import capitalizeFirstLetter from "@/common/utils/capitalize-first-letter";
import { formatNumber } from "@/common/utils/format.utils";
import { getPlatformProfileUrl } from "@/common/utils/platform.utils";
import { ExternalLink, TrendingUp } from "lucide-react";
import useAudienceAnalytics from "./use-audience-analytics.hook";

export default function AudienceAnalytics({
  creatorId,
  selectedPlatform: externalSelectedPlatform,
  onPlatformSelect,
}) {
  const {
    statsData,
    socialData,
    connectedPlatforms,
    selectedPlatform,
    platforms,
    totalFollowersAllPlatforms,
    handlePlatformClick,
    isLoading,
  } = useAudienceAnalytics(creatorId, externalSelectedPlatform, onPlatformSelect);

  const { getPlatformColor, getPlatformIcon } = useGetplatform();

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-primary">Audience Analytics Snapshot</h3>
      </div>

      {isLoading && !statsData && !socialData?.length && <Loading />}

      {(!isLoading || platforms.length > 0) && (
        <>
          <div className="mb-8 text-center">
            <p className="text-sm font-medium text-gray-700">Total Followers</p>
            <p className="text-4xl font-bold text-indigo-600">
              {formatNumber(totalFollowersAllPlatforms)}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
            {platforms.map((platform, index) => {
              const isSelected = selectedPlatform?.toLowerCase() === platform.name?.toLowerCase();
              const isDisabled = !connectedPlatforms.includes(platform.name);
              const profileHref = !isDisabled
                ? getPlatformProfileUrl(platform.name, platform.username, platform.profileUrl)
                : null;

              return (
                <button
                  key={platform.name + index}
                  type="button"
                  onClick={() => handlePlatformClick(platform.name)}
                  disabled={isDisabled}
                  className={`
                    relative flex items-center justify-between rounded-lg p-3 transition-all
                    ${profileHref ? "pr-9" : "pr-4"}
                    ${isDisabled ? "opacity-50 cursor-not-allowed bg-gray-100" : "cursor-pointer hover:shadow-md"}
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
                        <span className="text-[10px] text-gray-500">@{platform.username}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    {formatNumber(platform.followers)}
                  </div>
                  {profileHref ? (
                    <a
                      href={profileHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-1 top-3 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                      aria-label={`Open ${platform.name} profile in new tab`}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : null}
                </button>
              );
            })}
          </div>
        </>
      )}

      {!isLoading && !statsData && !platforms.length && (
        <div className="text-center py-12 text-gray-600">
          <TrendingUp className="w-8 h-8 text-gray-400 mx-auto mb-4" />
          <p>No Analytics Data Available</p>
        </div>
      )}
    </section>
  );
}
