import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import SearchIcon from "@/common/icons/search-icon";
import BlogPageShell from "@/components/blog/blog-page-shell/blog-page-shell.component";
import JsonLd from "@/components/seo/json-ld.component";
import { buildBlogIndexSchema } from "@/common/utils/blog.utils";
import { Filter, Newspaper } from "lucide-react";
import BlogIndexSkeleton from "./components/blog-index-skeleton/blog-index-skeleton.component";
import BlogPostCard from "./components/blog-post-card/blog-post-card.component";
import useBlogIndex from "./use-blog-index.hook";

export default function BlogIndexPage() {
  const {
    posts,
    isLoading,
    searchTerm,
    categoryFilter,
    showFilters,
    hasActiveFilters,
    categoryFilterOptions,
    handleSearchChange,
    handleCategoryFilterChange,
    toggleFilters,
    handleClearFilters,
  } = useBlogIndex();

  const postCountLabel =
    posts.length === 1 ? "1 article" : `${posts.length} articles`;

  return (
    <>
      <JsonLd data={buildBlogIndexSchema(posts)} />
      <BlogPageShell>
        <div className="relative z-20 mb-4 rounded-xl border border-indigo-100 bg-white shadow-sm sm:mb-6">
          <div className="border-b border-indigo-100 bg-indigo-100 px-3 py-2.5 sm:px-4">
            <div className="flex items-center gap-2 text-left">
              <Newspaper className="h-3.5 w-3.5 shrink-0 text-primary sm:h-4 sm:w-4" />
              <p className="text-[10px] font-semibold text-gray-700 sm:text-xs">Browse articles</p>
            </div>
          </div>

          <div className="p-3 sm:p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[200px] max-w-md flex-1">
                <CustomInput
                  type="text"
                  name="blog-search"
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
                  className="whitespace-nowrap text-[10px] font-medium text-primary hover:underline sm:text-xs"
                >
                  Clear filters
                </button>
              ) : null}
              <button
                type="button"
                onClick={toggleFilters}
                className={`ml-auto flex h-8 w-8 items-center justify-center rounded-lg border transition-colors sm:h-9 sm:w-9 ${
                  showFilters
                    ? "border-primary bg-primary text-white"
                    : "border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
                }`}
                title="Toggle filters"
                aria-label="Toggle filters"
              >
                <Filter className="h-4 w-4" />
              </button>
            </div>

            {showFilters ? (
              <div className="relative z-20 mt-3 overflow-visible border-t border-gray-100 pt-3 sm:mt-4 sm:pt-4">
                <div className="relative w-full max-w-xs overflow-visible">
                  <SimpleSelect
                    label="Category"
                    value={categoryFilter || "ALL"}
                    onChange={handleCategoryFilterChange}
                    options={categoryFilterOptions}
                    className="w-full"
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {!isLoading && posts.length > 0 ? (
          <p className="mb-3 text-left text-[10px] font-medium text-gray-500 sm:mb-4 sm:text-xs">
            {postCountLabel}
            {hasActiveFilters ? " matching your filters" : ""}
          </p>
        ) : null}

        {isLoading ? (
          <BlogIndexSkeleton />
        ) : !posts.length ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-12 text-center shadow-sm sm:px-6">
            <Newspaper className="mx-auto h-8 w-8 text-gray-300 sm:h-10 sm:w-10" />
            <p className="mt-3 text-sm font-medium text-gray-700 sm:text-base">
              {hasActiveFilters ? "No posts match your filters" : "No posts yet"}
            </p>
            <p className="mt-1 text-[10px] text-gray-500 sm:text-xs">
              {hasActiveFilters
                ? "Try adjusting your search or category filter."
                : "Check back soon for new articles."}
            </p>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-4 text-[10px] font-semibold text-primary hover:underline sm:text-xs"
              >
                Clear all filters
              </button>
            ) : null}
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {posts.map((post) => (
              <li key={post.id}>
                <BlogPostCard post={post} />
              </li>
            ))}
          </ul>
        )}
      </BlogPageShell>
    </>
  );
}
