"use client";

import PropTypes from "prop-types";
import { Menu, MenuItem } from "@mui/material";
import { EllipsisVertical, Loader2 } from "lucide-react";
import ConfirmationModal from "@/common/components/confirmation-modal/confirmation-modal.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Modal from "@/common/components/modal/modal.component";
import { product as defaultProduct } from "@/common/constants/auth.constant";
import { formatTimeAgo } from "@/common/utils/helper.utils";
import { deriveCompensation } from "@/common/utils/campaign.utils";
import { formatDateOrNA, getTodayHtmlDateInputValue } from "@/common/utils/date.utils";
import useActiveCampaigns from "./use-active-campaigns.hook";

const ActiveCampaigns = ({ refreshKey }) => {
  const {
    campaigns,
    isLoading,
    isError,
    message,
    isClosingListing,
    isExtendingDeadline,
    menuAnchorEl,
    menuCampaign,
    showCloseListingModal,
    campaignToClose,
    showExtendDeadlineModal,
    campaignToExtendDeadline,
    extendDeadlineValue,
    extendDeadlineError,
    isCampaignListingOpen,
    getCampaignTypeStyle,
    handleRefresh,
    handleMenuOpen,
    handleMenuClose,
    handleRequestCloseListing,
    handleCancelCloseListing,
    handleConfirmCloseListing,
    handleRequestExtendDeadline,
    handleCancelExtendDeadline,
    handleExtendDeadlineChange,
    handleConfirmExtendDeadline,
  } = useActiveCampaigns(refreshKey);

  return (
    <section className="space-y-4 rounded-lg bg-white p-3 shadow-md sm:space-y-6 sm:p-6">
      <div className="flex items-start justify-between gap-3 sm:items-center">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 sm:text-lg md:text-xl">
            Active Campaigns
          </h3>
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

      {isLoading && !campaigns.length ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
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
            const listingOpen = isCampaignListingOpen(campaign);

            return (
              <div
                key={campaign.id}
                className="rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                <div className="p-3 sm:p-4">
                  <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-2.5 sm:gap-3">
                      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 text-5xl sm:h-16 sm:w-16">
                        {campaign.created_by?.brand_profile?.brand_logo_url ? (
                          <img
                            src={campaign.created_by.brand_profile.brand_logo_url}
                            alt={campaign.campaign_title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xl font-semibold text-gray-400 sm:text-2xl">
                            BR
                          </span>
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
                      <div className="flex w-full items-start justify-between gap-2 sm:w-auto sm:justify-end">
                        <div
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[10px] font-medium sm:px-3 sm:py-1.5 sm:text-xs ${getCampaignTypeStyle(
                            campaign.campaign_type || "SPONSORED_POST"
                          )}`}
                        >
                          {campaign.campaign_type || "SPONSORED_POST"}
                        </div>
                        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                          {!listingOpen ? (
                            <span className="rounded-md bg-gray-200 px-1.5 py-1.5 text-[10px] font-semibold text-gray-600 sm:px-2 sm:py-1.5 sm:text-xs">
                              Listing closed
                            </span>
                          ) : null}
                          <button
                            type="button"
                            onClick={(event) => handleMenuOpen(event, campaign.id)}
                            disabled={isClosingListing || isExtendingDeadline}
                            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-500 bg-gray-100 transition-colors hover:bg-gray-200 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                            aria-label="Campaign options"
                          >
                            <EllipsisVertical className="h-4 w-4" />
                          </button>
                        </div>
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
                      <h5 className="mb-2 text-xs font-semibold text-gray-900">Requirements</h5>
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
                          <h5 className="mb-2 text-xs font-semibold text-gray-900">Deliverables</h5>
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
                        <div className="mt-3 border-l-2 border-primary">
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
          <h4 className="mb-2 text-sm font-semibold text-gray-800 sm:text-lg">
            No active campaigns yet
          </h4>
          <p className="mb-4 text-xs text-gray-500 sm:text-sm">
            Launch a campaign to start attracting creators. Your live campaigns will appear here in
            the same layout creators see on Discover+.
          </p>
        </div>
      )}

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          elevation: 3,
          sx: { minWidth: 220, borderRadius: 2, mt: 1 },
        }}
      >
        <MenuItem
          onClick={handleRequestExtendDeadline}
          disabled={isExtendingDeadline}
          sx={{ fontSize: "0.8125rem", py: 1.25, px: 2, whiteSpace: "normal" }}
        >
          Extend application deadline
        </MenuItem>
        <MenuItem
          onClick={handleRequestCloseListing}
          disabled={isClosingListing || !isCampaignListingOpen(menuCampaign)}
          sx={{ fontSize: "0.8125rem", py: 1.25, px: 2, whiteSpace: "normal" }}
        >
          Close listing to new applicants
        </MenuItem>
      </Menu>

      <ConfirmationModal
        show={showCloseListingModal}
        onCancel={handleCancelCloseListing}
        close={handleCancelCloseListing}
        onConfirm={handleConfirmCloseListing}
        message="Close listing to new applicants?"
        messageStyling="text-center text-sm font-semibold text-gray-900 sm:text-base"
        content={
          campaignToClose?.campaign_title
            ? `${campaignToClose.campaign_title} will be removed from Discover+ and will no longer accept new applications or hires.`
            : "This campaign will be removed from Discover+ and will no longer accept new applications or hires."
        }
        subContent="Existing applicants and hired creators are not affected."
        contentStyling="mt-2 max-w-sm text-center text-[10px] leading-snug text-gray-600 sm:text-xs"
        subContentStyling="mt-2 max-w-sm text-center text-[10px] text-gray-500 sm:text-xs"
        cancelText="Cancel"
        confirmText="Close listing"
        confirmLoading={isClosingListing}
        confirmLoadingText="Closing"
      />

      <Modal
        title="Extend application deadline"
        show={showExtendDeadlineModal}
        onClose={handleCancelExtendDeadline}
      >
        <div className="space-y-3">
          <p className="text-[10px] leading-snug text-gray-600 sm:text-xs">
            {campaignToExtendDeadline?.campaign_title
              ? `Update the deadline for ${campaignToExtendDeadline.campaign_title}. Choosing a future date reopens the listing to new applicants.`
              : "Choose a new application deadline. A future date reopens the listing to new applicants."}
          </p>
          <p className="text-[10px] text-gray-500 sm:text-xs">
            Current deadline: {formatDateOrNA(campaignToExtendDeadline?.application_deadline)}
          </p>
          <CustomInput
            label="New application deadline"
            type="date"
            name="extend_application_deadline"
            value={extendDeadlineValue}
            onChange={handleExtendDeadlineChange}
            inputProps={{ min: getTodayHtmlDateInputValue() }}
            isRequired
            errors={
              extendDeadlineError
                ? { extend_application_deadline: { message: extendDeadlineError } }
                : null
            }
          />
          <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
            <CustomButton
              text="Cancel"
              onClick={handleCancelExtendDeadline}
              className="btn-outline w-full sm:w-auto"
              disabled={isExtendingDeadline}
            />
            <CustomButton
              text="Save deadline"
              onClick={handleConfirmExtendDeadline}
              className="btn-primary w-full sm:w-auto"
              disabled={isExtendingDeadline}
              loading={isExtendingDeadline}
              loadingText="Saving"
            />
          </div>
        </div>
      </Modal>
    </section>
  );
};

ActiveCampaigns.propTypes = {
  refreshKey: PropTypes.number,
};

ActiveCampaigns.defaultProps = {
  refreshKey: 0,
};

export default ActiveCampaigns;
