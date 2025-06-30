import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Modal from "@/common/components/modal/modal.component";
import InstagramIcon from "@/common/icons/instagram";
import SearchIcon from "@/common/icons/search-icon";
import TiktokIcon from "@/common/icons/tiktok";
import YoutubeIcon from "@/common/icons/youtube";
import { Bookmark, ChevronRight, Filter, Mail, Star, Users, X } from "lucide-react";
import { useState } from "react";
import useDiscoverDreatorsHook from "./use-discover-creators.hook";

function DiscoverCreators({
  sortOptions,
  selectedShortlist,
  mockNicheCategories,
  handleCreatorPreview,
  handleSaveToShortlist,
  handleMessageCreator,
  getSortedCreators,
  handleRemoveFromShortlist,
  handleInviteToApply,
  userCampaigns = [], // Array of user's campaigns
}) {
  const { scrollRefs, overflowStates } = useDiscoverDreatorsHook({ mockNicheCategories });

  // Filter states
  const [filters, setFilters] = useState({
    platforms: [],
    minFollowers: "",
    country: "",
    city: "",
    gender: "",
    ageRange: "",
    niches: [],
  });

  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Mock data for filters
  const platformOptions = [
    { value: "instagram", label: "Instagram" },
    { value: "youtube", label: "YouTube" },
    { value: "tiktok", label: "TikTok" },
    { value: "facebook", label: "Facebook" },
    { value: "twitter", label: "Twitter" },
  ];

  const followerOptions = [
    { value: "1000", label: "1K+" },
    { value: "10000", label: "10K+" },
    { value: "50000", label: "50K+" },
    { value: "100000", label: "100K+" },
    { value: "500000", label: "500K+" },
    { value: "1000000", label: "1M+" },
  ];

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "non-binary", label: "Non-binary" },
    { value: "other", label: "Other" },
  ];

  const ageOptions = [
    { value: "18-24", label: "18-24" },
    { value: "25-34", label: "25-34" },
    { value: "35-44", label: "35-44" },
    { value: "45-54", label: "45-54" },
    { value: "55+", label: "55+" },
  ];

  // Mock niche categories for filter
  const nicheOptions = [
    { value: "fitness", label: "Fitness" },
    { value: "food", label: "Food" },
    { value: "travel", label: "Travel" },
    { value: "lifestyle", label: "Lifestyle" },
    { value: "fashion", label: "Fashion" },
    { value: "beauty", label: "Beauty" },
    { value: "tech", label: "Technology" },
    { value: "gaming", label: "Gaming" },
    { value: "other", label: "Other" },
  ];

  const sortByOptions = [
    { value: "followers", label: "Followers" },
    { value: "rating", label: "Rating" },
    { value: "engagement", label: "Engagement Rate" },
  ];

  // Social media icons mapping
  const PlatformIcons = {
    instagram: <InstagramIcon />,
    youtube: <YoutubeIcon />,
    tiktok: <TiktokIcon />,
  };

  const handleSeeMoreClick = (categoryId) => {
    const el = scrollRefs.current[categoryId];
    if (el) {
      el.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const clearAllFilters = () => {
    setFilters({
      platforms: [],
      minFollowers: "",
      country: "",
      city: "",
      gender: "",
      ageRange: "",
      niches: [],
    });
    setSearchKeyword("");
    setSelectedSort("");
  };

  const handleNicheToggle = (niche) => {
    setFilters((prev) => ({
      ...prev,
      niches: prev.niches.includes(niche)
        ? prev.niches.filter((n) => n !== niche)
        : [...prev.niches, niche],
    }));
  };

  const handlePlatformToggle = (platform) => {
    setFilters((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const handleFollowerSelect = (follower) => {
    setFilters((prev) => ({
      ...prev,
      minFollowers: prev.minFollowers === follower ? "" : follower,
    }));
  };

  const handleGenderSelect = (gender) => {
    setFilters((prev) => ({
      ...prev,
      gender: prev.gender === gender ? "" : gender,
    }));
  };

  const handleAgeSelect = (age) => {
    setFilters((prev) => ({
      ...prev,
      ageRange: prev.ageRange === age ? "" : age,
    }));
  };

  const handleInviteClick = (creator, e) => {
    e.stopPropagation();
    setSelectedCreator(creator);
    setShowInviteModal(true);
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return (
      filters.niches.length > 0 ||
      filters.platforms.length > 0 ||
      filters.minFollowers ||
      filters.gender ||
      filters.ageRange ||
      filters.country ||
      filters.city
    );
  };

  const CreatorCard = ({ creator, isShortlist = false, showSeeMore = false }) => (
    <div
      className={`group relative flex-shrink-0 snap-start ${
        isShortlist ? "w-full" : "w-64"
      } rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer bg-white border border-gray-200 overflow-hidden`}
      onClick={() => handleCreatorPreview(creator)}
    >
      {/* Compact Cover Images Section - moved further down */}
      <div className="relative h-32 bg-gray-100 overflow-hidden">
        {creator.portfolioImages && creator.portfolioImages.length >= 3 ? (
          <div className="flex h-full">
            {creator.portfolioImages.slice(0, 3).map((image, index) => (
              <div key={index} className="flex-1 relative">
                <img
                  src={image}
                  alt={`Portfolio ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {index < 2 && (
                  <div className="absolute right-0 top-0 w-px h-full bg-white/30"></div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full bg-gray-200"></div>
        )}
      </div>

      {/* Compact Content Section */}
      <div className="relative px-4 pb-4 space-y-3">
        {/* Compact Profile Image - positioned at base of cover images */}
        <div className="absolute top-[-70px] left-1/2 transform -translate-x-1/2">
          <div className="w-16 h-16 rounded-full border-2 border-white bg-white overflow-hidden">
            <img
              src={creator.profileImage}
              alt={creator.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Name, Rating and Location */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <h4 className="text-gray-900 font-semibold text-sm">{creator.name}</h4>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-xs text-gray-500">{creator.rating}</span>
              <span className="text-xs text-gray-400">({creator.reviewCount || 0})</span>
            </div>
          </div>
          <p className="text-gray-500 text-xs">
            {creator.age} • {creator.location}
          </p>
        </div>

        {/* Compact Niche Tags */}
        <div className="flex flex-wrap gap-1 justify-center">
          {creator.niches?.slice(0, 2).map((niche) => (
            <span
              key={niche}
              className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600 capitalize"
            >
              {niche}
            </span>
          ))}
        </div>

        {/* Short tagline bio */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            {creator.tagline || "Creating authentic content that resonates with audiences"}
          </p>
        </div>

        {/* Compact Stats - just total followers */}
        <div className="text-center text-xs text-gray-500 border-t border-gray-100 pt-2">
          <span className="font-medium">
            {creator.followers >= 1000000
              ? `${(creator.followers / 1000000).toFixed(1)}M Total Followers`
              : `${(creator.followers / 1000).toFixed(0)}K Total Followers`}
          </span>
        </div>

        {/* Compact Social Icons - more spread out with follower counts */}
        <div className="flex justify-center space-x-4">
          {creator.platforms.map((platform) => (
            <div key={platform} className="flex flex-col items-center space-y-1">
              <div
                className="w-8 h-8 flex items-center justify-center rounded bg-gray-100"
                title={`${platform}: ${creator.platformStats?.[platform]?.followers || "N/A"} followers`}
              >
                <div className="scale-75">
                  {PlatformIcons[platform] || (
                    <span className="text-xs font-medium text-gray-600">
                      {platform.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-500">
                {creator.platformStats?.[platform]?.followers
                  ? creator.platformStats[platform].followers >= 1000000
                    ? `${(creator.platformStats[platform].followers / 1000000).toFixed(1)}M`
                    : creator.platformStats[platform].followers >= 1000
                      ? `${(creator.platformStats[platform].followers / 1000).toFixed(0)}K`
                      : creator.platformStats[platform].followers
                  : "N/A"}
              </span>
            </div>
          ))}
        </div>

        {/* Icon Buttons */}
        <div className="flex justify-center space-x-2">
          {/* Bookmark - for saving to lists */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              isShortlist ? handleRemoveFromShortlist(creator.id) : handleSaveToShortlist(creator);
            }}
            className="p-2 rounded-full hover:bg-blue-100 transition"
            title={isShortlist ? "Remove from list" : "Save to list"}
          >
            <Bookmark
              className={`w-5 h-5 ${isShortlist ? "text-blue-700 fill-current" : "text-blue-600"}`}
            />
          </button>

          {/* Message */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMessageCreator(creator);
            }}
            className="p-2 rounded-full hover:bg-purple-100 transition"
            title="Message"
          >
            <Mail className="w-5 h-5 text-purple-600" />
          </button>
        </div>

        {/* Invite to Apply Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleInviteClick(creator, e);
            }}
            className="flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-200 border bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
          >
            Invite to Apply
          </button>
        </div>
      </div>
    </div>
  );

  const InviteModal = () =>
    showInviteModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Invite {selectedCreator?.name}</h3>
            <button
              onClick={() => setShowInviteModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {userCampaigns.length === 0 ? (
              <p className="text-gray-500">No active campaigns available</p>
            ) : (
              userCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    handleInviteToApply && handleInviteToApply(selectedCreator, campaign);
                    setShowInviteModal(false);
                  }}
                >
                  <h4 className="font-medium">{campaign.name}</h4>
                  <p className="text-sm text-gray-600">{campaign.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-white">
      {/* Main Content */}
      {selectedShortlist ? (
        <div className="space-y-4">
          {/* Shortlist Header */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{selectedShortlist.name}</h3>
              <p className="text-sm text-gray-600">{getSortedCreators().length} creators</p>
            </div>
            <div className="w-full max-w-[230px]">
              <SimpleSelect
                placeHolder="Sort by"
                options={sortOptions}
                className="w-48"
                onChange={() => {}}
              />
            </div>
          </div>

          {getSortedCreators().length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-1">No creators yet</h4>
              <p className="text-gray-600">Browse the Discover feed to add creators.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {getSortedCreators().map((creator) => (
                <CreatorCard key={creator.id} creator={creator} isShortlist={true} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Page Header */}
          <div className="">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Discover Creators</h1>
              <div className="flex items-center gap-3">
                {/* Search Input */}
                <div className="w-full min-w-[230px]">
                  <CustomInput
                    placeholder="Search creators"
                    value={searchKeyword}
                    startIcon={<SearchIcon />}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                </div>

                <div className="w-full min-w-[230px]">
                  <SimpleSelect
                    placeHolder="Select an opttion"
                    options={sortByOptions}
                    onChange={() => {}}
                  />
                </div>

                {/* Filter Button */}
                <div className="relative">
                  <CustomButton
                    text="Filters"
                    onClick={() => setShowFilterModal(true)}
                    startIcon={<Filter size={18} />}
                    className="btn-primary !h-10"
                  />
                </div>
              </div>
            </div>
            <p className="text-gray-600">Find the perfect creators for your campaigns</p>
          </div>
          {/* Clean Search and Filter Bar */}
          {!selectedShortlist && (
            <div className="mb-6">
              {/* Active Filters Display */}
              {hasActiveFilters() && (
                <div className="flex items-center gap-2 mt-3 flex-wrap border rounded-lg p-3 bg-gray-100">
                  <span className="text-sm text-gray-600">Active filters:</span>

                  {filters.niches.map((niche) => (
                    <span
                      key={niche}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full"
                    >
                      {nicheOptions.find((n) => n.value === niche)?.label}
                      <button
                        onClick={() => handleNicheToggle(niche)}
                        className="hover:text-indigo-900"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}

                  {filters.platforms.map((platform) => (
                    <span
                      key={platform}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full"
                    >
                      {platformOptions.find((p) => p.value === platform)?.label}
                      <button
                        onClick={() => handlePlatformToggle(platform)}
                        className="hover:text-indigo-900"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}

                  {filters.minFollowers && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                      {followerOptions.find((f) => f.value === filters.minFollowers)?.label}+
                      followers
                      <button
                        onClick={() => handleFollowerSelect(filters.minFollowers)}
                        className="hover:text-indigo-900"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}

                  {filters.gender && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                      {genderOptions.find((g) => g.value === filters.gender)?.label}
                      <button
                        onClick={() => handleGenderSelect(filters.gender)}
                        className="hover:text-indigo-900"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}

                  {filters.ageRange && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                      Age {filters.ageRange}
                      <button
                        onClick={() => handleAgeSelect(filters.ageRange)}
                        className="hover:text-indigo-900"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}

                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-gray-500 hover:text-gray-700 underline"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Category Sections */}
          {mockNicheCategories.map((category) => (
            <div key={category.id} className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold text-gray-900">{category.name}</h4>
                {overflowStates[category.id] && (
                  <button
                    onClick={() => handleSeeMoreClick(category.id)}
                    className="flex items-center space-x-1 text-primary hover:text-indigo-800 text-sm font-medium"
                  >
                    <span>See More</span>
                    <ChevronRight size={14} />
                  </button>
                )}
              </div>

              <div
                ref={(el) => {
                  scrollRefs.current[category.id] = el;
                }}
                className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scroll-smooth snap-x"
              >
                {category.creators.map((creator) => (
                  <CreatorCard key={creator.id} creator={creator} showSeeMore={true} />
                ))}
              </div>

              <hr className="border-gray-200" />
            </div>
          ))}
        </div>
      )}

      {/* Filter Modal using Custom Modal Component */}
      <Modal
        title="Filter Creators"
        show={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        size="lg"
      >
        <div className="space-y-6">
          {/* Niche Categories */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-2">Niche Categories</h4>
            <div className="grid grid-cols-7 gap-2">
              {nicheOptions.map((niche) => (
                <button
                  key={niche.value}
                  onClick={() => handleNicheToggle(niche.value)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    filters.niches.includes(niche.value)
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {niche.label}
                </button>
              ))}
            </div>
          </div>

          {/* Platforms */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-2">Platforms</h4>
            <div className="grid grid-cols-7 gap-2">
              {platformOptions.map((platform) => (
                <button
                  key={platform.value}
                  onClick={() => handlePlatformToggle(platform.value)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    filters.platforms.includes(platform.value)
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {platform.label}
                </button>
              ))}
            </div>
          </div>

          {/* Minimum Followers */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-2">Minimum Followers</h4>
            <div className="grid grid-cols-7 gap-2">
              {followerOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFollowerSelect(option.value)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    filters.minFollowers === option.value
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Demographics */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-2">Gender</h4>
              <div className="grid grid-cols-5 gap-2">
                {genderOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleGenderSelect(option.value)}
                    className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                      filters.gender === option.value
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-2">Age Range</h4>
              <div className="grid grid-cols-5 gap-2">
                {ageOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAgeSelect(option.value)}
                    className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                      filters.ageRange === option.value
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <CustomInput
              label="Country"
              placeholder="Enter country"
              value={filters.country}
              onChange={(e) => setFilters((prev) => ({ ...prev, country: e.target.value }))}
            />
            <CustomInput
              label="City"
              placeholder="Enter city"
              value={filters.city}
              onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-between items-center mt-6">
          <CustomButton onClick={clearAllFilters} text="Clear All" className="btn-cancel" />
          <div className="flex gap-3">
            <CustomButton
              onClick={() => setShowFilterModal(false)}
              text="Cancel"
              className="btn-cancel"
            />
            <CustomButton onClick={() => setShowFilterModal(false)} text="Apply Filters" />
          </div>
        </div>
      </Modal>

      {/* Invite Modal */}
      <InviteModal />
    </div>
  );
}

export default DiscoverCreators;
