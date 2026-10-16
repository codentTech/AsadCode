import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  archiveContentLibraryAsset,
  clearContentLibraryAsset,
  downloadContentLibraryAsset,
  fetchContentLibraryAsset,
  fetchContentLibraryAssets,
  fetchContentLibraryFilterOptions,
  selectContentLibraryArchive,
  selectContentLibraryAsset,
  selectContentLibraryDownload,
  selectContentLibraryFilterOptions,
  selectContentLibraryList,
  selectContentLibraryUnarchive,
  unarchiveContentLibraryAsset,
} from "@/provider/features/content-library/content-library.slice";
import { CONTENT_LIBRARY_PAGE_LIMIT } from "@/common/constants/content-library.constant";

const DEFAULT_FILTERS = {
  search: "",
  creatorId: "",
  campaignId: "",
  productName: "",
  contentType: "",
  approvedFrom: "",
  approvedTo: "",
  rightsStatus: "",
  libraryStatus: "active",
  sort: "newest_approved",
};

export default function useContentLibrary() {
  const dispatch = useDispatch();
  const listState = useSelector(selectContentLibraryList);
  const filterOptionsState = useSelector(selectContentLibraryFilterOptions);
  const assetState = useSelector(selectContentLibraryAsset);
  const archiveState = useSelector(selectContentLibraryArchive);
  const unarchiveState = useSelector(selectContentLibraryUnarchive);
  const downloadState = useSelector(selectContentLibraryDownload);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [assets, setAssets] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const listQuery = useMemo(() => {
    const params = {
      page,
      limit: CONTENT_LIBRARY_PAGE_LIMIT,
      sort: filters.sort || "newest_approved",
      libraryStatus: filters.libraryStatus || "active",
    };
    if (filters.search.trim()) params.search = filters.search.trim();
    if (filters.creatorId) params.creatorId = filters.creatorId;
    if (filters.campaignId) params.campaignId = filters.campaignId;
    if (filters.productName) params.productName = filters.productName;
    if (filters.contentType) params.contentType = filters.contentType;
    if (filters.approvedFrom) params.approvedFrom = filters.approvedFrom;
    if (filters.approvedTo) params.approvedTo = filters.approvedTo;
    if (filters.rightsStatus) params.rightsStatus = filters.rightsStatus;
    return params;
  }, [filters, page]);

  useEffect(() => {
    dispatch(fetchContentLibraryFilterOptions());
  }, [dispatch]);

  useEffect(() => {
    if (listQuery.page === 1) {
      setAssets([]);
    }
    dispatch(fetchContentLibraryAssets(listQuery));
  }, [dispatch, listQuery]);

  useEffect(() => {
    if (listState.isLoading) return;
    const data = listState.data;
    if (!data?.items) return;
    if (page === 1) {
      setAssets(data.items);
      return;
    }
    setAssets((prev) => {
      const existingIds = new Set(prev.map((item) => item.id));
      const next = data.items.filter((item) => !existingIds.has(item.id));
      return [...prev, ...next];
    });
  }, [listState.data, listState.isLoading, page]);

  useEffect(() => {
    if (!assets.length) {
      if (selectedAssetId) setSelectedAssetId(null);
      return;
    }
    const stillVisible = assets.some((asset) => asset.id === selectedAssetId);
    if (!stillVisible) {
      setSelectedAssetId(assets[0].id);
    }
  }, [assets, selectedAssetId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setFilters((prev) => {
        if (prev.search === searchInput) return prev;
        setPage(1);
        return { ...prev, search: searchInput };
      });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (!selectedAssetId) {
      dispatch(clearContentLibraryAsset());
      return;
    }
    dispatch(fetchContentLibraryAsset(selectedAssetId));
  }, [dispatch, selectedAssetId]);

  const lastArchiveHandledId = useRef(null);
  const lastUnarchiveHandledId = useRef(null);

  const refreshList = useCallback(() => {
    setAssets([]);
    setSelectedAssetId(null);
    setIsFullscreenOpen(false);
    if (page === 1) {
      dispatch(fetchContentLibraryAssets({ ...listQuery, page: 1 }));
      return;
    }
    setPage(1);
  }, [dispatch, listQuery, page]);

  useEffect(() => {
    const id = archiveState.data?.id;
    if (!archiveState.isSuccess || !id || lastArchiveHandledId.current === id) {
      return;
    }
    lastArchiveHandledId.current = id;
    refreshList();
  }, [archiveState.isSuccess, archiveState.data, refreshList]);

  useEffect(() => {
    const id = unarchiveState.data?.id;
    if (!unarchiveState.isSuccess || !id || lastUnarchiveHandledId.current === id) {
      return;
    }
    lastUnarchiveHandledId.current = id;
    refreshList();
  }, [unarchiveState.isSuccess, unarchiveState.data, refreshList]);

  const total = listState.data?.total ?? 0;
  const hasMore = assets.length < total;
  const isGridLoading =
    (listState.isLoading && page === 1) ||
    archiveState.isLoading ||
    unarchiveState.isLoading;
  const isLoadingMore = listState.isLoading && page > 1;

  const selectedAsset = assetState.data;
  const hasActiveFilters = useMemo(() => {
    return Boolean(
      filters.creatorId ||
        filters.campaignId ||
        filters.productName ||
        filters.contentType ||
        filters.approvedFrom ||
        filters.approvedTo ||
        filters.rightsStatus ||
        filters.libraryStatus !== "active" ||
        filters.search.trim()
    );
  }, [filters]);

  const openFilters = useCallback(() => {
    setDraftFilters(filters);
    setIsFilterOpen(true);
  }, [filters]);

  const closeFilters = useCallback(() => {
    setIsFilterOpen(false);
  }, []);

  const applyFilters = useCallback(() => {
    setFilters((prev) => ({
      ...draftFilters,
      search: prev.search,
      sort: prev.sort,
    }));
    setPage(1);
    setIsFilterOpen(false);
  }, [draftFilters]);

  const clearFilters = useCallback(() => {
    setDraftFilters((prev) => ({
      ...DEFAULT_FILTERS,
      search: prev.search,
      sort: prev.sort,
    }));
    setFilters((prev) => ({
      ...DEFAULT_FILTERS,
      search: prev.search,
      sort: prev.sort,
    }));
    setPage(1);
  }, []);

  const onSortChange = useCallback((option) => {
    const value = typeof option === "object" ? option?.value : option;
    setFilters((prev) => ({ ...prev, sort: value || "newest_approved" }));
    setPage(1);
  }, []);

  const onDraftFilterChange = useCallback((key, optionOrValue) => {
    const value =
      typeof optionOrValue === "object" && optionOrValue !== null
        ? (optionOrValue.value ?? "")
        : optionOrValue;
    setDraftFilters((prev) => ({ ...prev, [key]: value ?? "" }));
  }, []);

  const loadMore = useCallback(() => {
    if (!hasMore || listState.isLoading) return;
    setPage((prev) => prev + 1);
  }, [hasMore, listState.isLoading]);

  const selectAsset = useCallback((assetId) => {
    setSelectedAssetId(assetId);
    setIsFilterOpen(false);
  }, []);

  const closeDetail = useCallback(() => {
    setSelectedAssetId(null);
    setIsFullscreenOpen(false);
  }, []);

  const openFullscreen = useCallback(() => {
    setIsFullscreenOpen(true);
  }, []);

  const closeFullscreen = useCallback(() => {
    setIsFullscreenOpen(false);
  }, []);

  const downloadAsset = useCallback(
    (asset) => {
      if (!asset?.id) return;
      dispatch(
        downloadContentLibraryAsset({
          id: asset.id,
          filename: asset.original_filename,
        })
      );
    },
    [dispatch]
  );

  const archiveAsset = useCallback(() => {
    if (!selectedAssetId) return;
    dispatch(archiveContentLibraryAsset(selectedAssetId));
  }, [dispatch, selectedAssetId]);

  const unarchiveAsset = useCallback(() => {
    if (!selectedAssetId) return;
    dispatch(unarchiveContentLibraryAsset(selectedAssetId));
  }, [dispatch, selectedAssetId]);

  return {
    assets,
    total,
    filters,
    draftFilters,
    searchInput,
    setSearchInput,
    isFilterOpen,
    selectedAssetId,
    selectedAsset,
    isFullscreenOpen,
    isGridLoading,
    isLoadingMore,
    hasMore,
    hasActiveFilters,
    isDetailLoading: assetState.isLoading,
    isDownloading: downloadState.isLoading,
    isArchiving: archiveState.isLoading || unarchiveState.isLoading,
    filterOptions: filterOptionsState.data,
    openFilters,
    closeFilters,
    applyFilters,
    clearFilters,
    onSortChange,
    onDraftFilterChange,
    loadMore,
    selectAsset,
    closeDetail,
    openFullscreen,
    closeFullscreen,
    downloadAsset,
    archiveAsset,
    unarchiveAsset,
  };
}
