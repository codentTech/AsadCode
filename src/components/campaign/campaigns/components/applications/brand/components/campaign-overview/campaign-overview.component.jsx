import CustomButton from "@/common/components/custom-button/custom-button.component";
import ConfirmationDialog from "@/common/components/custom-dialog-confirmation/ConfirmationDialog";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Loader from "@/common/components/loader/loader.component";
import NotFound from "@/common/components/not-found/not-found.component";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { RefreshRounded } from "@mui/icons-material";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
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
  const {
    openFilterModal,
    setOpenFilterModal,
    messageDialogOpen,
    setMessageDialogOpen,
    campaignsData,
    campaignsLoading,
    campaignOptions,
    selectedCampaign,
    handleCampaignChange,
    hireModalOpen,
    setHireModalOpen,
    hireCreatorData,
    selectedCampaignForHire,
    showRejectConfirmation,
    createContractLoading,
    sendContractLoading,
    createContractSuccess,
    sendContractSuccess,
    createContractError,
    sendContractError,
    handleHireClick,
    handleSendOffer,
    handleRejectClick,
    handleConfirmReject,
    handleCancelReject,
    handleNicheToggle,
    handlePlatformToggle,
    handleCountryToggle,
    getSortLabel,
    COUNTRIES,
    APPLICATION_STATUS_OPTIONS,
    SORT_OPTIONS,
    NICHE_OPTIONS,
    PLATFORM_OPTIONS,
    COUNTRY_FILTER_OPTIONS,
  } = useCampaignOverview({
    onCampaignSelect,
    selectedCampaign: externalSelectedCampaign,
    selectedCreator,
    filters,
    onFilterChange,
    onClearFilters,
    onRejectCreator,
  });

  return (
    <div className="w-[23%] border-r flex flex-col bg-white p-4 gap-4">
      <SimpleSelect
        placeHolder="Select a campaign"
        options={campaignOptions}
        onChange={handleCampaignChange}
        isLoading={campaignsLoading}
        value={
          selectedCampaign?.campaign_title
            ? campaignOptions.find((opt) => opt.value === selectedCampaign.id) || {
                value: selectedCampaign.id,
                label: selectedCampaign.campaign_title || "Untitled Campaign",
              }
            : null
        }
      />

      <hr />

      {selectedCampaign ? (
        <>
          <div className="space-y-4">
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
              <button
                onClick={onClearFilters}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Clear All Filters
              </button>
            </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Status
              </label>
              <SimpleSelect
                placeHolder="Select status"
                options={APPLICATION_STATUS_OPTIONS}
                value={filters?.status ? { value: filters.status, label: filters.status } : null}
                onChange={(option) => onFilterChange("status", option?.value || "")}
              />
            </div>

            <div>
              <SimpleSelect
                placeHolder="Select Audience Country"
                options={COUNTRIES}
                value={filters?.country ? { value: filters.country, label: filters.country } : null}
                onChange={(option) => onFilterChange("country", option?.value || "")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <SimpleSelect
                placeHolder="Sort by"
                options={SORT_OPTIONS}
                value={
                  filters?.sort
                    ? {
                        value: filters.sort,
                        label: getSortLabel(filters.sort),
                      }
                    : null
                }
                onChange={(option) => onFilterChange("sort", option?.value || "newest")}
              />
            </div>

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
      ) : (
        <div className="flex items-center justify-center py-8">
          <NotFound
            title="No Campaigns Found"
            description="Create or select a campaign to get started."
          />
        </div>
      )}

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
          <div className="p-2 bg-gray-50 rounded-lg border">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {NICHE_OPTIONS.map((niche) => (
                <button
                  key={niche}
                  onClick={() => handleNicheToggle(niche)}
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

          <div className="bg-white border rounded-lg p-2 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Countries</h4>
            <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
              {COUNTRY_FILTER_OPTIONS.map((country) => (
                <label key={country} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="accent-blue-600"
                    checked={filters?.country === country}
                    onChange={(e) => handleCountryToggle(country, e.target.checked)}
                  />
                  <span>{country}</span>
                </label>
              ))}
            </div>
            <button className="mt-2 text-blue-600 text-sm hover:underline">+ Show more</button>
          </div>

          <div className="bg-white border rounded-lg p-2 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Social Platforms</h4>
            <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
              {PLATFORM_OPTIONS.map((platform) => (
                <label key={platform} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="accent-blue-600"
                    checked={filters?.platforms?.includes(platform)}
                    onChange={(e) => handlePlatformToggle(platform, e.target.checked)}
                  />
                  <span>{platform}</span>
                </label>
              ))}
            </div>
          </div>

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
