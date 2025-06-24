import CustomButton from "@/common/components/custom-button/custom-button.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import { avatar, sortOptions } from "@/common/constants/auth.constant";
import InstagramIcon from "@/common/icons/instagram";
import TwitterIcon from "@/common/icons/twitter";
import YoutubeIcon from "@/common/icons/youtube";
import CampaignCreationWizard from "@/components/campaign/create-campaign/create-campaign";
import {
  MapPin,
  Star,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  Heart,
  DollarSign,
  BarChart3,
} from "lucide-react";
import { useCreatorSpendAnalysis } from "./use-creator-spend-analysis.hook";

const CreatorSpendAnalysis = ({ isCompleted = false }) => {
  const {
    open,
    creators,
    formatFollowers,
    getPlatformColor,
    getSuccessRateColor,
    handleOpenModal,
    handleCloseModal,
  } = useCreatorSpendAnalysis();

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case "instagram":
        return <InstagramIcon />;
      case "youtube":
        return <YoutubeIcon />;
      case "twitter":
        return <TwitterIcon />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  // Generate random trending data for demonstration
  const getTrendingData = () => {
    const trends = ["up", "down", "stable"];
    const trend = trends[Math.floor(Math.random() * trends.length)];
    const percentage = Math.floor(Math.random() * 20) + 1;
    return { trend, percentage };
  };

  const getTrendingIcon = (trend) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-3 h-3 text-green-500" />;
      case "down":
        return <TrendingDown className="w-3 h-3 text-red-500" />;
      default:
        return <Minus className="w-3 h-3 text-gray-400" />;
    }
  };

  const getTrendingColor = (trend) => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  const totalViews = "10,000";
  const totalEngagement = "10,000";
  const engagementRate = "10,000";
  const costPerEngagement = "10,000";

  return (
    <div className="flex-1 flex flex-col h-screen bg-white pb-20">
      {/* Header */}

      {/* Compact Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Creator Analysis</h1>
              <p className="text-xs text-gray-500">Discover top creators for your campaigns</p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex-1 max-w-sm">
              <SimpleSelect
                placeHolder="Select an option"
                options={sortOptions}
                className="w-full max-w-[400px]"
              />
            </div>
            {!isCompleted && (
              <div className="w-full max-w-[200px]">
                <CustomButton text="Start a new campaign" onClick={handleOpenModal} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Creator List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-5xl mx-auto space-y-4">
          {creators.map((creator) => (
            <div
              key={creator.id}
              className="p-4 rounded-lg bg-white shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 border border-gray-100"
            >
              <div className="flex items-start space-x-4">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <img
                    src={avatar}
                    alt={creator.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 ring-2 ring-primary"
                  />
                </div>

                {/* Creator Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-full">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">{creator.name} </h3>
                        <div className="text-sm text-gray-900 bg-gray-100 rounded-lg p-2">
                          Creator Fee:
                          <span className="font-bold text-primary"> ${creator.totalSpent}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{creator.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(creator.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{creator.rating}</span>
                    <span className="text-sm text-gray-500">({creator.reviewCount} reviews)</span>
                  </div>

                  {/* Performance Metrics */}
                  <div className="flex items-center space-x-4 text-xs">
                    <div
                      className={`px-2 py-1 rounded-full ${getSuccessRateColor(
                        creator.successRate
                      )}`}
                    >
                      <span className="font-medium">{creator.successRate}% Success Rate</span>
                    </div>
                    <span className="text-xs bg-gray-100 rounded-lg px-2 py-1 text-gray-600">
                      27 Years
                    </span>
                    <div className="bg-gray-100 rounded-lg px-2 py-1 text-gray-600">
                      <span className="font-bold">Total Views:</span>{" "}
                      {formatFollowers(
                        Object.values(creator.platforms).reduce((sum, p) => sum + p.followers, 0)
                      )}
                    </div>
                    <span
                      className={`text-xs ${creator.deadline === "On time" ? "text-green-600 bg-green-50" : creator.deadline === "Cancelled" ? "text-orange-600 bg-orange-50" : "text-red-600 bg-red-50"} rounded-lg px-2 py-1 text-gray-600`}
                    >
                      <span className="font-bold">Deadline:</span> {creator.deadline}
                    </span>
                  </div>

                  {/* Enhanced Platform Stats Grid */}
                  {!isCompleted ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                      {Object.entries(creator.platforms).map(([platform, data]) => {
                        const trendData = getTrendingData();
                        return (
                          <div
                            key={platform}
                            className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`${getPlatformColor(platform)} p-2 rounded-lg bg-white shadow-sm`}
                                >
                                  {getPlatformIcon(platform)}
                                </span>
                                <span className="text-sm font-semibold text-gray-700 capitalize">
                                  {platform}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                {getTrendingIcon(trendData.trend)}
                                <span
                                  className={`text-xs font-medium ${getTrendingColor(trendData.trend)}`}
                                >
                                  {trendData.percentage}%
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Followers</span>
                                <span className="text-lg font-bold text-gray-900">
                                  {formatFollowers(data.followers)}
                                </span>
                              </div>

                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    platform === "instagram"
                                      ? "bg-gradient-to-r from-pink-500 to-purple-500"
                                      : platform === "youtube"
                                        ? "bg-gradient-to-r from-red-500 to-red-600"
                                        : platform === "twitter"
                                          ? "bg-gradient-to-r from-blue-500 to-blue-600"
                                          : "bg-gradient-to-r from-gray-500 to-gray-600"
                                  }`}
                                  style={{
                                    width: `${Math.min((data.followers / 300000) * 100, 100)}%`,
                                  }}
                                />
                              </div>

                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">Engagement</span>
                                <span className="font-medium text-gray-700">
                                  {(Math.random() * 5 + 2).toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
                      {/* Total Views Dashboard Card */}
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200 hover:shadow-sm transition-all duration-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-blue-700">Total Views</span>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <span className="text-xs font-medium text-green-600">12%</span>
                          </div>
                        </div>
                        <div className="text-lg font-bold text-blue-900 mb-1">{totalViews}</div>
                        <div className="text-xs text-blue-600">+1.2K from last week</div>
                      </div>

                      {/* Total Engagement Dashboard Card */}
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200 hover:shadow-sm transition-all duration-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-green-700">
                            Total Engagement
                          </span>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <span className="text-xs font-medium text-green-600">8%</span>
                          </div>
                        </div>
                        <div className="text-lg font-bold text-green-900 mb-1">
                          {totalEngagement}
                        </div>
                        <div className="text-xs text-green-600">+800 interactions</div>
                      </div>

                      {/* Engagement Rate Dashboard Card */}
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200 hover:shadow-sm transition-all duration-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-purple-700">
                            Engagement Rate
                          </span>
                          <div className="flex items-center space-x-1">
                            <TrendingDown className="w-3 h-3 text-red-500" />
                            <span className="text-xs font-medium text-red-600">3%</span>
                          </div>
                        </div>
                        <div className="text-lg font-bold text-purple-900 mb-1">
                          {engagementRate}%
                        </div>
                        <div className="text-xs text-purple-600">-0.5% from avg</div>
                      </div>

                      {/* Cost Per Engagement Dashboard Card */}
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200 hover:shadow-sm transition-all duration-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-orange-700">
                            Cost Per Engagement
                          </span>
                          <div className="flex items-center space-x-1">
                            <TrendingDown className="w-3 h-3 text-green-500" />
                            <span className="text-xs font-medium text-green-600">5%</span>
                          </div>
                        </div>
                        <div className="text-lg font-bold text-orange-900 mb-1">
                          ${costPerEngagement}
                        </div>
                        <div className="text-xs text-orange-600">$0.50 less per click</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CampaignCreationWizard open={open} close={handleCloseModal} />
    </div>
  );
};

export default CreatorSpendAnalysis;
