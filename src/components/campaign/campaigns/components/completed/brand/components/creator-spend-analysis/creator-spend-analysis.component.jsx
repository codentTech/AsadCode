import CustomButton from "@/common/components/custom-button/custom-button.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Loader from "@/common/components/loader/loader.component";
import NotFound from "@/common/components/not-found/not-found.component";
import { avatar, sortOptions } from "@/common/constants/auth.constant";
import { CAMPAIGN_TYPE } from "@/common/constants/campaign.constant";
import CampaignCreationWizard from "@/components/campaign/create-campaign/create-campaign";
import { AlertCircle, ExternalLink, MapPin, Star } from "lucide-react";
import CalendarModal from "../../../../active/calendar-modal/calendar-modal.component";
import TaskManagerModal from "../../../../task-manager/task-manager.component";
import { useCreatorSpendAnalysisCompleted } from "./use-creator-spend-analysis.hook";

const CreatorSpendAnalysisCompleted = ({
  selectedCampaign,
  selectedCreator,
  onCreatorSelect,
  onSortChange,
  currentSort = "newest",
  isMultiCreator = true,
  isCompleted = true,
}) => {
  const {
    open,
    creators,
    creatorsLoading,
    creatorsError,
    formatFollowers,
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
  } = useCreatorSpendAnalysisCompleted({
    selectedCampaign,
    selectedCreator,
    onCreatorSelect,
    isCompleted,
    isMultiCreator,
  });

  const handleSortChange = (option) => {
    if (onSortChange && option?.value) {
      onSortChange(option.value);
    }
  };

  const formatMetricValue = (value, type) => {
    if (value == null) return "—";
    if (type === "views" || type === "engagement") return formatFollowers(value);
    if (type === "rate") return `${(value * 100).toFixed(1)}%`;
    if (type === "currency") return `$${value.toFixed(2)}`;
    return String(value);
  };

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
        {!selectedCampaign && (
          <div className="flex items-center justify-center py-16">
            <NotFound
              title="No Campaign Selected"
              description="Select a campaign to view creators."
            />
          </div>
        )}
        {selectedCampaign && creatorsLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Loader loading={true} />
            <p className="text-xs text-gray-500 mt-2">Loading creators...</p>
          </div>
        ) : selectedCampaign && creatorsError ? (
          <div className="flex items-center justify-center py-8">
            <NotFound title="Error loading creators" description="Please try again later." />
          </div>
        ) : selectedCampaign && creators.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <NotFound
              title="No Completed Creators"
              description="No creators have completed this campaign yet."
            />
          </div>
        ) : selectedCampaign ? (
          <div className="space-y-3">
            {creators.map((creator) => {
              const isSelected = selectedCreator?.id === creator.id;
              const creatorMetrics = getCreatorMetrics(creator);
              const comparisons = getCreatorComparisons(creatorMetrics);
              const showMetrics = !isUgc;
              const metricsUnavailable = creatorMetrics?.metricsUnavailable;

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
                        src={creator.image || avatar}
                        alt={creator.name}
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 ring-2 ring-primary"
                        onError={(e) => {
                          e.target.src = avatar;
                        }}
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
                            {creator?.campaign?.campaign_type === CAMPAIGN_TYPE.SPONSORED_POST ||
                            creator?.campaign?.campaign_type === CAMPAIGN_TYPE.UGC ? (
                              <div className="text-sm text-gray-900 bg-gray-100 rounded-lg p-2">
                                Creator Fee:
                                <span className="font-bold text-primary">
                                  {" "}
                                  ${creator.totalSpent || creator.total_spent || 0}
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
                      {isUgc ? (
                        <div className="grid grid-cols-2 gap-3 mt-1">
                          <div className="bg-gray-100 rounded-lg p-3 border border-gray-200">
                            <span className="text-xs font-semibold text-gray-700 block mb-1">
                              Usage Rights
                            </span>
                            <span className="text-xs text-gray-900">
                              {creator.contract?.usageRights
                                ? creator.contract.usageRights.split("_").join(" ")
                                : "—"}
                            </span>
                          </div>
                          <div className="bg-gray-100 rounded-lg p-3 border border-gray-200">
                            <span className="text-xs font-semibold text-gray-700 block mb-1">
                              Creator Fee
                            </span>
                            <span className="text-xs font-bold text-primary">
                              ${creator.totalSpent || creator.total_spent || 0}
                            </span>
                          </div>
                        </div>
                      ) : showMetrics && !creatorMetrics ? (
                        /* No published post yet */
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400 bg-gray-50 rounded-lg p-2 border border-dashed border-gray-200">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          No published post link submitted yet.
                        </div>
                      ) : showMetrics && metricsUnavailable ? (
                        /* Post exists but Phyllo hasn't returned engagement data */
                        <div className="flex items-center gap-2 mt-2 text-xs text-amber-700 bg-amber-50 rounded-lg p-2 border border-amber-200">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          Metrics unavailable — engagement data is being fetched.
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
                              Cost Per Engagement
                            </span>
                            <div className="text-xs font-bold text-gray-900 mb-1">
                              {creatorMetrics.costPerEngagement === null
                                ? "N/A"
                                : formatMetricValue(creatorMetrics.costPerEngagement, "currency")}
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
        ) : null}
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
