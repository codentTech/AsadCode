import CustomButton from "@/common/components/custom-button/custom-button.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import { Skeleton } from "@/common/components/loader/skeleton-loader.component";
import NotFound from "@/common/components/not-found/not-found.component";
import { sortOptions } from "@/common/constants/auth.constant";
import { CAMPAIGN_TYPE } from "@/common/constants/campaign.constant";
import CalendarModal from "@/components/campaign-refactored/brand-campaign/active/components/calendar-modal/calendar-modal.component";
import TaskManagerModal from "@/components/campaign-refactored/brand-campaign/active/components/task-manager/task-manager.component";
import CampaignCreationWizard from "@/components/campaign-refactored/shared/create-campaign/create-campaign.component";
import { ExternalLink, MapPin, Star } from "lucide-react";
import { useCreatorSpendAnalysisCompleted } from "./use-creator-spend-analysis.hook";

const CreatorSpendAnalysisCompleted = ({
  selectedCampaign,
  selectedCreator,
  onCreatorSelect,
  onClearCreator,
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
    onClearCreator,
    onSortChange,
    isCompleted,
    isMultiCreator,
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-gradient-to-b from-gray-100 to-gray-50/80">
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-sm">
        <div className="p-2.5 sm:p-4">
          <div className="mb-2 sm:mb-3">
            <h1 className="text-sm font-semibold text-gray-900 sm:text-lg md:text-xl">
              Creator Analysis
            </h1>
            <p className="text-[10px] leading-snug text-gray-500 sm:text-xs md:text-sm">
              Review campaign results and individual performance.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <div className="min-w-0 flex-1 sm:max-w-xs md:max-w-sm">
              {isMultiCreator && (
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
                  className="w-full"
                />
              )}
            </div>
            <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end">
              <CustomButton
                text="Calendar"
                className="btn-primary flex-1 sm:flex-none sm:w-auto"
                onClick={() => setShowBrandCalendar(true)}
              />
              <CustomButton
                text="Task Manager"
                className="btn-outline flex-1 sm:flex-none sm:w-auto"
                onClick={() => setShowTaskManager(true)}
              />
              <CustomButton
                text="Start a new campaign"
                className="btn-primary w-full sm:w-auto"
                onClick={handleOpenModal}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2.5 sm:p-4">
        <div className="mx-auto max-w-5xl space-y-3 sm:space-y-4">
        {creatorsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm sm:gap-4 sm:p-4 md:hidden">
                  <Skeleton className="h-24 w-16 shrink-0 rounded-lg sm:h-28 sm:w-20" />
                  <div className="min-w-0 flex-1 space-y-2">
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
                <div className="hidden items-start space-x-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm md:flex">
                  <Skeleton circle className="h-20 w-20 flex-shrink-0" />
                  <div className="min-w-0 flex-1 space-y-2">
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
              <div className="space-y-3 sm:space-y-4">
                {creators.map((creator) => {
                  const isSelected = selectedCreator?.id === creator.id;
                  const creatorMetrics = getCreatorMetrics(creator);
                  const comparisons = getCreatorComparisons(creatorMetrics);
                  const showMetrics = !isUgc;
                  const showFee =
                    creator?.campaign?.campaign_type === CAMPAIGN_TYPE.SPONSORED_POST ||
                    creator?.campaign?.campaign_type === CAMPAIGN_TYPE.UGC;

                  return (
                    <div key={creator.id}>
                      <div
                        onClick={() => onCreatorSelect(creator)}
                        className={`cursor-pointer rounded-lg border bg-white p-3 shadow-sm transition-all duration-200 hover:shadow-md sm:p-4 md:hidden ${
                          isSelected
                            ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                            : "border-gray-100 hover:border-primary/50"
                        }`}
                      >
                        <div className="flex flex-col gap-3 sm:gap-4">
                          <div className="flex items-start gap-4">
                            <img
                              src={creator.image}
                              alt={creator.name}
                              className="h-24 w-16 shrink-0 rounded-lg border-2 border-gray-200 object-cover shadow-sm ring-2 ring-primary/30 sm:h-28 sm:w-20"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="mb-1 flex flex-wrap items-center gap-1.5 sm:gap-2">
                                <h3 className="text-sm font-semibold text-gray-900 sm:text-lg">
                                  {creator.name}
                                </h3>
                                {creator.deadline ? (
                                  <span
                                    className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] sm:rounded-lg sm:px-2 sm:text-xs ${
                                      creator.deadline === "On time"
                                        ? "bg-green-50 text-green-600"
                                        : creator.deadline === "Cancelled"
                                          ? "bg-orange-50 text-orange-600"
                                          : "bg-red-50 text-red-600"
                                    }`}
                                  >
                                    {creator.deadline}
                                  </span>
                                ) : null}
                              </div>
                              {showFee ? (
                                <div className="mb-2 w-fit max-w-full rounded-lg bg-gray-100 px-2 py-0.5 text-[10px] text-gray-900 sm:py-1 sm:text-xs md:text-sm">
                                  Creator Fee:{" "}
                                  <span className="font-bold text-primary">
                                    ${creator?.contract?.totalCompensation || 0}
                                  </span>
                                </div>
                              ) : null}
                              <div className="mb-2 flex flex-wrap items-center gap-2 text-[10px] text-gray-600 sm:gap-3 sm:text-xs md:text-sm">
                                <span className="inline-flex min-w-0 items-center gap-0.5 sm:gap-1">
                                  <MapPin className="h-3 w-3 shrink-0 sm:h-4 sm:w-4" />
                                  <span className="break-words">{creator.location}</span>
                                </span>
                                {creator.age ? <span>({creator.age} yrs)</span> : null}
                              </div>
                              <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-600 sm:gap-3 sm:text-xs">
                                <span className="inline-flex items-center gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 sm:h-4 sm:w-4 ${
                                        i < Math.floor(creator.rating || 0)
                                          ? "fill-current text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </span>
                                <span>{creator.rating}</span>
                                <span>({creator.reviewCount} reviews)</span>
                                <span
                                  className={`rounded-full px-1.5 py-0.5 text-[10px] sm:px-2 sm:text-xs ${getSuccessRateColor(
                                    creator.successRate || creator.success_rate
                                  )}`}
                                >
                                  {creator.successRate || creator.success_rate || 0}% Success Rate
                                </span>
                                {showMetrics && creatorMetrics?.publishedUrl ? (
                                  <a
                                    href={creatorMetrics.publishedUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-0.5 text-primary hover:underline sm:gap-1"
                                  >
                                    <ExternalLink className="h-2.5 w-2.5 shrink-0 sm:h-3 sm:w-3" />
                                    Published Post
                                  </a>
                                ) : null}
                              </div>
                            </div>
                          </div>

                          {isUgc ? null : showMetrics && !creatorMetrics ? (
                            <div className="w-full border-t border-gray-100 pt-3 sm:border-t sm:pt-3">
                              <div className="flex w-full flex-col gap-2">
                                {[1, 2, 3, 4].map((i) => (
                                  <div
                                    key={i}
                                    className="flex animate-pulse items-center justify-between gap-2 rounded-lg border border-gray-200 bg-gray-100 px-2.5 py-2 sm:gap-3 sm:px-3 sm:py-2.5"
                                  >
                                    <div className="min-w-0 flex-1 space-y-2">
                                      <div className="h-3 w-24 rounded bg-gray-300" />
                                      <div className="h-5 w-32 rounded bg-gray-300" />
                                    </div>
                                    <div className="h-3 w-20 shrink-0 rounded bg-gray-200" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : showMetrics && creatorMetrics ? (
                            <div className="w-full min-w-0 border-t border-gray-100 pt-3 sm:border-t sm:pt-3">
                              <div className="flex w-full flex-col gap-2">
                                <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 bg-gray-100 px-2.5 py-2 transition-all duration-200 hover:shadow-sm sm:gap-3 sm:px-3 sm:py-2.5">
                                  <div className="min-w-0">
                                    <p className="text-[10px] font-semibold text-gray-600 sm:text-xs">
                                      Total Views
                                    </p>
                                    <p className="text-sm font-bold tabular-nums text-gray-900 sm:text-base md:text-lg">
                                      {formatMetricValue(creatorMetrics.views, "views")}
                                    </p>
                                  </div>
                                  <p
                                    className={`max-w-[min(100%,10rem)] shrink-0 text-right text-[10px] leading-snug sm:max-w-[14rem] sm:text-xs ${comparisons.views.textColor}`}
                                  >
                                    {comparisons.views.label}
                                  </p>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 bg-gray-100 px-2.5 py-2 transition-all duration-200 hover:shadow-sm sm:gap-3 sm:px-3 sm:py-2.5">
                                  <div className="min-w-0">
                                    <p className="text-[10px] font-semibold text-gray-600 sm:text-xs">
                                      Total Engagement
                                    </p>
                                    <p className="text-sm font-bold tabular-nums text-gray-900 sm:text-base md:text-lg">
                                      {formatMetricValue(creatorMetrics.totalEngagement, "engagement")}
                                    </p>
                                  </div>
                                  <p
                                    className={`max-w-[min(100%,10rem)] shrink-0 text-right text-[10px] leading-snug sm:max-w-[14rem] sm:text-xs ${comparisons.engagement.textColor}`}
                                  >
                                    {comparisons.engagement.label}
                                  </p>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 bg-gray-100 px-2.5 py-2 transition-all duration-200 hover:shadow-sm sm:gap-3 sm:px-3 sm:py-2.5">
                                  <div className="min-w-0">
                                    <p className="text-[10px] font-semibold text-gray-600 sm:text-xs">
                                      Engagement Rate
                                    </p>
                                    <p className="text-sm font-bold tabular-nums text-gray-900 sm:text-base md:text-lg">
                                      {formatMetricValue(creatorMetrics.engagementRate, "rate")}
                                    </p>
                                  </div>
                                  <p
                                    className={`max-w-[min(100%,10rem)] shrink-0 text-right text-[10px] leading-snug sm:max-w-[14rem] sm:text-xs ${comparisons.er.textColor}`}
                                  >
                                    {comparisons.er.label}
                                  </p>
                                </div>
                                <div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-gray-100 px-2.5 py-2 transition-all duration-200 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-3 sm:py-2.5">
                                  <div className="min-w-0 flex-1">
                                    <p className="text-[10px] font-semibold text-gray-600 sm:text-xs">
                                      Cost Per
                                    </p>
                                    <div className="mt-0.5 flex flex-col gap-0.5 text-xs font-bold tabular-nums text-gray-900 sm:flex-row sm:flex-wrap sm:gap-x-3 sm:text-sm md:text-base">
                                      <span>
                                        <span className="font-normal text-gray-500">View </span>
                                        {creatorMetrics.costPerView == null ||
                                        !Number.isFinite(Number(creatorMetrics.costPerView))
                                          ? "N/A"
                                          : formatMetricValue(
                                              creatorMetrics.costPerView,
                                              "currency"
                                            )}
                                      </span>
                                      <span>
                                        <span className="font-normal text-gray-500">Engagement </span>
                                        {creatorMetrics.costPerEngagement == null ||
                                        !Number.isFinite(
                                          Number(creatorMetrics.costPerEngagement)
                                        )
                                          ? "N/A"
                                          : formatMetricValue(
                                              creatorMetrics.costPerEngagement,
                                              "currency"
                                            )}
                                      </span>
                                    </div>
                                  </div>
                                  <p
                                    className={`max-w-full text-[10px] leading-snug sm:max-w-[14rem] sm:text-right sm:text-xs ${comparisons.cpe.textColor}`}
                                  >
                                    {comparisons.cpe.label}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div
                        onClick={() => onCreatorSelect(creator)}
                        className={`hidden cursor-pointer rounded-lg border bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg md:block ${
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
                              className="h-20 w-20 rounded-full border-2 border-gray-200 object-cover ring-2 ring-primary"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="mb-2 flex items-start justify-between">
                              <div className="w-full">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                      {creator.name}
                                    </h3>
                                    {creator.deadline && (
                                      <span
                                        className={`rounded-lg px-2 py-1 text-sm ${creator.deadline === "On time" ? "bg-green-50 text-green-600" : creator.deadline === "Cancelled" ? "bg-orange-50 text-orange-600" : "bg-red-50 text-red-600"}`}
                                      >
                                        {creator.deadline}
                                      </span>
                                    )}
                                  </div>
                                  {creator?.campaign?.campaign_type === CAMPAIGN_TYPE.SPONSORED_POST ||
                                  creator?.campaign?.campaign_type === CAMPAIGN_TYPE.UGC ? (
                                    <div className="rounded-lg bg-gray-100 p-2 text-sm text-gray-900">
                                      Creator Fee:
                                      <span className="font-bold text-primary">
                                        {" "}
                                        ${creator?.contract?.totalCompensation || 0}
                                      </span>
                                    </div>
                                  ) : null}
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <div className="flex items-center space-x-1 text-xs">
                                    <MapPin className="h-4 w-4" />
                                    <span>{creator.location}</span>
                                  </div>
                                  {creator.age ? (
                                    <span className="text-xs text-gray-600">
                                      ({creator.age} Years Old)
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                            </div>

                            <div className="mb-3 flex items-center space-x-2">
                              <div className="flex items-center text-xs">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
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

                            <div className="mb-3 flex items-center space-x-4 text-xs">
                              <div
                                className={`rounded-full px-2 py-1 ${getSuccessRateColor(
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
                                  <ExternalLink className="h-3 w-3" />
                                  Published Post
                                </a>
                              )}
                            </div>

                            {isUgc ? null : showMetrics && !creatorMetrics ? (
                              <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
                                {[1, 2, 3, 4].map((i) => (
                                  <div
                                    key={i}
                                    className="animate-pulse rounded-lg border border-gray-200 bg-gray-100 p-3"
                                  >
                                    <div className="mb-2 h-3.5 w-20 rounded bg-gray-300" />
                                    <div className="mb-1 h-4 w-14 rounded bg-gray-300" />
                                    <div className="h-3 w-16 rounded bg-gray-200" />
                                  </div>
                                ))}
                              </div>
                            ) : showMetrics && creatorMetrics ? (
                              <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
                                <div className="rounded-lg border border-gray-200 bg-gray-100 p-3 transition-all duration-200 hover:shadow-sm">
                                  <span className="mb-1 block text-xs font-semibold text-gray-700">
                                    Total Views
                                  </span>
                                  <div className="mb-1 text-xs font-bold text-gray-900">
                                    {formatMetricValue(creatorMetrics.views, "views")}
                                  </div>
                                  <div className={`text-xs ${comparisons.views.textColor}`}>
                                    {comparisons.views.label}
                                  </div>
                                </div>

                                <div className="rounded-lg border border-gray-200 bg-gray-100 p-3 transition-all duration-200 hover:shadow-sm">
                                  <span className="mb-1 block text-xs font-semibold text-gray-700">
                                    Total Engagement
                                  </span>
                                  <div className="mb-1 text-xs font-bold text-gray-900">
                                    {formatMetricValue(creatorMetrics.totalEngagement, "engagement")}
                                  </div>
                                  <div className={`text-xs ${comparisons.engagement.textColor}`}>
                                    {comparisons.engagement.label}
                                  </div>
                                </div>

                                <div className="rounded-lg border border-gray-200 bg-gray-100 p-3 transition-all duration-200 hover:shadow-sm">
                                  <span className="mb-1 block text-xs font-semibold text-gray-700">
                                    Engagement Rate
                                  </span>
                                  <div className="mb-1 text-xs font-bold text-gray-900">
                                    {formatMetricValue(creatorMetrics.engagementRate, "rate")}
                                  </div>
                                  <div className={`text-xs ${comparisons.er.textColor}`}>
                                    {comparisons.er.label}
                                  </div>
                                </div>

                                <div className="rounded-lg border border-gray-200 bg-gray-100 p-3 transition-all duration-200 hover:shadow-sm">
                                  <span className="mb-1 block text-xs font-semibold text-gray-700">
                                    Cost Per
                                  </span>
                                  <div className="mb-0.5 text-xs text-gray-900">
                                    <span className="text-gray-500">View: </span>
                                    <span className="font-bold">
                                      {creatorMetrics.costPerView == null ||
                                      !Number.isFinite(Number(creatorMetrics.costPerView))
                                        ? "N/A"
                                        : formatMetricValue(creatorMetrics.costPerView, "currency")}
                                    </span>
                                  </div>
                                  <div className="mb-1 text-xs text-gray-900">
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
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
        </div>
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
