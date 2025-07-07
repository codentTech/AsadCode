import CustomButton from "@/common/components/custom-button/custom-button.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import { avatar, sortOptions } from "@/common/constants/auth.constant";
import InstagramIcon from "@/common/icons/instagram";
import TwitterIcon from "@/common/icons/twitter";
import YoutubeIcon from "@/common/icons/youtube";
import CampaignCreationWizard from "@/components/campaign/create-campaign/create-campaign";
import { MapPin, Minus, Star, TrendingDown, TrendingUp, Users } from "lucide-react";
import { useCreatorSpendAnalysis } from "./use-creator-spend-analysis.hook";
import BrandCalendarModal from "./components/brand-calendar-modal/brand-calendar-modal.component";
import TaskManagerModal from "./components/task-manager/task-manager.component";

const CreatorSpendAnalysis = ({ isCompleted = false }) => {
  const {
    open,
    creators,
    formatFollowers,
    getPlatformColor,
    getSuccessRateColor,
    handleOpenModal,
    handleCloseModal,
    showBrandCalendar,
    setShowBrandCalendar,
    showTaskManager,
    setShowTaskManager,
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

  // Helper function to determine if performance is above or below average
  const getPerformanceComparison = (metricType) => {
    // Simulate random performance data - in real app this would come from your data
    const isAboveAverage = Math.random() > 0.5;
    const difference = Math.floor(Math.random() * 5000) + 100; // Random difference

    return {
      isAboveAverage,
      difference: formatFollowers(difference),
      textColor: isAboveAverage ? "text-green-600" : "text-red-600",
    };
  };

  const totalViews = "10,000";
  const totalEngagement = "10,000";
  const engagementRate = "10,000";
  const costPerEngagement = "10,000";

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-100 pb-20">
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
            <div className="flex gap-3">
              <CustomButton
                text="Calendar"
                className="btn-primary"
                onClick={() => setShowBrandCalendar(true)}
              />
              <CustomButton
                text="Task Manager"
                className="btn-outline"
                onClick={() => setShowTaskManager(true)}
              />
              <CustomButton
                text="Start a new campaign"
                className="btn-primary"
                onClick={handleOpenModal}
              />
            </div>
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
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900">{creator.name}</h3>
                          {isCompleted && (
                            <span
                              className={`text-sm ${creator.deadline === "On time" ? "text-green-600 bg-green-50" : creator.deadline === "Cancelled" ? "text-orange-600 bg-orange-50" : "text-red-600 bg-red-50"} rounded-lg px-2 py-1`}
                            >
                              {creator.deadline}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-900 bg-gray-100 rounded-lg p-2">
                          Creator Fee:
                          <span className="font-bold text-primary"> ${creator.totalSpent}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1 text-xs">
                          <MapPin className="w-4 h-4" />
                          <span>{creator.location}</span>
                        </div>
                        <span className="text-xs text-gray-600">(27 Years)</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex text-xs items-center">
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
                    <span className="text-xs font-medium text-gray-900">{creator.rating}</span>
                    <span className="text-xs text-gray-600">({creator.reviewCount} reviews)</span>
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
                    {!isCompleted && (
                      <div className="bg-gray-100 rounded-lg px-2 py-1 text-gray-600">
                        <span className="font-bold">Total Views:</span>{" "}
                        {formatFollowers(
                          Object.values(creator.platforms).reduce((sum, p) => sum + p.followers, 0)
                        )}
                      </div>
                    )}
                  </div>

                  {/* Enhanced Platform Stats Grid */}
                  {!isCompleted ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                      {Object.entries(creator.platforms).map(([platform, data]) => (
                        <div
                          key={platform}
                          className="flex items-center justify-between bg-gray-100 rounded-lg px-1 pr-3
                                    hover:bg-gray-100/80 transition-colors duration-200"
                        >
                          <div className="flex items-center space-x-2">
                            <span className={`${getPlatformColor(platform)} p-1 rounded-md`}>
                              {getPlatformIcon(platform)}
                            </span>
                            <span className="text-xs capitalize font-semibold text-gray-700">
                              {platform}
                            </span>
                          </div>
                          <div className="text-sm font-bold text-gray-900">
                            {formatFollowers(data.followers)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
                      {/* Total Views Dashboard Card */}
                      <div className="bg-gray-100 rounded-lg p-3 border border-gray-200 hover:shadow-sm transition-all duration-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-gray-700">Total Views</span>
                        </div>
                        <div className="text-xs font-bold text-gray-900 mb-1">{totalViews}</div>
                        <div className={`text-xs ${getPerformanceComparison("views").textColor}`}>
                          +{getPerformanceComparison("views").difference} above campaign average
                        </div>
                      </div>

                      {/* Total Engagement Dashboard Card */}
                      <div className="bg-gray-100 rounded-lg p-3 border border-gray-200 hover:shadow-sm transition-all duration-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-gray-700">
                            Total Engagement
                          </span>
                        </div>
                        <div className="text-xs font-bold text-gray-900 mb-1">
                          {totalEngagement}
                        </div>
                        <div
                          className={`text-xs ${getPerformanceComparison("engagement").textColor}`}
                        >
                          +{getPerformanceComparison("engagement").difference} above campaign
                          average
                        </div>
                      </div>

                      {/* Engagement Rate Dashboard Card */}
                      <div className="bg-gray-100 rounded-lg p-3 border border-gray-200 hover:shadow-sm transition-all duration-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-gray-700">
                            Engagement Rate
                          </span>
                        </div>
                        <div className="text-xs font-bold text-gray-900 mb-1">
                          {engagementRate}%
                        </div>
                        <div className={`text-xs ${getPerformanceComparison("rate").textColor}`}>
                          +{getPerformanceComparison("rate").difference} above campaign average
                        </div>
                      </div>

                      {/* Cost Per Engagement Dashboard Card */}
                      <div className="bg-gray-100 rounded-lg p-3 border border-gray-200 hover:shadow-sm transition-all duration-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-gray-700">
                            Cost Per Engagement
                          </span>
                        </div>
                        <div className="text-xs font-bold text-gray-900 mb-1">
                          ${costPerEngagement}
                        </div>
                        <div className={`text-xs ${getPerformanceComparison("cost").textColor}`}>
                          +${getPerformanceComparison("cost").difference} above campaign average
                        </div>
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
      <BrandCalendarModal show={showBrandCalendar} onClose={() => setShowBrandCalendar(false)} />
      <TaskManagerModal show={showTaskManager} onClose={() => setShowTaskManager(false)} />
    </div>
  );
};

export default CreatorSpendAnalysis;
