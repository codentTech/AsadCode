import { Calendar, Mail, UserCheck, Users } from "lucide-react";

function StatsCards({ users }) {
  const totalUsers = users.length;
  const pendingUsers = users.filter((u) => u.status === "pending").length;
  const approvedUsers = users.filter((u) => u.status === "approved").length;
  const highPriorityUsers = users.filter((u) => u.priority === "high").length;

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "indigo",
    },
    {
      title: "Pending",
      value: pendingUsers,
      icon: Calendar,
      color: "yellow",
    },
    {
      title: "Approved",
      value: approvedUsers,
      icon: UserCheck,
      color: "green",
    },
    {
      title: "High Priority",
      value: highPriorityUsers,
      icon: Mail,
      color: "red",
    },
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      indigo: "bg-indigo-100 text-indigo-600",
      yellow: "bg-yellow-100 text-yellow-600",
      green: "bg-green-100 text-green-600",
      red: "bg-red-100 text-red-600",
    };
    return colorMap[color] || "bg-gray-100 text-gray-600";
  };

  const getTextColor = (color) => {
    const colorMap = {
      indigo: "text-gray-900",
      yellow: "text-yellow-600",
      green: "text-green-600",
      red: "text-red-600",
    };
    return colorMap[color] || "text-gray-900";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className={`text-3xl font-bold ${getTextColor(stat.color)}`}>{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full ${getColorClasses(stat.color)}`}>
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;
