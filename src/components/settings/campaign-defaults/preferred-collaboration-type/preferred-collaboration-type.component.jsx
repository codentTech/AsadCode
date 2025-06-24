import CustomButton from "@/common/components/custom-button/custom-button.component";
import SidebarLayout from "@/common/layouts/sidebar.layout";
import { CheckCircle, DollarSign, Gift, Info, Percent, TrendingUp, Users, Zap } from "lucide-react";
import { useState } from "react";

const PreferredCollaborationType = () => {
  const [selectedTypes, setSelectedTypes] = useState(["gifted"]); // Default selection

  const collaborationTypes = [
    {
      id: "gifted",
      label: "Gifted Collaborations",
      shortLabel: "Gifted",
      desc: "Receive free products or services in exchange for content creation",
      icon: Gift,
      color: "from-emerald-400 to-green-500",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-500",
      textColor: "text-emerald-700",
      iconBg: "bg-emerald-500",
      benefits: [
        "No upfront costs",
        "Try products before promoting",
        "Build brand relationships",
        "Great for beginners",
      ],
      stats: {
        popularity: "92%",
        avgValue: "$50-300",
        timeToStart: "1-3 days",
      },
      recommended: true,
    },
    {
      id: "paid",
      label: "Paid Collaborations",
      shortLabel: "Paid",
      desc: "Get paid upfront for creating and posting sponsored content",
      icon: DollarSign,
      color: "from-blue-400 to-indigo-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-500",
      textColor: "text-blue-700",
      iconBg: "bg-blue-500",
      benefits: [
        "Guaranteed income",
        "Professional partnerships",
        "Higher earning potential",
        "Predictable revenue",
      ],
      stats: {
        popularity: "78%",
        avgValue: "$200-2000",
        timeToStart: "3-7 days",
      },
      recommended: true,
    },
    {
      id: "affiliate",
      label: "Affiliate Marketing",
      shortLabel: "Affiliate",
      desc: "Earn commission on sales generated through your unique links",
      icon: Percent,
      color: "from-purple-400 to-pink-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-500",
      textColor: "text-purple-700",
      iconBg: "bg-purple-500",
      benefits: [
        "Unlimited earning potential",
        "Passive income opportunity",
        "Performance-based rewards",
        "Long-term partnerships",
      ],
      stats: {
        popularity: "65%",
        avgValue: "5-30% commission",
        timeToStart: "Immediate",
      },
      recommended: true,
    },
  ];

  const toggleCollaborationType = (typeId) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId) ? prev.filter((id) => id !== typeId) : [...prev, typeId]
    );
  };

  const getRecommendationText = () => {
    if (selectedTypes.length === 0) return "Select at least one collaboration type";
    if (selectedTypes.length === 1) return "Consider adding more types to increase opportunities";
    if (selectedTypes.length === 2) return "Great combination! You'll get diverse opportunities";
    return "Perfect! Maximum opportunities across all collaboration types";
  };

  return (
    <SidebarLayout>
      <div className="max-w-8xl mx-auto min-h-screen">
        {/* Header */}
        <div className="bg-primary p-4 rounded-lg text-white mb-4">
          <h1 className="text-xl font-bold text-white">Preferred Collaboration Type</h1>
          <p className="text-sm mt-1">
            Choose your default collaboration preferences. This helps brands understand how you
            prefer to work together.
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg flex-shrink-0">
              <Info className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Why This Matters</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                Your collaboration preferences help brands find you for the right opportunities. You
                can always change these later and negotiate different terms for specific campaigns.
              </p>
            </div>
          </div>
        </div>

        {/* Collaboration Type Cards */}
        <div className="grid lg:grid-cols-3 gap-4 mb-6">
          {collaborationTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedTypes.includes(type.id);

            return (
              <div
                key={type.id}
                onClick={() => toggleCollaborationType(type.id)}
                className={`
                  relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg
                  ${
                    isSelected
                      ? `${type.borderColor} ${type.bgColor} shadow-md`
                      : "border-gray-200 bg-white hover:border-indigo-200"
                  }
                `}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                )}

                {/* Recommended Badge */}
                {type.recommended && (
                  <div className="absolute -top-2 right-12">
                    <div className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full">
                      <Zap className="h-3 w-3 mr-1" />
                      RECOMMENDED
                    </div>
                  </div>
                )}

                {/* Header */}
                <div className="flex items-start space-x-3 mb-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${type.color} rounded-xl flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">{type.label}</h3>
                    <p className="text-gray-600 text-sm mt-1 leading-relaxed">{type.desc}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-900">
                      {type.stats.popularity}
                    </div>
                    <div className="text-xs text-gray-500">Popular</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-900">{type.stats.avgValue}</div>
                    <div className="text-xs text-gray-500">Avg Value</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-900">
                      {type.stats.timeToStart}
                    </div>
                    <div className="text-xs text-gray-500">Time to Start</div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-1">
                  <h4 className="font-medium text-gray-900 text-sm mb-2">Key Benefits:</h4>
                  {type.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start text-sm text-gray-600">
                      <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="leading-tight">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selection Summary & Action */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left side - Summary */}
            <div className="flex-1">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Your Collaboration Preferences
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{getRecommendationText()}</p>

                  {/* Selected Types Display */}
                  {selectedTypes.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedTypes.map((typeId) => {
                        const type = collaborationTypes.find((t) => t.id === typeId);
                        return (
                          <div
                            key={typeId}
                            className={`inline-flex items-center px-3 py-1 rounded-full border ${type.borderColor} ${type.bgColor} ${type.textColor}`}
                          >
                            <type.icon className="h-3 w-3 mr-1" />
                            <span className="text-sm font-medium">{type.shortLabel}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Opportunity Estimate */}
                  <div className="inline-flex items-center bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg px-3 py-2">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-700">
                      {selectedTypes.length === 0
                        ? "0"
                        : selectedTypes.length === 1
                          ? "150+"
                          : selectedTypes.length === 2
                            ? "300+"
                            : "500+"}{" "}
                      estimated monthly opportunities
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Action */}
            <div className="lg:w-auto">
              <CustomButton
                text="Save Collaboration Preferences"
                className="btn-primary w-full lg:w-auto"
                disabled={selectedTypes.length === 0}
              />
              <p className="text-xs text-gray-500 mt-2 text-center lg:text-left">
                You can update these anytime in your dashboard
              </p>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default PreferredCollaborationType;
