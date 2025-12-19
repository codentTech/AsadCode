import CustomButton from "@/common/components/custom-button/custom-button.component";
import { Globe } from "lucide-react";
import { campaignTitle } from "@/common/utils/campaign.utils";
import { formatTimeAgo } from "@/common/utils/helper.utils";
import { product } from "@/common/constants/auth.constant";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";

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
  const language = campaign?.language_requirement || "N/A";
  const minFollowers = campaign?.min_combined_followers || "0";
  const deliverables = campaign?.deliverables || [];
  const description =
    campaign?.short_description ||
    campaign?.long_description ||
    application.custom_message ||
    "No description available";
  const productImage = campaign?.campaign_image || product;
  const appliedDate = application.applied_at || application.created_at;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3">
            {brandLogo && (
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-5xl border border-gray-200 flex-shrink-0">
                <img
                  src={brandLogo}
                  alt={brandName}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm truncate">{brandName}</h3>
              <h4 className="text-sm text-gray-700 line-clamp-1 font-medium">
                {campaign?.campaign_title ||
                  (isInvitation ? "Individual Collaboration" : "Campaign Title")}
              </h4>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <Globe className="h-3 w-3" />
                <span>
                  {isInvitation ? "Invited" : "Applied"} {formatTimeAgo(appliedDate)}
                </span>
              </div>
            </div>
          </div>

          {/* Campaign Type and Payment Info */}
          {!isInvitation && typeStyle && (
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}
              >
                {campaignTitle(campaignType)}
              </div>
              {compensation && (
                <div className="flex gap-2 items-center text-left text-xs font-semibold text-gray-900">
                  <div>{compensation} -</div>
                  <div>{typeof budget === "number" ? `$${budget}` : budget}</div>
                </div>
              )}
            </div>
          )}
          {isInvitation && (
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${
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

        <div className="flex gap-4">
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
                <span className="font-medium">Language:</span> {language || "Any"}
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

          <div className="flex-shrink-0">
            <img
              src={productImage.startsWith("http") ? productImage : product}
              alt="Campaign Product"
              className="w-44 h-44 rounded-lg object-cover border border-gray-200"
            />
          </div>
        </div>
      </div>

      <div className="px-4">
        {description && (
          <div className="border-l-2 border-primary">
            <p className="text-xs text-gray-600 line-clamp-2 ml-2">
              <span className="font-bold">Description:</span> {description}
            </p>
          </div>
        )}
      </div>

      <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
        {!isInvitation && application.status === "PENDING" && (
          <CustomButton
            text="Withdraw"
            className="btn-outline flex-1 !h-8 !text-xs"
            onClick={() => handleWithdraw(campaign?.id)}
            disabled={withdrawLoading}
          />
        )}
        {isInvitation ? (
          <>
            {handleMessageClick && (campaign?.id || application.campaign_id) && (
              <CustomButton
                text="Message"
                className="btn-primary flex-1 !h-8 !text-xs"
                onClick={() => handleMessageClick(application)}
              />
            )}
            {(campaign?.id || application.campaign_id) &&
              application.collaboration_type !== COLLABORATION_TYPE.INDIVIDUAL_CREATOR && (
                <CustomButton
                  text="View Campaign"
                  className="btn-outline flex-1 !h-8 !text-xs"
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
                  className="btn-primary flex-1 !h-8 !text-xs"
                  onClick={() => handleMessageClick(application)}
                />
              )}
            {campaign?.id && (
              <CustomButton
                text="View Brief"
                className="btn-outline flex-1 !h-8 !text-xs"
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
