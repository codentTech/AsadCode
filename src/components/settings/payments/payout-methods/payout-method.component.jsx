import CustomButton from "@/common/components/custom-button/custom-button.component";
import { CreditCard, ExternalLink } from "lucide-react";
import usePayoutMethod from "./use-payout-method.hook";

const PayoutMethodsPage = () => {
  const { statusConfig, isLoading } = usePayoutMethod();

  return (
    <>
      {/* Header */}
      <div className="bg-primary p-4 rounded-lg text-white mb-4">
        <h1 className="text-xl font-bold text-white">Payouts</h1>
        <p className="text-sm mt-1">Connect Stripe to receive escrow payments.</p>
      </div>

      <div className="space-y-6">
        {/* Card 1: Stripe Account */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Stripe Account</h2>
            </div>

            <div className="space-y-4">
              {/* Status Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-lg">
                    <CreditCard className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.badgeColor}`}
                      >
                        {statusConfig.badge}
                      </span>
                    </div>
                  </div>
                </div>
                <CustomButton
                  text={statusConfig.buttonText}
                  className="btn-primary"
                  onClick={statusConfig.buttonAction}
                  icon={statusConfig.buttonText.includes("Stripe") ? ExternalLink : null}
                  loading={isLoading}
                  disabled={isLoading}
                />
              </div>

              {/* Helper Text */}
              <p className="text-sm text-gray-500 mt-4">
                Stripe manages your payout method and identity verification. CleerCut does not store
                bank details.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: How payouts work */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">How payouts work</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-indigo-600 font-semibold mt-0.5">•</span>
                <span className="text-sm text-gray-700">Brands fund escrow when they hire you</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-600 font-semibold mt-0.5">•</span>
                <span className="text-sm text-gray-700">
                  Escrow releases when the brand marks work complete or after admin resolution
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-600 font-semibold mt-0.5">•</span>
                <span className="text-sm text-gray-700">
                  Funds pay out to your connected Stripe account
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default PayoutMethodsPage;
