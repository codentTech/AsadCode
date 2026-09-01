"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import FullPageLoader from "@/common/components/loader/full-page-loader.component";
import { Download } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useCompletedCampaignReport from "./use-completed-campaign-report.hook";

const AGE_COLORS = ["#16273F", "#3D5878", "#6C87A3", "#A9BDD0"];
const FEMALE = "#E9B9C7";
const MALE = "#AECBE3";

function PercentTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const row = payload[0];
  const name = label || row?.payload?.name || row?.name || "";
  const value = Number(row?.value);
  return (
    <div className="rounded-lg border border-[#EDECE7] bg-white px-2.5 py-1.5 text-xs shadow-sm">
      <p className="font-semibold text-[#16273F]">{name}</p>
      <p className="tabular-nums text-[#5A5955]">
        {Number.isFinite(value) ? `${value}%` : "-"}
      </p>
    </div>
  );
}

function CreatorCell({ name, avatarUrl }) {
  const initial = String(name || "C").trim().charAt(0).toUpperCase() || "C";
  return (
    <span className="inline-flex items-center gap-2.5">
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt=""
          className="h-8 w-8 shrink-0 rounded-full border border-[#E5E4DF] object-cover object-top"
        />
      ) : (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#E5E4DF] bg-[#DCE4EC] text-[11px] font-semibold text-[#16273F]">
          {initial}
        </span>
      )}
      <span className="font-medium text-[#16273F]">{name || "Creator"}</span>
    </span>
  );
}

function MetricCard({ label, value, underline }) {
  return (
    <div className="rounded-[10px] border border-[#EDECE7] bg-[#FCFCFB] px-4 py-4">
      <p className="text-[11px] font-medium uppercase tracking-wide text-[#8A8985]">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-[#16273F]">{value}</p>
      {underline ? <div className="mt-2.5 h-[3px] w-[34px] rounded-sm bg-primary" /> : null}
    </div>
  );
}

function PairedBox({ primaryLabel, primary, secondaryLabel, secondary }) {
  return (
    <div className="rounded-[10px] border border-[#EDECE7] bg-[#FCFCFB] px-4 py-4">
      <p className="text-[11px] font-medium uppercase tracking-wide text-[#8A8985]">
        {primaryLabel}
      </p>
      <p className="mt-1 text-xl font-bold text-[#16273F]">{primary}</p>
      <div className="my-2 border-t border-[#E5E4DF]" />
      <p className="text-xs leading-snug text-[#8A8985]">
        {secondaryLabel}: <span className="font-semibold text-[#5A5955]">{secondary}</span>
      </p>
    </div>
  );
}

function ReportTable({ columns, rows }) {
  return (
    <div className="-mx-1 overflow-x-auto overscroll-x-contain sm:mx-0">
      <table className="w-max min-w-full border-collapse text-left text-[13px]">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`whitespace-nowrap border-y border-[#E5E4DF] bg-[#FAFAF8] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A8985] ${
                  col.align === "right" ? "text-right" : "text-left"
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.id || row.creatorId || idx} className="border-b border-[#EDECE7] last:border-b-0">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`whitespace-nowrap px-4 py-3 tabular-nums text-[#16273F] ${
                    col.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ChartEmpty({ message }) {
  return (
    <div className="flex h-40 items-center justify-center rounded-[10px] bg-[#FCFCFB] px-3 text-center text-xs text-[#8A8985] sm:h-48">
      {message}
    </div>
  );
}

function OverviewSection({ overview, formatCurrency, formatNumber, formatPercent }) {
  if (!overview) return null;

  const ageData = (overview.ageDistribution || [])
    .map((row) => ({
      name: row.label,
      value: Number(row.value) || 0,
    }))
    .filter((row) => row.name);
  const ageHasData = ageData.some((row) => row.value > 0);

  const genderData = (overview.genderSplit || [])
    .map((g) => ({
      name: g.label,
      value: Number(g.value) || 0,
    }))
    .filter((g) => g.value > 0);
  const genderHasData = genderData.length > 0;

  const topCountries = overview.topCountries || [];
  const topCities = overview.topCities || [];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricCard label="Total cost" value={formatCurrency(overview.totalCost)} underline />
        <MetricCard label="Total posts" value={formatNumber(overview.totalPosts)} underline />
        <MetricCard label="Total views" value={formatNumber(overview.totalViews)} underline />
        <MetricCard
          label="Earned media value"
          value={formatCurrency(overview.earnedMediaValue)}
          underline
        />
        <MetricCard label="Likes" value={formatNumber(overview.likes)} />
        <MetricCard label="Comments" value={formatNumber(overview.comments)} />
        <MetricCard label="Avg engagement rate" value={formatPercent(overview.avgEngagementRate)} />
      </div>

      <section>
        <h2 className="text-[17px] font-bold text-[#16273F]">Combined audience demographics</h2>
        <div className="mt-5 grid items-center gap-7 lg:grid-cols-[1.35fr_1fr]">
          <div>
            {ageHasData ? (
              <div className="h-52 w-full sm:h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ageData} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDECE7" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: "#5A5955" }}
                      axisLine={{ stroke: "#EDECE7" }}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 11, fill: "#8A8985" }}
                      unit="%"
                      width={36}
                      axisLine={{ stroke: "#EDECE7" }}
                      tickLine={false}
                    />
                    <Tooltip content={<PercentTooltip />} />
                    <Bar dataKey="value" radius={[2, 2, 0, 0]} barSize={40} name="Percentage">
                      {ageData.map((entry, i) => (
                        <Cell key={entry.name} fill={AGE_COLORS[i % AGE_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <ChartEmpty message="No age distribution available for this campaign yet." />
            )}
            {ageHasData ? (
              <p className="mt-2.5 text-center text-xs text-[#5A5955]">
                {ageData.map((a) => `${a.name} ${a.value}%`).join(" · ")}
              </p>
            ) : null}
          </div>

          <div>
            {genderHasData ? (
              <>
                <div className="mx-auto h-44 w-full max-w-[11rem]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genderData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={42}
                        outerRadius={62}
                        paddingAngle={0}
                      >
                        {genderData.map((entry) => (
                          <Cell
                            key={entry.name}
                            fill={
                              String(entry.name).toLowerCase().includes("female") ? FEMALE : MALE
                            }
                            stroke="none"
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<PercentTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-2.5 text-center text-xs text-[#5A5955]">
                  {genderData.map((g) => `${g.name} ${g.value}%`).join(" · ")}
                </p>
              </>
            ) : (
              <ChartEmpty message="No gender distribution available for this campaign yet." />
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-10 sm:grid-cols-2">
          {[
            { title: "Top countries", rows: topCountries },
            { title: "Top cities", rows: topCities },
          ].map((block) => (
            <div key={block.title}>
              <h3 className="mb-3.5 text-sm font-bold text-[#16273F]">{block.title}</h3>
              {block.rows.length === 0 ? (
                <p className="text-xs text-[#8A8985]">No data</p>
              ) : (
                <div className="space-y-2.5">
                  {block.rows.map((row) => {
                    const pct = Number(row.value) || 0;
                    return (
                      <div
                        key={row.label}
                        className="grid grid-cols-[minmax(0,7.5rem)_1fr_2.5rem] items-center gap-3"
                      >
                        <span className="truncate text-[12.5px] text-[#5A5955]">{row.label}</span>
                        <div className="h-2 overflow-hidden rounded-md bg-[#DCE4EC]">
                          <div
                            className="h-full rounded-md bg-[#16273F]"
                            style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                          />
                        </div>
                        <span className="text-right text-[12.5px] font-bold tabular-nums text-[#16273F]">
                          {pct}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Unavailable() {
  return <span className="italic text-[#8A8985]">Unavailable</span>;
}

function SalesRoiSection({ sales, formatCurrency, formatNumber, formatDate }) {
  if (!sales) return null;
  const conversionSecondary =
    sales.blendedConversionLabel === "conversion"
      ? `${sales.blendedConversionValue ?? 0}%`
      : formatNumber(sales.blendedConversionValue);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <PairedBox
          primaryLabel="Total sales"
          primary={formatCurrency(sales.totalSales)}
          secondaryLabel="Blended AOV"
          secondary={formatCurrency(sales.blendedAov)}
        />
        <PairedBox
          primaryLabel="Total orders"
          primary={formatNumber(sales.totalOrders)}
          secondaryLabel={
            sales.blendedConversionLabel === "conversion" ? "Blended conversion" : "Units sold"
          }
          secondary={conversionSecondary}
        />
        <PairedBox
          primaryLabel="ROI"
          primary={sales.roi == null ? <Unavailable /> : `${sales.roi}x`}
          secondaryLabel="Cost per sale"
          secondary={
            sales.costPerSale == null ? <Unavailable /> : formatCurrency(sales.costPerSale)
          }
        />
        <PairedBox
          primaryLabel="Total cost"
          primary={formatCurrency(sales.totalCost)}
          secondaryLabel="Cost per creator"
          secondary={formatCurrency(sales.costPerCreator)}
        />
        <PairedBox
          primaryLabel="Payouts"
          primary={formatCurrency(sales.payouts)}
          secondaryLabel="Product cost"
          secondary={formatCurrency(sales.productCost)}
        />
      </div>

      <p className="text-[11.5px] leading-snug text-[#8A8985]">{sales.costBasisNote}</p>

      <div>
        <h3 className="mb-3 text-base font-bold text-[#16273F]">Sales by creator</h3>
        <ReportTable
          columns={[
            {
              key: "creatorName",
              label: "Creator",
              render: (r) => <CreatorCell name={r.creatorName} avatarUrl={r.avatarUrl} />,
            },
            {
              key: "revenue",
              label: "Revenue",
              align: "right",
              render: (r) => formatCurrency(r.revenue),
            },
            { key: "aov", label: "AOV", align: "right", render: (r) => formatCurrency(r.aov) },
            {
              key: "orders",
              label: "Orders",
              align: "right",
              render: (r) => formatNumber(r.orders),
            },
            {
              key: "conversion",
              label: "Conversion",
              align: "right",
              render: (r) =>
                r.conversionLabel === "conversion"
                  ? `${r.conversionValue ?? 0}%`
                  : `Units sold: ${formatNumber(r.conversionValue)}`,
            },
            {
              key: "roi",
              label: "ROI",
              align: "right",
              render: (r) => (r.roi == null ? <Unavailable /> : `${r.roi}x`),
            },
            {
              key: "costPerSale",
              label: "Cost/sale",
              align: "right",
              render: (r) =>
                r.costPerSale == null ? <Unavailable /> : formatCurrency(r.costPerSale),
            },
          ]}
          rows={sales.creators || []}
        />
      </div>

      {sales.topProducts?.length ? (
        <div>
          <h3 className="mb-3 text-base font-bold text-[#16273F]">Top products</h3>
          <ReportTable
            columns={[
              { key: "productLabel", label: "Product" },
              {
                key: "quantity",
                label: "Quantity",
                align: "right",
                render: (r) => formatNumber(r.quantity),
              },
              {
                key: "revenue",
                label: "Revenue",
                align: "right",
                render: (r) => formatCurrency(r.revenue),
              },
            ]}
            rows={sales.topProducts}
          />
        </div>
      ) : null}

      <div className="space-y-1 text-[11.5px] leading-relaxed text-[#8A8985]">
        <p>Engagement data as of {formatDate(sales.engagementAsOf)} (Phyllo, refreshes ~daily).</p>
        <p>
          Sales data as of {formatDate(sales.salesAsOf)} (Shopify sync, refreshes periodically).
        </p>
        <p>{sales.refundDisclaimer}</p>
      </div>
    </div>
  );
}

function CreatorsContentSection({
  section,
  formatCurrency,
  formatNumber,
  formatPercent,
  formatDate,
}) {
  if (!section) return null;
  const platformColumns = [
    { key: "platform", label: "Platform" },
    { key: "posts", label: "Posts", align: "right", render: (r) => formatNumber(r.posts) },
    {
      key: "avgViews",
      label: "Avg views",
      align: "right",
      render: (r) => formatNumber(r.avgViews),
    },
    {
      key: "avgEngagementRate",
      label: "Avg eng. rate",
      align: "right",
      render: (r) => formatPercent(r.avgEngagementRate),
    },
  ];
  if (section.showShareOfViews) {
    platformColumns.push({
      key: "shareOfViews",
      label: "Share of views",
      align: "right",
      render: (r) => formatPercent(r.shareOfViews),
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-base font-bold text-[#16273F]">Top performing creators</h3>
        <ReportTable
          columns={[
            {
              key: "creatorName",
              label: "Creator",
              render: (r) => <CreatorCell name={r.creatorName} avatarUrl={r.avatarUrl} />,
            },
            {
              key: "followers",
              label: "Followers",
              align: "right",
              render: (r) => formatNumber(r.followers),
            },
            {
              key: "posts",
              label: "Posts",
              align: "right",
              render: (r) => formatNumber(r.posts),
            },
            {
              key: "views",
              label: "Views",
              align: "right",
              render: (r) => formatNumber(r.views),
            },
            {
              key: "engagementRate",
              label: "Eng. rate",
              align: "right",
              render: (r) => formatPercent(r.engagementRate),
            },
            {
              key: "costPerEngagement",
              label: "Cost/eng.",
              align: "right",
              render: (r) => formatCurrency(r.costPerEngagement),
            },
          ]}
          rows={section.topCreators || []}
        />
      </div>

      <div>
        <h3 className="mb-3 text-base font-bold text-[#16273F]">Platform breakdown</h3>
        <ReportTable columns={platformColumns} rows={section.platformBreakdown || []} />
      </div>

      <div>
        <h3 className="mb-3 text-base font-bold text-[#16273F]">Best performing content</h3>
        <ReportTable
          columns={[
            { key: "platform", label: "Platform" },
            {
              key: "creatorName",
              label: "Creator",
              render: (r) => <CreatorCell name={r.creatorName} avatarUrl={r.avatarUrl} />,
            },
            {
              key: "views",
              label: "Views",
              align: "right",
              render: (r) => formatNumber(r.views),
            },
            {
              key: "engagementRate",
              label: "Eng. rate",
              align: "right",
              render: (r) => formatPercent(r.engagementRate),
            },
            {
              key: "date",
              label: "Date",
              align: "right",
              render: (r) => formatDate(r.date),
            },
          ]}
          rows={section.bestPerformingContent || []}
        />
      </div>
    </div>
  );
}

function RehireSection({ rehire, formatCurrency }) {
  if (!rehire) return null;
  const suppressScore = Boolean(rehire.suppressNumericScore);

  return (
    <div className="space-y-5">
      <p className="rounded-lg bg-[#F5F5F4] px-3 py-2 text-[11.5px] leading-snug text-[#5A5955]">
        {rehire.scoreNote}
      </p>
      <ReportTable
        columns={[
          {
            key: "creatorName",
            label: "Creator",
            render: (r) => <CreatorCell name={r.creatorName} avatarUrl={r.avatarUrl} />,
          },
          { key: "paymentLabel", label: "Payment" },
          {
            key: "score",
            label: "Score",
            align: "right",
            render: (r) => {
              if (suppressScore) {
                return <span className="italic text-[#8A8985]">Not ranked</span>;
              }
              if (r.insufficientData) {
                return <span className="italic text-[#8A8985]">Insufficient data</span>;
              }
              return r.score;
            },
          },
          {
            key: "cost",
            label: "Cost/view",
            align: "right",
            render: (r) => (
              <span>
                {formatCurrency(r.costPerView)}
                <span className="block text-[10px] text-[#8A8985]">
                  Cost/eng. {formatCurrency(r.costPerEngagement)}
                </span>
              </span>
            ),
          },
          { key: "onTimeLabel", label: "On-time" },
          {
            key: "revisions",
            label: "Revisions",
            align: "right",
            render: (r) => (r.revisions == null ? "-" : r.revisions),
          },
          {
            key: "avgResponseHours",
            label: "Avg response",
            align: "right",
            render: (r) => (r.avgResponseHours == null ? "-" : `${r.avgResponseHours}h`),
          },
          {
            key: "rating",
            label: "Rating*",
            align: "right",
            render: (r) => (r.rating == null ? "-" : r.rating),
          },
        ]}
        rows={rehire.scorecard || []}
      />
      <p className="text-[11.5px] italic leading-relaxed text-[#8A8985]">
        *{rehire.ratingFootnote}
      </p>

      {rehire.internalNotes?.length ? (
        <div>
          <h3 className="mb-3 text-base font-bold text-[#16273F]">Internal notes</h3>
          <div className="space-y-3">
            {rehire.internalNotes.map((note) => (
              <div
                key={note.creatorId}
                className="rounded-[10px] border border-[#EDECE7] bg-[#FCFCFB] p-3.5"
              >
                <p className="text-sm font-semibold text-[#16273F]">{note.creatorName}</p>
                <p className="mt-1 whitespace-pre-wrap text-[12.5px] leading-relaxed text-[#5A5955]">
                  {note.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function CompletedCampaignReport({ campaignId }) {
  const {
    data,
    isLoading,
    isError,
    message,
    activeTab,
    tabs,
    isPdfLoading,
    handleTabChange,
    handleDownloadPdf,
    formatCurrency,
    formatNumber,
    formatPercent,
    formatDate,
  } = useCompletedCampaignReport(campaignId);

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#EDEDEA] p-4">
        <div className="max-w-md rounded-xl border border-[#EDECE7] bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-semibold text-[#16273F]">Unable to load report</p>
          <p className="mt-2 text-xs text-[#8A8985]">{message || "Please try again later."}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return <FullPageLoader />;
  }

  const { header, overview, salesAndRoi, creatorsAndContent, rehire } = data;
  const dateLabel = [formatDate(header.dateRangeStart), formatDate(header.dateRangeEnd)]
    .filter((d) => d !== "-")
    .join(" - ");
  const subline = [header.campaignType, header.brandName, dateLabel].filter(Boolean).join(" · ");

  return (
    <div className="min-h-screen bg-[#EDEDEA] text-[#5A5955]">
      <div className="mx-auto flex max-w-[960px] items-center justify-between gap-4 px-2 pb-3.5 pt-5">
        <span className="text-xs uppercase tracking-wider text-[#8A8985]">Report viewer</span>
        <CustomButton
          text="Export as PDF"
          className="btn-primary sm:min-w-[140px]"
          onClick={handleDownloadPdf}
          disabled={isPdfLoading}
          loading={isPdfLoading}
          loadingText="Generating PDF…"
          startIcon={isPdfLoading ? null : <Download className="h-3.5 w-3.5" />}
        />
      </div>

      <div className="mx-auto mb-12 max-w-[960px] border border-[#EDECE7] bg-white px-5 py-7 shadow-[0_8px_28px_rgba(22,39,63,0.10)] sm:px-10 sm:py-11">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
          <div className="min-w-0">
            <h1 className="text-[22px] font-bold tracking-tight text-[#16273F] sm:text-[26px]">
              {header.campaignTitle}
            </h1>
            {subline ? <p className="mt-1.5 text-[13.5px] text-[#8A8985]">{subline}</p> : null}
          </div>
          <div className="flex flex-row flex-wrap gap-2 sm:flex-col sm:items-end">
            <span className="whitespace-nowrap rounded-full border border-[#E5E4DF] bg-white px-4 py-1.5 text-[12.5px] text-[#16273F]">
              {header.status || "Completed"}
            </span>
            <span className="whitespace-nowrap rounded-full border border-[#E5E4DF] bg-white px-4 py-1.5 text-[12.5px] text-[#16273F]">
              {header.creatorsCompleted} of {header.creatorsTotal} creators
            </span>
          </div>
        </div>

        <nav
          className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-2"
          role="tablist"
          aria-label="Report sections"
        >
          {tabs.map((tab) => {
            const active = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => handleTabChange(tab.id)}
                className={
                  active
                    ? "rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white"
                    : "py-0.5 text-sm font-medium text-[#8A8985] hover:text-[#16273F]"
                }
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
        <hr className="mb-7 mt-4 border-0 border-t border-[#EDECE7]" />

        {activeTab === "overview" ? (
          <OverviewSection
            overview={overview}
            formatCurrency={formatCurrency}
            formatNumber={formatNumber}
            formatPercent={formatPercent}
          />
        ) : null}
        {activeTab === "sales" ? (
          <SalesRoiSection
            sales={salesAndRoi}
            formatCurrency={formatCurrency}
            formatNumber={formatNumber}
            formatDate={formatDate}
          />
        ) : null}
        {activeTab === "creators" ? (
          <CreatorsContentSection
            section={creatorsAndContent}
            formatCurrency={formatCurrency}
            formatNumber={formatNumber}
            formatPercent={formatPercent}
            formatDate={formatDate}
          />
        ) : null}
        {activeTab === "rehire" ? (
          <RehireSection rehire={rehire} formatCurrency={formatCurrency} />
        ) : null}
      </div>
    </div>
  );
}
