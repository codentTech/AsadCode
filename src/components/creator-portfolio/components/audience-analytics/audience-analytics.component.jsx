import Loading from "@/common/components/loader/loading.component";
import useGetplatform from "@/common/hooks/use-social-platform.hook";
import capitalizeFirstLetter from "@/common/utils/capitalize-first-letter";
import { formatNumber } from "@/common/utils/format.utils";
import { getPlatformProfileUrl } from "@/common/utils/platform.utils";
import { ExternalLink } from "lucide-react";
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
    <section className="rounded-lg bg-white p-3 shadow-md sm:p-6">
      <div className="mb-4 flex items-center justify-between sm:mb-6">
        <h3 className="text-sm font-semibold text-primary sm:text-lg md:text-xl">
          Audience Analytics Snapshot
        </h3>
      </div>

      {isLoading && !statsData && !socialData?.length && <Loading />}

      {(!isLoading || platforms.length > 0) && (
        <>
          <div className="mb-5 text-center sm:mb-8">
            <p className="text-[10px] font-medium text-gray-700 sm:text-sm">Total Followers</p>
            <p className="text-2xl font-bold text-indigo-600 sm:text-4xl">
              {formatNumber(totalFollowersAllPlatforms)}
            </p>
          </div>

          <div className="my-3 grid grid-cols-1 gap-3 sm:my-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
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
                    relative flex items-center justify-between rounded-lg p-2.5 transition-all sm:p-3
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
                      <span className="text-[10px] capitalize font-semibold text-primary sm:text-xs">
                        {capitalizeFirstLetter(platform.name)}
                      </span>
                      {platform.username && (
                        <span className="text-[10px] text-gray-500">@{platform.username}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs font-bold text-gray-900 sm:text-sm">
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
        <div className="rounded-lg border border-gray-100 bg-gray-100 shadow-sm text-center py-2">
          <p className="text-center text-sm text-gray-500">No Analytics Data Available</p>
        </div>
      )}
    </section>
  );
}
