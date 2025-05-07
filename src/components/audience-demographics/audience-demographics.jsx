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
  Legend,
} from "recharts";
import useAudienceDemographics from "./use-audience-demographics";

// Custom tooltip with improved styling
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-lg rounded-md border border-gray-200">
        <p className="font-medium text-gray-800">{label || payload[0].name}</p>
        <p className="text-indigo-600 font-bold">{`${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

// Generate custom legend items for better control
const generateCustomAgeColors = ({ colors, ageData }) => {
  return ageData.map((item, index) => ({
    value: item.name,
    color: colors.age[index % colors.age.length],
    id: `age-${index}`,
  }));
};

const generateCustomLocationColors = ({ colors, locationData }) => {
  return locationData.map((item, index) => ({
    value: item.name,
    color: colors.location[index % colors.location.length],
    id: `location-${index}`,
  }));
};

// Custom Legend component for more flexibility
const CustomLegend = ({ items }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-2">
      {items.map((item) => (
        <div key={item.id} className="flex items-center">
          <div
            className="w-3 h-3 rounded-full mr-1"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-xs text-gray-600">{item.value}</span>
        </div>
      ))}
    </div>
  );
};

function AudienceDemographics({ className }) {
  const { colors, genderData, ageData, locationData } =
    useAudienceDemographics();

  // Generate legend items
  const ageColorItems = generateCustomAgeColors({ colors, ageData });
  const locationColorItems = generateCustomLocationColors({
    colors,
    locationData,
  });
  return (
    <div className={`${""} px-2`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Audience Demographics
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Age Chart */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-sm font-medium text-gray-700">
              Age Distribution
            </h5>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              Last 30 days
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={ageData}
              margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />
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
              <Bar
                dataKey="value"
                radius={[4, 4, 0, 0]}
                barSize={30}
                name="Percentage"
              >
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
        </div>

        {/* Gender Chart */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-sm font-medium text-gray-700">
              Gender Distribution
            </h5>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              Last 30 days
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart margin={{ top: 10, right: 10, left: 10, bottom: -20 }}>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                innerRadius={50}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
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
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
                iconType="circle"
                iconSize={10}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Location Chart */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-sm font-medium text-gray-700">
              Location Distribution
            </h5>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              Last 30 days
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={locationData}
              layout="vertical"
              margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="#f0f0f0"
              />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "#6b7280" }}
                unit="%"
                axisLine={{ stroke: "#e5e7eb" }}
                tickLine={false}
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 11, fill: "#6b7280" }}
                width={40}
                axisLine={{ stroke: "#e5e7eb" }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="value"
                radius={[0, 4, 4, 0]}
                barSize={20}
                name="Percentage"
              >
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
        </div>
      </div>
    </div>
  );
}

export default AudienceDemographics;
