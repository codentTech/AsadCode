"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import { product as defaultProduct } from "@/common/constants/auth.constant";
import { formatTimeAgo } from "@/common/utils/helper.utils";
import { deriveCompensation } from "@/common/utils/campaign.utils";
import { getAllBrandCampaigns } from "@/provider/features/campaigns/campaigns.slice";
import { Loader2 } from "lucide-react";

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
    (state) => state.campaigns.getAllBrandCampaigns || {}
  );

  useEffect(() => {
    dispatch(getAllBrandCampaigns());
  }, [dispatch, refreshKey]);

  // Filter out completed campaigns on frontend
  const activeCampaignsData = useMemo(() => {
    if (!data?.data || !Array.isArray(data.data)) return null;
    return {
      ...data,
      data: data.data.filter((campaign) => campaign.status !== "COMPLETE"),
    };
  }, [data]);

  const campaigns = useMemo(() => normalizeCampaigns(activeCampaignsData), [activeCampaignsData]);

  const handleRefresh = () => {
    dispatch(getAllBrandCampaigns());
  };

  return (
    <section className="space-y-4 rounded-lg bg-white p-3 shadow-md sm:space-y-6 sm:p-6">
      <div className="flex items-start justify-between gap-3 sm:items-center">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 sm:text-lg md:text-xl">Active Campaigns</h3>
          <p className="mt-1 text-[10px] leading-snug text-gray-500 sm:text-xs md:text-sm">
            Preview how your campaigns appear to creators on Discover+. These are live and ready for
            applications.
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isLoading}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Refresh active campaigns"
        >
          <Loader2 className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
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
        <div className="grid grid-cols-1 gap-3 sm:gap-4 xl:grid-cols-2">
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
                <div className="p-3 sm:p-4">
                  <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-2.5 sm:gap-3">
                      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 text-5xl sm:h-16 sm:w-16">
                        {campaign.created_by?.brand_profile?.brand_logo_url ? (
                          <img
                            src={campaign.created_by.brand_profile.brand_logo_url}
                            alt={campaign.campaign_title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xl font-semibold text-gray-400 sm:text-2xl">BR</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-gray-900">
                          {campaign.created_by?.brand_profile?.brand_name || "Brand"}
                        </h3>
                        <h4 className="line-clamp-1 text-xs font-medium text-gray-700 sm:text-sm">
                          {campaign.campaign_title}
                        </h4>
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-gray-500 sm:text-xs">
                          <span>{formatTimeAgo(new Date(campaign.created_at))}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-1.5 sm:flex-shrink-0 sm:items-end sm:gap-2">
                      <div
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[10px] font-medium sm:px-3 sm:py-1.5 sm:text-xs ${getCampaignTypeStyle(
                          campaign.campaign_type || "SPONSORED_POST"
                        )}`}
                      >
                        {campaign.campaign_type || "SPONSORED_POST"}
                      </div>
                      <div className="flex items-center gap-2 text-left text-[10px] font-semibold text-gray-900 sm:text-xs">
                        <div>{compensation.label}</div>
                        <div>-</div>
                        <div>{compensation.detail}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row">
                    <div className="flex-1">
                      <h5 className="text-xs font-semibold text-gray-900 mb-2">Requirements</h5>
                      <div className="flex flex-col gap-1 text-[10px] sm:text-xs">
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
                            className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600 sm:px-2 sm:py-1 sm:text-xs"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {(campaign.short_description || campaign.long_description) && (
                        <div className="border-l-2 border-primary mt-3">
                          <p className="ml-2 line-clamp-2 text-[10px] text-gray-600 sm:text-xs">
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
                        className="h-40 w-28 rounded-lg border border-gray-200 object-cover sm:h-44 sm:w-44"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 px-3 py-3 sm:px-4">
                  <CustomButton
                    text="View Brief"
                    className="btn-outline w-full"
                    href={`/campaign?tab=active&campaignId=${campaign.id}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-6 text-center sm:p-10">
          <h4 className="mb-2 text-sm font-semibold text-gray-800 sm:text-lg">No active campaigns yet</h4>
          <p className="mb-4 text-xs text-gray-500 sm:text-sm">
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
