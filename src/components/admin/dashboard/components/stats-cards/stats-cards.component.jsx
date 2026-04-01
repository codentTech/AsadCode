import Link from "next/link";

function StatsCards({ items, isLoading }) {
  const getColorClasses = (color) => {
    const colorMap = {
      indigo: "bg-indigo-100 text-indigo-600",
      violet: "bg-violet-100 text-violet-600",
      sky: "bg-sky-100 text-sky-600",
      emerald: "bg-emerald-100 text-emerald-600",
      amber: "bg-amber-100 text-amber-600",
      rose: "bg-rose-100 text-rose-600",
      cyan: "bg-cyan-100 text-cyan-600",
      orange: "bg-orange-100 text-orange-600",
      red: "bg-red-100 text-red-600",
      fuchsia: "bg-fuchsia-100 text-fuchsia-600",
      yellow: "bg-yellow-100 text-yellow-600",
      green: "bg-green-100 text-green-600",
    };
    return colorMap[color] || "bg-gray-100 text-gray-600";
  };

  const getTextColor = (color) => {
    const colorMap = {
      indigo: "text-gray-900",
      violet: "text-violet-700",
      sky: "text-sky-700",
      emerald: "text-emerald-700",
      amber: "text-amber-700",
      rose: "text-rose-700",
      cyan: "text-cyan-800",
      orange: "text-orange-700",
      red: "text-red-700",
      fuchsia: "text-fuchsia-800",
      yellow: "text-yellow-600",
      green: "text-green-600",
    };
    return colorMap[color] || "text-gray-900";
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
            <div className="h-8 bg-gray-200 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
      {items.map((stat, index) => {
        const inner = (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className={`text-3xl font-bold ${getTextColor(stat.color)}`}>{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full ${getColorClasses(stat.color)}`}>
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
        );

        const cardClass =
          "bg-white p-6 rounded-xl shadow-sm border border-gray-200 transition-shadow " +
          (stat.href ? "hover:shadow-md cursor-pointer" : "hover:shadow-md");

        if (stat.href) {
          return (
            <Link key={index} href={stat.href} className={`block ${cardClass}`}>
              {inner}
            </Link>
          );
        }

        return (
          <div key={index} className={cardClass}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}

export default StatsCards;
