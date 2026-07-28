import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { discoverCreators } from "@/provider/features/users/users.slice";
import ROLES from "@/common/constants/role.constant";
import { BRAND_CAMPAIGN_TAB } from "@/common/constants/campaign.constant";
import {
  DISCOVER_MIN_SEARCH_LENGTH,
  DISCOVER_PAGE_LIMIT,
  DISCOVER_SEARCH_DEBOUNCE_MS,
} from "@/common/constants/discover.constant";
import { DISCOVER_CREATORS_DEFAULT_SORT_BY } from "@/common/constants/options.constant";
import {
  groupCreatorsByNiche,
  mapUserToCreator,
} from "@/common/utils/discover-creators.util";
import { buildCreateCampaignPath } from "@/common/utils/campaign.utils";

export default function useDiscoverCreators() {
  const scrollRefs = useRef({});
  const discoverFetchCompletedOnceRef = useRef(false);
  const discoverHadPendingRef = useRef(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const discoverCreatorsState = useSelector((state) => state.users?.discoverCreators);

  const [creators, setCreators] = useState([]);
  const [nicheCategories, setNicheCategories] = useState([]);

  const [filters, setFilters] = useState({
    platforms: [],
    minFollowers: "",
    minFollowersTo: "",
    countries: [],
    city: "",
    state: "",
    state_short: "",
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
  const [selectedSort, setSelectedSort] = useState(DISCOVER_CREATORS_DEFAULT_SORT_BY);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredCreators, setFilteredCreators] = useState([]);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterType, setFilterType] = useState("creator");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreCreators, setHasMoreCreators] = useState(false);
  const [totalCreatorsCount, setTotalCreatorsCount] = useState(0);
  const queryParamsRef = useRef({});
  const currentPageRef = useRef(1);

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
      filters.minFollowersTo ||
      filters.gender ||
      filters.ageRange ||
      (Array.isArray(filters.countries) && filters.countries.length > 0) ||
      filters.city ||
      filters.state ||
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
    if (filters.state) params.state = filters.state;
    if (filters.state_short) params.stateShort = filters.state_short;
    if (filters.languages?.length > 0) params.languages = filters.languages.join(",");
    if (filters.minFollowers) params.minFollowers = Number(filters.minFollowers);
    if (filters.minFollowersTo) params.minFollowersTo = Number(filters.minFollowersTo);
    if (filters.gender) {
      const normalizedGender = String(filters.gender).toLowerCase();
      if (normalizedGender === "female") {
        params.gender = "mostly-female";
      } else if (normalizedGender === "male") {
        params.gender = "mostly-male";
      } else {
        params.gender = normalizedGender;
      }
    }
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
    async (params = {}, options = {}) => {
      const { append = false } = options;
      const requestedPage = Number(params.page) > 0 ? Number(params.page) : 1;
      const creatorParams = {
        ...params,
        page: requestedPage,
        limit: DISCOVER_PAGE_LIMIT,
        role: ROLES.CREATOR,
      };
      const result = await dispatch(discoverCreators(creatorParams));
      if (!discoverCreators.fulfilled.match(result)) return;

      const users = Array.isArray(result.payload?.users) ? result.payload.users : [];
      const mappedCreators = users.map(mapUserToCreator);
      const totalCount = Number(result.payload?.total) || 0;
      setTotalCreatorsCount(totalCount);

      queryParamsRef.current = { ...params, page: undefined };
      currentPageRef.current = requestedPage;

      setCreators((prevCreators) => {
        const nextCreators = append
          ? [...prevCreators, ...mappedCreators].filter(
              (creator, index, arr) => index === arr.findIndex((item) => item.id === creator.id)
            )
          : mappedCreators;
        setHasMoreCreators(nextCreators.length < totalCount);
        setNicheCategories(groupCreatorsByNiche(nextCreators));
        return nextCreators;
      });
    },
    [dispatch]
  );

  const resetSearch = useCallback(() => {
    setSearchInput("");
    setDebouncedSearchKeyword("");
    setSelectedSort(DISCOVER_CREATORS_DEFAULT_SORT_BY);
    setFilters({
      platforms: [],
      minFollowers: "",
      minFollowersTo: "",
      countries: [],
      city: "",
      state: "",
      state_short: "",
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

  const handleFollowerRangeChange = useCallback((field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
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
      minFollowersTo: "",
      countries: [],
      city: "",
      state: "",
      state_short: "",
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
    setSelectedSort(DISCOVER_CREATORS_DEFAULT_SORT_BY);
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
        trimmed.length >= DISCOVER_MIN_SEARCH_LENGTH ? trimmed : ""
      );
    }, DISCOVER_SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const handleApplyFilters = useCallback(() => {
    setShowFilterModal(false);
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (loading || isLoadingMore || !hasMoreCreators) return;
    setIsLoadingMore(true);
    await fetchCreators(
      { ...queryParamsRef.current, page: currentPageRef.current + 1 },
      { append: true }
    );
    setIsLoadingMore(false);
  }, [loading, isLoadingMore, hasMoreCreators, fetchCreators]);

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
      fetchCreators(buildQueryParams());
    }
  }, [
    isReduxReady,
    showFilterModal,
    selectedSort,
    debouncedSearchKeyword,
    fetchCreators,
    buildQueryParams,
  ]);

  useEffect(() => {
    if (!isReduxReady || showFilterModal) return;
    const q = debouncedSearchKeyword.trim();
    if (q.length < DISCOVER_MIN_SEARCH_LENGTH) return;
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

  const handleNewCampaignClick = useCallback(() => {
    router.push(buildCreateCampaignPath({ returnTab: BRAND_CAMPAIGN_TAB.DISCOVER }));
  }, [router]);

  return {
    scrollRefs,
    creators,
    nicheCategories,
    loading,
    isDiscoverInitialLoading,
    isDiscoverRefetching,
    isLoadingMore,
    hasMoreCreators,
    totalCreatorsCount,
    filters,
    setFilters,
    audienceFilters,
    setAudienceFilters,
    searchKeyword: searchInput,
    selectedSort,
    setSelectedSort,
    selectedCategory,
    filteredCreators,
    showInviteModal,
    setShowInviteModal,
    selectedCreator,
    showFilterModal,
    setShowFilterModal,
    filterType,
    setFilterType,
    hasActiveFilters,
    handleNewCampaignClick,
    handleNicheToggle,
    handlePlatformToggle,
    handleFollowerRangeChange,
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
    handleLoadMore,
  };
}
