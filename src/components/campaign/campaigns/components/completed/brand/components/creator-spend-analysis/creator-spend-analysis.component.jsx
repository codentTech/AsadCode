import CustomButton from "@/common/components/custom-button/custom-button.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import { Skeleton } from "@/common/components/loader/skeleton-loader.component";
import NotFound from "@/common/components/not-found/not-found.component";
import { avatar, sortOptions } from "@/common/constants/auth.constant";
import { CAMPAIGN_TYPE } from "@/common/constants/campaign.constant";
import CampaignCreationWizard from "@/components/campaign/create-campaign/create-campaign.component";
import { ExternalLink, MapPin, Star } from "lucide-react";
import CalendarModal from "../../../../active/calendar-modal/calendar-modal.component";
import TaskManagerModal from "../../../../task-manager/task-manager.component";
import { useCreatorSpendAnalysisCompleted } from "./use-creator-spend-analysis.hook";

const CreatorSpendAnalysisCompleted = ({
  selectedCampaign,
  selectedCreator,
  onCreatorSelect,
  currentSort = "newest",
  isMultiCreator = true,
  isCompleted = true,
}) => {
  const {
    open,
    creators,
    creatorsLoading,
    creatorsError,
    getSuccessRateColor,
    handleOpenModal,
    handleCloseModal,
    showBrandCalendar,
    setShowBrandCalendar,
    showTaskManager,
    setShowTaskManager,
    isUgc,
    getCreatorMetrics,
    getCreatorComparisons,
    handleSortChange,
    formatMetricValue,
  } = useCreatorSpendAnalysisCompleted({
    selectedCampaign,
    selectedCreator,
    onCreatorSelect,
    isCompleted,
    isMultiCreator,
  });

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-100">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Creator Analysis</h1>
              <p className="text-xs text-gray-500">
                Review campaign results and individual performance.
              </p>
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

      <div className="flex-1 overflow-y-auto p-4">
        {creatorsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-4 rounded-lg bg-white shadow-sm border border-gray-100 flex items-start space-x-4"
              >
                <Skeleton circle className="w-20 h-20 flex-shrink-0" />
                <div className="flex-1 min-w-0 space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-8 w-24 rounded" />
                    <Skeleton className="h-8 w-24 rounded" />
                    <Skeleton className="h-8 w-24 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {!selectedCampaign && (
              <div className="flex items-center justify-center py-16">
                <NotFound
                  title="No Campaign Selected"
                  description="Select a campaign to view creators."
                />
              </div>
            )}
            {selectedCampaign && creatorsError && (
              <div className="flex items-center justify-center py-8">
                <NotFound title="Error loading creators" description="Please try again later." />
              </div>
            )}
            {selectedCampaign && creators.length === 0 && (
              <div className="flex items-center justify-center py-8">
                <NotFound
                  title="No Completed Creators"
                  description="No creators have completed this campaign yet."
                />
              </div>
            )}
            {selectedCampaign && creators.length > 0 && (
              <div className="space-y-3">
                {creators.map((creator) => {
                  console.log("creator", creator);
                  const isSelected = selectedCreator?.id === creator.id;
                  const creatorMetrics = getCreatorMetrics(creator);
                  const comparisons = getCreatorComparisons(creatorMetrics);
                  const showMetrics = !isUgc;

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
                        <div className="flex-shrink-0">
                          <img
                            src={creator.image}
                            alt={creator.name}
                            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 ring-2 ring-primary"
                          />
                        </div>

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
                                {creator?.campaign?.campaign_type ===
                                  CAMPAIGN_TYPE.SPONSORED_POST ||
                                creator?.campaign?.campaign_type === CAMPAIGN_TYPE.UGC ? (
                                  <div className="text-sm text-gray-900 bg-gray-100 rounded-lg p-2">
                                    Creator Fee:
                                    <span className="font-bold text-primary">
                                      {" "}
                                      ${creator?.contract?.totalCompensation || 1}
                                    </span>
                                  </div>
                                ) : null}
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-1 text-xs">
                                  <MapPin className="w-4 h-4" />
                                  <span>{creator.location}</span>
                                </div>
                                {creator.age && (
                                  <span className="text-xs text-gray-600">
                                    ({creator.age} Years Old)
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 mb-3">
                            <div className="flex text-xs items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(creator.rating || 0)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-600">{creator.rating}</span>
                            <span className="text-xs text-gray-600">
                              ({creator.reviewCount} reviews)
                            </span>
                          </div>

                          <div className="flex items-center space-x-4 text-xs mb-3">
                            <div
                              className={`px-2 py-1 rounded-full ${getSuccessRateColor(
                                creator.successRate || creator.success_rate
                              )}`}
                            >
                              {`${creator.successRate || creator.success_rate || 0}% Success Rate`}
                            </div>
                            {showMetrics && creatorMetrics?.publishedUrl && (
                              <a
                                href={creatorMetrics.publishedUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1 text-primary hover:underline"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Published Post
                              </a>
                            )}
                          </div>

                          {/* UGC: show usage rights + completion status instead of metrics */}
                          {isUgc ? null : showMetrics && !creatorMetrics ? (
                            /* Skeleton while engagement data is being fetched */
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
                              {[1, 2, 3, 4].map((i) => (
                                <div
                                  key={i}
                                  className="bg-gray-100 rounded-lg p-3 border border-gray-200 animate-pulse"
                                >
                                  <div className="h-3.5 w-20 bg-gray-300 rounded mb-2" />
                                  <div className="h-4 w-14 bg-gray-300 rounded mb-1" />
                                  <div className="h-3 w-16 bg-gray-200 rounded" />
                                </div>
                              ))}
                            </div>
                          ) : showMetrics && creatorMetrics ? (
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
                              <div className="bg-gray-100 rounded-lg p-3 border border-gray-200 hover:shadow-sm transition-all duration-200">
                                <span className="text-xs font-semibold text-gray-700 block mb-1">
                                  Total Views
                                </span>
                                <div className="text-xs font-bold text-gray-900 mb-1">
                                  {formatMetricValue(creatorMetrics.views, "views")}
                                </div>
                                <div className={`text-xs ${comparisons.views.textColor}`}>
                                  {comparisons.views.label}
                                </div>
                              </div>

                              <div className="bg-gray-100 rounded-lg p-3 border border-gray-200 hover:shadow-sm transition-all duration-200">
                                <span className="text-xs font-semibold text-gray-700 block mb-1">
                                  Total Engagement
                                </span>
                                <div className="text-xs font-bold text-gray-900 mb-1">
                                  {formatMetricValue(creatorMetrics.totalEngagement, "engagement")}
                                </div>
                                <div className={`text-xs ${comparisons.engagement.textColor}`}>
                                  {comparisons.engagement.label}
                                </div>
                              </div>

                              <div className="bg-gray-100 rounded-lg p-3 border border-gray-200 hover:shadow-sm transition-all duration-200">
                                <span className="text-xs font-semibold text-gray-700 block mb-1">
                                  Engagement Rate
                                </span>
                                <div className="text-xs font-bold text-gray-900 mb-1">
                                  {formatMetricValue(creatorMetrics.engagementRate, "rate")}
                                </div>
                                <div className={`text-xs ${comparisons.er.textColor}`}>
                                  {comparisons.er.label}
                                </div>
                              </div>

                              <div className="bg-gray-100 rounded-lg p-3 border border-gray-200 hover:shadow-sm transition-all duration-200">
                                <span className="text-xs font-semibold text-gray-700 block mb-1">
                                  Cost Per
                                </span>
                                <div className="text-xs text-gray-900 mb-0.5">
                                  <span className="text-gray-500">View: </span>
                                  <span className="font-bold">
                                    {creatorMetrics.costPerView == null ||
                                    !Number.isFinite(Number(creatorMetrics.costPerView))
                                      ? "N/A"
                                      : formatMetricValue(creatorMetrics.costPerView, "currency")}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-900 mb-1">
                                  <span className="text-gray-500">Engagement: </span>
                                  <span className="font-bold">
                                    {creatorMetrics.costPerEngagement == null ||
                                    !Number.isFinite(Number(creatorMetrics.costPerEngagement))
                                      ? "N/A"
                                      : formatMetricValue(
                                          creatorMetrics.costPerEngagement,
                                          "currency"
                                        )}
                                  </span>
                                </div>
                                <div className={`text-xs ${comparisons.cpe.textColor}`}>
                                  {comparisons.cpe.label}
                                </div>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      <CampaignCreationWizard open={open} close={handleCloseModal} />
      <CalendarModal
        show={showBrandCalendar}
        onClose={() => setShowBrandCalendar(false)}
        selectedCampaign={selectedCampaign}
      />
      <TaskManagerModal
        show={showTaskManager}
        onClose={() => setShowTaskManager(false)}
        isMultiCreator={isMultiCreator}
      />
    </div>
  );
};

export default CreatorSpendAnalysisCompleted;
