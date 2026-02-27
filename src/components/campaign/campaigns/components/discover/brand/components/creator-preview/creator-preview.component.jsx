import CustomButton from "@/common/components/custom-button/custom-button.component";
import Loading from "@/common/components/loadar/loading.component";
import { avatar } from "@/common/constants/auth.constant";
import useGetplatform from "@/common/hooks/use-social-platform.hook";
import { getPlatformProfileUrl } from "@/common/utils/platform.utils";
import AudienceDemographics from "@/components/audience-demographics/audience-demographics.component";
import { VerifiedRounded } from "@mui/icons-material";
import { MapPin, Star } from "lucide-react";
import useCreatorPreview from "./use-creator-preview.hook";

function CreatorPreview({ previewCreator, setIsPreviewOpen }) {
  const { getPlatformColor, getPlatformIcon, formatFollowers } = useGetplatform();
  const { stats, audience, socialAccounts, platformData, metricsData, isLoading } =
    useCreatorPreview(previewCreator);

  if (!previewCreator) return null;
  if (isLoading) return <Loading />;

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

          <div className="text-right mt-2">
            <div className="flex items-center gap-2 bg-green-900 px-3 py-1 rounded-lg">
              <VerifiedRounded className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">
                {isLoading
                  ? "Loading..."
                  : `${stats.data?.total_followers ? `${formatFollowers(stats.data.total_followers)} Followers` : "Authentic Audience: 0%"}`}
              </span>
            </div>
          </div>
        </div>

        {/* Platform Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {platformData.map((platform, index) => {
            const profileUrl =
              platform.profileUrl || getPlatformProfileUrl(platform.name, platform.username);
            const platformContent = (
              <div className="flex items-center space-x-2">
                <span className={`${getPlatformColor(platform.name)} p-1 rounded-md`}>
                  {getPlatformIcon(platform.name)}
                </span>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="text-xs capitalize font-bold text-primary">
                      {platform.name}
                    </span>
                    {platform.isVerified && <VerifiedRounded className="w-3 h-3 text-blue-500" />}
                  </div>
                  {platform.username && (
                    <span className="text-[10px] text-gray-500 w-full max-w-[110px] truncate">
                      @{platform.username}
                    </span>
                  )}
                </div>
              </div>
            );
            return (
              <div
                key={platform.name + index}
                className={`flex items-center justify-between bg-gray-100 rounded-lg p-2 pr-3 transition-colors duration-200 ${
                  platform.loading || platform.notConnected ? "opacity-50" : "hover:bg-gray-100/80"
                }`}
              >
                {profileUrl && !platform.notConnected ? (
                  <a
                    href={profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2"
                  >
                    {platformContent}
                  </a>
                ) : (
                  platformContent
                )}
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
            );
          })}
        </div>
      </div>

      {/* Metrics Section */}
      <div className="px-2 py-4 border-b border-gray-200">
        <div className="grid grid-cols-4 gap-4">
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
        </div>
      </div>

      {/* Audience Demographics */}
      <div className="px-2 py-4">
        <h3 className="text-lg font-semibold text-primary mb-4">Audience Demographics</h3>
        <AudienceDemographics
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2"
          audienceData={audience.data ?? null}
          loading={audience.isLoading}
        />
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
