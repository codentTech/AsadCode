import CustomButton from "@/common/components/custom-button/custom-button.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Modal from "@/common/components/modal/modal.component";
import NotFound from "@/common/components/not-found/not-found.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { campaignTitle } from "@/common/utils/campaign.utils";
import { formatTimeAgo } from "@/common/utils/helper.utils";
import Niche from "@/components/niche/niche";
import { DollarSign, Gift, Globe, Loader2, RotateCcw, Users, Zap } from "lucide-react";
import CampaignBriefModal from "../../../applications/components/campaign-brief-modal/campaign-brief-modal.component";
import { useCampaignFeed } from "./use-campaign-feed.hook";
import { useRouter } from "next/navigation";

function CampaignFeed() {
  const router = useRouter();
  const {
    sortBy,
    handleSortChange,
    sortedCampaigns,
    isLoading,
    selectedNiche,
    handleNicheChange,
    clearAllFilters,
    showFullBrief,
    briefCampaign,
    showApplication,
    applicationCampaign,
    applicationPitch,
    setApplicationPitch,
    handleOpenBrief,
    handleOpenApplication,
    closeBrief,
    closeApplication,
    handleApply,
    isApplying,
    filteredCampaignsData,
    isLoadingMore,
    hasMoreCampaigns,
    totalCampaigns,
    handleLoadMore,
  } = useCampaignFeed();
  const shownCampaignsCount = sortedCampaigns.length;
  const totalCount = totalCampaigns || shownCampaignsCount;
  const progressValue =
    totalCount > 0 ? Math.min((shownCampaignsCount / totalCount) * 100, 100) : 0;

  const sortOptions = [
    { value: "latest", label: "Latest" },
    { value: "highest-value", label: "Highest Value" },
  ];

  // Campaign type color mapping
  const getCampaignTypeStyle = (type) => {
    const styles = {
      UGC: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        border: "border-blue-200",
        icon: <Users size={12} />,
      },
      GIFTED: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-200",
        icon: <Gift size={12} />,
      },
      SPONSORED_POST: {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-200",
        icon: <DollarSign size={12} />,
      },
      AFFILIATE: {
        bg: "bg-purple-100",
        text: "text-purple-800",
        border: "border-purple-200",
        icon: <Zap size={12} />,
      },
    };
    return styles[type];
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 min-w-0 w-full bg-gray-100">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="p-3 sm:p-4">
          <Niche selectedNiche={selectedNiche} onNicheChange={handleNicheChange} />
        </div>
        <div className="px-3 sm:px-4 pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex justify-between items-center gap-2">
              <h2 className="text-sm font-semibold text-gray-900 sm:text-lg md:text-xl">
                Available Campaigns
                {(filteredCampaignsData || totalCampaigns > 0) && (
                  <span className="ml-1.5 text-[10px] font-normal leading-snug text-gray-600 sm:ml-2 sm:text-xs md:text-sm">
                    ({sortedCampaigns.length} of {totalCampaigns || sortedCampaigns.length} results)
                  </span>
                )}
              </h2>
              {(selectedNiche !== "all" || filteredCampaignsData) && (
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50 md:hidden"
                  onClick={clearAllFilters}
                  title="Clear filters"
                  aria-label="Clear filters"
                >
                  <RotateCcw size={14} />
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="w-full min-w-0 sm:w-40">
                <SimpleSelect
                  options={sortOptions}
                  value={sortBy}
                  onChange={handleSortChange}
                  placeHolder="Sort by"
                />
              </div>
              {(selectedNiche !== "all" || filteredCampaignsData) && (
                <CustomButton
                  text="Clear Filters"
                  className="btn-secondary hidden shrink-0 md:inline-flex"
                  onClick={clearAllFilters}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-3 sm:p-4 overflow-y-auto flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-7 h-7 sm:w-8 sm:h-8 animate-spin text-primary" />
            <span className="ml-2 text-xs sm:text-sm text-gray-600">Loading campaigns...</span>
          </div>
        ) : sortedCampaigns.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              <NotFound title="No campaigns found"></NotFound>
            </p>
          </div>
        ) : (
          sortedCampaigns.map((campaign) => {
            const typeStyle = getCampaignTypeStyle(campaign.type) || {
              bg: "bg-gray-100",
              text: "text-gray-800",
              border: "border-gray-200",
              icon: null,
            };

            return (
              <div
                key={campaign.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="p-3 sm:p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-3">
                    <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center text-5xl border border-gray-200 flex-shrink-0">
                        <img src={campaign.brandLogo} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                          <button
                            onClick={() =>
                              campaign.brandId && router.push(`/brand-profile/${campaign.brandId}`)
                            }
                            className="hover:text-primary transition-colors cursor-pointer"
                          >
                            {campaign.brandName}
                          </button>
                        </h3>
                        <h4 className="text-xs sm:text-sm text-gray-700 line-clamp-1 font-medium">
                          {campaign.title}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <Globe className="h-3 w-3" />
                          <span>{formatTimeAgo(campaign.postedDate)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Campaign Type and Payment Info */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-center gap-2 flex-shrink-0 sm:ml-auto">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-medium border ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}
                      >
                        {campaignTitle(campaign.type)}
                      </div>
                      <div className="flex gap-2 items-center text-left text-[11px] sm:text-xs font-semibold text-gray-900">
                        <div>{campaign.compensation} -</div>
                        <div>
                          {+campaign.creator_fee !== 0 ? campaign.creator_fee : "Negotiable"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-semibold text-gray-900 mb-2">Requirements</h5>
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="flex items-center gap-2 text-gray-600">
                          <span className="font-medium">Niche:</span>{" "}
                          {Array.isArray(campaign.niche)
                            ? campaign.niche.map((n) => `${n}`).join(", ")
                            : `${campaign.niche}`}
                        </span>
                        {(campaign.locationMandatory || campaign.locationPreferred) && (
                          <span className="flex items-center gap-2 text-gray-600">
                            <span className="font-medium">Location:</span> {campaign.location}
                          </span>
                        )}
                        <span className="flex items-center gap-2 text-gray-600">
                          <span className="font-medium">Language:</span> {campaign.language}
                        </span>
                        <span className="flex items-center gap-2 text-gray-600">
                          <span className="font-medium">Min Followers:</span> {campaign.followerMin}
                        </span>
                      </div>

                      <div className="mt-2">
                        <h5 className="text-xs font-semibold text-gray-900 mb-2">Deliverables</h5>
                        <div className="flex flex-wrap gap-1">
                          {campaign.deliverables.map((item) => (
                            <span
                              key={item}
                              className="px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="border-l-2 border-primary mt-3">
                        <p className="text-xs text-gray-600 line-clamp-2 ml-2">
                          <span className="font-bold">Description:</span> {campaign.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex-shrink-0 w-full sm:w-auto flex justify-center sm:justify-end">
                      <img
                        src={campaign.productImage}
                        alt="Campaign Product"
                        className="w-full max-w-[200px] sm:max-w-none sm:w-44 sm:h-44 aspect-square rounded-lg object-cover border border-gray-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-t border-gray-100 flex gap-2">
                  <CustomButton
                    text="View Brief"
                    className="btn-outline flex-1"
                    onClick={() => handleOpenBrief(campaign)}
                  />
                  <CustomButton
                    text="Apply"
                    className="btn-primary flex-1"
                    onClick={() => handleOpenApplication(campaign)}
                  />
                </div>
              </div>
            );
          })
        )}

        {!isLoading && sortedCampaigns.length > 0 && hasMoreCampaigns && (
          <div className="sticky bottom-2 z-[5] rounded-xl border border-gray-200 bg-white/95 p-3 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/85 sm:bottom-3 sm:p-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold text-gray-800 sm:text-xs">
                  Showing {shownCampaignsCount} of {totalCount} campaigns
                </p>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600 sm:text-xs">
                  {Math.round(progressValue)}%
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${progressValue}%` }}
                  aria-hidden
                />
              </div>
              <CustomButton
                text="Load More"
                className="btn-primary w-full sm:w-auto sm:min-w-[132px] sm:self-end"
                onClick={handleLoadMore}
                loading={isLoadingMore}
                disabled={isLoadingMore}
              />
            </div>
          </div>
        )}
      </div>

      <CampaignBriefModal show={showFullBrief} onClose={closeBrief} campaign={briefCampaign} />

      <Modal show={showApplication} title="Apply to Campaign" onClose={closeApplication} size="lg">
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="flex items-start gap-2.5 sm:gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-lg border border-gray-200 bg-white sm:h-12 sm:w-12">
                {applicationCampaign?.brandLogo ? (
                  <img
                    src={applicationCampaign.brandLogo}
                    alt={applicationCampaign?.brandName || "Brand logo"}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 sm:text-lg md:text-xl">
                  {applicationCampaign?.brandName}
                </h4>
                <p className="text-[10px] leading-snug text-gray-600 sm:text-xs md:text-sm">
                  {applicationCampaign?.title}
                </p>
              </div>
            </div>
          </div>
          {applicationCampaign?.questions?.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-xs font-semibold text-gray-900 mb-2">Questions</h5>
              <div className="flex flex-col gap-1 text-xs">
                {(applicationCampaign?.questions ?? []).map((question) => (
                  <span
                    key={question}
                    className="px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs"
                  >
                    {question}
                  </span>
                ))}
              </div>
            </div>
          )}
          <TextArea
            label="Your Pitch (Optional)"
            placeholder="Write your pitch here or use a saved template..."
            value={applicationPitch}
            onChange={(e) => setApplicationPitch(e.target.value)}
            rows={4}
          />
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-3">
            <CustomButton text="Cancel" className="btn-cancel w-full" onClick={closeApplication} />
            <CustomButton
              text="Submit Application"
              className="btn-primary w-full"
              onClick={handleApply}
              disabled={isApplying}
              loading={isApplying}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default CampaignFeed;
