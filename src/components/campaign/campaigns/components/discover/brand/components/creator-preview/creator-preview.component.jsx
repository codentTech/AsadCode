import CustomButton from "@/common/components/custom-button/custom-button.component";
import { avatar, cover } from "@/common/constants/auth.constant";
import useGetplatform from "@/common/hooks/use-get-social-platform.hook";
import AudienceDemographics from "@/components/audience-demographics/audience-demographics";
import { VerifiedOutlined, VerifiedRounded } from "@mui/icons-material";
import {
  Star,
  Instagram,
  Youtube,
  Twitter,
  MapPin,
  CheckCircle,
  X,
  Verified,
  VerifiedIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

function CreatorPreview({ previewCreator, setIsPreviewOpen }) {
  const router = useRouter();
  const { getPlatformColor, getPlatformIcon, formatFollowers } = useGetplatform();
  if (!previewCreator) return null;

  // Mock data - replace with actual API data
  const mockData = {
    platforms: [
      { name: "Instagram", followers: "285K" },
      { name: "YouTube", followers: "95K" },
      { name: "Twitter", followers: "42K" },
    ],
    authenticAudience: 72,
    engagementRate: "1.84%",
    averageReach: "35%",
    averageViews: 651,
    postingFrequency: "4/Month",
  };

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
              <p className="text-xs text-gray-600">
                @{previewCreator.username || "sophia.creates"}
              </p>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <MapPin className="w-3 h-3" />
                <span>{previewCreator.location}</span>
              </div>
              <div className="flex items-center justify-start text-xs text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current" />
                ))}
                <span className="text-xs text-gray-700">
                  {previewCreator.rating} ({previewCreator.reviewCount})
                </span>
              </div>
            </div>
          </div>

          <div className="text-right mt-2">
            <div className="flex items-center gap-2 bg-green-900 px-3 py-1 rounded-lg">
              <VerifiedRounded className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">
                Authentic Audience: {mockData.authenticAudience}%
              </span>
            </div>
          </div>
        </div>

        {/* Platform Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {mockData.platforms.map((platform) => (
            <div
              key={platform.name}
              className="flex items-center justify-between bg-gray-100 rounded-lg p-2 pr-3 hover:bg-gray-100/80 transition-colors duration-200"
            >
              <div className="flex items-center space-x-2">
                <span className={`${getPlatformColor(platform.name)} p-1 rounded-md`}>
                  {getPlatformIcon(platform.name)}
                </span>
                <span className="text-xs capitalize font-semibold text-gray-700">
                  {platform.name}
                </span>
              </div>
              <div className="text-sm font-bold text-gray-900">
                {formatFollowers(platform.followers)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics Section */}
      <div className="px-2 py-4 border-b border-gray-200">
        <div className="grid grid-cols-4 gap-4">
          <div className="text-left">
            <p className="text-sm text-gray-600">Engagement Rate</p>
            <p className="text-lg font-semibold">{mockData.engagementRate}</p>
          </div>
          <div className="text-left">
            <p className="text-sm text-gray-600">Average Reach</p>
            <p className="text-lg font-semibold">{mockData.averageReach}</p>
          </div>
          <div className="text-left">
            <p className="text-sm text-gray-600">Average Views</p>
            <p className="text-lg font-semibold">{mockData.averageViews}</p>
          </div>
          <div className="text-left">
            <p className="text-sm text-gray-600">Posting Frequency</p>
            <p className="text-lg font-semibold">{mockData.postingFrequency}</p>
          </div>
        </div>
      </div>

      {/* Audience Demographics */}
      <div className="px-2 py-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Audience Demographics</h3>
        <AudienceDemographics className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2" />
      </div>

      {/* Footer Actions */}
      <div className="bg-gray-100 rounded-lg sticky w-full bottom-0 p-4 border-t flex justify-between">
        <CustomButton text="Close" className="btn-cancel" onClick={() => setIsPreviewOpen(false)} />

        <CustomButton
          text="View Full Profile"
          className="btn-primary"
          onClick={() => window.open("creator-portfolio", "_blank")}
        />
      </div>
    </div>
  );
}

export default CreatorPreview;
