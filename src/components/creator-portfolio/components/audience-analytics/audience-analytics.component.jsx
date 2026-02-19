import Loading from "@/common/components/loadar/loading.component";
import useGetplatform from "@/common/hooks/use-social-platform.hook";
import capitalizeFirstLetter from "@/common/utils/capitalize-first-letter";
import { formatNumber } from "@/common/utils/format.utils";
import AudienceDemographics from "@/components/audience-demographics/audience-demographics";
import { VerifiedRounded } from "@mui/icons-material";
import { TrendingUp } from "lucide-react";
import useAudienceAnalytics from "./use-audience-analytics";

function AudienceAnalytics({ creatorId }) {
  const { statsData, audienceData, socialData, isLoading } = useAudienceAnalytics(creatorId);
  const { getPlatformColor, getPlatformIcon, formatFollowers } = useGetplatform();

  const totalFollowers = statsData?.total_followers ? formatNumber(statsData.total_followers) : "0";

  const platforms = Array.isArray(socialData)
    ? socialData.map((p) => ({
        name: p.platform,
        followers: formatNumber(p.follower_count),
        engagement: "", // Phyllo Stats object may not include engagement
      }))
    : [];

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-primary">Audience Analytics Snapshot</h3>
      </div>

      {isLoading && !statsData && <Loading />}

      {!isLoading && statsData && (
        <>
          <div className="mb-8 text-center">
            <p className="text-sm font-medium text-gray-700">Total Followers</p>
            <p className="text-4xl font-bold text-indigo-600">{totalFollowers}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
            {platforms.map((platform, index) => (
              <div
                key={platform.name + index}
                className={`flex items-center justify-between bg-gray-100 rounded-lg p-2 pr-3 transition-colors duration-200 ${
                  platform.loading || platform.notConnected ? "opacity-50" : "hover:bg-gray-100/80"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className={`${getPlatformColor(platform.name)} p-1 rounded-md`}>
                    {getPlatformIcon(platform.name)}
                  </span>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className="text-xs capitalize font-semibold text-primary">
                        {capitalizeFirstLetter(platform.name)}
                      </span>
                      {platform.isVerified && <VerifiedRounded className="w-3 h-3 text-blue-500" />}
                    </div>
                    {platform.username && (
                      <span className="text-[10px] text-gray-500">@{platform.username}</span>
                    )}
                  </div>
                </div>
                <div className="text-sm font-bold text-gray-900">
                  {platform.loading ? (
                    <div className="h-4 w-12 bg-gray-200 animate-pulse rounded"></div>
                  ) : platform.notConnected ? (
                    <span className="text-xs text-gray-400">Not connected</span>
                  ) : (
                    formatFollowers(platform.followers)
                  )}
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-primary mb-4">Audience Demographics</h3>
          <AudienceDemographics audienceData={audienceData} />
        </>
      )}

      {!isLoading && !statsData && (
        <div className="text-center py-12 text-gray-600">
          <TrendingUp className="w-8 h-8 text-gray-400 mx-auto mb-4" />
          <p>No Analytics Data Available</p>
        </div>
      )}
    </section>
  );
}

export default AudienceAnalytics;
