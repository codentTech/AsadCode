import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { discoverCreators } from "@/provider/features/users/users.slice";
import ROLES from "@/common/constants/role.constant";

const mapUserToCreator = (user) => {
  const creatorProfile = user?.creator_profile || {};
  const socialAccounts = user?.social_accounts || [];

  const platforms = socialAccounts.map((s) => s.platform).filter(Boolean);
  const platformStats = socialAccounts.reduce((acc, s) => {
    const pd = s.profile_data || {};
    const followers =
      Number(pd.follower_count) ||
      Number(pd.subscriber_count) ||
      Number(pd.followers) ||
      Number(pd.followers_count) ||
      Number(pd.reputation?.follower_count) ||
      Number(pd.reputation?.subscriber_count) ||
      0;
    const username = pd.username ?? pd.handle ?? pd.platform_username ?? null;
    const profileUrl = pd.profile_url ?? pd.url ?? null;
    if (s.platform) {
      acc[s.platform] = { followers, username, profile_url: profileUrl };
    }
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
    ...user,
    creator_profile: creatorProfile,
    id: user?.id,
    name,
    profileImage: creatorProfile?.profile_photo_url || "/assets/images/account.png",
    portfolioImages,
    rating: 0,
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

const SEARCH_DEBOUNCE_MS = 500;
const MIN_SEARCH_LENGTH = 2;

export default function useDiscoverCreators() {
  const scrollRefs = useRef({});
  const discoverFetchCompletedOnceRef = useRef(false);
  const discoverHadPendingRef = useRef(false);
  const dispatch = useDispatch();
  const discoverCreatorsState = useSelector((state) => state.users?.discoverCreators);

  const [creators, setCreators] = useState([]);
  const [nicheCategories, setNicheCategories] = useState([]);

  const [filters, setFilters] = useState({
    platforms: [],
    minFollowers: "",
    countries: [],
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

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredCreators, setFilteredCreators] = useState([]);

  const [open, setOpen] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterType, setFilterType] = useState("creator");

  const safeData = discoverCreatorsState?.data || {};
  const loading = discoverCreatorsState?.isLoading || false;
  const isReduxReady = !!discoverCreatorsState;
  useEffect(() => {
    if (loading) {
      discoverHadPendingRef.current = true;
    }
    if (!loading && discoverHadPendingRef.current) {
      discoverFetchCompletedOnceRef.current = true;
    }
  }, [loading]);

  const isDiscoverInitialLoading = loading && !discoverFetchCompletedOnceRef.current;
  const isDiscoverRefetching = loading && discoverFetchCompletedOnceRef.current;

  const hasActiveFilters = useCallback(() => {
    return (
      filters.niches.length > 0 ||
      filters.platforms.length > 0 ||
      filters.minFollowers ||
      filters.gender ||
      filters.ageRange ||
      filters.country ||
      (Array.isArray(filters.countries) && filters.countries.length > 0) ||
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

    if (debouncedSearchKeyword) params.search = debouncedSearchKeyword;
    if (selectedSort) params.sortBy = selectedSort;
    if (filters.niches.length > 0) params.niches = filters.niches.join(",");
    if (filters.platforms.length > 0) params.platforms = filters.platforms.join(",");
    if (Array.isArray(filters.countries) && filters.countries.length > 0) {
      params.countries = filters.countries.join(",");
    }
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
  }, [filters, audienceFilters, debouncedSearchKeyword, selectedSort, selectedCategory]);

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
    setSearchInput("");
    setDebouncedSearchKeyword("");
    setSelectedSort("");
    setFilters({
      platforms: [],
      minFollowers: "",
      countries: [],
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
  }, []);

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
    setSearchInput("");
    setDebouncedSearchKeyword("");
    setSelectedSort("");
    setSelectedCategory(null);
    setFilteredCreators([]);
  }, []);

  const handleInviteClick = useCallback((creator, e) => {
    e.stopPropagation();
    setSelectedCreator(creator);
    setShowInviteModal(true);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchInput(e.target.value);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const trimmed = searchInput.trim();
      setDebouncedSearchKeyword(
        trimmed.length >= MIN_SEARCH_LENGTH ? trimmed : ""
      );
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const handleApplyFilters = useCallback(() => {
    setShowFilterModal(false);
  }, []);

  useEffect(() => {
    if (isReduxReady && safeData && safeData.users && Array.isArray(safeData.users)) {
      const mappedCreators = safeData.users.map(mapUserToCreator);
      setCreators(mappedCreators);
      const groupedCategories = groupCreatorsByNiche(mappedCreators);
      setNicheCategories(groupedCategories);
    }
  }, [isReduxReady, safeData]);

  useEffect(() => {
    if (!isReduxReady) return;
    if (debouncedSearchKeyword) return;
    if (hasActiveFilters()) return;
    if (selectedSort) return;
    fetchCreators({});
  }, [isReduxReady, debouncedSearchKeyword, hasActiveFilters, selectedSort, fetchCreators]);

  useEffect(() => {
    if (!isReduxReady || showFilterModal) return;

    if (hasActiveFilters() && !debouncedSearchKeyword) {
      const filterParams = buildQueryParams();
      fetchCreators(filterParams);
    }
  }, [
    isReduxReady,
    showFilterModal,
    filters,
    audienceFilters,
    debouncedSearchKeyword,
    fetchCreators,
    buildQueryParams,
    hasActiveFilters,
  ]);

  useEffect(() => {
    if (!isReduxReady || showFilterModal || debouncedSearchKeyword) return;

    if (selectedSort) {
      fetchCreators({ sortBy: selectedSort });
    }
  }, [isReduxReady, showFilterModal, selectedSort, debouncedSearchKeyword, fetchCreators]);

  useEffect(() => {
    if (!isReduxReady || showFilterModal) return;
    const q = debouncedSearchKeyword.trim();
    if (q.length < MIN_SEARCH_LENGTH) return;
    const params = { search: q };
    if (selectedSort) params.sortBy = selectedSort;
    fetchCreators(params);
  }, [
    isReduxReady,
    showFilterModal,
    debouncedSearchKeyword,
    selectedSort,
    fetchCreators,
  ]);

  return {
    scrollRefs,
    creators,
    nicheCategories,
    loading,
    isDiscoverInitialLoading,
    isDiscoverRefetching,
    filters,
    setFilters,
    audienceFilters,
    setAudienceFilters,
    searchKeyword: searchInput,
    selectedSort,
    setSelectedSort,
    selectedCategory,
    filteredCreators,
    open,
    setOpen,
    showInviteModal,
    setShowInviteModal,
    selectedCreator,
    showFilterModal,
    setShowFilterModal,
    filterType,
    setFilterType,
    hasActiveFilters,
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
