import CustomButton from "@/common/components/custom-button/custom-button.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Loader from "@/common/components/loader/loader.component";
import NotFound from "@/common/components/not-found/not-found.component";
import { avatar, sortOptions } from "@/common/constants/auth.constant";
import InstagramIcon from "@/common/icons/instagram";
import TwitterIcon from "@/common/icons/twitter";
import YoutubeIcon from "@/common/icons/youtube";
import CampaignCreationWizard from "@/components/campaign/create-campaign/create-campaign";
import { MapPin, Star, Users } from "lucide-react";
import React from "react";
import CalendarModal from "../../../calendar-modal/calendar-modal.component";
import TaskManagerModal from "./components/task-manager/task-manager.component";
import { useCreatorSpendAnalysis } from "./use-creator-spend-analysis.hook";

const CreatorSpendAnalysis = ({
  selectedCampaign,
  selectedCreator,
  onCreatorSelect,
  onSortChange,
  currentSort = "newest",
}) => {
  const {
    open,
    creators,
    creatorsLoading,
    creatorsSuccess,
    creatorsError,
    formatFollowers,
    getPlatformColor,
    getSuccessRateColor,
    handleOpenModal,
    handleCloseModal,
    showBrandCalendar,
    setShowBrandCalendar,
    showTaskManager,
    setShowTaskManager,
  } = useCreatorSpendAnalysis(selectedCampaign);

  // Handle sort change
  const handleSortChange = (option) => {
    if (onSortChange && option?.value) {
      onSortChange(option.value);
    }
  };

  // Auto-select first creator when creators are loaded and no creator is selected
  React.useEffect(() => {
    if (creatorsSuccess && creators.length > 0 && !selectedCreator && selectedCampaign) {
      onCreatorSelect(creators[0]);
    }
  }, [creatorsSuccess, creators, selectedCreator, selectedCampaign, onCreatorSelect]);

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
    <div className="flex-1 flex flex-col h-screen bg-gray-100">
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

          <div className="flex justify-between items-center gap-4">
            <div className="flex-1 max-w-sm">
              <SimpleSelect
                placeHolder="Select an option"
                options={sortOptions}
                value={
                  currentSort
                    ? {
                        value: currentSort,
                        label: sortOptions.find((opt) => opt.value === currentSort)?.label,
                      }
                    : null
                }
                onChange={handleSortChange}
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
          {/* Campaign Selection Message */}
          {!selectedCampaign && !creatorsLoading && (
            <div className="py-16">
              <NotFound
                title="No Active Campaign Selected"
                description="Select an active campaign from the left panel to view and manage creators."
              />
            </div>
          )}

          {/* Loading State */}
          {creatorsLoading && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Loader loading={true} />
              <p className="text-sm text-gray-500 mt-3">Loading creators...</p>
            </div>
          )}

          {/* Error State */}
          {creatorsError && (
            <div className="py-16">
              <NotFound
                title="Error Loading Creators"
                description="There was an error loading the creators for this campaign. Please try again."
              />
            </div>
          )}

          {/* No Creators Message */}
          {creatorsSuccess && creators.length === 0 && selectedCampaign && (
            <div className="py-16">
              <NotFound
                title="No Creators Found"
                description="Try adjusting filters or selecting a different campaign."
              />
            </div>
          )}

          {/* Creators List */}
          {creatorsSuccess &&
            creators.length > 0 &&
            selectedCampaign &&
            creators.map((creator) => {
              const isSelected = selectedCreator?.id === creator.id;
              return (
                <div
                  key={creator.id}
                  onClick={() => onCreatorSelect(creator)}
                  className={`p-4 rounded-lg bg-white shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 border cursor-pointer ${
                    isSelected
                      ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                      : "border-gray-100 hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Profile Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={creator.image || avatar}
                        alt={creator.name}
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 ring-2 ring-primary"
                        onError={(e) => {
                          e.target.src = avatar;
                        }}
                      />
                    </div>

                    {/* Creator Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="w-full">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {creator.name}
                              </h3>
                              {creator.deadline && (
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
                        <span className="text-xs text-gray-600">
                          ({creator.reviewCount} reviews)
                        </span>
                      </div>

                      {/* Performance Metrics */}
                      <div className="flex items-center space-x-4 text-xs">
                        <div
                          className={`px-2 py-1 rounded-full ${getSuccessRateColor(
                            creator.successRate
                          )}`}
                        >
                          {`${creator.successRate || 0}% Success Rate`}
                        </div>
                        <div className="bg-gray-100 rounded-lg px-2 py-1 text-gray-600">
                          <span className="font-bold">Total Views:</span>{" "}
                          {formatFollowers(
                            Object.values(creator.platforms).reduce(
                              (sum, p) => sum + p.followers,
                              0
                            )
                          )}
                        </div>
                      </div>
                      {/* Enhanced Platform Stats Grid */}
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
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <CampaignCreationWizard open={open} close={handleCloseModal} />
      <CalendarModal
        show={showBrandCalendar}
        onClose={() => setShowBrandCalendar(false)}
        selectedCampaign={selectedCampaign}
      />
      <TaskManagerModal show={showTaskManager} onClose={() => setShowTaskManager(false)} />
    </div>
  );
};

export default CreatorSpendAnalysis;
