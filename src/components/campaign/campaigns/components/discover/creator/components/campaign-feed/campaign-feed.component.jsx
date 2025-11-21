import CustomButton from "@/common/components/custom-button/custom-button.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { product } from "@/common/constants/auth.constant";
import { campaignTitle, campiagnDeliverable } from "@/common/utils/campaign.utils";
import { formatTimeAgo } from "@/common/utils/helper.utils";
import Niche from "@/components/niche/niche";
import { DollarSign, Gift, Globe, Loader2, Users, Zap } from "lucide-react";
import { useCampaignFeed } from "./use-campaign-feed.hook";

function CampaignFeed() {
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
    return styles[type] || styles["SPONSORED_POST"];
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
              {filteredCampaignsData
                ? "No campaigns match your current filters. Try adjusting your criteria."
                : "No campaigns found. Try adjusting your filters."}
            </p>
          </div>
        ) : (
          sortedCampaigns.map((campaign) => {
            const typeStyle = getCampaignTypeStyle(campaign.type);

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
                          {campaign.brandName}
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
                        <div>{campaign.budget}</div>
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
                              {campiagnDeliverable(item)}
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
                        src={
                          campaign.productImage.startsWith("http") ? campaign.productImage : product
                        }
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

      <Modal show={showFullBrief} title="Campaign Brief" onClose={closeBrief} size="lg">
        <div className="space-y-5">
          <div className="flex gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-5xl border border-gray-200 flex-shrink-0">
              <img
                src={briefCampaign?.brandLogo}
                alt="Brand Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xl font-bold text-gray-900 truncate">
                {briefCampaign?.brandName}
              </h4>
              <p className="text-sm text-gray-700 font-medium mt-1 line-clamp-2">
                {briefCampaign?.title}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {briefCampaign && (
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${getCampaignTypeStyle(briefCampaign.type).bg} ${getCampaignTypeStyle(briefCampaign.type).text} ${getCampaignTypeStyle(briefCampaign.type).border}`}
                  >
                    {briefCampaign.type}
                  </div>
                )}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                  {briefCampaign?.compensationAmount}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h6 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <DollarSign size={16} />
                Compensation
              </h6>
              <div className="space-y-1 text-xs text-blue-800">
                <div>
                  <span className="font-medium">Type:</span> {briefCampaign?.compensation}
                </div>
                <div>
                  <span className="font-medium">Amount:</span> {briefCampaign?.compensationAmount}
                </div>
                {briefCampaign?.creator_fixed_price && (
                  <div>
                    <span className="font-medium">Fixed Price:</span> $
                    {briefCampaign?.creator_fixed_price}
                  </div>
                )}
                {briefCampaign?.suggested_min && briefCampaign?.suggested_max && (
                  <div>
                    <span className="font-medium">Range:</span> ${briefCampaign?.suggested_min} - $
                    {briefCampaign?.suggested_max}
                  </div>
                )}
                {briefCampaign?.commission_percentage && (
                  <div>
                    <span className="font-medium">Commission:</span>{" "}
                    {briefCampaign?.commission_percentage}%
                  </div>
                )}
                {briefCampaign?.product_value && (
                  <div>
                    <span className="font-medium">Product Value:</span> $
                    {briefCampaign?.product_value}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <h6 className="text-sm font-semibold text-purple-900 mb-2 flex items-center gap-2">
                <Users size={16} />
                Requirements
              </h6>
              <div className="space-y-1 text-xs text-purple-800">
                <div>
                  <span className="font-medium">Followers:</span> {briefCampaign?.followerMin}
                </div>
                <div>
                  <span className="font-medium">Language:</span> {briefCampaign?.language}
                </div>
                <div>
                  <span className="font-medium">Location:</span> {briefCampaign?.location}
                </div>
                {briefCampaign?.creator_gender && (
                  <div>
                    <span className="font-medium">Gender:</span> {briefCampaign?.creator_gender}
                  </div>
                )}
                {briefCampaign?.min_age && briefCampaign?.max_age && (
                  <div>
                    <span className="font-medium">Age Range:</span> {briefCampaign?.min_age} -{" "}
                    {briefCampaign?.max_age}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h5 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Globe size={18} />
              Campaign Details
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-700">Niche:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {briefCampaign?.niches?.map((niche, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-md"
                      >
                        {niche}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-700">Platforms:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {briefCampaign?.required_platforms?.map((platform, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-700">Posted:</span>
                  <span className="text-sm text-gray-600 ml-2">
                    {formatTimeAgo(briefCampaign?.postedDate)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-700">Location Details:</span>
                  <div className="text-sm text-gray-600 mt-1">
                    {briefCampaign?.in_person_required ? (
                      <span className="text-red-600 font-medium">In-person required</span>
                    ) : briefCampaign?.creator_country || briefCampaign?.creator_city ? (
                      <span className="text-orange-600 font-medium">
                        Preferred: {briefCampaign.creator_country} {briefCampaign.creator_city}
                      </span>
                    ) : (
                      <span className="text-green-600 font-medium">Remote friendly</span>
                    )}
                  </div>
                </div>

                {briefCampaign?.creator_country && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Creator Country:</span>
                    <span className="text-sm text-gray-600 ml-2">
                      {briefCampaign.creator_country}
                    </span>
                  </div>
                )}

                {briefCampaign?.creator_city && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Creator City:</span>
                    <span className="text-sm text-gray-600 ml-2">{briefCampaign.creator_city}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h5 className="text-lg font-semibold text-gray-900 mb-3">Description</h5>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {briefCampaign?.description || "No description available"}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h5 className="text-lg font-semibold text-gray-900 mb-3">Deliverables</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {briefCampaign?.deliverables?.map((deliverable, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">{campiagnDeliverable(deliverable)}</span>
                </div>
              ))}
            </div>
          </div>

          {briefCampaign?.productImage && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h5 className="text-lg font-semibold text-gray-900 mb-3">Campaign Image</h5>
              <div className="flex justify-center">
                <img
                  src={
                    briefCampaign.productImage.startsWith("http")
                      ? briefCampaign.productImage
                      : product
                  }
                  alt="Campaign Product"
                  className="w-48 h-48 rounded-lg object-cover border border-gray-200 shadow-sm"
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <CustomButton
              text="Apply to Campaign"
              className="flex-1 btn-primary"
              onClick={() => {
                closeBrief();
                handleOpenApplication(briefCampaign);
              }}
            />
            <CustomButton text="Close" className="flex-1 btn-outline" onClick={closeBrief} />
          </div>
        </div>
      </Modal>

      <Modal show={showApplication} title="Apply to Campaign" onClose={closeApplication} size="lg">
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-lg p-3">
            <h4 className="text-lg font-semibold text-gray-900">
              {applicationCampaign?.brandName}
            </h4>
            <p className="text-sm text-gray-600">{applicationCampaign?.title}</p>
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
              text={isApplying ? "Submitting..." : "Submit Application"}
              className="w-full btn-primary"
              onClick={handleApply}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default CampaignFeed;
