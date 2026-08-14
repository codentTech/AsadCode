import CustomButton from "@/common/components/custom-button/custom-button.component";
import { CheckCircle } from "lucide-react";
import PropTypes from "prop-types";
import useAccountType from "./use-account-type.hook";

const AccountType = ({ selectedType, handleSelectMode, onNext, onContinueWithEmail }) => {
  const { position, handleBackToLogin } = useAccountType();

  return (
    <div className="relative flex min-h-screen items-center justify-center px-2.5 py-6 sm:px-4 sm:py-12">
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
      <div className="w-full max-w-3xl space-y-4 rounded-2xl p-3 shadow-2xl sm:space-y-5 sm:rounded-3xl sm:p-10">
        <div className="mb-4 text-center sm:mb-8">
          <h1 className="mb-1 text-sm font-semibold text-gray-900 sm:mb-2 sm:text-lg md:text-xl lg:text-3xl">
            Let's Get Started
          </h1>
          <p className="mx-autoa max-w-3xl text-[10px] text-gray-600 sm:text-xs md:text-sm lg:text-lg">
            Choose how you'd like to use CleerCut and unlock opportunities that match your goals
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:gap-6 md:grid-cols-2">
          <AccountCard
            title="I'm a Creator"
            description="Collaborate with brands and grow your influence."
            selected={selectedType === "creator"}
            onClick={() => handleSelectMode("creator")}
          />

          <AccountCard
            title="I'm a Client"
            description="Post campaigns and work with top creators."
            selected={selectedType === "brand"}
            onClick={() => handleSelectMode("brand")}
          />
        </div>

        <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-between sm:pt-4">
          <CustomButton
            onClick={handleBackToLogin}
            text="Back to login"
            className="btn-secondary w-full sm:w-auto"
          />
          <CustomButton
            onClick={onNext}
            disabled={!selectedType}
            text="Next"
            className="btn-primary w-full text-white sm:w-auto"
          />
        </div>
        {onContinueWithEmail ? (
          <p className="text-center text-[10px] text-gray-600 sm:text-xs">
            Already started signup?{" "}
            <button
              type="button"
              onClick={onContinueWithEmail}
              className="font-semibold text-indigo-600 underline hover:text-indigo-700"
            >
              Continue with your email
            </button>
          </p>
        ) : null}
      </div>
    </div>
  );
};

const AccountCard = ({ title, description, selected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`group relative cursor-pointer rounded-xl border-2 p-3 transition-all duration-300 hover:shadow-lg sm:p-6
        ${selected ? "border-primary bg-indigo-50 shadow-xl" : "border-gray-200 bg-white"}
      `}
    >
      {selected && (
        <div className="absolute -right-2.5 -top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary shadow sm:-right-3 sm:-top-3 sm:h-9 sm:w-9">
          <CheckCircle className="w-5 h-5 text-white" />
        </div>
      )}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900 sm:text-xl">{title}</h3>
        <p className="text-[10px] text-gray-600 sm:text-sm">{description}</p>
      </div>
    </div>
  );
};

AccountType.propTypes = {
  selectedType: PropTypes.string,
  handleSelectMode: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onContinueWithEmail: PropTypes.func,
};

export default AccountType;
