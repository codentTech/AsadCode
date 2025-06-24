import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import InstagramIcon from "@/common/icons/instagram";
import TikTokIcon from "@/common/icons/tiktok";
import TwitterIcon from "@/common/icons/twitter";
import YoutubeIcon from "@/common/icons/youtube";
import SidebarLayout from "@/common/layouts/sidebar.layout";
import {
  CheckCircle,
  Instagram,
  Youtube,
  Twitter,
  Users,
  Hash,
  Save,
  Info,
  Video,
} from "lucide-react";
import { useState } from "react";

const DefaultCampaignRequirements = () => {
  const [followerMinimums, setFollowerMinimums] = useState({
    instagram: "",
    tiktok: "",
    youtube: "",
    twitter: "",
  });
  const [selectedNiches, setSelectedNiches] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState(["instagram"]);

  const platforms = [
    {
      id: "instagram",
      label: "Instagram",
      icon: <InstagramIcon />,
      color: "from-pink-400 to-purple-500",
    },
    { id: "tiktok", label: "TikTok", icon: <TikTokIcon />, color: "from-gray-800 to-gray-900" },
    { id: "youtube", label: "YouTube", icon: <YoutubeIcon />, color: "from-red-500 to-red-600" },
    { id: "twitter", label: "Twitter", icon: <TwitterIcon />, color: "from-blue-400 to-blue-500" },
  ];

  const niches = [
    { id: "fashion", label: "Fashion & Style", icon: "👗" },
    { id: "beauty", label: "Beauty & Skincare", icon: "💄" },
    { id: "fitness", label: "Fitness & Health", icon: "💪" },
    { id: "food", label: "Food & Beverage", icon: "🍕" },
    { id: "travel", label: "Travel & Tourism", icon: "✈️" },
    { id: "tech", label: "Technology", icon: "💻" },
    { id: "lifestyle", label: "Lifestyle", icon: "🌟" },
    { id: "parenting", label: "Parenting", icon: "👶" },
    { id: "business", label: "Business", icon: "💼" },
    { id: "gaming", label: "Gaming", icon: "🎮" },
  ];

  const togglePlatform = (platformId) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId) ? prev.filter((id) => id !== platformId) : [...prev, platformId]
    );
  };

  const toggleNiche = (nicheId) => {
    setSelectedNiches((prev) =>
      prev.includes(nicheId) ? prev.filter((id) => id !== nicheId) : [...prev, nicheId]
    );
  };

  const handleFollowerChange = (platform, value) => {
    setFollowerMinimums((prev) => ({
      ...prev,
      [platform]: value,
    }));
  };

  return (
    <SidebarLayout>
      <div className="min-h-screen mx-auto">
        {/* Header */}
        <div className="bg-primary p-4 rounded-lg text-white mb-4">
          <h1 className="text-xl font-bold text-white">Default Campaign Requirements</h1>
          <p className="text-sm mt-1">
            Set default requirements for your campaigns to save time and ensure consistent
            standards.
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg flex-shrink-0">
              <Info className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-1">How It Works</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                These settings will be automatically applied to new campaigns. You can always adjust
                them for specific campaigns later.
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Platform Requirements */}
            <div className="bg-white rounded-lg shadow-sm p-5 border">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                  <Hash className="h-4 w-4 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Required Platforms</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {platforms.map((platform) => {
                  const isSelected = selectedPlatforms.includes(platform.id);

                  return (
                    <button
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      className={`
                        flex items-center p-3 rounded-lg border transition-all duration-200
                        ${
                          isSelected
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200 hover:border-indigo-200"
                        }
                      `}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3`}>
                        {platform.icon}
                      </div>
                      <span className="font-medium text-sm flex-1 text-left">{platform.label}</span>
                      {isSelected && <CheckCircle className="h-4 w-4 text-indigo-500" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Follower Minimums */}
            <div className="bg-white rounded-lg shadow-sm p-5 border">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Minimum Followers</h3>
              </div>

              <div className="space-y-4">
                {platforms
                  .filter((p) => selectedPlatforms.includes(p.id))
                  .map((platform) => {
                    return (
                      <div key={platform.id} className="flex items-end justify-end space-x-3">
                        <div className={`w-8 h-8`}>{platform.icon}</div>
                        <div className="flex-1">
                          <CustomInput
                            label={`${platform.label} Minimum`}
                            name={`${platform.id}Followers`}
                            type="number"
                            placeholder="1000"
                            value={followerMinimums[platform.id]}
                            onChange={(e) => handleFollowerChange(platform.id, e.target.value)}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Set to 0 or leave empty for no minimum requirement
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Preferred Niches */}
            <div className="bg-white rounded-lg shadow-sm p-5 border">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Hash className="h-4 w-4 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Preferred Niches</h3>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {niches.map((niche) => {
                  const isSelected = selectedNiches.includes(niche.id);
                  return (
                    <button
                      key={niche.id}
                      onClick={() => toggleNiche(niche.id)}
                      className={`
                        flex items-center p-2 rounded-lg border transition-all duration-200
                        ${
                          isSelected
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200 hover:border-indigo-200"
                        }
                      `}
                    >
                      <span className="text-sm mr-2">{niche.icon}</span>
                      <span className="text-xs font-medium text-left flex-1">{niche.label}</span>
                      {isSelected && <CheckCircle className="h-3 w-3 text-indigo-500" />}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Select niches that align with your brand and campaigns
              </p>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-lg shadow-sm p-5 border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements Summary</h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Required Platforms</span>
                  <span className="text-sm font-medium">{selectedPlatforms.length}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Preferred Niches</span>
                  <span className="text-sm font-medium">{selectedNiches.length}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Minimum Followers Set</span>
                  <span className="text-sm font-medium">
                    {
                      Object.values(followerMinimums).filter((val) => val && parseInt(val) > 0)
                        .length
                    }
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <CustomButton
                  text="Save Default Requirements"
                  className="btn-primary w-full"
                  icon={Save}
                />
                <p className="text-xs text-gray-500 text-center mt-2">
                  These settings will apply to all new campaigns
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default DefaultCampaignRequirements;
