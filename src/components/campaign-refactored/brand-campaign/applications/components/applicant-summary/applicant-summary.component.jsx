import CustomInput from "@/common/components/custom-input/custom-input.component";
import { ArrowLeft, Search, Sparkles } from "lucide-react";
import useApplicantSummary from "./use-applicant-summary.hook";

function SortArrow({ active, dir }) {
  if (!active) return null;
  return <span className="ml-0.5 text-[10px]">{dir === "asc" ? "↑" : "↓"}</span>;
}

function ApplicantSummary() {
  const {
    campaignId,
    campaignName,
    rows,
    isLoading,
    isError,
    message,
    search,
    handleSearchChange,
    recommendedActive,
    handleRecommendedClick,
    sortKey,
    sortDir,
    handleColumnSort,
    formatCompact,
    formatPercent,
    formatPlatform,
    avatarFallback,
    SORT_KEYS,
    handleBack,
  } = useApplicantSummary();

  if (!campaignId) {
    return (
      <div className="min-h-screen bg-white p-4 sm:p-6">
        <button
          type="button"
          onClick={handleBack}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-700 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <p className="text-sm text-gray-600">
          Missing campaign. Open Applicant Summary from Applications.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-3 py-2.5 sm:px-4 md:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
            aria-label="Back to Applications"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-semibold text-gray-900 sm:text-lg md:text-xl">
              Applicant Summary
            </h1>
            {campaignName ? (
              <p className="truncate text-[10px] leading-snug text-gray-500 sm:text-xs md:text-sm">
                {campaignName}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="w-full px-3 py-4 sm:px-4 sm:py-5 md:px-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 w-full sm:max-w-sm">
            <CustomInput
              type="text"
              name="applicantSummarySearch"
              placeholder="Search creators"
              value={search}
              onChange={handleSearchChange}
              startIcon={<Search className="h-3.5 w-3.5 text-gray-400" aria-hidden />}
              className="h-8 min-h-8 text-xs"
            />
          </div>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleRecommendedClick}
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold sm:text-xs ${
              recommendedActive
                ? "bg-sky-100 text-sky-800"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Sparkles className="h-3 w-3 shrink-0" aria-hidden />
            Recommended
          </button>
          {recommendedActive ? (
            <p className="text-[10px] leading-snug text-gray-500 sm:text-xs">
              Starts with the strongest signal for spotting inflated followings
            </p>
          ) : null}
        </div>

        {isLoading ? (
          <p className="py-12 text-center text-sm text-gray-500">Loading applicant summary…</p>
        ) : isError ? (
          <p className="py-12 text-center text-sm text-red-600">
            {message || "Could not load applicant summary."}
          </p>
        ) : rows.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-500">
            No applicants with connected social accounts for this campaign.
          </p>
        ) : (
          <div className="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full min-w-full text-left text-xs">
              <thead className="bg-gray-50 text-[10px] font-semibold text-gray-600 sm:text-xs">
                <tr>
                  <th className="px-3 py-2.5 font-semibold">Creator</th>
                  <th
                    className="cursor-pointer whitespace-nowrap px-3 py-2.5"
                    onClick={() => handleColumnSort(SORT_KEYS.platform)}
                  >
                    Platform
                    <SortArrow active={sortKey === SORT_KEYS.platform} dir={sortDir} />
                  </th>
                  <th
                    className="cursor-pointer whitespace-nowrap px-3 py-2.5"
                    onClick={() => handleColumnSort(SORT_KEYS.followers)}
                  >
                    Followers
                    <SortArrow active={sortKey === SORT_KEYS.followers} dir={sortDir} />
                  </th>
                  <th
                    className="cursor-pointer whitespace-nowrap px-3 py-2.5"
                    onClick={() => handleColumnSort(SORT_KEYS.typicalViews)}
                  >
                    Typical views
                    <SortArrow active={sortKey === SORT_KEYS.typicalViews} dir={sortDir} />
                  </th>
                  <th
                    className="cursor-pointer whitespace-nowrap px-3 py-2.5"
                    onClick={() => handleColumnSort(SORT_KEYS.engagementRate)}
                  >
                    Engagement
                    <SortArrow active={sortKey === SORT_KEYS.engagementRate} dir={sortDir} />
                  </th>
                  <th
                    className="cursor-pointer whitespace-nowrap px-3 py-2.5"
                    onClick={() => handleColumnSort(SORT_KEYS.reachViewEfficiency)}
                  >
                    View efficiency
                    <SortArrow active={sortKey === SORT_KEYS.reachViewEfficiency} dir={sortDir} />
                  </th>
                  <th
                    className="cursor-pointer whitespace-nowrap px-3 py-2.5"
                    onClick={() => handleColumnSort(SORT_KEYS.performanceConsistency)}
                  >
                    Perf. consistency
                    <SortArrow
                      active={sortKey === SORT_KEYS.performanceConsistency}
                      dir={sortDir}
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const location = [row.city, row.country].filter(Boolean).join(", ");
                  return (
                    <tr
                      key={`${row.creatorId}-${row.platform}`}
                      className="border-t border-gray-100 hover:bg-gray-50/80"
                    >
                      <td className="px-3 py-2.5">
                        <div className="flex min-w-0 items-center gap-2">
                          <img
                            src={row.photoUrl || avatarFallback}
                            alt=""
                            className="h-8 w-8 shrink-0 rounded-full object-cover"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-gray-900 sm:text-sm">
                              {row.name}
                            </p>
                            {location ? (
                              <p className="truncate text-[10px] text-gray-500 sm:text-xs">
                                {location}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-gray-800">{formatPlatform(row.platform)}</td>
                      <td className="px-3 py-2.5 tabular-nums text-gray-800">
                        {formatCompact(row.followers)}
                      </td>
                      <td className="px-3 py-2.5 tabular-nums text-gray-800">
                        {formatCompact(row.typicalViews)}
                      </td>
                      <td className="px-3 py-2.5 tabular-nums text-gray-800">
                        {formatPercent(row.engagementRate)}
                      </td>
                      <td className="px-3 py-2.5 tabular-nums text-gray-800">
                        {formatPercent(row.reachViewEfficiency)}
                      </td>
                      <td className="px-3 py-2.5 tabular-nums text-gray-800">
                        {row.performanceConsistency != null
                          ? Number(row.performanceConsistency).toFixed(0)
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplicantSummary;
