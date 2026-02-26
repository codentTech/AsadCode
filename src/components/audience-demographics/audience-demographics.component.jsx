import React from "react";
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

import { DEFAULT_COLORS, useAudienceDemographics } from "./use-audience-demographics.hook";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const name = payload[0].payload?.name ?? payload[0].name ?? label;
    return (
      <div className="flex bg-white p-3 shadow-lg rounded-md border border-gray-200">
        <p className="font-medium text-gray-800">{name}</p>
        <p className="text-indigo-600 font-bold">{`${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ items }) => (
  <div className="flex flex-wrap justify-center gap-4 mt-2">
    {items.map((item) => (
      <div key={item.id} className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
        <span className="text-xs text-gray-600">
          {item.percentage != null ? `${item.percentage}%` : ""}
        </span>
      </div>
    ))}
  </div>
);

/** Renders "Male" and "30%" outside the pie ring so labels don't sit on the graph */
const renderPieLabel = ({ cx, cy, midAngle, outerRadius, name, value }) => {
  const RADIAN = Math.PI / 180;
  const labelRadius = outerRadius + 22;
  const x = cx + labelRadius * Math.cos(-midAngle * RADIAN);
  const y = cy + labelRadius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#111827"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      <tspan x={x} y={y - 5} display="block">
        {name}
      </tspan>
      <tspan x={x} y={y + 7} display="block">
        {value}%
      </tspan>
    </text>
  );
};

const ChartSkeleton = () => (
  <div className="animate-pulse space-y-3">
    <div className="h-4 bg-gray-200 rounded w-1/2" />
    <div className="h-32 bg-gray-200 rounded" />
  </div>
);

const EmptyState = ({ message = "No data available" }) => (
  <div className="flex items-center justify-center min-h-[80px] py-4">
    <p className="text-sm text-gray-500 text-center">{message}</p>
  </div>
);

/**
 * AudienceDemographics – charts use only real distribution data from API (Phyllo).
 * When API returns audience_age_distribution, audience_gender_distribution,
 * audience_country_distribution, they are shown as graphs. Otherwise that section
 * shows an empty state (no guessed percentages).
 */
function AudienceDemographics({
  audienceData,
  loading = false,
  className = "grid grid-cols-1 xl:grid-cols-2",
}) {
  const {
    colors,
    ageData,
    genderData,
    locationData,
    ageColorItems,
    genderColorItems,
    locationColorItems,
  } = useAudienceDemographics(audienceData, DEFAULT_COLORS);

  if (loading) {
    return (
      <div className={`${className} gap-3`}>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <ChartSkeleton />
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <ChartSkeleton />
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  if (!audienceData?.has_data) {
    return (
      <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100">
        <EmptyState message="No audience demographics available yet." />
      </div>
    );
  }

  return (
    <div className={`${className} gap-3`}>
      {/* Age distribution */}
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <h5 className="text-sm font-medium text-gray-700 mb-4">Age Distribution</h5>
        {ageData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={ageData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  unit="%"
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={false}
                  width={30}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={30} name="Percentage">
                  {ageData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors.age[index % colors.age.length]}
                      name={entry.name}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <CustomLegend items={ageColorItems} />
          </>
        ) : (
          <EmptyState message="No age distribution from Phyllo. API may not return percentage data for this account yet." />
        )}
      </div>

      {/* Gender distribution */}
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <h5 className="text-sm font-medium text-gray-700 mb-4">Gender Distribution</h5>
        {genderData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart margin={{ top: 25, right: 25, left: 25, bottom: 25 }}>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  nameKey="name"
                  dataKey="value"
                  label={renderPieLabel}
                  labelLine={false}
                  outerRadius={60}
                  innerRadius={50}
                  paddingAngle={2}
                >
                  {genderData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors.gender[index % colors.gender.length]}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <CustomLegend items={genderColorItems} />
          </>
        ) : (
          <EmptyState message="No gender distribution from Phyllo. API may not return percentage data for this account yet." />
        )}
      </div>

      {/* Location distribution */}
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <h5 className="text-sm font-medium text-gray-700 mb-4">Top Countries</h5>
        {locationData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={locationData} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={false}
                  interval={0}
                  angle={-35}
                  textAnchor="end"
                />
                <YAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  unit="%"
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={false}
                  width={30}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={24} name="Percentage">
                  {locationData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors.location[index % colors.location.length]}
                      name={entry.name}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <CustomLegend items={locationColorItems} />
          </>
        ) : (
          <EmptyState message="No country distribution from Phyllo. API may not return percentage data for this account yet." />
        )}
      </div>
    </div>
  );
}

export default AudienceDemographics;
