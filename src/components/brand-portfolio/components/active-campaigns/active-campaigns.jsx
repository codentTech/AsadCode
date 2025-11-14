"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import { product as defaultProduct } from "@/common/constants/auth.constant";
import { formatTimeAgo } from "@/common/utils/helper.utils";
import { getBrandCampaignsExcludingCompleted } from "@/provider/features/campaigns/campaigns.slice";
import { Loader2 } from "lucide-react";

const formatCurrency = (value) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toLocaleString()}`;
};

const deriveCompensation = (campaign) => {
  if (!campaign) {
    return {
      label: "Paid",
      detail: "Compensation TBD",
    };
  }

  if (campaign.creator_fixed_price) {
    return {
      label: "Paid",
      detail: `${formatCurrency(Number(campaign.creator_fixed_price))}`,
    };
  }

  if (campaign.suggested_min && campaign.suggested_max) {
    return {
      label: "Paid",
      detail: `${formatCurrency(Number(campaign.suggested_min))} - ${formatCurrency(
        Number(campaign.suggested_max)
      )}`,
    };
  }

  if (campaign.product_value) {
    return {
      label: "Gifted",
      detail: `Product (${formatCurrency(Number(campaign.product_value))} value)`,
    };
  }

  if (campaign.commission_percentage) {
    return {
      label: "Commission",
      detail: `${campaign.commission_percentage}% per sale`,
    };
  }

  return {
    label: "Paid",
    detail: "Budget available",
  };
};

const getCampaignTypeStyle = (type) => {
  const styles = {
    SPONSORED_POST: "bg-green-100 text-green-800 border-green-200",
    UGC: "bg-blue-100 text-blue-800 border-blue-200",
    BRANDED_CONTENT: "bg-blue-100 text-blue-800 border-blue-200",
    PRODUCT_REVIEW: "bg-orange-100 text-orange-800 border-orange-200",
    AFFILIATE: "bg-purple-100 text-purple-800 border-purple-200",
    GIVEAWAY: "bg-pink-100 text-pink-800 border-pink-200",
    EVENT: "bg-indigo-100 text-indigo-800 border-indigo-200",
    APP_PROMOTION: "bg-teal-100 text-teal-800 border-teal-200",
    GIFTED: "bg-yellow-100 text-yellow-800 border-yellow-200",
    COMMISSION: "bg-purple-100 text-purple-800 border-purple-200",
  };

  return styles[type] || styles.SPONSORED_POST;
};

const normalizeCampaigns = (data) => {
  if (!data) return [];

  if (Array.isArray(data)) return data;

  if (Array.isArray(data?.data)) return data.data;

  if (Array.isArray(data?.campaigns)) return data.campaigns;

  return [];
};

function ActiveCampaigns({ refreshKey }) {
  const dispatch = useDispatch();
  const { data, isLoading, isError, message } = useSelector(
    (state) => state.campaigns.getBrandCampaignsExcludingCompleted || {}
  );

  useEffect(() => {
    dispatch(getBrandCampaignsExcludingCompleted());
  }, [dispatch, refreshKey]);

  const campaigns = useMemo(() => normalizeCampaigns(data), [data]);

  const handleRefresh = () => {
    dispatch(getBrandCampaignsExcludingCompleted());
  };

  return (
    <section className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Active Campaigns</h3>
          <p className="text-sm text-gray-500 mt-1">
            Preview how your campaigns appear to creators on Discover+. These are live and ready for
            applications.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CustomButton
            text="Refresh"
            className="btn-outline !px-4 !py-2 text-xs"
            onClick={handleRefresh}
            disabled={isLoading}
            startIcon={<Loader2 className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />}
          />
        </div>
      </div>

      {isError && (
        <div className="p-4 border border-red-200 bg-red-50 rounded-lg text-sm text-red-700">
          Unable to load campaigns: {message || "Please try again shortly."}
        </div>
      )}

      {isLoading && !campaigns.length ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : campaigns.length ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {campaigns.map((campaign) => {
            const compensation = deriveCompensation(campaign);
            const deliverables = campaign.deliverables || [];
            const niches = campaign.niches || campaign.categories || [];
            const minFollowersValue = Number(campaign.min_combined_followers);
            const minFollowersDisplay = Number.isFinite(minFollowersValue)
              ? minFollowersValue.toLocaleString()
              : campaign.min_combined_followers || "Not specified";

            return (
              <div
                key={campaign.id}
                className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-5xl border border-gray-200 flex-shrink-0">
                        {campaign.created_by?.brand_profile?.brand_logo_url ? (
                          <img
                            src={campaign.created_by.brand_profile.brand_logo_url}
                            alt={campaign.campaign_title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl font-semibold text-gray-400">BR</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                          {campaign.created_by?.brand_profile?.brand_name || "Brand"}
                        </h3>
                        <h4 className="text-sm text-gray-700 line-clamp-1 font-medium">
                          {campaign.campaign_title}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <span>{formatTimeAgo(new Date(campaign.created_at))}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${getCampaignTypeStyle(
                          campaign.campaign_type || "SPONSORED_POST"
                        )}`}
                      >
                        {campaign.campaign_type || "SPONSORED_POST"}
                      </div>
                      <div className="flex gap-2 items-center text-left text-xs font-semibold text-gray-900">
                        <div>{compensation.label}</div>
                        <div>-</div>
                        <div>{compensation.detail}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <h5 className="text-xs font-semibold text-gray-900 mb-2">Requirements</h5>
                      <div className="flex flex-col gap-1 text-xs">
                        {niches.length ? (
                          <span className="flex items-center gap-2 text-gray-600">
                            <span className="font-medium">Niche:</span>{" "}
                            {Array.isArray(niches) ? niches.join(", ") : niches}
                          </span>
                        ) : null}
                        <span className="flex items-center gap-2 text-gray-600">
                          <span className="font-medium">Location:</span>{" "}
                          {`${campaign.in_person_required ? "In-person" : "Remote"}${
                            campaign.creator_city || campaign.creator_country
                              ? ` • ${[campaign.creator_city, campaign.creator_country]
                                  .filter(Boolean)
                                  .join(", ")}`
                              : ""
                          }`}
                        </span>
                        {campaign.creator_language && (
                          <span className="flex items-center gap-2 text-gray-600">
                            <span className="font-medium">Language:</span>{" "}
                            {campaign.creator_language}
                          </span>
                        )}
                        <span className="flex items-center gap-2 text-gray-600">
                          <span className="font-medium">Min Followers:</span> {minFollowersDisplay}
                        </span>
                      </div>

                      {deliverables.length ? (
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
                      ) : null}

                      {(campaign.short_description || campaign.long_description) && (
                        <div className="border-l-2 border-primary mt-3">
                          <p className="text-xs text-gray-600 line-clamp-2 ml-2">
                            <span className="font-bold">Description:</span>{" "}
                            {campaign.short_description || campaign.long_description}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex-shrink-0">
                      <img
                        src={
                          campaign.campaign_image && campaign.campaign_image.startsWith("http")
                            ? campaign.campaign_image
                            : defaultProduct
                        }
                        alt={campaign.campaign_title}
                        className="w-44 h-44 rounded-lg object-cover border border-gray-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
                  <CustomButton
                    text="View Brief"
                    className="btn-outline flex-1 !h-8 !text-xs"
                    href={`/campaign?tab=active&campaignId=${campaign.id}`}
                  />
                  <CustomButton
                    text="Apply"
                    className="btn-primary flex-1 !h-8 !text-xs disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled
                    title="Creators see this Apply button on Discover+. Campaign owners cannot apply."
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="border border-dashed border-gray-200 rounded-lg p-10 text-center bg-gray-50">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">No active campaigns yet</h4>
          <p className="text-sm text-gray-500 mb-4">
            Launch a campaign to start attracting creators. Your live campaigns will appear here in
            the same layout creators see on Discover+.
          </p>
        </div>
      )}
    </section>
  );
}

ActiveCampaigns.propTypes = {
  refreshKey: PropTypes.number,
};

ActiveCampaigns.defaultProps = {
  refreshKey: 0,
};

export default ActiveCampaigns;
