import CustomButton from "@/common/components/custom-button/custom-button.component";
import useBackgroundEffect from "@/common/hooks/use-background-effect.hook";
import { CheckCircle } from "lucide-react";

const AccountType = ({ selectedType, handleSelectMode, onNext }) => {
  const { position } = useBackgroundEffect();

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-64 h-64 rounded-full bg-indigo-100 blur-xl opacity-60"
          style={{
            left: `calc(10% + ${position.x}px)`,
            top: `calc(30% + ${position.y}px)`,
            transition: "all 0.3s ease",
          }}
        />
        <div
          className="absolute w-96 h-96 rounded-full bg-indigo-200 blur-xl opacity-50"
          style={{
            right: `calc(15% + ${position.x * -1}px)`,
            bottom: `calc(20% + ${position.y * -1}px)`,
            transition: "all 0.5s ease",
          }}
        />
        <div
          className="absolute w-48 h-48 rounded-full bg-indigo-300 blur-xl opacity-40"
          style={{
            left: `calc(50% + ${position.y}px)`,
            top: `calc(15% + ${position.x}px)`,
            transition: "all 0.4s ease",
          }}
        />
      </div>
      {/* Container */}
      <div className="w-full max-w-3xl rounded-3xl shadow-2xl p-10 space-y-5">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">Let's Get Started</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-autoa">
            Choose how you'd like to use CleerCut and unlock opportunities that match your goals
          </p>
        </div>

        {/* Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AccountCard
            title="I'm a Creator"
            description="Collaborate with brands and grow your influence."
            selected={selectedType === "creator"}
            onClick={() => handleSelectMode("creator")}
          />

          <AccountCard
            title="I'm a Brand or Agency"
            description="Post campaigns and work with top creators."
            selected={selectedType === "brand"}
            onClick={() => handleSelectMode("brand")}
          />
        </div>

        {/* Continue Button */}
        <div className="pt-4 flex justify-center">
          <CustomButton
            onClick={onNext}
            disabled={!selectedType}
            text={`Continue as ${
              selectedType === "creator" ? "Creator" : selectedType === "brand" ? "Brand" : "..."
            }`}
            className="btn-primary text-white"
          />
        </div>
      </div>
    </div>
  );
};

const AccountCard = ({ title, description, selected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer group hover:shadow-lg
        ${selected ? "border-primary bg-indigo-50 shadow-xl" : "border-gray-200 bg-white"}
      `}
    >
      {selected && (
        <div className="absolute -top-3 -right-3 bg-primary rounded-full w-9 h-9 flex items-center justify-center shadow">
          <CheckCircle className="w-5 h-5 text-white" />
        </div>
      )}
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
};

export default AccountType;
