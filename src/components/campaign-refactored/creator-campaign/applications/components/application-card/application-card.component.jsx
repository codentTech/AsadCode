import CustomButton from "@/common/components/custom-button/custom-button.component";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import { campaignTitle, formatLanguageForDisplay } from "@/common/utils/campaign.utils";
import { formatTimeAgo } from "@/common/utils/helper.utils";
import { Globe } from "lucide-react";

// Campaign type color mapping - matches campaign-feed component
const getCampaignTypeStyle = (type) => {
  const styles = {
    UGC: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      border: "border-blue-200",
    },
    GIFTED: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      border: "border-yellow-200",
    },
    SPONSORED_POST: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-200",
    },
    AFFILIATE: {
      bg: "bg-purple-100",
      text: "text-purple-800",
      border: "border-purple-200",
    },
  };
  return styles[type] || styles["SPONSORED_POST"];
};

const ApplicationCard = ({
  application,
  formatCompensationType,
  handleViewCampaign,
  handleWithdraw,
  handleMessageClick,
  withdrawLoading,
}) => {
  const isInvitation = application.isInvitation;
  const campaign = application.campaign;
  const brand = campaign?.created_by || application.brand;
  const brandName =
    brand?.first_name && brand?.last_name
      ? `${brand.first_name} ${brand.last_name}`
      : brand?.first_name || "Brand";
  const brandLogo = brand?.brand_profile?.brand_logo_url;
  const campaignType = campaign?.campaign_type;
  const typeStyle = campaignType ? getCampaignTypeStyle(campaignTitle(campaignType)) : null;
  const compensation = campaign?.compensation_type
    ? formatCompensationType(campaign.compensation_type)
    : null;
  const budget = campaign?.budget || campaign?.creator_fee || "N/A";
  const niches = campaign?.niches || [];
  const location = campaign?.location_options?.[0] || "N/A";
  const language = formatLanguageForDisplay(
    campaign?.language_requirement || campaign?.creator_language
  );
  const minFollowers = campaign?.min_combined_followers || "0";
  const deliverables = campaign?.deliverables || [];
  const description =
    campaign?.short_description ||
    campaign?.long_description ||
    application.custom_message ||
    "No description available";
  const appliedDate = application.applied_at || application.created_at;

  // Determine if this is an individual collaboration invite (no campaign post)
  const isIndividualCollaboration =
    isInvitation && application.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="p-3 sm:p-4">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            {brandLogo && (
              <div className="h-14 w-14 flex-shrink-0 rounded-lg border border-gray-200 bg-gray-100 sm:h-16 sm:w-16">
                <img
                  src={brandLogo}
                  alt={brandName}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-gray-900">{brandName}</h3>
              <h4 className="line-clamp-1 text-xs font-medium text-gray-700 sm:text-sm">
                {campaign?.campaign_title ||
                  (isInvitation ? "Individual Collaboration" : "Campaign Title")}
              </h4>
              <div className="mt-1 flex items-center gap-1 text-[10px] text-gray-500 sm:text-xs">
                <Globe className="h-3 w-3" />
                <span>
                  {isInvitation ? "Invited" : "Applied"} {formatTimeAgo(appliedDate)}
                </span>
              </div>
            </div>
          </div>

          {/* Campaign Type and Payment Info */}
          {!isInvitation && typeStyle && (
            <div className="flex flex-shrink-0 flex-row items-center justify-between gap-2 sm:flex-col sm:items-end">
              <div
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[10px] font-medium sm:px-3 sm:py-1.5 sm:text-xs ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}
              >
                {campaignTitle(campaignType)}
              </div>
              {compensation && (
                <div className="flex items-center gap-2 text-left text-[10px] font-semibold text-gray-900 sm:text-xs">
                  <div>{compensation} -</div>
                  <div>{typeof budget === "number" ? `$${budget}` : budget}</div>
                </div>
              )}
            </div>
          )}
          {isInvitation && (
            <div className="flex flex-shrink-0 flex-row items-center justify-between gap-2 sm:flex-col sm:items-end">
              <div
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[10px] font-medium sm:px-3 sm:py-1.5 sm:text-xs ${
                  application.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR
                    ? "bg-purple-100 text-purple-800 border-purple-200"
                    : "bg-blue-100 text-blue-800 border-blue-200"
                }`}
              >
                {application.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR
                  ? "Individual"
                  : "Multi-Creator"}
              </div>
            </div>
          )}
        </div>

        {/* Requirements and Description - Only show for multi-creator campaigns, not individual collaborations */}
        {!isIndividualCollaboration && (
          <>
            <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row">
              <div className="flex-1">
                <h5 className="text-xs font-semibold text-gray-900 mb-2">Requirements</h5>
                <div className="flex flex-col gap-1 text-xs">
                  <span className="flex items-start gap-2 text-gray-600">
                    <span className="font-medium">Niche:</span>{" "}
                    {Array.isArray(niches) && niches.length > 0
                      ? niches.map((n) => `${n}`).join(", ")
                      : niches || "N/A"}
                  </span>
                  {location && (
                    <span className="flex items-center gap-2 text-gray-600">
                      <span className="font-medium">Location:</span> {location}
                    </span>
                  )}
                  <span className="flex items-center gap-2 text-gray-600">
                    <span className="font-medium">Language:</span> {language}
                  </span>
                  <span className="flex items-center gap-2 text-gray-600">
                    <span className="font-medium">Min Followers:</span> {minFollowers || "0"}
                  </span>
                </div>

                {deliverables.length > 0 && (
                  <div className="mt-2">
                    <h5 className="text-xs font-semibold text-gray-900 mb-2">Deliverables</h5>
                    <div className="flex flex-wrap gap-1">
                      {deliverables.map((item) => (
                        <span
                          key={item}
                          className="px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {campaign?.campaign_image && (
                  <div className="flex flex-shrink-0 justify-center lg:justify-start">
                  <img
                    src={campaign?.campaign_image}
                    alt="Campaign Product"
                      className="h-40 w-28 rounded-lg border border-gray-200 object-cover sm:h-44 sm:w-44"
                  />
                </div>
              )}
            </div>
          </>
        )}

        {campaign?.campaign_image && isIndividualCollaboration && (
          <div className="flex justify-center">
            <img
              src={campaign?.campaign_image}
              alt="Campaign Product"
              className="w-44 h-44 rounded-lg object-cover border border-gray-200"
            />
          </div>
        )}
      </div>

      {/* Description - Only show for multi-creator campaigns, not individual collaborations */}
      {!isIndividualCollaboration && description && (
        <div className="px-3 sm:px-4">
          <div className="border-l-2 border-primary">
            <p className="ml-2 line-clamp-2 text-[10px] text-gray-600 sm:text-xs">
              <span className="font-bold">Description:</span> {description}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 border-t border-gray-100 px-3 py-3 sm:flex-row sm:px-4">
        {!isInvitation && application.status === "PENDING" && (
          <CustomButton
            text="Withdraw"
            className="btn-outline flex-1"
            onClick={() => handleWithdraw(campaign?.id)}
            disabled={withdrawLoading}
          />
        )}
        {isInvitation ? (
          <>
            {handleMessageClick && (campaign?.id || application.campaign_id) && (
              <CustomButton
                text="Message"
                className="btn-primary flex-1"
                onClick={() => handleMessageClick(application)}
              />
            )}
            {(campaign?.id || application.campaign_id) &&
              application.collaboration_type !== COLLABORATION_TYPE.INDIVIDUAL_CREATOR && (
                <CustomButton
                  text="View Campaign"
                  className="btn-outline flex-1"
                  onClick={() => handleViewCampaign(campaign)}
                />
              )}
          </>
        ) : (
          <>
            {handleMessageClick &&
              application.status === "NEGOTIATIONS" &&
              (campaign?.id || application.campaign_id) && (
                <CustomButton
                  text="Message"
                  className="btn-primary flex-1"
                  onClick={() => handleMessageClick(application)}
                />
              )}
            {campaign?.id && (
              <CustomButton
                text="View Brief"
                className="btn-outline flex-1"
                onClick={() => handleViewCampaign(campaign)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ApplicationCard;
