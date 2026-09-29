import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  discoverCreators,
} from "@/provider/features/users/users.slice";
import { BRAND_CAMPAIGN_TAB } from "@/common/constants/campaign.constant";
import {
  DISCOVER_MIN_SEARCH_LENGTH,
  DISCOVER_PAGE_LIMIT,
  DISCOVER_PREFETCH_ROWS,
  DISCOVER_SEARCH_DEBOUNCE_MS,
} from "@/common/constants/discover.constant";
import {
  DISCOVER_CREATORS_DEFAULT_SORT_BY,
} from "@/common/constants/options.constant";
import {
  groupCreatorsByNiche,
  mapDiscoverCardToCreator,
} from "@/common/utils/discover-creators.util";
import { buildCreateCampaignPath } from "@/common/utils/campaign.utils";

export default function useDiscoverCreators() {
  const scrollRefs = useRef({});
  const discoverFetchCompletedOnceRef = useRef(false);
  const discoverHadPendingRef = useRef(false);
  const prefetchGuardRef = useRef(false);
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
  const nextCursorRef = useRef(null);
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
  const isDiscoverRefetching = loading && discoverFetchCompletedOnceRef.current && !isLoadingMore;

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
    if (selectedCategory?.nicheKey || selectedCategory?.name) {
      const categoryNiche =
        selectedCategory.nicheKey ||
        selectedCategory.name.toLowerCase().replace("top in ", "").trim();
      params.niches = categoryNiche;
    }

    return params;
  }, [filters, audienceFilters, debouncedSearchKeyword, selectedSort, selectedCategory]);

  const fetchCreators = useCallback(
    async (params = {}, options = {}) => {
      const { append = false, cursor = null } = options;
      const requestedPage = Number(params.page) > 0 ? Number(params.page) : 1;
      const creatorParams = {
        ...params,
        page: requestedPage,
        limit: DISCOVER_PAGE_LIMIT,
        ...(cursor ? { cursor } : {}),
      };
      const result = await dispatch(discoverCreators(creatorParams));
      if (!discoverCreators.fulfilled.match(result)) return;

      const payload = result.payload || {};
      const items = Array.isArray(payload.items)
        ? payload.items
        : Array.isArray(payload.users)
          ? payload.users
          : [];
      const mappedCreators = items.map((item) =>
        item?.mini_profile_pictures || item?.platforms
          ? mapDiscoverCardToCreator(item)
          : mapDiscoverCardToCreator({
              ...item,
              mini_profile_pictures: item?.creator_profile?.mini_profile_pictures,
              categories: item?.creator_profile?.categories,
              profile_photo_url: item?.creator_profile?.profile_photo_url,
              bio: item?.creator_profile?.bio,
              creator_type: item?.creator_profile?.creator_type,
              media_kit_url: item?.creator_profile?.media_kit_url,
              total_followers: item?.creator_profile?.total_followers,
              rating: item?.creator_profile?.rating,
              platforms: [],
            })
      );

      const nextCursor = payload.nextCursor ?? null;
      nextCursorRef.current = nextCursor;
      const totalHint = Number(payload.totalHint ?? payload.total);
      if (Number.isFinite(totalHint) && totalHint > 0) {
        setTotalCreatorsCount(totalHint);
      }

      queryParamsRef.current = { ...params, page: undefined };
      currentPageRef.current = requestedPage;
      prefetchGuardRef.current = false;

      setCreators((prevCreators) => {
        const nextCreators = append
          ? [...prevCreators, ...mappedCreators].filter(
              (creator, index, arr) => index === arr.findIndex((item) => item.id === creator.id)
            )
          : mappedCreators;
        const resolvedTotal =
          Number.isFinite(totalHint) && totalHint > 0
            ? totalHint
            : Math.max(
                nextCreators.length + (nextCursor || mappedCreators.length >= DISCOVER_PAGE_LIMIT ? DISCOVER_PAGE_LIMIT : 0),
                nextCreators.length
              );
        setHasMoreCreators(
          Boolean(nextCursor) || nextCreators.length < resolvedTotal
        );
        setNicheCategories(groupCreatorsByNiche(nextCreators));
        if (!Number.isFinite(totalHint) || totalHint <= 0) {
          setTotalCreatorsCount(resolvedTotal);
        }
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
    const categoryNiche =
      category.nicheKey || category.name.toLowerCase().replace("top in ", "").trim();
    setSelectedCategory({ ...category, nicheKey: categoryNiche });
    setFilteredCreators(category.creators || []);
    nextCursorRef.current = null;
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
      {
        ...queryParamsRef.current,
        page: currentPageRef.current + 1,
      },
      { append: true, cursor: nextCursorRef.current || undefined }
    );
    setIsLoadingMore(false);
  }, [loading, isLoadingMore, hasMoreCreators, fetchCreators]);

  const handleGridRangeChanged = useCallback(
    (range, totalCount) => {
      if (!hasMoreCreators || isLoadingMore || loading || prefetchGuardRef.current) return;
      const remaining = totalCount - (range?.endIndex ?? 0);
      if (remaining <= DISCOVER_PREFETCH_ROWS) {
        prefetchGuardRef.current = true;
        handleLoadMore();
      }
    },
    [hasMoreCreators, isLoadingMore, loading, handleLoadMore]
  );

  useEffect(() => {
    if (!isReduxReady || showFilterModal) return;

    nextCursorRef.current = null;
    currentPageRef.current = 1;
    fetchCreators({ ...buildQueryParams(), page: 1 });
  }, [
    isReduxReady,
    showFilterModal,
    filters,
    audienceFilters,
    debouncedSearchKeyword,
    selectedSort,
    selectedCategory,
    fetchCreators,
    buildQueryParams,
  ]);

  useEffect(() => {
    if (!selectedCategory) return;
    setFilteredCreators(creators);
  }, [creators, selectedCategory]);

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
    handleGridRangeChanged,
    resetSearch,
  };
}
