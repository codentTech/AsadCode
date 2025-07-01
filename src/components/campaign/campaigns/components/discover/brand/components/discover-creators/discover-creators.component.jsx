import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Modal from "@/common/components/modal/modal.component";
import InstagramIcon from "@/common/icons/instagram";
import SearchIcon from "@/common/icons/search-icon";
import TiktokIcon from "@/common/icons/tiktok";
import YoutubeIcon from "@/common/icons/youtube";
import CampaignCreationWizard from "@/components/campaign/create-campaign/create-campaign";
import { ArrowLeft, Bookmark, ChevronRight, Filter, Mail, Star, Users, X } from "lucide-react";
import { useState } from "react";
import useDiscoverDreatorsHook from "./use-discover-creators.hook";

function DiscoverCreators({
  sortOptions,
  selectedShortlist,
  setSelectedShortlist,
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
  const [open, setOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterType, setFilterType] = useState("creator");
  const [audienceFilters, setAudienceFilters] = useState({
    audienceGender: "",
    audienceAgeRanges: [],
    audienceCountries: [],
    audienceCity: "",
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredCreators, setFilteredCreators] = useState([]);

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
    { value: "skincare", label: "Skincare" },
    { value: "other", label: "Other" },
  ];

  const sortByOptions = [
    { value: "followers", label: "Followers" },
    { value: "rating", label: "Rating" },
    { value: "engagement", label: "Engagement Rate" },
  ];

  // Add language options
  const languageOptions = [
    { value: "english", label: "English" },
    { value: "spanish", label: "Spanish" },
    { value: "french", label: "French" },
    { value: "german", label: "German" },
    { value: "italian", label: "Italian" },
    { value: "portuguese", label: "Portuguese" },
    { value: "chinese", label: "Chinese" },
    { value: "japanese", label: "Japanese" },
    { value: "korean", label: "Korean" },
    { value: "arabic", label: "Arabic" },
    { value: "hindi", label: "Hindi" },
    { value: "other", label: "Other" },
  ];

  // Audience-specific options
  const audienceGenderOptions = [
    { value: "mostly-male", label: "Mostly Male" },
    { value: "mostly-female", label: "Mostly Female" },
  ];

  const audienceAgeOptions = [
    { value: "13-17", label: "13–17" },
    { value: "18-24", label: "18–24" },
    { value: "25-34", label: "25–34" },
    { value: "35-44", label: "35–44" },
    { value: "45-54", label: "45–54" },
    { value: "55+", label: "55+" },
  ];

  const countryOptions = [
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
    { value: "uk", label: "United Kingdom" },
    { value: "au", label: "Australia" },
    { value: "de", label: "Germany" },
    { value: "fr", label: "France" },
    { value: "es", label: "Spain" },
    { value: "it", label: "Italy" },
    { value: "jp", label: "Japan" },
    { value: "br", label: "Brazil" },
  ];

  // Handler functions for audience filters
  const handleAudienceGenderSelect = (gender) => {
    setAudienceFilters((prev) => ({
      ...prev,
      audienceGender: prev.audienceGender === gender ? "" : gender,
    }));
  };

  const handleAudienceAgeToggle = (age) => {
    setAudienceFilters((prev) => ({
      ...prev,
      audienceAgeRanges: prev.audienceAgeRanges.includes(age)
        ? prev.audienceAgeRanges.filter((a) => a !== age)
        : [...prev.audienceAgeRanges, age],
    }));
  };

  const handleAudienceCountryToggle = (country) => {
    setAudienceFilters((prev) => ({
      ...prev,
      audienceCountries: prev.audienceCountries.includes(country)
        ? prev.audienceCountries.filter((c) => c !== country)
        : [...prev.audienceCountries, country],
    }));
  };

  const handleLanguageToggle = (language) => {
    setFilters((prev) => ({
      ...prev,
      languages: prev.languages?.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...(prev.languages || []), language],
    }));
  };

  // Social media icons mapping
  const PlatformIcons = {
    instagram: <InstagramIcon />,
    youtube: <YoutubeIcon />,
    tiktok: <TiktokIcon />,
  };

  // Updated handleSeeMoreClick to filter by category
  const handleSeeMoreClick = (category) => {
    // Get the niche from category name (convert "Top in Skincare" to "skincare")
    const categoryNiche = category.name.toLowerCase().replace("top in ", "").trim();

    // Get all creators from all categories that have this niche
    const allCreators = mockNicheCategories.flatMap((cat) => cat.creators);
    const creatorsWithNiche = allCreators.filter(
      (creator) =>
        creator.niches && creator.niches.some((niche) => niche.toLowerCase() === categoryNiche)
    );

    setSelectedCategory(category);
    setFilteredCreators(creatorsWithNiche);
  };

  // Function to go back to main discover view
  const handleBackToDiscover = () => {
    setSelectedCategory(null);
    setFilteredCreators([]);
    setSelectedShortlist(null);
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
      languages: [],
    });
    setAudienceFilters({
      audienceGender: "",
      audienceAgeRanges: [],
      audienceCountries: [],
      audienceCity: "",
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
      filters.city ||
      filters.languages?.length > 0 ||
      audienceFilters.audienceGender ||
      audienceFilters.audienceAgeRanges.length > 0 ||
      audienceFilters.audienceCountries.length > 0 ||
      audienceFilters.audienceCity
    );
  };

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  const CreatorCard = ({ creator, isShortlist = false }) => (
    <div
      className={`group relative flex-shrink-0 snap-start ${
        isShortlist ? "w-full" : "w-64"
      } rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer bg-white border border-gray-200 overflow-hidden`}
      onClick={() => handleCreatorPreview(creator)}
    >
      {/* Cover Images Section */}
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
          <div className="w-full h-full bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100"></div>
        )}
      </div>

      {/* Content Section */}
      <div className="relative px-4 pb-4 space-y-3">
        {/* Profile Image */}
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

        {/* Niche Tags */}
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

        {/* Stats */}
        <div className="text-center text-xs text-gray-500 border-t border-gray-100 pt-2">
          <span className="font-medium">
            {creator.followers >= 1000000
              ? `${(creator.followers / 1000000).toFixed(1)}M Total Followers`
              : `${(creator.followers / 1000).toFixed(0)}K Total Followers`}
          </span>
        </div>

        {/* Social Icons */}
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

        {/* Invite Button */}
        <div className="flex items-center gap-3">
          <CustomButton
            text="Invite to Apply"
            onClick={(e) => {
              e.stopPropagation();
              handleInviteClick(creator, e);
            }}
            className="btn-outline w-full rounded-lg"
          />
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
    <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
      {/* Main Content */}
      {selectedShortlist ? (
        <div className="space-y-4">
          {/* Shortlist Header */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div onClick={handleBackToDiscover} className="cursor-pointer">
                <ArrowLeft />
              </div>
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  {selectedShortlist.name}
                  <p className="text-lg text-gray-600">({getSortedCreators().length} creators)</p>
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Search Input */}
              <div className="w-full min-w-[230px] bg-white">
                <CustomInput
                  placeholder="Search creators"
                  value={searchKeyword}
                  startIcon={<SearchIcon />}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>

              <div className="w-full min-w-[230px]">
                <SimpleSelect placeHolder="Sort by" options={sortByOptions} onChange={() => {}} />
              </div>

              {/* Filter Button */}
              <div className="relative">
                <CustomButton
                  text="Filters"
                  onClick={() => setShowFilterModal(true)}
                  startIcon={<Filter size={18} />}
                  className="btn-outline !h-10"
                />
              </div>
              <div className="w-full max-w-[200px]">
                <CustomButton
                  text="Start a new campaign"
                  onClick={handleOpenModal}
                  className="btn-primary !h-10"
                />
              </div>
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
      ) : selectedCategory ? (
        <div className="space-y-4">
          {/* Shortlist Header */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div onClick={handleBackToDiscover} className="cursor-pointer">
                <ArrowLeft />
              </div>
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  {selectedCategory.name}
                  <p className="text-lg text-gray-600">({filteredCreators.length} creators)</p>
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Search Input */}
              <div className="w-full min-w-[230px] bg-white">
                <CustomInput
                  placeholder="Search creators"
                  value={searchKeyword}
                  startIcon={<SearchIcon />}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>

              <div className="w-full min-w-[230px]">
                <SimpleSelect placeHolder="Sort by" options={sortByOptions} onChange={() => {}} />
              </div>

              {/* Filter Button */}
              <div className="relative">
                <CustomButton
                  text="Filters"
                  onClick={() => setShowFilterModal(true)}
                  startIcon={<Filter size={18} />}
                  className="btn-outline !h-10"
                />
              </div>
              <div className="w-full max-w-[200px]">
                <CustomButton
                  text="Start a new campaign"
                  onClick={handleOpenModal}
                  className="btn-primary !h-10"
                />
              </div>
            </div>
          </div>

          {filteredCreators.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-1">No creators yet</h4>
              <p className="text-gray-600">Browse the Discover feed to add creators.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredCreators.map((creator, index) => (
                <CreatorCard key={index} creator={creator} isShortlist={true} />
              ))}
            </div>
          )}
        </div>
      ) : (
        // Main discover view
        <div className="space-y-6">
          {/* Page Header */}
          <div className="border-b pb-2">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Discover Creators</h1>
              <div className="flex items-center gap-3">
                {/* Search Input */}
                <div className="w-full min-w-[230px] bg-white">
                  <CustomInput
                    placeholder="Search creators"
                    value={searchKeyword}
                    startIcon={<SearchIcon />}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                </div>

                <div className="w-full min-w-[230px]">
                  <SimpleSelect placeHolder="Sort by" options={sortByOptions} onChange={() => {}} />
                </div>

                {/* Filter Button */}
                <div className="relative">
                  <CustomButton
                    text="Filters"
                    onClick={() => setShowFilterModal(true)}
                    startIcon={<Filter size={18} />}
                    className="btn-outline !h-10"
                  />
                </div>
                <div className="w-full max-w-[200px]">
                  <CustomButton
                    text="Start a new campaign"
                    onClick={handleOpenModal}
                    className="btn-primary !h-10"
                  />
                </div>
              </div>
            </div>
            <p className="text-gray-600">Find the perfect creators for your campaigns</p>
          </div>

          {/* Active Filters Display */}
          {!selectedShortlist && (
            <div className="mb-6">
              {hasActiveFilters() && (
                <div className="border rounded-xl p-4 bg-white shadow-sm">
                  {/* Header Row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-700">Active Filters</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {/* Count total active filters */}
                        {filters.niches.length +
                          filters.platforms.length +
                          (filters.minFollowers ? 1 : 0) +
                          (filters.gender ? 1 : 0) +
                          (filters.ageRange ? 1 : 0) +
                          (filters.country ? 1 : 0) +
                          (filters.city ? 1 : 0) +
                          (filters.languages?.length || 0) +
                          (audienceFilters.audienceGender ? 1 : 0) +
                          audienceFilters.audienceAgeRanges.length +
                          audienceFilters.audienceCountries.length +
                          (audienceFilters.audienceCity ? 1 : 0)}
                      </span>
                    </div>
                    <button
                      onClick={clearAllFilters}
                      className="text-xs text-gray-500 hover:text-red-600 font-medium transition-colors"
                    >
                      Clear all filters
                    </button>
                  </div>

                  {/* Filters Content */}
                  <div className="flex gap-5">
                    {/* Creator Filters Section */}
                    {(filters.niches.length > 0 ||
                      filters.platforms.length > 0 ||
                      filters.minFollowers ||
                      filters.gender ||
                      filters.ageRange ||
                      filters.country ||
                      filters.city ||
                      filters.languages?.length > 0) && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                            Creator Filters
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {/* Niche Filters */}
                          {filters.niches.map((niche) => (
                            <span
                              key={niche}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full border border-blue-200 hover:bg-blue-200 transition-colors"
                            >
                              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                              {nicheOptions.find((n) => n.value === niche)?.label}
                              <button
                                onClick={() => handleNicheToggle(niche)}
                                className="ml-1 hover:text-blue-900 hover:bg-blue-300 rounded-full p-0.5 transition-colors"
                                title="Remove filter"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))}

                          {/* Platform Filters */}
                          {filters.platforms.map((platform) => (
                            <span
                              key={platform}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full border border-blue-200 hover:bg-blue-200 transition-colors"
                            >
                              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                              {platformOptions.find((p) => p.value === platform)?.label}
                              <button
                                onClick={() => handlePlatformToggle(platform)}
                                className="ml-1 hover:text-blue-900 hover:bg-blue-300 rounded-full p-0.5 transition-colors"
                                title="Remove filter"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))}

                          {/* Min Followers Filter */}
                          {filters.minFollowers && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full border border-blue-200 hover:bg-blue-200 transition-colors">
                              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                              {followerOptions.find((f) => f.value === filters.minFollowers)?.label}
                              + followers
                              <button
                                onClick={() => handleFollowerSelect(filters.minFollowers)}
                                className="ml-1 hover:text-blue-900 hover:bg-blue-300 rounded-full p-0.5 transition-colors"
                                title="Remove filter"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          )}

                          {/* Gender Filter */}
                          {filters.gender && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full border border-blue-200 hover:bg-blue-200 transition-colors">
                              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                              {genderOptions.find((g) => g.value === filters.gender)?.label}
                              <button
                                onClick={() => handleGenderSelect(filters.gender)}
                                className="ml-1 hover:text-blue-900 hover:bg-blue-300 rounded-full p-0.5 transition-colors"
                                title="Remove filter"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          )}

                          {/* Age Range Filter */}
                          {filters.ageRange && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full border border-blue-200 hover:bg-blue-200 transition-colors">
                              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                              Age {filters.ageRange}
                              <button
                                onClick={() => handleAgeSelect(filters.ageRange)}
                                className="ml-1 hover:text-blue-900 hover:bg-blue-300 rounded-full p-0.5 transition-colors"
                                title="Remove filter"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          )}

                          {/* Language Filters */}
                          {filters.languages?.map((language) => (
                            <span
                              key={language}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full border border-blue-200 hover:bg-blue-200 transition-colors"
                            >
                              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                              {languageOptions.find((l) => l.value === language)?.label}
                              <button
                                onClick={() => handleLanguageToggle(language)}
                                className="ml-1 hover:text-blue-900 hover:bg-blue-300 rounded-full p-0.5 transition-colors"
                                title="Remove filter"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))}

                          {/* Country Filter */}
                          {filters.country && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full border border-blue-200 hover:bg-blue-200 transition-colors">
                              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                              Country: {filters.country}
                              <button
                                onClick={() => setFilters((prev) => ({ ...prev, country: "" }))}
                                className="ml-1 hover:text-blue-900 hover:bg-blue-300 rounded-full p-0.5 transition-colors"
                                title="Remove filter"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          )}

                          {/* City Filter */}
                          {filters.city && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full border border-blue-200 hover:bg-blue-200 transition-colors">
                              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                              City: {filters.city}
                              <button
                                onClick={() => setFilters((prev) => ({ ...prev, city: "" }))}
                                className="ml-1 hover:text-blue-900 hover:bg-blue-300 rounded-full p-0.5 transition-colors"
                                title="Remove filter"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Audience Filters Section */}
                    {(audienceFilters.audienceGender ||
                      audienceFilters.audienceAgeRanges.length > 0 ||
                      audienceFilters.audienceCountries.length > 0 ||
                      audienceFilters.audienceCity) && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded-md border border-purple-100">
                            Audience Filters
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {/* Audience Gender Filter */}
                          {audienceFilters.audienceGender && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-800 text-xs font-medium rounded-full border border-purple-200 hover:bg-purple-200 transition-colors">
                              <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                              {
                                audienceGenderOptions.find(
                                  (g) => g.value === audienceFilters.audienceGender
                                )?.label
                              }
                              <button
                                onClick={() =>
                                  handleAudienceGenderSelect(audienceFilters.audienceGender)
                                }
                                className="ml-1 hover:text-purple-900 hover:bg-purple-300 rounded-full p-0.5 transition-colors"
                                title="Remove filter"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          )}

                          {/* Audience Age Range Filters */}
                          {audienceFilters.audienceAgeRanges.map((age) => (
                            <span
                              key={age}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-800 text-xs font-medium rounded-full border border-purple-200 hover:bg-purple-200 transition-colors"
                            >
                              <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                              Age {audienceAgeOptions.find((a) => a.value === age)?.label}
                              <button
                                onClick={() => handleAudienceAgeToggle(age)}
                                className="ml-1 hover:text-purple-900 hover:bg-purple-300 rounded-full p-0.5 transition-colors"
                                title="Remove filter"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))}

                          {/* Audience Country Filters */}
                          {audienceFilters.audienceCountries.map((country) => (
                            <span
                              key={country}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-800 text-xs font-medium rounded-full border border-purple-200 hover:bg-purple-200 transition-colors"
                            >
                              <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                              {countryOptions.find((c) => c.value === country)?.label}
                              <button
                                onClick={() => handleAudienceCountryToggle(country)}
                                className="ml-1 hover:text-purple-900 hover:bg-purple-300 rounded-full p-0.5 transition-colors"
                                title="Remove filter"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))}

                          {/* Audience City Filter */}
                          {audienceFilters.audienceCity && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-800 text-xs font-medium rounded-full border border-purple-200 hover:bg-purple-200 transition-colors">
                              <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                              Audience City: {audienceFilters.audienceCity}
                              <button
                                onClick={() =>
                                  setAudienceFilters((prev) => ({ ...prev, audienceCity: "" }))
                                }
                                className="ml-1 hover:text-purple-900 hover:bg-purple-300 rounded-full p-0.5 transition-colors"
                                title="Remove filter"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Category Sections */}
          {mockNicheCategories.map((category) => (
            <div key={category.id} className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold text-gray-900">{category.name}</h4>
                <button
                  onClick={() => handleSeeMoreClick(category)}
                  className="flex items-center space-x-1 text-primary hover:text-indigo-800 text-sm font-medium"
                >
                  <span>See More</span>
                  <ChevronRight size={14} />
                </button>
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

      {/* Filter Modal */}
      <Modal
        title="Filter Creators"
        show={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        size="lg"
      >
        <div className="space-y-6">
          {/* Filter Type Toggle */}
          <div className="flex items-center justify-center">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => setFilterType("creator")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filterType === "creator"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Creator Filters
              </button>
              <button
                onClick={() => setFilterType("audience")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filterType === "audience"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Audience Filters
              </button>
            </div>
          </div>

          {/* Creator Filters */}
          {filterType === "creator" && (
            <div className="space-y-6">
              {/* Niche Categories */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Niche Categories</h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
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
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
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
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
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
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {genderOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleGenderSelect(option.value)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
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
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {ageOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleAgeSelect(option.value)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
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

                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2">Language</h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {languageOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleLanguageToggle(option.value)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          filters.languages?.includes(option.value)
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
          )}

          {/* Audience Filters */}
          {filterType === "audience" && (
            <div className="space-y-6">
              {/* Audience Gender */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Audience Gender</h4>
                <p className="text-xs text-gray-600 mb-3">
                  Select the primary gender of the creator's audience
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {audienceGenderOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAudienceGenderSelect(option.value)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        audienceFilters.audienceGender === option.value
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Top Audience Age Ranges */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Top Audience Age Ranges</h4>
                <p className="text-xs text-gray-600 mb-3">
                  Select multiple age ranges that make up the creator's primary audience
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {audienceAgeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAudienceAgeToggle(option.value)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        audienceFilters.audienceAgeRanges.includes(option.value)
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Top Audience Country */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Top Audience Country</h4>
                <p className="text-xs text-gray-600 mb-3">
                  Select countries where the creator's audience is located
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {countryOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAudienceCountryToggle(option.value)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        audienceFilters.audienceCountries.includes(option.value)
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Top Audience City */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Top Audience City</h4>
                <p className="text-xs text-gray-600 mb-3">
                  Useful for location-specific businesses like restaurants or hotels
                </p>
                <CustomInput
                  placeholder="Enter city (e.g., New York, Los Angeles)"
                  value={audienceFilters.audienceCity}
                  onChange={(e) =>
                    setAudienceFilters((prev) => ({ ...prev, audienceCity: e.target.value }))
                  }
                />
              </div>
            </div>
          )}
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
            <CustomButton
              onClick={() => {
                // Apply filters logic here
                setShowFilterModal(false);
              }}
              text="Apply Filters"
              className="btn-primary"
            />
          </div>
        </div>
      </Modal>

      {/* Invite Modal */}
      <InviteModal />
      <CampaignCreationWizard open={open} close={handleCloseModal} />
    </div>
  );
}

export default DiscoverCreators;
