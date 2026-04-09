import CustomButton from "@/common/components/custom-button/custom-button.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Modal from "@/common/components/modal/modal.component";
import NotFound from "@/common/components/not-found/not-found.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { campaignTitle } from "@/common/utils/campaign.utils";
import { formatTimeAgo } from "@/common/utils/helper.utils";
import Niche from "@/components/niche/niche";
import { DollarSign, Gift, Globe, Loader2, Users, Zap } from "lucide-react";
import CampaignBriefModal from "../../../../applications/creator/components/campaign-brief-modal/campaign-brief-modal.component";
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
  } = useCampaignFeed();

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
    <div className="flex-1 flex flex-col h-[calc(100vh-70px)] bg-gray-100">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="p-4">
          <Niche selectedNiche={selectedNiche} onNicheChange={handleNicheChange} />
        </div>
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Available Campaigns
              {filteredCampaignsData && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  ({sortedCampaigns.length} results)
                </span>
              )}
            </h2>
            <div className="flex items-center gap-2">
              <div className="w-40">
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
                  className="btn-secondary text-xs px-3 py-2"
                  onClick={clearAllFilters}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-4 overflow-y-auto flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-gray-600">Loading campaigns...</span>
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
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-5xl border border-gray-200 flex-shrink-0">
                        <img src={campaign.brandLogo} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                          <button
                            onClick={() =>
                              campaign.brandId && router.push(`/brand-profile/${campaign.brandId}`)
                            }
                            className="hover:text-primary transition-colors cursor-pointer"
                          >
                            {campaign.brandName}
                          </button>
                        </h3>
                        <h4 className="text-sm text-gray-700 line-clamp-1 font-medium">
                          {campaign.title}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <Globe className="h-3 w-3" />
                          <span>{formatTimeAgo(campaign.postedDate)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Campaign Type and Payment Info */}
                    <div className="flex flex-col items-center gap-2 flex-shrink-0">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}
                      >
                        {campaignTitle(campaign.type)}
                      </div>
                      <div className="flex gap-2 items-center text-left text-xs font-semibold text-gray-900">
                        <div>{campaign.compensation} -</div>
                        <div>
                          {+campaign.creator_fee !== 0 ? campaign.creator_fee : "Negotiable"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
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

                    <div className="flex-shrink-0">
                      <img
                        src={campaign.productImage}
                        alt="Campaign Product"
                        className="w-44 h-44 rounded-lg object-cover border border-gray-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
                  <CustomButton
                    text="View Brief"
                    className="btn-outline flex-1 !h-8 !text-xs"
                    onClick={() => handleOpenBrief(campaign)}
                  />
                  <CustomButton
                    text="Apply"
                    className="btn-primary flex-1 !h-8 !text-xs"
                    onClick={() => handleOpenApplication(campaign)}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      <CampaignBriefModal show={showFullBrief} onClose={closeBrief} campaign={briefCampaign} />

      <Modal show={showApplication} title="Apply to Campaign" onClose={closeApplication} size="lg">
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-lg p-3">
            <h4 className="text-lg font-semibold text-gray-900">
              {applicationCampaign?.brandName}
            </h4>
            <p className="text-sm text-gray-600">{applicationCampaign?.title}</p>
          </div>
          <div className="space-y-2">
            <h5 className="text-xs font-semibold text-gray-900 mb-2">Questions</h5>
            <div className="flex flex-col gap-1 text-xs">
              {applicationCampaign?.questions.map((question) => (
                <span
                  key={question}
                  className="px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs"
                >
                  {question}
                </span>
              ))}
            </div>
          </div>
          <TextArea
            label="Your Pitch (Optional)"
            placeholder="Write your pitch here or use a saved template..."
            value={applicationPitch}
            onChange={(e) => setApplicationPitch(e.target.value)}
            rows={4}
          />
          <div className="flex gap-3">
            <CustomButton text="Cancel" className="w-full btn-cancel" onClick={closeApplication} />
            <CustomButton
              text="Submit Application"
              className="w-full btn-primary"
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
