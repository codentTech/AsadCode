import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Loader from "@/common/components/loader/loader.component";
import Modal from "@/common/components/modal/modal.component";
import NoResultFound from "@/common/components/no-result-found/no-result-found";
import { avatar } from "@/common/constants/auth.constant";
import CreatorCard from "@/components/campaign/campaigns/components/creator-card/creator-card.component";
import CampaignCreationWizard from "@/components/campaign/create-campaign/create-campaign";
import { Filter } from "lucide-react";
import React from "react";
import useCampaignOverview from "../campaign-overview/use-campaign-overview.hook";
import useCreatorSpendAnalysis from "./use-creator-spend-analysis.hook";

const CreatorSpendAnalysis = ({
  selectedCampaign,
  appliedCreatorsData,
  appliedCreatorsLoading,
  onCreatorSelect,
  selectedCreator,
  filters,
  onCampaignSelect,
  onFilterChange,
  onClearFilters,
  onMessageClick,
}) => {
  const { creators, formatFollowers, getPlatformColor, open, handleOpenModal, handleCloseModal } =
    useCreatorSpendAnalysis();

  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const { campaignsData, campaignsLoading, campaignOptions } = useCampaignOverview();
  const hasAutoSelected = React.useRef(false);

  // Auto-select first campaign and notify parent once
  React.useEffect(() => {
    if (
      !selectedCampaign &&
      !hasAutoSelected.current &&
      Array.isArray(campaignsData?.data) &&
      campaignsData.data.length > 0 &&
      typeof onCampaignSelect === "function"
    ) {
      onCampaignSelect(campaignsData.data[0]);
      hasAutoSelected.current = true;
    }
  }, [selectedCampaign, campaignsData, onCampaignSelect]);

  // Note: We don't need to fetch data here since it's passed from parent component
  // The parent Applications component handles all API calls and passes the data down

  const handleCreatorPreview = (creator) => {
    if (onCreatorSelect) {
      onCreatorSelect(creator);
    }
  };

  const handleSaveToShortlist = (creator) => {
    console.log("Save to shortlist:", creator);
  };

  const handleInviteClick = (creator, e) => {
    e.stopPropagation();
    console.log("Invite creator:", creator);
  };

  // Map API data to shared CreatorCard shape
  const mapCreatorForCard = (creator) => {
    const creatorData = creator.creator;
    const profile = creatorData?.creator_profile;
    return {
      id: creator.id,
      name: `${creatorData?.first_name || ""} ${creatorData?.last_name || ""}`.trim(),
      profileImage: profile?.profile_photo_url || avatar,
      age: creatorData?.date_of_birth
        ? Math.floor(
            (new Date() - new Date(creatorData.date_of_birth)) / (365.25 * 24 * 60 * 60 * 1000)
          )
        : "N/A",
      location:
        `${creatorData?.city || ""} ${creatorData?.country || ""}`.trim() ||
        "Location not specified",
      rating: 4.5,
      reviewCount: 12,
      followers: 0,
      platforms: (profile?.social_platforms || []).map(({ platform }) => platform).filter(Boolean),
      platformStats: {},
      portfolioImages: profile?.mini_profile_pictures || [],
      niches: profile?.categories || [],
      tagline: creator.pitch || "",
      appliedDate: new Date(creator.applied_at).toLocaleDateString(),
    };
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-100">
      {/* Compact Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 w-full">
              <div className="min-w-[240px] w-[260px]">
                <SimpleSelect
                  placeHolder="Select a campaign"
                  options={campaignOptions}
                  isSearchable={true}
                  isMulti={false}
                  isLoading={campaignsLoading}
                  value={
                    selectedCampaign
                      ? { value: selectedCampaign.id, label: selectedCampaign.campaign_title }
                      : null
                  }
                  onChange={(opt) => {
                    const id = opt?.value;
                    const campaign = campaignsData?.data?.find((c) => c.id === id);
                    if (onCampaignSelect && campaign) onCampaignSelect(campaign);
                  }}
                />
              </div>
              <div className="relative">
                <CustomButton
                  text="Filters"
                  onClick={() => setShowFilterModal(true)}
                  startIcon={<Filter size={18} />}
                  className="btn-outline !h-10"
                />
              </div>
            </div>
            <div className="w-full max-w-[200px]">
              <CustomButton text="Start a new campaign" onClick={handleOpenModal} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {selectedCampaign ? (
          <>
            {/* Campaign Info */}
            <div className="mb-6 p-4 bg-white rounded-lg border">
              <h2 className="text-sm font-semibold text-gray-900 mb-2">
                Applied Creators for "{selectedCampaign.campaign_title}"
              </h2>
              <p className="text-xs text-gray-600">
                {appliedCreatorsData?.data?.length || 0} creators have applied to this campaign
              </p>
            </div>

            {/* Loading State */}
            {selectedCampaign && appliedCreatorsLoading && (
              <div className="text-center py-8 flex flex-col items-center">
                <Loader loading={true} color="blue" size={32} />
              </div>
            )}

            {/* Applied Creators Grid */}
            {!appliedCreatorsLoading &&
              Array.isArray(appliedCreatorsData?.data) &&
              appliedCreatorsData.data.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                  {appliedCreatorsData.data.map((creator) => {
                    const mapped = mapCreatorForCard(creator);
                    return (
                      <div key={creator.id} onClick={() => handleCreatorPreview(creator)}>
                        <CreatorCard
                          creator={mapped}
                          tab="applications"
                          appliedDate={mapped.appliedDate}
                          onCreatorPreview={handleCreatorPreview}
                          onSaveToShortlist={handleSaveToShortlist}
                          onRemoveFromShortlist={() => {}}
                          onMessageCreator={onMessageClick}
                          onInviteClick={() => {}}
                        />
                      </div>
                    );
                  })}
                </div>
              )}

            {/* No Creators Found */}
            {!appliedCreatorsLoading &&
              (!Array.isArray(appliedCreatorsData?.data) ||
                appliedCreatorsData.data.length === 0) && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <NoResultFound
                    message="No Creators Found"
                    subMessage="Try adjusting filters or selecting a different campaign."
                  />
                </div>
              )}
          </>
        ) : null}
      </div>

      <CampaignCreationWizard open={open} close={handleCloseModal} />

      {/* Filters Modal */}
      <Modal title="Filters" show={showFilterModal} onClose={() => setShowFilterModal(false)}>
        <div className="space-y-6">
          {/* Follower Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Follower Count</label>
            <div className="flex gap-2">
              <CustomInput
                type="number"
                placeholder="Min"
                value={filters?.min_followers || ""}
                onChange={(e) => onFilterChange && onFilterChange("min_followers", e.target.value)}
              />
              <CustomInput
                type="number"
                placeholder="Max"
                value={filters?.max_followers || ""}
                onChange={(e) => onFilterChange && onFilterChange("max_followers", e.target.value)}
              />
            </div>
          </div>

          {/* Categories (Niches) */}
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
                    const current = filters?.niches || [];
                    const next = current.includes(niche)
                      ? current.filter((n) => n !== niche)
                      : [...current, niche];
                    onFilterChange && onFilterChange("niches", next);
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

          {/* Minimum Rating */}
          <div className="bg-white border rounded-lg p-2 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Minimum Rating</h4>
            <input
              type="range"
              min="1"
              max="5"
              step="0.1"
              value={filters?.min_rating || 1}
              onChange={(e) => onFilterChange && onFilterChange("min_rating", e.target.value)}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1.0</span>
              <span>5.0</span>
            </div>
          </div>

          {/* Countries */}
          <div className="bg-white border rounded-lg p-2 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Countries</h4>
            <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
              {["United States", "Canada", "United Kingdom", "Australia"].map((country) => (
                <label key={country} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="accent-blue-600"
                    checked={filters?.country === country}
                    onChange={(e) =>
                      onFilterChange && onFilterChange("country", e.target.checked ? country : "")
                    }
                  />
                  <span>{country}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Platforms */}
          <div className="bg-white border rounded-lg p-2 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Social Platforms</h4>
            <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
              {["Instagram", "TikTok", "YouTube"].map((platform) => (
                <label key={platform} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="accent-blue-600"
                    checked={filters?.platforms?.includes(platform)}
                    onChange={(e) => {
                      const current = filters?.platforms || [];
                      const next = e.target.checked
                        ? [...current, platform]
                        : current.filter((p) => p !== platform);
                      onFilterChange && onFilterChange("platforms", next);
                    }}
                  />
                  <span>{platform}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort By */}
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
              onChange={(option) =>
                onFilterChange && onFilterChange("sort", option?.value || "newest")
              }
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <CustomButton text="Clear" className="btn-outline" onClick={onClearFilters} />
            <CustomButton
              text="Apply"
              className="btn-primary"
              onClick={() => setShowFilterModal(false)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreatorSpendAnalysis;
