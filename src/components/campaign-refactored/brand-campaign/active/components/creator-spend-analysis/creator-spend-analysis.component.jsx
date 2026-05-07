import CustomButton from "@/common/components/custom-button/custom-button.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import { Skeleton } from "@/common/components/loader/skeleton-loader.component";
import NotFound from "@/common/components/not-found/not-found.component";
import { sortOptions } from "@/common/constants/auth.constant";
import { CAMPAIGN_TYPE } from "@/common/constants/campaign.constant";
import CalendarModal from "@/components/campaign-refactored/brand-campaign/active/components/calendar-modal/calendar-modal.component";
import TaskManagerModal from "@/components/campaign-refactored/brand-campaign/active/components/task-manager/task-manager.component";
import { MapPin, Star } from "lucide-react";
import { useCreatorSpendAnalysis } from "./use-creator-spend-analysis.hook";

const CreatorSpendAnalysis = ({
  selectedCampaign,
  selectedCreator,
  onCreatorSelect,
  onClearCreator,
  onSortChange,
  currentSort = "newest",
  isCompleted = false,
}) => {
  const {
    creators,
    creatorsLoading,
    creatorsSuccess,
    creatorsError,
    creatorsListCampaignId,
    isMultiCreator,
    getSuccessRateColor,
    showBrandCalendar,
    setShowBrandCalendar,
    showTaskManager,
    setShowTaskManager,
    getPlatformIcon,
    formatFollowers,
    getPlatformColor,
    handleSortChange,
    openBrandCalendar,
    closeBrandCalendar,
    openTaskManagerModal,
    closeTaskManagerModal,
    handleCreatorRowClick,
  } = useCreatorSpendAnalysis(
    selectedCampaign,
    isCompleted,
    true,
    onClearCreator,
    selectedCreator,
    onCreatorSelect,
    onSortChange
  );

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-gradient-to-b from-gray-100 to-gray-50/80">
      <div className="shrink-0 z-10 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-sm">
        <div className="p-2.5 sm:p-4">
          <div className="mb-2 sm:mb-3">
            <h1 className="text-sm font-semibold text-gray-900 sm:text-lg md:text-xl">
              Creator Progress
            </h1>
            <p className="text-[10px] leading-snug text-gray-500 sm:text-xs md:text-sm">
              Track creator progress, deadlines and deliverables.
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
                onClick={openBrandCalendar}
              />
              <CustomButton
                text="Task Manager"
                className="btn-outline flex-1 sm:flex-none sm:w-auto"
                onClick={openTaskManagerModal}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4">
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
              {!selectedCampaign && !isMultiCreator && creators.length === 0 && (
                <div className="py-16">
                  <NotFound
                    title="No Individual Collaborations"
                    description="You don't have any active individual collaborations at the moment."
                  />
                </div>
              )}
              {!selectedCampaign && isMultiCreator && (
                <div className="py-16">
                  <NotFound
                    title="No Active Campaign Selected"
                    description="Select an active campaign from the left panel to view and manage creators."
                  />
                </div>
              )}

              {creatorsError && (
                <div className="py-16">
                  <NotFound
                    title="Error Loading Creators"
                    description="There was an error loading the creators for this campaign. Please try again."
                  />
                </div>
              )}

              {creatorsSuccess &&
                creators.length === 0 &&
                selectedCampaign &&
                !creatorsError &&
                (isMultiCreator ? creatorsListCampaignId === selectedCampaign?.id : true) && (
                <div className="py-16">
                  <NotFound
                    title="No Creators Found"
                    description="Try adjusting filters or selecting a different campaign."
                  />
                </div>
              )}

              {creatorsSuccess &&
                creators.length > 0 &&
                (selectedCampaign || (!isMultiCreator && creators.length > 0)) &&
                creators.map((creator) => {
                  const isSelected = selectedCreator?.id === creator.id;

                  return (
                    <div key={creator.id}>
                      <div
                        onClick={() => onCreatorSelect(creator)}
                        className={`cursor-pointer rounded-lg border bg-white p-3 shadow-sm transition-all duration-200 hover:shadow-md sm:p-4 md:hidden ${
                          isSelected
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
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
                              </div>
                              {creator?.campaign?.campaign_type === CAMPAIGN_TYPE.SPONSORED_POST ||
                              creator?.campaign?.campaign_type === CAMPAIGN_TYPE.UGC ? (
                                <div className="mb-2 w-fit max-w-full rounded-lg bg-gray-100 px-2 py-0.5 text-[10px] text-gray-900 sm:py-1 sm:text-xs md:text-sm">
                                  Creator Fee:{" "}
                                  <span className="font-bold text-primary">
                                    ${creator?.contract?.totalCompensation ?? 0}
                                  </span>
                                </div>
                              ) : null}
                              <div className="mb-2 flex flex-wrap items-center gap-2 text-[10px] text-gray-600 sm:gap-3 sm:text-xs md:text-sm">
                                <span className="inline-flex min-w-0 items-center gap-0.5 sm:gap-1">
                                  <MapPin className="h-3 w-3 shrink-0 sm:h-4 sm:w-4" />
                                  <span className="break-words">{creator.location}</span>
                                </span>
                                {creator.age != null && creator.age !== "" ? (
                                  <span className="text-gray-500">({creator.age} yrs)</span>
                                ) : null}
                              </div>
                              <div className="mb-2 flex flex-wrap items-center gap-2 text-[10px] text-gray-600 sm:gap-3 sm:text-xs">
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
                                <span>{(creator.rating || 0).toFixed(1)}</span>
                                <span className="text-gray-500">
                                  ({creator.reviewCount ?? 0} reviews)
                                </span>
                                <span
                                  className={`rounded-full px-1.5 py-0.5 text-[10px] sm:px-2 sm:text-xs ${getSuccessRateColor(
                                    creator.successRate
                                  )}`}
                                >
                                  {`${creator.successRate || 0}% Success Rate`}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="w-full border-t border-gray-100 pt-3 sm:pt-3">
                            <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
                              {Object.entries(creator.platforms)
                                ?.filter(
                                  ([platform]) => platform !== "twitter" && platform !== "facebook"
                                )
                                .map(([platform, data]) => (
                                  <div
                                    key={platform}
                                    className="flex items-center justify-between rounded-lg bg-gray-100 px-2 py-1.5 pr-3 transition-colors duration-200 hover:bg-gray-100/80 sm:px-1"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={`${getPlatformColor(platform)} rounded-md p-1`}
                                      >
                                        {getPlatformIcon(platform)}
                                      </span>
                                      <span className="text-[10px] font-semibold capitalize text-gray-700 sm:text-xs">
                                        {platform}
                                      </span>
                                    </div>
                                    <div className="text-xs font-bold tabular-nums text-gray-900 sm:text-sm">
                                      {formatFollowers(data.followers)}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        onClick={() => onCreatorSelect(creator)}
                        className={`hidden rounded-lg bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg md:block md:cursor-pointer md:border ${
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
                                  </div>
                                  {creator?.campaign?.campaign_type ===
                                    CAMPAIGN_TYPE.SPONSORED_POST ||
                                  creator?.campaign?.campaign_type === CAMPAIGN_TYPE.UGC ? (
                                    <div className="rounded-lg bg-gray-100 p-2 text-sm text-gray-900">
                                      Creator Fee:
                                      <span className="font-bold text-primary">
                                        {" "}
                                        ${creator?.contract?.totalCompensation ?? 0}
                                      </span>
                                    </div>
                                  ) : null}
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <div className="flex items-center space-x-1 text-xs">
                                    <MapPin className="h-4 w-4" />
                                    <span>{creator.location}</span>
                                  </div>
                                  {creator.age != null && creator.age !== "" ? (
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
                                        ? "fill-current text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-600">
                                {(creator.rating || 0).toFixed(1)}
                              </span>
                              <span className="text-xs text-gray-600">
                                ({creator.reviewCount ?? 0} reviews)
                              </span>
                            </div>

                            <div className="flex items-center space-x-4 text-xs">
                              <div
                                className={`rounded-full px-2 py-1 ${getSuccessRateColor(
                                  creator.successRate
                                )}`}
                              >
                                {`${creator.successRate || 0}% Success Rate`}
                              </div>
                            </div>
                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                              {Object.entries(creator.platforms)
                                ?.filter(
                                  ([platform]) => platform !== "twitter" && platform !== "facebook"
                                )
                                .map(([platform, data]) => (
                                  <div
                                    key={platform}
                                    className="flex items-center justify-between rounded-lg bg-gray-100 px-1 pr-3 transition-colors duration-200 hover:bg-gray-100/80"
                                  >
                                    <div className="flex items-center space-x-2 gap-2">
                                      <span className={`${getPlatformColor(platform)} rounded-md p-1`}>
                                        {getPlatformIcon(platform)}
                                      </span>
                                      <span className="text-xs font-semibold capitalize text-gray-700">
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
                    </div>
                  );
                })}
            </>
          )}
        </div>
      </div>

      <CalendarModal
        show={showBrandCalendar}
        onClose={closeBrandCalendar}
        selectedCampaign={selectedCampaign}
      />
      <TaskManagerModal
        show={showTaskManager}
        onClose={closeTaskManagerModal}
        selectedCampaignId={selectedCampaign?.id || null}
        isMultiCreator={isMultiCreator}
      />
    </div>
  );
};

export default CreatorSpendAnalysis;
