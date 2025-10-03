import CustomButton from "@/common/components/custom-button/custom-button.component";
import ConfirmationDialog from "@/common/components/custom-dialog-confirmation/ConfirmationDialog";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Loader from "@/common/components/loader/loader.component";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { createContract, sendContract } from "@/provider/features/campaigns/campaigns.slice";
import { RefreshRounded } from "@mui/icons-material";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import HireCreatorModal from "../hire-creator-modal/hire-creator-modal.component";
import useCampaignOverview from "./use-campaign-overview.hook";

export default function CampaignOverview({
  onCampaignSelect,
  selectedCampaign: externalSelectedCampaign,
  selectedCreator,
  filters,
  onFilterChange,
  onClearFilters,
  onRejectCreator,
}) {
  const dispatch = useDispatch();
  const [hireModalOpen, setHireModalOpen] = useState(false);
  const [hireCreatorData, setHireCreatorData] = useState(null);
  const [selectedCampaignForHire, setSelectedCampaignForHire] = useState(null);
  const [showRejectConfirmation, setShowRejectConfirmation] = useState(false);

  // Get contract creation state from Redux
  const {
    isLoading: createContractLoading,
    isSuccess: createContractSuccess,
    isError: createContractError,
  } = useSelector((state) => state.campaigns.createContract || {});

  // Get contract sending state from Redux
  const {
    isLoading: sendContractLoading,
    isSuccess: sendContractSuccess,
    isError: sendContractError,
  } = useSelector((state) => state.campaigns.sendContract || {});

  const {
    openFilterModal,
    setOpenFilterModal,
    messageDialogOpen,
    setMessageDialogOpen,
    campaignsData,
    campaignsLoading,
    campaignsSuccess,
    campaignsError,
    campaignOptions,
    selectedCampaign: internalSelectedCampaign,
    handleCampaignChange: internalHandleCampaignChange,
  } = useCampaignOverview();

  // Use external selected campaign if provided, otherwise use internal
  const selectedCampaign = externalSelectedCampaign || internalSelectedCampaign;

  // Handle campaign change and notify parent
  const handleCampaignChange = (selectedOption) => {
    const campaignId = selectedOption?.value;
    const campaign = campaignsData?.data?.find((c) => c.id === campaignId);

    if (onCampaignSelect && campaign) {
      onCampaignSelect(campaign);
    }
  };

  // Notify parent if internal auto-selection happens and parent hasn't provided selectedCampaign
  useEffect(() => {
    if (!externalSelectedCampaign && internalSelectedCampaign && onCampaignSelect) {
      onCampaignSelect(internalSelectedCampaign);
    }
  }, [externalSelectedCampaign, internalSelectedCampaign, onCampaignSelect]);

  const handleHireClick = () => {
    if (!selectedCreator || !externalSelectedCampaign) {
      console.error("Missing creator or campaign data for hiring");
      return;
    }

    // Set real creator and campaign data
    setHireCreatorData(selectedCreator);
    setSelectedCampaignForHire(externalSelectedCampaign);
    setHireModalOpen(true);
  };

  const handleSendOffer = async (contractData) => {
    // Prepare contract data for API
    const contractPayload = {
      campaignId: externalSelectedCampaign.id,
      creatorId: selectedCreator.creator?.id || selectedCreator.id,
      brandId: externalSelectedCampaign.created_by?.id,
      startDate: contractData.startDate,
      completionDeadline: contractData.completionDeadline,
      contentFormat: contractData.contentFormat,
      revisionsLimit: contractData.revisionsLimit,
      compensationType: contractData.compensationType.toUpperCase(),
      totalCompensation: contractData.totalCompensation
        ? parseFloat(contractData.totalCompensation)
        : undefined,
      productPrice: contractData.productPrice ? parseFloat(contractData.productPrice) : undefined,
      usageRights:
        contractData.usageRights === "no_usage"
          ? "no_usage"
          : contractData.usageRights === "permanent"
            ? "permanent"
            : `${contractData.usageRights}_months`,
      exclusivityClause:
        contractData.exclusivityClause === "none"
          ? "none"
          : `${contractData.exclusivityClause}_months`,
      hashtags: contractData.hashtags,
      mentions: contractData.mentions,
      inPersonRequired: contractData.inPersonRequired,
      eligibleCountry: contractData.eligibleCountry,
      eligibleCity: contractData.eligibleCity,
      ageRange: contractData.ageRange,
      gender: contractData.gender,
      language: contractData.language,
    };

    // Create contract
    const createResult = await dispatch(createContract(contractPayload)).unwrap();

    if (createResult.success) {
      // Send contract (this now auto-approves and hires the creator)
      await dispatch(sendContract(createResult.data.id)).unwrap();

      // Close modal
      setHireModalOpen(false);
      setHireCreatorData(null);
      setSelectedCampaignForHire(null);

      // Add a small delay to ensure backend has updated the status
      setTimeout(() => {
        // Refresh applications list
        if (onCampaignSelect) {
          onCampaignSelect(externalSelectedCampaign);
        }
      }, 1000); // 1 second delay
    }
  };

  const handleRejectClick = () => {
    setShowRejectConfirmation(true);
  };

  const handleConfirmReject = () => {
    if (onRejectCreator && selectedCampaign && selectedCreator) {
      onRejectCreator(selectedCampaign.id, selectedCreator.id);
    }
    setShowRejectConfirmation(false);
  };

  const handleCancelReject = () => {
    setShowRejectConfirmation(false);
  };

  const countries = [
    { value: "United States", label: "United States" },
    { value: "United Kingdom", label: "United Kingdom" },
    { value: "Canada", label: "Canada" },
    { value: "Australia", label: "Australia" },
  ];

  return (
    <div className="w-[23%] border-r flex flex-col bg-white p-4 gap-4">
      <SimpleSelect
        placeHolder="Select a campaign"
        options={campaignOptions}
        isSearchable={true}
        isMulti={false}
        onChange={handleCampaignChange}
        isLoading={campaignsLoading}
      />

      <hr />

      {/* Show Actions and Filters - now default campaign is auto-selected */}
      {selectedCampaign ? (
        <>
          <div className="space-y-4">
            {/* Show Actions only when both campaign and creator are selected */}
            {selectedCreator ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Actions</h3>
                <div className="grid grid-cols-1 2xl:grid-cols-3 gap-2">
                  <CustomButton
                    text="Message"
                    onClick={() => setMessageDialogOpen(true)}
                    className="btn-primary"
                  />
                  <CustomButton text="Hire" className="btn-outline" onClick={handleHireClick} />
                  <CustomButton text="Reject" className="btn-danger" onClick={handleRejectClick} />
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                </div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Select a Creator</h3>
                <p className="text-xs text-gray-500">Choose a creator to view actions</p>
              </div>
            )}

            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </h3>
              {/* Clear Filters Button */}
              <button
                onClick={onClearFilters}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Clear All Filters
              </button>
            </div>

            {/* Follower Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Follower Count</label>
              <div className="flex gap-2">
                <CustomInput
                  type="number"
                  placeholder="Min"
                  value={filters?.min_followers || ""}
                  onChange={(e) => onFilterChange("min_followers", e.target.value)}
                />
                <CustomInput
                  type="number"
                  placeholder="Max"
                  value={filters?.max_followers || ""}
                  onChange={(e) => onFilterChange("max_followers", e.target.value)}
                />
              </div>
            </div>

            {/* Application Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Status
              </label>
              <SimpleSelect
                placeHolder="Select status"
                options={[
                  { value: "PENDING", label: "Pending" },
                  { value: "HIRED", label: "Hired" },
                  { value: "REJECTED", label: "Rejected" },
                  { value: "DRAFT", label: "Draft" },
                ]}
                value={filters?.status ? { value: filters.status, label: filters.status } : null}
                onChange={(option) => onFilterChange("status", option?.value || "")}
              />
            </div>

            {/* Audience Country */}
            <div>
              <SimpleSelect
                placeHolder="Select Audience Country"
                options={countries}
                value={filters?.country ? { value: filters.country, label: filters.country } : null}
                onChange={(option) => onFilterChange("country", option?.value || "")}
              />
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <SimpleSelect
                placeHolder="Sort by"
                options={[
                  { value: "newest", label: "Newest First" },
                  { value: "oldest", label: "Oldest First" },
                  { value: "rating", label: "Highest Rating" },
                  { value: "followers", label: "Most Followers" },
                ]}
                value={
                  filters?.sort
                    ? {
                        value: filters.sort,
                        label:
                          filters.sort === "newest"
                            ? "Newest First"
                            : filters.sort === "oldest"
                              ? "Oldest First"
                              : filters.sort === "rating"
                                ? "Highest Rating"
                                : "Most Followers",
                      }
                    : null
                }
                onChange={(option) => onFilterChange("sort", option?.value || "newest")}
              />
            </div>

            {/* See More Button */}
            <button
              onClick={() => setOpenFilterModal(!openFilterModal)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {openFilterModal ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              {openFilterModal ? "See Less" : "See More"}
            </button>
          </div>
        </>
      ) : campaignsLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader loading={true} />
        </div>
      ) : null}

      <HireCreatorModal
        show={hireModalOpen}
        onClose={() => setHireModalOpen(false)}
        creatorData={hireCreatorData}
        campaignData={selectedCampaignForHire}
        onSendOffer={handleSendOffer}
        isLoading={createContractLoading || sendContractLoading}
        isSuccess={createContractSuccess && sendContractSuccess}
        isError={createContractError || sendContractError}
      />

      {/* Message Creator Dialog */}
      <Modal
        title={`Message to Sam Waters`}
        show={messageDialogOpen}
        onClose={() => setMessageDialogOpen(false)}
      >
        <TextArea label="Your Message" />
        <div className="w-full flex justify-end gap-3">
          <CustomButton
            text="Cancel"
            className="btn-cancel"
            onClick={() => setMessageDialogOpen(false)}
          />

          <CustomButton text="Send Message" className="btn-primary" />
        </div>
      </Modal>

      <Modal title="Apply Filters" show={openFilterModal} onClose={() => setOpenFilterModal(false)}>
        <div className="space-y-6">
          {/* Category Filters */}
          <div className="p-2 bg-gray-50 rounded-lg border">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {[
                "Beauty",
                "Skincare",
                "Fitness",
                "Fashion",
                "Travel",
                "Food",
                "Finance",
                "Business",
                "Health",
              ].map((niche) => (
                <button
                  key={niche}
                  onClick={() => {
                    const currentNiches = filters?.niches || [];
                    const newNiches = currentNiches.includes(niche)
                      ? currentNiches.filter((n) => n !== niche)
                      : [...currentNiches, niche];
                    onFilterChange("niches", newNiches);
                  }}
                  className={`px-2 py-1.5 rounded-lg text-xs border ${
                    filters?.niches?.includes(niche)
                      ? "bg-primary text-white shadow-sm"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-primary hover:text-primary"
                  }`}
                >
                  {niche}
                </button>
              ))}
            </div>
          </div>

          {/* Rating Slider */}
          <div className="bg-white border rounded-lg p-2 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Minimum Rating</h4>
            <input
              type="range"
              min="1"
              max="5"
              step="0.1"
              value={filters?.min_rating || 1}
              onChange={(e) => onFilterChange("min_rating", e.target.value)}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1.0</span>
              <span>5.0</span>
            </div>
          </div>

          {/* Number of Ratings Slider */}
          <div className="bg-white border rounded-lg p-2 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Number of Ratings</h4>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              defaultValue="20"
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0</span>
              <span>100+</span>
            </div>
          </div>

          {/* Country Filters */}
          <div className="bg-white border rounded-lg p-2 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Countries</h4>
            <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
              {["United States", "Canada", "United Kingdom", "Australia"].map((country, idx) => (
                <label key={country} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="accent-blue-600"
                    checked={filters?.country === country}
                    onChange={(e) => onFilterChange("country", e.target.checked ? country : "")}
                  />
                  <span>{country}</span>
                </label>
              ))}
            </div>
            <button className="mt-2 text-blue-600 text-sm hover:underline">+ Show more</button>
          </div>

          {/* Platform Filters */}
          <div className="bg-white border rounded-lg p-2 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Social Platforms</h4>
            <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
              {["Instagram", "TikTok", "YouTube"].map((platform, idx) => (
                <label key={platform} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="accent-blue-600"
                    checked={filters?.platforms?.includes(platform)}
                    onChange={(e) => {
                      const currentPlatforms = filters?.platforms || [];
                      const newPlatforms = e.target.checked
                        ? [...currentPlatforms, platform]
                        : currentPlatforms.filter((p) => p !== platform);
                      onFilterChange("platforms", newPlatforms);
                    }}
                  />
                  <span>{platform}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <CustomButton
              text="Apply Filters"
              className="w-full btn-primary"
              onClick={() => setOpenFilterModal(false)}
            />
            <CustomButton
              text="Reset"
              className="btn-outline"
              startIcon={<RefreshRounded />}
              onClick={onClearFilters}
            />
          </div>
        </div>
      </Modal>

      {/* Reject Confirmation Modal */}
      <ConfirmationDialog
        show={showRejectConfirmation}
        onClose={handleCancelReject}
        onConfirm={handleConfirmReject}
        message="Reject Creator"
        content={
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              Are you sure you want to reject this creator's application?
            </p>
            <p className="text-sm text-gray-500">
              This action will move the application to the rejected list.
            </p>
          </div>
        }
      />
    </div>
  );
}
