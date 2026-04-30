import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const formatTick = (value) => {
  if (!value || typeof value !== "string") return "";
  const [, month, day] = value.split("-");
  if (!month || !day) return value;
  return `${month}/${day}`;
};

const SignupsTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-md">
      <p className="font-medium text-gray-800">{label}</p>
      <p className="text-indigo-600 font-semibold">{payload[0].value} signups</p>
    </div>
  );
};

const ApplicationsTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-md">
      <p className="font-medium text-gray-800">{label}</p>
      <p className="text-violet-600 font-semibold">{payload[0].value} applications</p>
    </div>
  );
};

function DashboardTrends({ signupsByDay, applicationsByDay, isLoading }) {
  if (isLoading) {
    return (
      <div className="mb-8 grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="h-64 bg-gray-100 rounded" />
        </div>
        <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="h-64 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <h3 className="mb-3 text-sm font-semibold text-gray-900 sm:mb-4 sm:text-lg">
          User signups (14 days, UTC)
        </h3>
        <div className="h-56 w-full min-h-[14rem] sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={signupsByDay} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="signupFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tickFormatter={formatTick} tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#9ca3af" width={36} />
              <Tooltip content={<SignupsTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#4f46e5"
                strokeWidth={2}
                fill="url(#signupFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <h3 className="mb-3 text-sm font-semibold text-gray-900 sm:mb-4 sm:text-lg">
          Creator applications (14 days, UTC)
        </h3>
        <div className="h-56 w-full min-h-[14rem] sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={applicationsByDay} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tickFormatter={formatTick} tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#9ca3af" width={36} />
              <Tooltip content={<ApplicationsTooltip />} />
              <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default DashboardTrends;
