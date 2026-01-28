import CustomButton from "@/common/components/custom-button/custom-button.component";
import { CreditCard, ExternalLink, AlertTriangle, X } from "lucide-react";
import usePayoutMethod from "./use-payout-method.hook";

const PayoutMethodsPage = () => {
  const { statusConfig, isLoading, connectError, setConnectError } = usePayoutMethod();

  return (
    <>
      {/* Header */}
      <div className="bg-primary p-4 rounded-lg text-white mb-4">
        <h1 className="text-xl font-bold text-white">Payouts</h1>
        <p className="text-sm mt-1">Connect Stripe to receive escrow payments.</p>
      </div>

      <div className="space-y-6">
        {/* Connect Error Warning Banner */}
        {connectError && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-yellow-800 mb-1">
                  Stripe Connect Not Enabled
                </h3>
                <p className="text-sm text-yellow-700 mb-2">
                  Stripe Connect is a feature that allows CleerCut to send payments directly to creators' bank accounts. 
                  Your Stripe account needs to have Connect enabled before creators can receive payouts.
                </p>
                <p className="text-sm text-yellow-700 mb-2">
                  <strong>To enable Stripe Connect:</strong>
                </p>
                <ol className="text-sm text-yellow-700 mb-3 ml-4 list-decimal space-y-1">
                  <li>Log into your Stripe Dashboard</li>
                  <li>Go to Settings → Connect</li>
                  <li>Complete the Connect setup process</li>
                  <li>Return here and try again</li>
                </ol>
                <a
                  href="https://dashboard.stripe.com/settings/connect"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-yellow-800 hover:text-yellow-900 underline"
                >
                  Open Stripe Dashboard →
                </a>
              </div>
              <button
                onClick={() => setConnectError(null)}
                className="p-1 hover:bg-yellow-100 rounded transition-colors"
              >
                <X className="h-4 w-4 text-yellow-600" />
              </button>
            </div>
          </div>
        )}

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

              {/* Status Description */}
              {statusConfig.description && (
                <div className="mt-4 space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700 mb-3 font-medium">{statusConfig.description}</p>
                    {statusConfig.details && statusConfig.details.length > 0 && (
                      <ul className="space-y-2">
                        {statusConfig.details.map((detail, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="text-indigo-600 font-semibold mt-0.5">•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* What You Need Section */}
                  {statusConfig.whatYouNeed && statusConfig.whatYouNeed.length > 0 && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-900 mb-2">
                        What you'll need:
                      </h4>
                      <ul className="space-y-2">
                        {statusConfig.whatYouNeed.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-blue-800">
                            <span className="text-blue-600 font-semibold mt-0.5">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Helper Text */}
              <p className="text-sm text-gray-500 mt-4">
                <strong>Security:</strong> Stripe manages your payout method and identity verification. CleerCut does not store bank details.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: How payouts work */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">How payouts work</h2>
            <ul className="space-y-1 mb-6">
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
                  Funds are automatically transferred to your connected bank account via Stripe
                </span>
              </li>
            </ul>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-800 mb-1">
                    Is my information secure?
                  </h4>
                  <p className="text-xs text-gray-600">
                    Yes! Stripe is a PCI-compliant payment processor trusted by millions. CleerCut never sees or stores your bank account details.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-800 mb-1">
                    How long does setup take?
                  </h4>
                  <p className="text-xs text-gray-600">
                    Typically 5-10 minutes if you have all required documents ready. Identity verification may take 1-2 business days.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-800 mb-1">
                    When will I receive payments?
                  </h4>
                  <p className="text-xs text-gray-600">
                    Once your Stripe account is fully set up and verified, payments will be automatically transferred to your bank account after work is completed and approved.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-800 mb-1">
                    Can I use a business bank account?
                  </h4>
                  <p className="text-xs text-gray-600">
                    Yes! You can connect either a personal or business bank account, depending on your account type.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PayoutMethodsPage;
