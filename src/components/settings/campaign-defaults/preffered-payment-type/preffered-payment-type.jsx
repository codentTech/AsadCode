import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import {
  CheckCircle,
  CreditCard,
  DollarSign,
  Gift,
  Info,
  Percent,
  Save,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

const PreferredPaymentType = () => {
  const [selectedPaymentTypes, setSelectedPaymentTypes] = useState(["fixed"]);
  const [fixedRates, setFixedRates] = useState({
    post: "",
    story: "",
    reel: "",
    video: "",
  });
  const [commissionRate, setCommissionRate] = useState("");
  const [giftedMinValue, setGiftedMinValue] = useState("");

  const paymentTypes = [
    {
      id: "fixed",
      label: "Fixed Payment",
      shortLabel: "Fixed",
      desc: "Set upfront payment for content creation",
      icon: DollarSign,
      color: "from-green-400 to-emerald-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-500",
      benefits: [
        "Guaranteed payment",
        "Clear expectations",
        "No sales pressure",
        "Immediate income",
      ],
      recommended: true,
    },
    {
      id: "gifted",
      label: "Gifted Products",
      shortLabel: "Gifted",
      desc: "Receive free products in exchange for content",
      icon: Gift,
      color: "from-pink-400 to-rose-500",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-500",
      benefits: ["Try new products", "No upfront costs", "Build relationships", "Content variety"],
      recommended: true,
    },
    {
      id: "commission",
      label: "Commission Based",
      shortLabel: "Commission",
      desc: "Earn percentage on sales generated through your content",
      icon: Percent,
      color: "from-purple-400 to-indigo-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-500",
      benefits: [
        "Unlimited earning",
        "Performance rewards",
        "Long-term income",
        "Scale with success",
      ],
      recommended: false,
    },
  ];

  const contentTypes = [
    { id: "post", label: "Instagram Post", placeholder: "150" },
    { id: "story", label: "Instagram Story", placeholder: "50" },
    { id: "reel", label: "Instagram Reel", placeholder: "200" },
    { id: "video", label: "YouTube Video", placeholder: "500" },
  ];

  const togglePaymentType = (typeId) => {
    setSelectedPaymentTypes((prev) =>
      prev.includes(typeId) ? prev.filter((id) => id !== typeId) : [...prev, typeId]
    );
  };

  const handleFixedRateChange = (contentType, value) => {
    setFixedRates((prev) => ({
      ...prev,
      [contentType]: value,
    }));
  };

  return (
    <>
      {/* Header */}
      <div className="mb-3 rounded-lg bg-primary p-3 text-white sm:mb-4 sm:p-4">
        <h1 className="text-sm font-semibold text-white sm:text-lg md:text-xl">Preferred Payment Type</h1>
        <p className="mt-1 text-[10px] leading-snug sm:text-xs md:text-sm">
          Set your default payment preferences to help brands understand how you prefer to be
          compensated.
        </p>
      </div>

      {/* Info Banner */}
      <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 sm:mb-6 sm:p-4">
        <div className="flex items-start space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg flex-shrink-0">
            <Info className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h3 className="mb-1 text-xs font-medium text-blue-900 sm:text-sm">Payment Preferences</h3>
            <p className="text-xs leading-relaxed text-blue-800 sm:text-sm">
              You can select multiple payment types. Brands will see your preferences when creating
              campaigns with you.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Type Selection */}
      <div className="mb-6 grid gap-3 sm:gap-4 lg:grid-cols-3">
        {paymentTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedPaymentTypes.includes(type.id);

          return (
            <div
              key={type.id}
              onClick={() => togglePaymentType(type.id)}
              className={`
                  relative rounded-xl border-2 p-3 sm:p-5 cursor-pointer transition-all duration-200 hover:shadow-lg
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
                <div className="absolute -top-2 left-4">
                  <div className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full">
                    ⭐ POPULAR
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
                  <h3 className="text-sm font-bold leading-tight text-gray-900 sm:text-lg">{type.label}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-gray-600 sm:text-sm">{type.desc}</p>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-1">
                {type.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start text-xs text-gray-600 sm:text-sm">
                    <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="leading-tight">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Fixed Payment Rates */}
        {selectedPaymentTypes.includes("fixed") && (
          <div className="rounded-lg border bg-white p-3 shadow-sm sm:p-5">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <CreditCard className="h-4 w-4 text-green-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 sm:text-lg">Fixed Payment Rates</h3>
            </div>

            <div className="space-y-4">
              {contentTypes.map((content) => (
                <CustomInput
                  key={content.id}
                  label={content.label}
                  name={`${content.id}Rate`}
                  type="number"
                  placeholder={content.placeholder}
                  value={fixedRates[content.id]}
                  onChange={(e) => handleFixedRateChange(content.id, e.target.value)}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Set your standard rates for different content types (USD)
            </p>
          </div>
        )}

        {/* Commission Settings */}
        {selectedPaymentTypes.includes("commission") && (
          <div className="rounded-lg border bg-white p-3 shadow-sm sm:p-5">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 sm:text-lg">Commission Settings</h3>
            </div>

            <div className="space-y-4">
              <CustomInput
                label="Preferred Commission Rate (%)"
                name="commissionRate"
                type="number"
                placeholder="15"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
              />
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Your preferred commission percentage for affiliate sales
            </p>
          </div>
        )}

        {/* Gifted Product Settings */}
        {selectedPaymentTypes.includes("gifted") && (
          <div className="rounded-lg border bg-white p-3 shadow-sm sm:p-5">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
                <Gift className="h-4 w-4 text-pink-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 sm:text-lg">Gifted Product Settings</h3>
            </div>

            <div className="space-y-4">
              <CustomInput
                label="Minimum Product Value (USD)"
                name="giftedMinValue"
                type="number"
                placeholder="50"
                value={giftedMinValue}
                onChange={(e) => setGiftedMinValue(e.target.value)}
              />
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Minimum value for gifted products you're willing to accept
            </p>
          </div>
        )}

        {/* Summary & Save */}
        <div className="rounded-lg border bg-white p-3 shadow-sm sm:p-5">
          <h3 className="mb-4 text-sm font-semibold text-gray-900 sm:text-lg">Payment Summary</h3>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Selected Payment Types</span>
              <span className="text-sm font-medium">{selectedPaymentTypes.length}</span>
            </div>

            {selectedPaymentTypes.includes("fixed") && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Fixed Rates Set</span>
                <span className="text-sm font-medium">
                  {Object.values(fixedRates).filter((rate) => rate && parseInt(rate) > 0).length}
                  /4
                </span>
              </div>
            )}

            {selectedPaymentTypes.includes("commission") && commissionRate && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Commission Rate</span>
                <span className="text-sm font-medium">{commissionRate}%</span>
              </div>
            )}

            {selectedPaymentTypes.includes("gifted") && giftedMinValue && (
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Min Gifted Value</span>
                <span className="text-sm font-medium">${giftedMinValue}</span>
              </div>
            )}
          </div>

          <CustomButton
            text="Save Payment Preferences"
            className="btn-primary w-full"
            icon={Save}
            disabled={selectedPaymentTypes.length === 0}
          />
          <p className="text-xs text-gray-500 text-center mt-2">
            These preferences will be shown to brands
          </p>
        </div>
      </div>
    </>
  );
};

export default PreferredPaymentType;
