import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { discoverCreators } from "@/provider/features/users/users.slice";
import ROLES from "@/common/constants/role.constant";

// Helper Functions
const mapUserToCreator = (user) => {
  const creatorProfile = user?.creator_profile || {};
  const socialAccounts = user?.social_accounts || [];

  const platforms = socialAccounts.map((s) => s.platform).filter(Boolean);
  const platformStats = socialAccounts.reduce((acc, s) => {
    const followers = s.profile_data?.followers || s.profile_data?.followers_count || 0;
    if (s.platform) acc[s.platform] = { followers };
    return acc;
  }, {});

  const name = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "Creator";
  const portfolioImages = Array.isArray(creatorProfile?.mini_profile_pictures)
    ? creatorProfile.mini_profile_pictures
    : [];

  let age = "";
  if (user?.date_of_birth) {
    const birthDate = new Date(user.date_of_birth);
    const today = new Date();
    const ageInYears = today.getFullYear() - birthDate.getFullYear();
    age = `${ageInYears}`;
  }

  const location =
    [user?.city, user?.country].filter(Boolean).join(", ") || "Location not specified";

  return {
    id: user?.id,
    name,
    profileImage: creatorProfile?.profile_photo_url || "/assets/images/account.png",
    portfolioImages,
    rating: 4.5,
    reviewCount: 0,
    age,
    location,
    niches: creatorProfile?.categories || [],
    tagline: creatorProfile?.bio || "Creating authentic content that resonates with audiences",
    followers: Object.values(platformStats).reduce((sum, stat) => sum + (stat.followers || 0), 0),
    platforms,
    platformStats,
  };
};

const groupCreatorsByNiche = (creators) => {
  const nicheGroups = {};

  creators.forEach((creator) => {
    if (creator.niches && Array.isArray(creator.niches) && creator.niches.length > 0) {
      const primaryNiche = creator.niches[0];
      if (!nicheGroups[primaryNiche]) {
        nicheGroups[primaryNiche] = [];
      }
      nicheGroups[primaryNiche].push(creator);
    }
  });

  return Object.entries(nicheGroups).map(([niche, creatorsList]) => ({
    id: niche.toLowerCase().replace(/\s+/g, "-"),
    name: `Top in ${niche.charAt(0).toUpperCase() + niche.slice(1)}`,
    creators: creatorsList.sort((a, b) => b.followers - a.followers).slice(0, 10),
  }));
};

export default function useDiscoverCreators() {
  // Refs
  const scrollRefs = useRef({});

  // Redux
  const dispatch = useDispatch();
  const discoverCreatorsState = useSelector((state) => state.users?.discoverCreators);

  // State
  const [overflowStates, setOverflowStates] = useState({});
  const [creators, setCreators] = useState([]);
  const [nicheCategories, setNicheCategories] = useState([]);
  const [total, setTotal] = useState(0);

  // Filter states moved from main component
  const [filters, setFilters] = useState({
    platforms: [],
    minFollowers: "",
    country: "",
    city: "",
    gender: "",
    ageRange: "",
    niches: [],
    languages: [],
  });

  const [audienceFilters, setAudienceFilters] = useState({
    audienceGender: "",
    audienceAgeRanges: [],
    audienceCountries: [],
    audienceCountryCode: "",
    audienceCity: "",
    audienceCityCountryCode: "",
  });

  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredCreators, setFilteredCreators] = useState([]);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Modal states moved from main component
  const [open, setOpen] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterType, setFilterType] = useState("creator");

  // Computed Values
  const safeData = discoverCreatorsState?.data || {};
  const loading = discoverCreatorsState?.isLoading || false;

  // Ensure error is always a string or null, never an object
  let error = null;
  if (discoverCreatorsState?.isError) {
    const errorMessage = discoverCreatorsState?.message;
    if (typeof errorMessage === "string") {
      error = errorMessage;
    } else if (errorMessage && typeof errorMessage === "object") {
      error = errorMessage.message || "An error occurred";
    } else {
      error = "An error occurred";
    }
  }

  const message = discoverCreatorsState?.message || "";
  const isReduxReady = !!discoverCreatorsState;

  // Computed functions moved from main component
  const hasActiveFilters = useCallback(() => {
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
  }, [filters, audienceFilters]);

  const buildQueryParams = useCallback(() => {
    const params = {};

    if (searchKeyword) params.search = searchKeyword;
    if (selectedSort) params.sortBy = selectedSort;
    if (filters.niches.length > 0) params.niches = filters.niches.join(",");
    if (filters.platforms.length > 0) params.platforms = filters.platforms.join(",");
    if (filters.country) params.country = filters.country;
    if (filters.city) params.city = filters.city;
    if (filters.languages?.length > 0) params.languages = filters.languages.join(",");
    if (filters.minFollowers) params.minFollowers = Number(filters.minFollowers);
    if (filters.gender) params.gender = filters.gender;
    if (filters.ageRange) params.ageRange = filters.ageRange;
    if (audienceFilters.audienceGender) params.audienceGender = audienceFilters.audienceGender;
    if (audienceFilters.audienceAgeRanges.length > 0)
      params.audienceAgeRanges = audienceFilters.audienceAgeRanges.join(",");
    if (audienceFilters.audienceCountries.length > 0)
      params.audienceCountries = audienceFilters.audienceCountries.join(",");
    if (audienceFilters.audienceCity) params.audienceCity = audienceFilters.audienceCity;
    if (selectedCategory?.name) {
      const categoryNiche = selectedCategory.name.toLowerCase().replace("top in ", "").trim();
      params.niches = categoryNiche;
    }

    return params;
  }, [filters, audienceFilters, searchKeyword, selectedSort, selectedCategory]);

  // Callbacks
  const fetchCreators = useCallback(
    async (params = {}) => {
      const creatorParams = {
        ...params,
        role: ROLES.CREATOR,
      };
      await dispatch(discoverCreators(creatorParams));
    },
    [dispatch]
  );

  const resetSearch = useCallback(() => {
    // Reset all search and filter states
    setSearchKeyword("");
    setSelectedSort("");
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
      audienceCountryCode: "",
      audienceCity: "",
      audienceCityCountryCode: "",
    });
    // Don't reset hasInitialized - we want to keep track that we've initialized
    // The search clear effect will handle fetching all creators
  }, []);

  const checkAllOverflows = useCallback(() => {
    const newStates = {};
    nicheCategories.forEach((category) => {
      const el = scrollRefs.current[category.id];
      if (el) {
        newStates[category.id] = el.scrollWidth > el.clientWidth;
      }
    });
    setOverflowStates(newStates);
  }, [nicheCategories]);

  // Handler functions moved from main component
  const handleNicheToggle = useCallback((niche) => {
    setFilters((prev) => ({
      ...prev,
      niches: prev.niches.includes(niche)
        ? prev.niches.filter((n) => n !== niche)
        : [...prev.niches, niche],
    }));
  }, []);

  const handlePlatformToggle = useCallback((platform) => {
    setFilters((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  }, []);

  const handleFollowerSelect = useCallback((follower) => {
    setFilters((prev) => ({
      ...prev,
      minFollowers: prev.minFollowers === follower ? "" : follower,
    }));
  }, []);

  const handleGenderSelect = useCallback((gender) => {
    setFilters((prev) => ({
      ...prev,
      gender: prev.gender === gender ? "" : gender,
    }));
  }, []);

  const handleAgeSelect = useCallback((age) => {
    setFilters((prev) => ({
      ...prev,
      ageRange: prev.ageRange === age ? "" : age,
    }));
  }, []);

  const handleLanguageToggle = useCallback((language) => {
    setFilters((prev) => ({
      ...prev,
      languages: prev.languages?.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...(prev.languages || []), language],
    }));
  }, []);

  const handleAudienceGenderSelect = useCallback((gender) => {
    setAudienceFilters((prev) => ({
      ...prev,
      audienceGender: prev.audienceGender === gender ? "" : gender,
    }));
  }, []);

  const handleAudienceAgeToggle = useCallback((age) => {
    setAudienceFilters((prev) => ({
      ...prev,
      audienceAgeRanges: prev.audienceAgeRanges.includes(age)
        ? prev.audienceAgeRanges.filter((a) => a !== age)
        : [...prev.audienceAgeRanges, age],
    }));
  }, []);

  const handleAudienceCountryToggle = useCallback((country) => {
    setAudienceFilters((prev) => ({
      ...prev,
      audienceCountries: prev.audienceCountries.includes(country)
        ? prev.audienceCountries.filter((c) => c !== country)
        : [...prev.audienceCountries, country],
    }));
  }, []);

  const handleSeeMoreClick = useCallback((category) => {
    const categoryNiche = category.name.toLowerCase().replace("top in ", "").trim();
    const creatorsInThisCategory = category.creators || [];
    setSelectedCategory(category);
    setFilteredCreators(creatorsInThisCategory);
  }, []);

  const handleBackToDiscover = useCallback((setSelectedShortlist) => {
    setSelectedCategory(null);
    setFilteredCreators([]);
    setSelectedShortlist(null);
    // Reset to show all creators when going back
    // The consolidated useEffect will handle the API call automatically
  }, []);

  const clearAllFilters = useCallback(() => {
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
      audienceCountryCode: "",
      audienceCity: "",
      audienceCityCountryCode: "",
    });
    setSearchKeyword("");
    setSelectedSort("");
    setSelectedCategory(null);
    setFilteredCreators([]);
    // Don't reset hasInitialized - we want to keep track that we've initialized
    // The search clear effect will handle fetching all creators
  }, []);

  const handleInviteClick = useCallback((creator, e) => {
    e.stopPropagation();
    setSelectedCreator(creator);
    setShowInviteModal(true);
  }, []);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchKeyword(value);
    // The consolidated useEffect will handle the API call
    // No need to manually trigger anything here
  }, []);

  const handleApplyFilters = useCallback(() => {
    // Close the modal first
    setShowFilterModal(false);

    // Apply filters immediately after modal closes
    // The useEffect will handle the actual API call
  }, []);

  // Effects
  useEffect(() => {
    if (isReduxReady && safeData && safeData.users && Array.isArray(safeData.users)) {
      const mappedCreators = safeData.users.map(mapUserToCreator);
      setCreators(mappedCreators);
      setTotal(safeData.total || 0);

      const groupedCategories = groupCreatorsByNiche(mappedCreators);
      setNicheCategories(groupedCategories);
    }
  }, [isReduxReady, safeData]);

  useEffect(() => {
    if (nicheCategories.length > 0) {
      setTimeout(() => {
        checkAllOverflows();
      }, 100);
    }
  }, [nicheCategories, checkAllOverflows]);

  // Initial load effect - only runs once when component mounts
  useEffect(() => {
    if (isReduxReady && !hasInitialized && !searchKeyword && !hasActiveFilters() && !selectedSort) {
      // Only fetch initial data if we don't have any data yet
      if (!safeData.users || safeData.users.length === 0) {
        fetchCreators({});
        setHasInitialized(true);
      }
    }
  }, [
    isReduxReady,
    hasInitialized,
    searchKeyword,
    hasActiveFilters,
    selectedSort,
    fetchCreators,
    safeData.users,
  ]);

  // Effect to handle when search is cleared - fetch all creators
  useEffect(() => {
    if (isReduxReady && hasInitialized && !searchKeyword && !hasActiveFilters() && !selectedSort) {
      // When search is cleared and no other filters are active, fetch all creators
      fetchCreators({});
    }
  }, [isReduxReady, hasInitialized, searchKeyword, hasActiveFilters, selectedSort, fetchCreators]);

  // Effect to handle filter changes (but not search or initial load)
  useEffect(() => {
    if (!isReduxReady || showFilterModal) return;

    // Only trigger when filters actually change and we're not searching
    if (hasActiveFilters() && !searchKeyword) {
      const filterParams = buildQueryParams();
      fetchCreators(filterParams);
    }
  }, [
    isReduxReady,
    showFilterModal,
    filters,
    audienceFilters,
    searchKeyword,
    fetchCreators,
    buildQueryParams,
    hasActiveFilters,
  ]);

  // Effect to handle sort changes (but not search)
  useEffect(() => {
    if (!isReduxReady || showFilterModal || searchKeyword) return;

    if (selectedSort) {
      fetchCreators({ sortBy: selectedSort });
    }
  }, [isReduxReady, showFilterModal, selectedSort, searchKeyword, fetchCreators]);

  // Debounced search effect to prevent rapid API calls while typing
  useEffect(() => {
    if (!isReduxReady) return;

    const timeoutId = setTimeout(() => {
      // Only trigger API call if search keyword has changed and we're not in filter modal
      if (searchKeyword && !showFilterModal) {
        const params = { search: searchKeyword };
        if (selectedSort) params.sortBy = selectedSort;
        fetchCreators(params);
      }
    }, 300); // 300ms delay for search

    return () => clearTimeout(timeoutId);
  }, [isReduxReady, searchKeyword, selectedSort, showFilterModal, fetchCreators]);

  useEffect(() => {
    checkAllOverflows();
    window.addEventListener("resize", checkAllOverflows);
    return () => window.removeEventListener("resize", checkAllOverflows);
  }, [checkAllOverflows]);

  // Effects moved from main component
  // Removed problematic useEffect that was causing filters to apply immediately
  // Filters now only apply when "Apply Filters" button is clicked

  return {
    // Data
    scrollRefs,
    overflowStates,
    creators,
    nicheCategories,
    loading,
    error: error ? message : null,
    total,
    isReduxReady,
    hasInitialized,

    // State
    filters,
    setFilters,
    audienceFilters,
    setAudienceFilters,
    searchKeyword,
    setSearchKeyword,
    selectedSort,
    setSelectedSort,
    selectedCategory,
    setSelectedCategory,
    filteredCreators,
    setFilteredCreators,

    // Modal states
    open,
    setOpen,
    showInviteModal,
    setShowInviteModal,
    selectedCreator,
    setSelectedCreator,
    showFilterModal,
    setShowFilterModal,
    filterType,
    setFilterType,

    // Functions
    fetchCreators,
    resetSearch,
    hasActiveFilters,
    buildQueryParams,

    // Handlers
    handleNicheToggle,
    handlePlatformToggle,
    handleFollowerSelect,
    handleGenderSelect,
    handleAgeSelect,
    handleLanguageToggle,
    handleAudienceGenderSelect,
    handleAudienceAgeToggle,
    handleAudienceCountryToggle,
    handleSeeMoreClick,
    handleBackToDiscover,
    clearAllFilters,
    handleInviteClick,
    handleSearchChange,
    handleApplyFilters,
  };
}
