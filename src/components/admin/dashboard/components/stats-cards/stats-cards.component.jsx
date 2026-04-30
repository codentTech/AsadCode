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
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
          >
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
            <div className="h-8 bg-gray-200 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
      {items.map((stat, index) => {
        const inner = (
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] font-medium text-gray-600 sm:text-xs md:text-sm">{stat.title}</p>
              <p className={`text-xl font-bold tabular-nums sm:text-2xl md:text-3xl ${getTextColor(stat.color)}`}>
                {stat.value}
              </p>
            </div>
            <div className={`shrink-0 rounded-full p-2 sm:p-3 ${getColorClasses(stat.color)}`}>
              <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          </div>
        );

        const cardClass =
          "rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow sm:p-6 " +
          (stat.href ? "cursor-pointer hover:shadow-md" : "hover:shadow-md");

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
