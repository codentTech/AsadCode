import { useCallback, useEffect, useMemo, useState } from "react";
import { BLOG_CATEGORY_FILTER_OPTIONS } from "@/common/constants/options.constant";
import { extractSimpleSelectValue } from "@/common/utils/generic.util";
import blogService from "@/provider/features/blog/blog.service";

export default function useBlogIndex() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const buildListParams = useCallback(() => {
    const params = {};
    const trimmed = typeof searchTerm === "string" ? searchTerm.trim() : "";
    if (trimmed) {
      params.search = trimmed;
    }
    if (categoryFilter) {
      params.category = categoryFilter;
    }
    return params;
  }, [searchTerm, categoryFilter]);

  const loadPosts = useCallback(() => {
    setIsLoading(true);
    blogService
      .getPublishedPosts(buildListParams())
      .then((response) => {
        setPosts(Array.isArray(response?.data) ? response.data : []);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [buildListParams]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadPosts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [loadPosts]);

  const handleSearchChange = useCallback((value) => {
    const next = typeof value === "string" ? value : value?.target?.value ?? "";
    setSearchTerm(next);
  }, []);

  const handleCategoryFilterChange = useCallback((option) => {
    const value = extractSimpleSelectValue(option);
    if (value === "ALL" || value == null || value === "") {
      setCategoryFilter(null);
      return;
    }
    setCategoryFilter(value);
  }, []);

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setCategoryFilter(null);
  }, []);

  const hasActiveFilters = useMemo(() => {
    const hasSearch = typeof searchTerm === "string" && searchTerm.trim() !== "";
    return hasSearch || categoryFilter != null;
  }, [searchTerm, categoryFilter]);

  return {
    posts,
    isLoading,
    searchTerm,
    categoryFilter,
    showFilters,
    hasActiveFilters,
    categoryFilterOptions: BLOG_CATEGORY_FILTER_OPTIONS,
    handleSearchChange,
    handleCategoryFilterChange,
    toggleFilters,
    handleClearFilters,
  };
}
