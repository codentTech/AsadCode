import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BLOG_CATEGORY_FILTER_OPTIONS,
  BLOG_CATEGORY_OPTIONS,
} from "@/common/constants/options.constant";
import { DEFAULT_PAGE_LIMIT } from "@/common/constants/genaric.constant";
import { formatBlogDate } from "@/common/utils/blog.utils";
import { getUploadedFileUrl } from "@/common/utils/common.utils";
import { extractSimpleSelectValue } from "@/common/utils/generic.util";
import { uploadSingleFile } from "@/provider/features/upload-file/upload-file.slice";
import {
  bulkDeleteBlogPosts,
  createBlogPost,
  deleteBlogPost,
  fetchAdminBlogPosts,
  resetBulkDeleteBlogPosts,
  resetCreateBlogPost,
  resetDeleteBlogPost,
  resetUpdateBlogPost,
  selectBulkDeleteBlogPosts,
  selectCreateBlogPost,
  selectDeleteBlogPost,
  selectFetchAdminBlogPosts,
  selectUpdateBlogPost,
  updateBlogPost,
} from "@/provider/features/blog/blog.slice";
import { Eye, ExternalLink, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

const emptyForm = {
  title: "",
  category: "",
  excerpt: "",
  body: "",
  cover_image_url: "",
};

const adminBlogColumns = [
  {
    key: "title",
    title: "Title",
    customRender: (row) => (
      <span className="line-clamp-2 font-medium text-gray-900">{row.title}</span>
    ),
  },
  {
    key: "category",
    title: "Category",
    customRender: (row) => <span className="text-gray-600">{row.category}</span>,
  },
  {
    key: "published_at",
    title: "Published",
    customRender: (row) => (
      <span className="text-gray-600">{formatBlogDate(row.published_at)}</span>
    ),
  },
  {
    key: "public_post",
    title: "Public post",
    customRender: (row) => (
      <Link
        href={`/blog/${row.slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        View public post
        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
      </Link>
    ),
  },
];

const blogRowActions = [
  {
    key: "detail",
    label: "View details",
    icon: <Eye size={16} />,
  },
  {
    key: "edit",
    label: "Edit",
    icon: <Pencil size={16} />,
  },
  {
    key: "delete",
    label: "Delete",
    icon: <Trash2 size={16} />,
  },
];

export default function useAdminBlog() {
  const dispatch = useDispatch();
  const { data: listData, isLoading } = useSelector(selectFetchAdminBlogPosts);
  const createState = useSelector(selectCreateBlogPost);
  const updateState = useSelector(selectUpdateBlogPost);
  const deleteState = useSelector(selectDeleteBlogPost);
  const bulkDeleteState = useSelector(selectBulkDeleteBlogPosts);
  const { isLoading: isUploading } = useSelector((state) => state.uploadFile.uploadSingleFile);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_LIMIT);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [detailPost, setDetailPost] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [coverPreview, setCoverPreview] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  const rows = useMemo(() => {
    if (Array.isArray(listData?.items)) {
      return listData.items;
    }
    if (Array.isArray(listData)) {
      return listData;
    }
    return [];
  }, [listData]);

  const totalRecords = listData?.total ?? rows.length;

  const buildListParams = useCallback(() => {
    const params = {
      page: currentPage,
      limit: pageSize,
    };
    const trimmed = typeof searchTerm === "string" ? searchTerm.trim() : "";
    if (trimmed) {
      params.search = trimmed;
    }
    if (categoryFilter) {
      params.category = categoryFilter;
    }
    return params;
  }, [currentPage, pageSize, searchTerm, categoryFilter]);

  const loadPosts = useCallback(() => {
    dispatch(fetchAdminBlogPosts(buildListParams()));
  }, [dispatch, buildListParams]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadPosts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [loadPosts]);

  useEffect(() => {
    if (createState.isSuccess) {
      dispatch(resetCreateBlogPost());
      setIsModalOpen(false);
      setForm(emptyForm);
      setCoverPreview("");
      setEditingPost(null);
      setCurrentPage(1);
      loadPosts();
    }
  }, [createState.isSuccess, dispatch, loadPosts]);

  useEffect(() => {
    if (updateState.isSuccess) {
      dispatch(resetUpdateBlogPost());
      setIsModalOpen(false);
      setForm(emptyForm);
      setCoverPreview("");
      setEditingPost(null);
      loadPosts();
    }
  }, [updateState.isSuccess, dispatch, loadPosts]);

  useEffect(() => {
    if (deleteState.isSuccess) {
      dispatch(resetDeleteBlogPost());
      setDeleteTarget(null);
      setSelectedIds((prev) =>
        deleteTarget?.id ? prev.filter((id) => id !== deleteTarget.id) : prev
      );
      if (rows.length === 1 && currentPage > 1) {
        setCurrentPage((page) => page - 1);
      } else {
        loadPosts();
      }
    }
  }, [deleteState.isSuccess, deleteTarget?.id, dispatch, loadPosts, rows.length, currentPage]);

  useEffect(() => {
    if (bulkDeleteState.isSuccess) {
      dispatch(resetBulkDeleteBlogPosts());
      setIsBulkDeleteOpen(false);
      setSelectedIds([]);
      if (rows.length <= selectedIds.length && currentPage > 1) {
        setCurrentPage((page) => page - 1);
      } else {
        loadPosts();
      }
    }
  }, [
    bulkDeleteState.isSuccess,
    dispatch,
    loadPosts,
    rows.length,
    selectedIds.length,
    currentPage,
  ]);

  const handleSearchChange = useCallback((value) => {
    const next = typeof value === "string" ? value : value?.target?.value ?? "";
    setCurrentPage(1);
    setSearchTerm(next);
  }, []);

  const handleCategoryFilterChange = useCallback((option) => {
    const value = extractSimpleSelectValue(option);
    setCurrentPage(1);
    if (value === "ALL" || value == null || value === "") {
      setCategoryFilter(null);
      return;
    }
    setCategoryFilter(value);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((size) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setCategoryFilter(null);
    setCurrentPage(1);
  }, []);

  const hasActiveFilters = useMemo(() => {
    const hasSearch = typeof searchTerm === "string" && searchTerm.trim() !== "";
    return hasSearch || categoryFilter != null;
  }, [searchTerm, categoryFilter]);

  const handleSelectionChange = useCallback((ids) => {
    setSelectedIds(ids);
  }, []);

  const handleActionClick = useCallback((actionKey, row) => {
    if (actionKey === "detail") {
      setDetailPost(row);
      return;
    }

    if (actionKey === "edit") {
      setEditingPost(row);
      setForm({
        title: row.title,
        category: row.category,
        excerpt: row.excerpt,
        body: row.body,
        cover_image_url: row.cover_image_url,
      });
      setCoverPreview(row.cover_image_url);
      setIsModalOpen(true);
      return;
    }

    if (actionKey === "delete") {
      setDeleteTarget(row);
    }
  }, []);

  const handleCloseDetail = useCallback(() => {
    setDetailPost(null);
  }, []);

  const openCreateModal = useCallback(() => {
    setEditingPost(null);
    setForm(emptyForm);
    setCoverPreview("");
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingPost(null);
    setForm(emptyForm);
    setCoverPreview("");
  }, []);

  const handleFieldChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const categoryOptions = useMemo(() => {
    if (!form.category || BLOG_CATEGORY_OPTIONS.some((option) => option.value === form.category)) {
      return BLOG_CATEGORY_OPTIONS;
    }

    return [{ value: form.category, label: form.category }, ...BLOG_CATEGORY_OPTIONS];
  }, [form.category]);

  const handleCategoryChange = useCallback(
    (option) => {
      handleFieldChange("category", extractSimpleSelectValue(option, ""));
    },
    [handleFieldChange]
  );

  const handleCoverUpload = useCallback(
    (event) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const previewUrl = URL.createObjectURL(file);
      setCoverPreview(previewUrl);

      dispatch(uploadSingleFile({ file, folder: "blog" })).then((result) => {
        if (uploadSingleFile.fulfilled.match(result)) {
          const url = getUploadedFileUrl(result.payload);
          if (url) {
            setForm((prev) => ({ ...prev, cover_image_url: url }));
            setCoverPreview(url);
          }
        }
      });
    },
    [dispatch]
  );

  const handleSubmit = useCallback(() => {
    if (!form.title || !form.category || !form.excerpt || !form.body || !form.cover_image_url) {
      return;
    }

    if (editingPost) {
      dispatch(updateBlogPost({ id: editingPost.id, payload: form }));
      return;
    }

    dispatch(createBlogPost(form));
  }, [dispatch, editingPost, form]);

  const handleConfirmDelete = useCallback(() => {
    if (!deleteTarget) return;
    dispatch(deleteBlogPost(deleteTarget.id));
  }, [deleteTarget, dispatch]);

  const handleOpenBulkDelete = useCallback(() => {
    if (!selectedIds.length) return;
    setIsBulkDeleteOpen(true);
  }, [selectedIds.length]);

  const handleConfirmBulkDelete = useCallback(() => {
    if (!selectedIds.length) return;
    dispatch(bulkDeleteBlogPosts(selectedIds));
  }, [dispatch, selectedIds]);

  const isSaving = createState.isLoading || updateState.isLoading;
  const canSubmit =
    Boolean(form.title && form.category && form.excerpt && form.body && form.cover_image_url) &&
    !isSaving &&
    !isUploading;

  return {
    rows,
    columns: adminBlogColumns,
    isLoading: isLoading || deleteState.isLoading || bulkDeleteState.isLoading,
    currentPage,
    pageSize,
    totalRecords,
    handlePageChange,
    handlePageSizeChange,
    searchTerm,
    categoryFilter,
    showFilters,
    hasActiveFilters,
    selectedIds,
    handleSearchChange,
    handleCategoryFilterChange,
    toggleFilters,
    handleClearFilters,
    handleSelectionChange,
    blogRowActions,
    handleActionClick,
    detailPost,
    handleCloseDetail,
    isModalOpen,
    editingPost,
    form,
    coverPreview,
    deleteTarget,
    setDeleteTarget,
    isBulkDeleteOpen,
    setIsBulkDeleteOpen,
    openCreateModal,
    closeModal,
    handleFieldChange,
    handleCategoryChange,
    categoryOptions,
    categoryFilterOptions: BLOG_CATEGORY_FILTER_OPTIONS,
    handleCoverUpload,
    handleSubmit,
    handleConfirmDelete,
    handleOpenBulkDelete,
    handleConfirmBulkDelete,
    isSaving,
    canSubmit,
    deleteLoading: deleteState.isLoading,
    bulkDeleteLoading: bulkDeleteState.isLoading,
  };
}
