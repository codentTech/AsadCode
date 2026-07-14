"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomDataTable from "@/common/components/custom-data-table/custom-data-table.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import DeleteConfirmationModal from "@/common/components/delete-confirmation-modal/delete-confirmation-modal.component";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
import TiptapEditor from "@/common/components/tiptap-editor/tiptap-editor.component";
import DashboardLayout from "@/common/layouts/dashboard-layout";
import SearchIcon from "@/common/icons/search-icon";
import { Filter } from "lucide-react";
import BlogPostDetailModal from "./components/blog-post-detail-modal/blog-post-detail-modal.component";
import useAdminBlog from "./use-admin-blog.hook";

export default function AdminBlog() {
  const {
    rows,
    columns,
    isLoading,
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
    currentPage,
    pageSize,
    totalRecords,
    handlePageChange,
    handlePageSizeChange,
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
    categoryFilterOptions,
    handleCoverUpload,
    handleSubmit,
    handleConfirmDelete,
    handleOpenBulkDelete,
    handleConfirmBulkDelete,
    isSaving,
    canSubmit,
    deleteLoading,
    bulkDeleteLoading,
  } = useAdminBlog();

  return (
    <DashboardLayout>
      <div className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-3 py-3 sm:px-4 sm:py-4 md:px-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-gray-900 sm:text-lg">Blog Posts</h3>
            <div className="flex flex-wrap items-center gap-2">
              {selectedIds.length > 0 ? (
                <CustomButton
                  text={`Delete selected (${selectedIds.length})`}
                  onClick={handleOpenBulkDelete}
                  className="btn-danger-outline"
                />
              ) : null}
              <CustomButton text="New Post" onClick={openCreateModal} className="btn-primary" />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="relative min-w-[200px] max-w-md flex-1">
              <CustomInput
                type="text"
                name="search"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search posts..."
                startIcon={<SearchIcon />}
                className="!h-[36px]"
              />
            </div>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={handleClearFilters}
                className="whitespace-nowrap text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                Clear filters
              </button>
            ) : null}
            <button
              type="button"
              onClick={toggleFilters}
              className={`ml-auto flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
                showFilters
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
              }`}
              title="Toggle filters"
            >
              <Filter size={18} />
            </button>
          </div>

          {showFilters ? (
            <div className="border-t border-gray-200 pt-4">
              <div className="flex flex-wrap items-center gap-6">
                <div className="w-full max-w-[300px]">
                  <SimpleSelect
                    label="Category"
                    value={categoryFilter || "ALL"}
                    onChange={handleCategoryFilterChange}
                    options={categoryFilterOptions}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="min-w-0 overflow-x-auto">
          <CustomDataTable
            columns={columns}
            data={rows}
            selectable
            selectedIds={selectedIds}
            searchable={false}
            externalSearch
            searchValue={searchTerm}
            onSearchChange={handleSearchChange}
            onSelectionChange={handleSelectionChange}
            actions={blogRowActions}
            onActionClick={handleActionClick}
            emptyMessage="No posts found"
            loading={isLoading}
            paginated
            externalPagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalRecords={totalRecords}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </div>

      <BlogPostDetailModal post={detailPost} onClose={handleCloseDetail} />

      <Modal
        title={editingPost ? "Edit Post" : "New Post"}
        show={isModalOpen}
        onClose={closeModal}
        size="lg"
        height="fixed"
      >
        <div className="space-y-4">
          <CustomInput
            label="Title"
            name="title"
            value={form.title}
            onChange={(e) => handleFieldChange("title", e.target.value)}
            placeholder="Post title"
          />
          <SimpleSelect
            label="Category"
            value={form.category}
            onChange={handleCategoryChange}
            options={categoryOptions}
            placeHolder="Select category"
            className="w-full"
          />
          <TextArea
            label="Excerpt"
            name="excerpt"
            value={form.excerpt}
            onChange={(e) => handleFieldChange("excerpt", e.target.value)}
            placeholder="1–2 sentence summary"
            rows={3}
          />

          <div>
            <p className="mb-1.5 text-xs font-medium text-gray-700 sm:text-sm">Cover image</p>
            {coverPreview ? (
              <img
                src={coverPreview}
                alt="Cover preview"
                className="mb-2 h-32 w-full rounded-lg object-cover sm:h-40"
              />
            ) : null}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleCoverUpload}
              className="block w-full text-xs text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary"
            />
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-gray-700 sm:text-sm">Post body</p>
            <TiptapEditor
              content={form.body}
              onChange={(content) => handleFieldChange("body", content)}
              placeholder="Write your post..."
              minHeight="280px"
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
            <CustomButton text="Cancel" onClick={closeModal} className="btn-outline" />
            <CustomButton
              text={editingPost ? "Save changes" : "Publish"}
              onClick={handleSubmit}
              className="btn-primary"
              disabled={!canSubmit}
              loading={isSaving}
            />
          </div>
        </div>
      </Modal>

      <DeleteConfirmationModal
        id={deleteTarget?.id || 0}
        openConfirmationPopup={Boolean(deleteTarget)}
        setOpenConfirmationPopup={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        mainText="Delete blog post?"
        subText={
          deleteTarget
            ? `This will permanently remove "${deleteTarget.title}" from the blog.`
            : ""
        }
        confirmText="Delete"
        closeText="Cancel"
        action={handleConfirmDelete}
        type="delete-blog-post"
        confirmLoading={deleteLoading}
      />

      <DeleteConfirmationModal
        id="bulk-delete-blog-posts"
        openConfirmationPopup={isBulkDeleteOpen}
        setOpenConfirmationPopup={setIsBulkDeleteOpen}
        mainText="Delete selected posts?"
        subText={`This will permanently remove ${selectedIds.length} post${
          selectedIds.length === 1 ? "" : "s"
        } from the blog.`}
        confirmText="Delete"
        closeText="Cancel"
        action={handleConfirmBulkDelete}
        type="bulk-delete-blog-posts"
        confirmLoading={bulkDeleteLoading}
      />
    </DashboardLayout>
  );
}
