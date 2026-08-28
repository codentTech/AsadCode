"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import FullPageLoader from "@/common/components/loader/full-page-loader.component";
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

const AGE_COLORS = ["#4F46E5", "#6366F1", "#818CF8", "#A5B4FC"];
const PINK = "#EC4899";
const BLUE = "#3B82F6";

function PercentTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const row = payload[0];
  const name = label || row?.payload?.name || row?.name || "";
  const value = Number(row?.value);
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs shadow-sm">
      <p className="font-semibold text-gray-900">{name}</p>
      <p className="tabular-nums text-gray-600">{Number.isFinite(value) ? `${value}%` : "—"}</p>
    </div>
  );
}

function MetricCard({ label, value, underline }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-100 px-2.5 py-2 sm:px-3 sm:py-2.5">
      <p className="text-[10px] font-semibold text-gray-600 sm:text-xs">{label}</p>
      <p className="mt-0.5 text-sm font-bold tabular-nums text-gray-900 sm:text-base md:text-lg">
        {value}
      </p>
      {underline ? <div className="mt-2 h-0.5 w-full rounded-full bg-primary" /> : null}
    </div>
  );
}

function PairedBox({ primaryLabel, primary, secondaryLabel, secondary }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-100 px-2.5 py-2 sm:px-3 sm:py-2.5">
      <p className="text-[10px] font-semibold text-gray-600 sm:text-xs">{primaryLabel}</p>
      <p className="text-sm font-bold tabular-nums text-gray-900 sm:text-base">{primary}</p>
      <div className="my-1.5 border-t border-gray-200" />
      <p className="text-[10px] leading-snug text-gray-600 sm:text-xs">
        {secondaryLabel}:{" "}
        <span className="font-semibold tabular-nums text-gray-800">{secondary}</span>
      </p>
    </div>
  );
}

function ReportTable({ columns, rows }) {
  return (
    <div className="-mx-1 overflow-x-auto overscroll-x-contain rounded-lg border border-gray-200 bg-white sm:mx-0">
      <table className="w-max min-w-full text-left text-xs sm:text-sm">
        <thead className="bg-gray-200 text-[10px] uppercase tracking-wide text-gray-700 sm:text-xs">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="whitespace-nowrap px-2.5 py-2 font-semibold sm:px-3">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.id || idx} className="border-t border-gray-100 text-gray-700">
              {columns.map((col) => (
                <td key={col.key} className="whitespace-nowrap px-2.5 py-2 tabular-nums sm:px-3">
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
    <div className="flex h-40 items-center justify-center rounded-lg bg-gray-100 px-3 text-center text-xs text-gray-500 sm:h-48">
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
    <div className="space-y-4 sm:space-y-5">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
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

      <div className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-lg border border-gray-200 bg-gray-100 p-3 sm:p-4">
          <h3 className="mb-3 text-xs font-semibold text-gray-900 sm:text-sm">Age distribution</h3>
          {ageHasData ? (
            <div className="h-48 w-full rounded-lg bg-white p-2 sm:h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageData} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#6B7280" }}
                    axisLine={{ stroke: "#E5E7EB" }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: "#6B7280" }}
                    unit="%"
                    width={36}
                    axisLine={{ stroke: "#E5E7EB" }}
                    tickLine={false}
                  />
                  <Tooltip content={<PercentTooltip />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={28} name="Percentage">
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
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-100 p-3 sm:p-4">
          <h3 className="mb-3 text-xs font-semibold text-gray-900 sm:text-sm">Gender split</h3>
          {genderHasData ? (
            <>
              <div className="mx-auto h-40 w-full max-w-[11rem] rounded-lg bg-white p-2 sm:h-44">
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
                      paddingAngle={2}
                    >
                      {genderData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={String(entry.name).toLowerCase().includes("female") ? PINK : BLUE}
                          stroke="none"
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<PercentTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {genderData.map((g) => (
                  <span
                    key={g.name}
                    className="rounded-lg bg-white px-2 py-1 text-[10px] font-medium text-gray-700 sm:text-xs"
                  >
                    {g.name}: {g.value}%
                  </span>
                ))}
              </div>
            </>
          ) : (
            <ChartEmpty message="No gender distribution available for this campaign yet." />
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { title: "Top countries", rows: topCountries },
          { title: "Top cities", rows: topCities },
        ].map((block) => (
          <div
            key={block.title}
            className="rounded-lg border border-gray-200 bg-gray-100 p-3 sm:p-4"
          >
            <h3 className="mb-3 text-xs font-semibold text-gray-900 sm:text-sm">{block.title}</h3>
            <div className="space-y-2 rounded-lg bg-white p-2.5 sm:p-3">
              {block.rows.length === 0 ? (
                <p className="text-xs text-gray-500">No data</p>
              ) : (
                block.rows.map((row) => {
                  const pct = Number(row.value) || 0;
                  return (
                    <div key={row.label}>
                      <div className="mb-0.5 flex justify-between gap-2 text-[10px] text-gray-600 sm:text-xs">
                        <span className="min-w-0 truncate font-medium text-gray-800">
                          {row.label}
                        </span>
                        <span className="shrink-0 tabular-nums">{pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-lg bg-gray-100">
                        <div
                          className="h-1.5 rounded-lg bg-primary"
                          style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SalesRoiSection({ sales, formatCurrency, formatNumber, formatDate }) {
  if (!sales) return null;
  const conversionSecondary =
    sales.blendedConversionLabel === "conversion"
      ? `${sales.blendedConversionValue ?? 0}%`
      : formatNumber(sales.blendedConversionValue);

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <PairedBox
          primaryLabel="Total Sales"
          primary={formatCurrency(sales.totalSales)}
          secondaryLabel="Blended AOV"
          secondary={formatCurrency(sales.blendedAov)}
        />
        <PairedBox
          primaryLabel="Total Orders"
          primary={formatNumber(sales.totalOrders)}
          secondaryLabel={
            sales.blendedConversionLabel === "conversion" ? "Blended Conversion" : "Units sold"
          }
          secondary={conversionSecondary}
        />
        <PairedBox
          primaryLabel="ROI"
          primary={sales.roi == null ? "N/A" : `${sales.roi}x`}
          secondaryLabel="Cost per sale"
          secondary={formatCurrency(sales.costPerSale)}
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

      <p className="rounded-lg bg-gray-100 px-3 py-2 text-[11px] leading-snug text-gray-600 sm:text-xs">
        {sales.costBasisNote}
      </p>

      <ReportTable
        columns={[
          { key: "creatorName", label: "Creator" },
          {
            key: "revenue",
            label: "Revenue",
            render: (r) => formatCurrency(r.revenue),
          },
          { key: "aov", label: "AOV", render: (r) => formatCurrency(r.aov) },
          { key: "orders", label: "Orders", render: (r) => formatNumber(r.orders) },
          {
            key: "conversion",
            label: "Conversion",
            render: (r) =>
              r.conversionLabel === "conversion"
                ? `${r.conversionValue ?? 0}%`
                : `Units sold: ${formatNumber(r.conversionValue)}`,
          },
          { key: "roi", label: "ROI", render: (r) => (r.roi == null ? "N/A" : `${r.roi}x`) },
          {
            key: "costPerSale",
            label: "Cost/sale",
            render: (r) => formatCurrency(r.costPerSale),
          },
        ]}
        rows={sales.creators || []}
      />

      {sales.topProducts?.length ? (
        <div>
          <h3 className="mb-2 text-xs font-semibold text-gray-900 sm:text-sm">Top products</h3>
          <ReportTable
            columns={[
              { key: "productLabel", label: "Product" },
              { key: "quantity", label: "Quantity", render: (r) => formatNumber(r.quantity) },
              { key: "revenue", label: "Revenue", render: (r) => formatCurrency(r.revenue) },
            ]}
            rows={sales.topProducts}
          />
        </div>
      ) : null}

      <div className="space-y-1 rounded-lg bg-gray-100 px-3 py-2 text-[11px] text-gray-600 sm:text-xs">
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
    { key: "posts", label: "Posts", render: (r) => formatNumber(r.posts) },
    { key: "avgViews", label: "Avg views", render: (r) => formatNumber(r.avgViews) },
    {
      key: "avgEngagementRate",
      label: "Avg eng. rate",
      render: (r) => formatPercent(r.avgEngagementRate),
    },
  ];
  if (section.showShareOfViews) {
    platformColumns.push({
      key: "shareOfViews",
      label: "Share of views",
      render: (r) => formatPercent(r.shareOfViews),
    });
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="mb-2 text-xs font-semibold text-gray-900 sm:text-sm">
          Top performing creators
        </h3>
        <ReportTable
          columns={[
            { key: "creatorName", label: "Creator" },
            {
              key: "followers",
              label: "Followers",
              render: (r) => formatNumber(r.followers),
            },
            { key: "posts", label: "Posts", render: (r) => formatNumber(r.posts) },
            { key: "views", label: "Views", render: (r) => formatNumber(r.views) },
            {
              key: "engagementRate",
              label: "Eng. rate",
              render: (r) => formatPercent(r.engagementRate),
            },
            {
              key: "costPerEngagement",
              label: "Cost/eng.",
              render: (r) => formatCurrency(r.costPerEngagement),
            },
          ]}
          rows={section.topCreators || []}
        />
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold text-gray-900 sm:text-sm">Platform breakdown</h3>
        <ReportTable columns={platformColumns} rows={section.platformBreakdown || []} />
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold text-gray-900 sm:text-sm">
          Best performing content
        </h3>
        <ReportTable
          columns={[
            { key: "platform", label: "Platform" },
            { key: "creatorName", label: "Creator" },
            { key: "views", label: "Views", render: (r) => formatNumber(r.views) },
            {
              key: "engagementRate",
              label: "Eng. rate",
              render: (r) => formatPercent(r.engagementRate),
            },
            { key: "date", label: "Date", render: (r) => formatDate(r.date) },
          ]}
          rows={section.bestPerformingContent || []}
        />
      </div>
    </div>
  );
}

function RehireSection({ rehire, formatCurrency }) {
  if (!rehire) return null;
  return (
    <div className="space-y-4 sm:space-y-5">
      <p className="rounded-lg bg-gray-100 px-3 py-2 text-[11px] leading-snug text-gray-600 sm:text-xs">
        {rehire.scoreNote}
      </p>
      <ReportTable
        columns={[
          { key: "creatorName", label: "Creator" },
          { key: "paymentLabel", label: "Payment" },
          {
            key: "score",
            label: "Score",
            render: (r) =>
              r.insufficientData ? (
                <span className="italic text-gray-500">Insufficient data</span>
              ) : (
                r.score
              ),
          },
          {
            key: "cost",
            label: "Cost/view",
            render: (r) => (
              <span>
                {formatCurrency(r.costPerView)}
                <span className="block text-[10px] text-gray-500">
                  Cost/eng. {formatCurrency(r.costPerEngagement)}
                </span>
              </span>
            ),
          },
          { key: "onTimeLabel", label: "On-time" },
          { key: "revisions", label: "Revisions" },
          {
            key: "avgResponseHours",
            label: "Avg response",
            render: (r) => (r.avgResponseHours == null ? "—" : `${r.avgResponseHours}h`),
          },
          {
            key: "rating",
            label: "Rating*",
            render: (r) => (r.rating == null ? "—" : r.rating),
          },
        ]}
        rows={rehire.scorecard || []}
      />
      <p className="text-[11px] italic text-gray-500 sm:text-xs">*{rehire.ratingFootnote}</p>

      {rehire.internalNotes?.length ? (
        <div>
          <h3 className="mb-2 text-xs font-semibold text-gray-900 sm:text-sm">Internal notes</h3>
          <div className="space-y-3">
            {rehire.internalNotes.map((note) => (
              <div
                key={note.creatorId}
                className="rounded-lg border border-gray-200 bg-gray-100 p-3"
              >
                <p className="text-xs font-semibold text-gray-900 sm:text-sm">{note.creatorName}</p>
                <p className="mt-1 whitespace-pre-wrap text-[11px] leading-relaxed text-gray-600 sm:text-xs">
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

function SideCard({ title, children }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
      {title ? (
        <h2 className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-500 sm:text-xs">
          {title}
        </h2>
      ) : null}
      {children}
    </div>
  );
}

function SnapshotRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-2 rounded-lg bg-gray-100 px-2.5 py-2">
      <span className="text-[10px] font-medium text-gray-600 sm:text-xs">{label}</span>
      <span className="text-right text-[10px] font-bold tabular-nums text-gray-900 sm:text-xs">
        {value}
      </span>
    </div>
  );
}

function ReportLeftPanel({
  header,
  headerPills,
  overview,
  onDownloadPdf,
  formatCurrency,
  formatNumber,
  formatPercent,
}) {
  return (
    <aside className="flex w-full flex-col gap-3">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="bg-primary px-3 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-indigo-100">
            Campaign
          </p>
          <h1 className="mt-1 text-sm font-semibold leading-snug text-white sm:text-base">
            {header.campaignTitle}
          </h1>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {headerPills.map((pill) => (
              <span
                key={pill}
                className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-800"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
        <div className="p-3">
          <CustomButton
            text="Download as PDF"
            className="btn-outline w-full"
            onClick={onDownloadPdf}
          />
        </div>
      </div>

      <SideCard title="Snapshot">
        <div className="space-y-1.5">
          <SnapshotRow label="Total cost" value={formatCurrency(overview?.totalCost)} />
          <SnapshotRow label="Total posts" value={formatNumber(overview?.totalPosts)} />
          <SnapshotRow label="Total views" value={formatNumber(overview?.totalViews)} />
          <SnapshotRow label="EMV" value={formatCurrency(overview?.earnedMediaValue)} />
          <SnapshotRow label="Eng. rate" value={formatPercent(overview?.avgEngagementRate)} />
        </div>
      </SideCard>
    </aside>
  );
}

function ReportStatusCard({ header, meta, salesAndRoi, formatDate }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="bg-primary px-3 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-indigo-100">
          Report status
        </p>
        <p className="mt-1 text-sm font-semibold text-white sm:text-base">
          {header?.status || "—"}
        </p>
      </div>
      <div className="space-y-1.5 p-3">
        <SnapshotRow
          label="Creators done"
          value={`${header?.creatorsCompleted ?? 0}/${header?.creatorsTotal ?? 0}`}
        />
        <SnapshotRow label="Sales tracking" value={meta?.trackingEnabled ? "On" : "Off"} />
        <SnapshotRow
          label="Engagement as of"
          value={formatDate(meta?.engagementAsOf || salesAndRoi?.engagementAsOf)}
        />
        {meta?.trackingEnabled ? (
          <SnapshotRow
            label="Sales as of"
            value={formatDate(meta?.salesAsOf || salesAndRoi?.salesAsOf)}
          />
        ) : null}
      </div>
    </div>
  );
}

function ReportRightPanel({
  data,
  activeTab,
  formatCurrency,
  formatNumber,
  formatPercent,
  formatDate,
}) {
  const { overview, salesAndRoi, creatorsAndContent, rehire, meta, header } = data;
  const topCountry = overview?.topCountries?.[0];
  const topCreator = creatorsAndContent?.topCreators?.[0];
  const topScored = rehire?.scorecard?.find((row) => !row.insufficientData);

  return (
    <aside className="flex h-full min-h-0 w-full flex-col gap-3 overflow-y-auto p-3 sm:p-4">
      <ReportStatusCard
        header={header}
        meta={meta}
        salesAndRoi={salesAndRoi}
        formatDate={formatDate}
      />

      <SideCard title="Audience highlight">
        <div className="space-y-1.5">
          <SnapshotRow
            label="Top country"
            value={
              topCountry ? `${topCountry.label} (${Number(topCountry.value) || 0}%)` : "No data"
            }
          />
          {(overview?.genderSplit || [])
            .filter((g) => Number(g.value) > 0)
            .map((g) => (
              <SnapshotRow key={g.label} label={g.label} value={`${g.value}%`} />
            ))}
          {!overview?.genderSplit?.some((g) => Number(g.value) > 0) ? (
            <p className="text-[10px] text-gray-500 sm:text-xs">No gender split yet.</p>
          ) : null}
        </div>
      </SideCard>

      {activeTab === "sales" && salesAndRoi ? (
        <SideCard title="Sales glance">
          <div className="space-y-1.5">
            <SnapshotRow label="Total sales" value={formatCurrency(salesAndRoi.totalSales)} />
            <SnapshotRow label="Orders" value={formatNumber(salesAndRoi.totalOrders)} />
            <SnapshotRow
              label="ROI"
              value={salesAndRoi.roi == null ? "N/A" : `${salesAndRoi.roi}x`}
            />
          </div>
          <p className="mt-2 text-[10px] leading-snug text-gray-500 sm:text-xs">
            {salesAndRoi.costBasisNote}
          </p>
        </SideCard>
      ) : null}

      {activeTab === "creators" && topCreator ? (
        <SideCard title="Top creator">
          <p className="text-xs font-semibold text-gray-900">{topCreator.creatorName}</p>
          <div className="mt-2 space-y-1.5">
            <SnapshotRow label="Views" value={formatNumber(topCreator.views)} />
            <SnapshotRow label="Eng. rate" value={formatPercent(topCreator.engagementRate)} />
            <SnapshotRow label="Posts" value={formatNumber(topCreator.posts)} />
          </div>
        </SideCard>
      ) : null}

      {activeTab === "rehire" ? (
        <SideCard title="Re-hire tip">
          {topScored ? (
            <>
              <p className="text-xs font-semibold text-gray-900">{topScored.creatorName}</p>
              <p className="mt-1 text-[10px] text-gray-600 sm:text-xs">
                Highest score in this campaign:{" "}
                <span className="font-bold tabular-nums text-gray-900">{topScored.score}</span>
              </p>
            </>
          ) : (
            <p className="text-[10px] leading-snug text-gray-500 sm:text-xs">
              Scores need complete cost, rating, on-time, revisions, and response data.
            </p>
          )}
          {rehire?.scoreNote ? (
            <p className="mt-2 text-[10px] leading-snug text-gray-500 sm:text-xs">
              {rehire.scoreNote}
            </p>
          ) : null}
        </SideCard>
      ) : null}

      {activeTab === "overview" ? (
        <SideCard title="How to use this report">
          <ul className="list-disc space-y-1.5 pl-4 text-[10px] leading-snug text-gray-600 sm:text-xs">
            <li>Overview is the campaign scan — cost, reach, and audience.</li>
            <li>Sales & ROI appears only when Shopify tracking is on.</li>
            <li>Re-Hire ranks creators for your next collaboration.</li>
          </ul>
        </SideCard>
      ) : null}
    </aside>
  );
}

const PANE_COLUMN = "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white";

const mobileNavBtn =
  "inline-flex min-h-[30px] flex-1 items-center justify-center gap-1 rounded-md border border-gray-300 bg-white px-2 text-[10px] font-semibold text-gray-700 shadow-sm hover:bg-gray-50 sm:min-h-8 sm:text-xs";

const mobileNavBtnActive =
  "inline-flex min-h-[30px] flex-1 items-center justify-center gap-1 rounded-md border border-primary bg-primary px-2 text-[10px] font-semibold text-white shadow-sm sm:min-h-8 sm:text-xs";

export default function CompletedCampaignReport({ campaignId }) {
  const {
    data,
    isLoading,
    isError,
    message,
    activeTab,
    tabs,
    pdfNotice,
    mobilePane,
    handleTabChange,
    handleDownloadPdf,
    dismissPdfNotice,
    goToLeftPane,
    goToCenterPane,
    goToRightPane,
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
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <div className="max-w-md rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-semibold text-gray-900">Unable to load report</p>
          <p className="mt-2 text-xs text-gray-500">{message || "Please try again later."}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return <FullPageLoader />;
  }

  const { header, overview, salesAndRoi, creatorsAndContent, rehire } = data;
  const dateLabel = [formatDate(header.dateRangeStart), formatDate(header.dateRangeEnd)]
    .filter((d) => d !== "—")
    .join(" – ");
  const headerPills = [
    header.brandName,
    header.campaignType,
    header.status,
    dateLabel || null,
    `${header.creatorsCompleted} of ${header.creatorsTotal} creators completed`,
  ].filter(Boolean);

  const leftVisible = mobilePane === "left" ? "flex" : "hidden";
  const centerVisible = mobilePane === "center" ? "flex" : "hidden";
  const rightVisible = mobilePane === "right" ? "flex" : "hidden";

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gray-100 text-gray-700 md:h-screen md:flex-row md:items-stretch">
      <div className="flex shrink-0 items-center gap-1.5 border-b border-gray-200 bg-white px-2 py-2 md:hidden">
        <button
          type="button"
          className={mobilePane === "left" ? mobileNavBtnActive : mobileNavBtn}
          onClick={goToLeftPane}
        >
          Campaign
        </button>
        <button
          type="button"
          className={mobilePane === "center" ? mobileNavBtnActive : mobileNavBtn}
          onClick={goToCenterPane}
        >
          Report
        </button>
        <button
          type="button"
          className={mobilePane === "right" ? mobileNavBtnActive : mobileNavBtn}
          onClick={goToRightPane}
        >
          Details
        </button>
      </div>

      <div
        className={`${PANE_COLUMN} border-b border-gray-200 md:h-full md:w-[280px] md:max-w-[300px] md:shrink-0 md:grow-0 md:basis-[300px] md:border-b-0 md:border-r lg:w-[320px] lg:max-w-[340px] lg:basis-[340px] ${leftVisible} md:flex`}
      >
        <div className="h-full min-h-0 overflow-y-auto p-3 sm:p-4">
          <ReportLeftPanel
            header={header}
            headerPills={headerPills}
            overview={overview}
            onDownloadPdf={handleDownloadPdf}
            formatCurrency={formatCurrency}
            formatNumber={formatNumber}
            formatPercent={formatPercent}
          />
        </div>
      </div>

      <div
        className={`${PANE_COLUMN} bg-gray-100 md:h-full md:max-w-[58%] md:flex-[1_1_50%] lg:max-w-[60%] ${centerVisible} md:flex`}
      >
        <div className="flex h-full min-h-0 flex-col overflow-hidden p-3 sm:p-4">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="shrink-0 rounded-t-xl bg-primary px-3 py-3 sm:px-4 sm:py-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-indigo-100">
                    Completed campaign report
                  </p>
                  <h2 className="mt-0.5 truncate text-sm font-semibold text-white sm:text-base">
                    {tabs.find((t) => t.id === activeTab)?.label || "Overview"}
                  </h2>
                </div>
              </div>

              {pdfNotice ? (
                <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-indigo-300/40 bg-indigo-700/40 px-3 py-2 text-xs text-indigo-50">
                  <span>PDF export is coming soon (Phase 2).</span>
                  <button
                    type="button"
                    className="font-semibold text-white underline"
                    onClick={dismissPdfNotice}
                  >
                    Dismiss
                  </button>
                </div>
              ) : null}
            </div>

            <div
              className="flex w-full shrink-0 gap-0.5 border-b border-gray-200 bg-gray-100 p-1"
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
                    className={`min-h-8 flex-1 whitespace-nowrap rounded-lg px-1.5 py-1.5 text-center text-[10px] font-semibold leading-none transition-colors sm:px-2.5 sm:text-xs ${
                      active
                        ? "bg-primary text-white shadow-sm"
                        : "text-gray-600 hover:bg-white hover:text-gray-900"
                    }`}
                  >
                    <span className="md:hidden">{tab.shortLabel || tab.label}</span>
                    <span className="hidden md:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
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
        </div>
      </div>

      <div
        className={`${PANE_COLUMN} border-t border-gray-200 md:h-full md:border-l md:border-t-0 md:max-w-md md:flex-[0_1_27%] lg:max-w-lg lg:flex-[0_1_27%] ${rightVisible} md:flex`}
      >
        <ReportRightPanel
          data={data}
          activeTab={activeTab}
          formatCurrency={formatCurrency}
          formatNumber={formatNumber}
          formatPercent={formatPercent}
          formatDate={formatDate}
        />
      </div>
    </div>
  );
}
