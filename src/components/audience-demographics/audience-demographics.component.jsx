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

import AudienceChartSkeleton from "./components/audience-chart-skeleton.component";
import AudienceEmptyState from "./components/audience-empty-state.component";
import CustomLegend from "./components/custom-legend.component";
import CustomTooltip from "./components/custom-tooltip.component";
import { renderPieLabel } from "./components/render-pie-label";
import { DEFAULT_COLORS, useAudienceDemographics } from "./use-audience-demographics.hook";

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
  platform = null,
  emptyMessage = null,
}) {
  const {
    colors,
    ageData,
    genderData,
    locationData,
    ageColorItems,
    genderColorItems,
    locationColorItems,
    cityData,
    cityColorItems,
  } = useAudienceDemographics(audienceData, DEFAULT_COLORS, platform);

  const showTopCities =
    platform?.toLowerCase() === "instagram" && Array.isArray(cityData) && cityData.length > 0;

  if (loading) {
    return (
      <div className={`${className} gap-3`}>
        <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
          <AudienceChartSkeleton />
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
          <AudienceChartSkeleton />
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
          <AudienceChartSkeleton />
        </div>
      </div>
    );
  }

  if (audienceData?.no_connection) {
    return (
      <div className="rounded-lg border border-gray-100 bg-white p-2 shadow-sm">
        <AudienceEmptyState
          message={
            audienceData?.empty_message ||
            "This creator has not connected their social media platforms."
          }
        />
      </div>
    );
  }

  if (!audienceData?.has_data) {
    return (
      <div className="rounded-lg border border-gray-100 bg-gray-100 shadow-sm">
        <AudienceEmptyState message={emptyMessage || "No audience demographics available yet."} />
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
          <AudienceEmptyState message="No age distribution from Phyllo. API may not return percentage data for this account yet." />
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
          <AudienceEmptyState message="No country distribution from Phyllo. API may not return percentage data for this account yet." />
        )}
      </div>

      {/* Top Follower Cities: Instagram only (Phyllo does not provide for TikTok/YouTube) */}
      {showTopCities && (
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <h5 className="text-sm font-medium text-gray-700 mb-4">Top Follower Cities</h5>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={cityData} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
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
                {cityData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors.location[index % colors.location.length]}
                    name={entry.name}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <CustomLegend items={cityColorItems} />
        </div>
      )}
    </div>
  );
}

export default AudienceDemographics;
