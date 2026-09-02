import CustomButton from "@/common/components/custom-button/custom-button.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import { Skeleton } from "@/common/components/loader/skeleton-loader.component";
import NotFound from "@/common/components/not-found/not-found.component";
import UrgencyPill from "@/common/components/urgency-pill/urgency-pill.component";
import { sortOptions } from "@/common/constants/auth.constant";
import { ExternalLink, LayoutGrid, MapPin, Star } from "lucide-react";
import { useCreatorSpendAnalysisCompleted } from "./use-creator-spend-analysis.hook";

function PairedMetricBox({ label, primary, secondaryLabel, secondary }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-100 px-2.5 py-2 sm:px-3 sm:py-2.5">
      <p className="text-[10px] font-semibold text-gray-600 sm:text-xs">{label}</p>
      <p className="text-sm font-bold tabular-nums text-gray-900 sm:text-base">{primary}</p>
      {secondaryLabel ? (
        <>
          <div className="my-1 border-t border-gray-300/80" />
          <p className="text-[10px] leading-snug text-gray-500 sm:text-xs">
            {secondaryLabel}:{" "}
            <span className="font-semibold tabular-nums text-gray-800">{secondary}</span>
          </p>
        </>
      ) : null}
    </div>
  );
}

function EngagementMetricBoxes({ creatorMetrics, formatMetricValue }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-5">
      <div className="rounded-lg border border-gray-200 bg-gray-100 px-2.5 py-2 sm:px-3 sm:py-2.5">
        <p className="text-[10px] font-semibold text-gray-600 sm:text-xs">Total Views</p>
        <p className="text-sm font-bold tabular-nums text-gray-900 sm:text-base">
          {formatMetricValue(creatorMetrics.views, "views")}
        </p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-gray-100 px-2.5 py-2 sm:px-3 sm:py-2.5">
        <p className="text-[10px] font-semibold text-gray-600 sm:text-xs">Total Engagement</p>
        <p className="text-sm font-bold tabular-nums text-gray-900 sm:text-base">
          {formatMetricValue(creatorMetrics.totalEngagement, "engagement")}
        </p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-gray-100 px-2.5 py-2 sm:px-3 sm:py-2.5">
        <p className="text-[10px] font-semibold text-gray-600 sm:text-xs">Engagement Rate</p>
        <p className="text-sm font-bold tabular-nums text-gray-900 sm:text-base">
          {formatMetricValue(creatorMetrics.engagementRate, "rate")}
        </p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-gray-100 px-2.5 py-2 sm:px-3 sm:py-2.5">
        <p className="text-[10px] font-semibold text-gray-600 sm:text-xs">Cost/View</p>
        <p className="text-sm font-bold tabular-nums text-gray-900 sm:text-base">
          {creatorMetrics.costPerView == null ||
          !Number.isFinite(Number(creatorMetrics.costPerView))
            ? "N/A"
            : formatMetricValue(creatorMetrics.costPerView, "currency")}
        </p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-gray-100 px-2.5 py-2 sm:px-3 sm:py-2.5">
        <p className="text-[10px] font-semibold text-gray-600 sm:text-xs">Cost/Engagement</p>
        <p className="text-sm font-bold tabular-nums text-gray-900 sm:text-base">
          {creatorMetrics.costPerEngagement == null ||
          !Number.isFinite(Number(creatorMetrics.costPerEngagement))
            ? "N/A"
            : formatMetricValue(creatorMetrics.costPerEngagement, "currency")}
        </p>
      </div>
    </div>
  );
}

function AffiliateSalesMetricBoxes({ creatorMetrics, formatMetricValue }) {
  const conversionIsUnits = creatorMetrics.conversionLabel !== "conversion";
  const conversionSecondary = conversionIsUnits
    ? formatMetricValue(
        creatorMetrics.conversionValue ?? creatorMetrics.unitsSold,
        "number"
      )
    : `${creatorMetrics.conversionValue ?? 0}%`;

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-5">
      <PairedMetricBox
        label="Revenue"
        primary={formatMetricValue(creatorMetrics.revenue, "currency")}
        secondaryLabel="AOV"
        secondary={formatMetricValue(creatorMetrics.aov, "currency")}
      />
      <PairedMetricBox
        label="Orders"
        primary={formatMetricValue(creatorMetrics.orders, "number")}
        secondaryLabel={conversionIsUnits ? "Units sold" : "Conversion"}
        secondary={conversionSecondary}
      />
      <PairedMetricBox
        label="ROI"
        primary={
          creatorMetrics.roi == null || !Number.isFinite(Number(creatorMetrics.roi))
            ? "N/A"
            : formatMetricValue(creatorMetrics.roi, "ratio")
        }
        secondaryLabel="Cost/Sale"
        secondary={
          creatorMetrics.costPerSale == null ||
          !Number.isFinite(Number(creatorMetrics.costPerSale))
            ? "N/A"
            : formatMetricValue(creatorMetrics.costPerSale, "currency")
        }
      />
      <PairedMetricBox
        label="Views"
        primary={formatMetricValue(creatorMetrics.views, "views")}
        secondaryLabel="Cost/View"
        secondary={
          creatorMetrics.costPerView == null ||
          !Number.isFinite(Number(creatorMetrics.costPerView))
            ? "N/A"
            : formatMetricValue(creatorMetrics.costPerView, "currency")
        }
      />
      <PairedMetricBox
        label="Engagement Rate"
        primary={formatMetricValue(creatorMetrics.engagementRate, "rate")}
        secondaryLabel="Cost/Engagement"
        secondary={
          creatorMetrics.costPerEngagement == null ||
          !Number.isFinite(Number(creatorMetrics.costPerEngagement))
            ? "N/A"
            : formatMetricValue(creatorMetrics.costPerEngagement, "currency")
        }
      />
    </div>
  );
}

function CreatorMetricsSection({ creatorMetrics, formatMetricValue }) {
  if (!creatorMetrics) {
    return (
      <div className="w-full border-t border-gray-100 pt-3">
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-lg border border-gray-200 bg-gray-100 px-2.5 py-2 sm:px-3 sm:py-2.5"
            >
              <div className="mb-1.5 h-3 w-20 rounded bg-gray-300" />
              <div className="h-4 w-14 rounded bg-gray-300" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (creatorMetrics.metricsUnavailable && !creatorMetrics.isAffiliateSales) {
    return null;
  }

  return (
    <div className="w-full border-t border-gray-100 pt-3">
      {creatorMetrics.isAffiliateSales ? (
        <AffiliateSalesMetricBoxes
          creatorMetrics={creatorMetrics}
          formatMetricValue={formatMetricValue}
        />
      ) : (
        <EngagementMetricBoxes
          creatorMetrics={creatorMetrics}
          formatMetricValue={formatMetricValue}
        />
      )}
    </div>
  );
}

const CreatorSpendAnalysisCompleted = ({
  selectedCampaign,
  selectedCreator,
  onCreatorSelect,
  onClearCreator,
  onSortChange,
  currentSort = "urgency",
  isCompleted = true,
  onOpenBoard,
}) => {
  const {
    creators,
    creatorsLoading,
    creatorsSuccess,
    creatorsError,
    isMultiCreator,
    isIndividualMode,
    isUgc,
    getCreatorMetrics,
    handleSortChange,
    formatMetricValue,
    handleViewReport,
  } = useCreatorSpendAnalysisCompleted({
    selectedCampaign,
    selectedCreator,
    onCreatorSelect,
    onClearCreator,
    onSortChange,
    currentSort,
    isCompleted,
  });

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-gradient-to-b from-gray-100 to-gray-50/80">
      <div className="shrink-0 z-10 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-sm">
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
              {(isMultiCreator || isIndividualMode) && (
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
            <div className="flex w-full flex-nowrap items-stretch gap-2 sm:w-auto sm:flex-wrap sm:justify-end">
              {selectedCampaign?.id ? (
                <>
                  <CustomButton
                    text="Report"
                    title="View Report"
                    className="btn-primary min-w-0 flex-1 px-2 sm:hidden"
                    onClick={handleViewReport}
                  />
                  <CustomButton
                    text="View Report"
                    title="View Report"
                    className="btn-primary hidden min-w-0 sm:inline-flex sm:w-auto"
                    onClick={handleViewReport}
                  />
                </>
              ) : null}
              {onOpenBoard ? (
                <>
                  <CustomButton
                    text="Board"
                    title="Campaign Board"
                    className="btn-outline min-w-0 flex-1 px-2 sm:hidden"
                    startIcon={<LayoutGrid className="h-3.5 w-3.5 shrink-0" />}
                    onClick={onOpenBoard}
                  />
                  <CustomButton
                    text="Campaign Board"
                    title="Campaign Board"
                    className="btn-outline hidden min-w-0 sm:inline-flex sm:w-auto"
                    startIcon={<LayoutGrid className="h-4 w-4 shrink-0" />}
                    onClick={onOpenBoard}
                  />
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2.5 sm:p-4">
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
                    </div>
                  </div>
                  <div className="hidden items-start space-x-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm md:flex">
                    <Skeleton circle className="h-20 w-20 flex-shrink-0" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-32" />
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
              {selectedCampaign && creatorsSuccess && creators.length === 0 && !creatorsError && (
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
                    const showMetrics = !isUgc;

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
                                className="h-24 w-16 shrink-0 rounded-lg object-cover sm:h-28 sm:w-20"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="mb-1 flex items-start justify-between gap-2">
                                  <h3 className="text-sm font-semibold text-gray-900 sm:text-lg">
                                    {creator.name}
                                  </h3>
                                  {creator.urgencyLabel ? (
                                    <UrgencyPill
                                      label={creator.urgencyLabel}
                                      tier={creator.urgencyTier}
                                    />
                                  ) : null}
                                </div>
                                <div className="mb-1 flex flex-wrap items-center gap-2 text-[10px] text-gray-600 sm:gap-3 sm:text-xs md:text-sm">
                                  <span className="inline-flex items-center gap-1">
                                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                                    {creator.location}
                                  </span>
                                  {creator.age != null && creator.age !== "" ? (
                                    <span>({creator.age} Years Old)</span>
                                  ) : null}
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <div className="flex items-center gap-2 text-[10px] text-gray-600 sm:text-xs">
                                    <span className="inline-flex items-center">
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
                                  </div>
                                  {showMetrics && creatorMetrics?.publishedUrl ? (
                                    <a
                                      href={creatorMetrics.publishedUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="text-xs inline-flex items-center gap-0.5 text-primary hover:underline sm:gap-1"
                                    >
                                      <ExternalLink className="h-2.5 w-2.5 shrink-0 sm:h-3 sm:w-3" />
                                      Published Post
                                    </a>
                                  ) : null}
                                </div>
                              </div>
                            </div>

                            {isUgc ? null : showMetrics ? (
                              <CreatorMetricsSection
                                creatorMetrics={creatorMetrics}
                                formatMetricValue={formatMetricValue}
                              />
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
                              <div className="mb-1 flex items-start justify-between">
                                <div className="w-full">
                                  <div className="flex justify-between items-center gap-2">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                      {creator.name}
                                    </h3>
                                    {creator.urgencyLabel ? (
                                      <div className="w-fit max-w-full rounded-lg bg-gray-100 px-2 py-1 text-sm text-gray-900">
                                        <UrgencyPill
                                          label={creator.urgencyLabel}
                                          tier={creator.urgencyTier}
                                        />
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

                              <div className="mb-3 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
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
                                <div className="pr-4">
                                  {showMetrics && creatorMetrics?.publishedUrl ? (
                                    <a
                                      href={creatorMetrics.publishedUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="text-xs inline-flex items-center gap-1 text-primary hover:underline"
                                    >
                                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                                      Published Post
                                    </a>
                                  ) : null}
                                </div>
                              </div>

                              {isUgc ? null : showMetrics ? (
                                <CreatorMetricsSection
                                  creatorMetrics={creatorMetrics}
                                  formatMetricValue={formatMetricValue}
                                />
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
    </div>
  );
};

export default CreatorSpendAnalysisCompleted;
