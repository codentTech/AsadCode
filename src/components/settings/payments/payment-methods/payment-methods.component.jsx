"use client";

import { useEffect } from "react";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import Modal from "@/common/components/modal/modal.component";
import { CreditCard, Plus, Trash2, AlertCircle, CheckCircle2 } from "lucide-react";
import usePaymentMethods from "./use-payment-methods.hook";

// Card Form Component
function CardFormComponent({
  stripePromise,
  setupIntentClientSecret,
  onSuccess,
  onError,
  isProcessing,
  setIsProcessing,
}) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !setupIntentClientSecret) {
      return;
    }

    setIsProcessing(true);
    const cardElement = elements.getElement(CardElement);

    try {
      const { setupIntent, error } = await stripe.confirmCardSetup(setupIntentClientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        onError(error.message);
        setIsProcessing(false);
        return;
      }

      if (setupIntent && setupIntent.payment_method) {
        onSuccess(setupIntent.payment_method);
      }
    } catch (err) {
      onError(err.message || "An error occurred");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} id="card-form">
      <div className="mb-4 p-4 border border-gray-300 rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </div>
    </form>
  );
}

const PaymentMethodsPage = () => {
  const {
    paymentMethods,
    hasPaymentMethod,
    isLoading,
    isChecking,
    showAddCardModal,
    setShowAddCardModal,
    handleAddCardSuccess,
    handleAddCardError,
    handleRemoveCard,
    handleUpdateCard,
    stripePromise,
    setupIntentClientSecret,
    isProcessing,
    setIsProcessing,
    errorMessage,
    setErrorMessage,
  } = usePaymentMethods();

  // Reset error when modal closes
  useEffect(() => {
    if (!showAddCardModal) {
      setErrorMessage(null);
    }
  }, [showAddCardModal, setErrorMessage]);

  const handleAddCard = () => {
    const form = document.getElementById("card-form");
    if (form) {
      form.requestSubmit();
    }
  };

  return (
    <>
      {/* Header */}
      <div className="bg-primary p-4 rounded-lg text-white mb-4">
        <h1 className="text-xl font-bold text-white">Payment Methods</h1>
        <p className="text-sm mt-1">
          Add a payment method to fund creator collaborations. Required before sending offers.
        </p>
      </div>

      {/* Payment Methods List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Saved Payment Methods</h2>
            <CustomButton
              text="Add Card"
              className="btn-primary"
              onClick={() => setShowAddCardModal(true)}
              icon={<Plus className="w-4 h-4" />}
              disabled={isLoading || isChecking}
            />
          </div>

          {isChecking ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">Checking payment methods...</p>
            </div>
          ) : hasPaymentMethod && paymentMethods.length > 0 ? (
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-lg">
                      <CreditCard className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900 capitalize">
                          {method.card?.brand || "Card"}
                        </span>
                        {method.id === paymentMethods[0]?.id && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        •••• •••• •••• {method.card?.last4 || "****"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Expires {method.card?.exp_month || "MM"}/{method.card?.exp_year || "YYYY"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CustomButton
                      text="Update"
                      className="btn-secondary text-xs"
                      onClick={() => handleUpdateCard(method.id)}
                      disabled={isProcessing}
                    />
                    {paymentMethods.length > 1 && (
                      <button
                        onClick={() => handleRemoveCard(method.id)}
                        disabled={isProcessing}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Remove card"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">No payment methods</p>
                  <p className="text-xs text-gray-500 mb-4">
                    Add a payment method to send offers and fund collaborations
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Info Banner */}
          {hasPaymentMethod && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 mb-1">Payment method required</p>
                  <p className="text-xs text-blue-700">
                    You must have a valid payment method saved before sending offers to creators. No
                    charge occurs when sending an offer - payment is only processed when the creator
                    accepts.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">How payments work</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Add payment method</p>
                <p className="text-xs text-gray-600">
                  Save a card securely. Required before sending offers.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Send offer</p>
                <p className="text-xs text-gray-600">
                  No charge occurs when sending an offer. This is just a precondition.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Creator accepts</p>
                <p className="text-xs text-gray-600">
                  When creator accepts, your card is automatically charged. Funds are held in
                  escrow.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Release payment</p>
                <p className="text-xs text-gray-600">
                  After you mark work complete and submit a review, funds are released to the
                  creator.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Add Card Modal */}
      <Modal
        show={showAddCardModal}
        onClose={() => {
          setShowAddCardModal(false);
          setErrorMessage(null);
        }}
        title="Add Payment Method"
        size="md"
      >
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            Add a card to fund creator collaborations. Your card information is securely stored by
            Stripe.
          </p>
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          )}
          {stripePromise && setupIntentClientSecret ? (
            <Elements stripe={stripePromise}>
              <CardFormComponent
                stripePromise={stripePromise}
                setupIntentClientSecret={setupIntentClientSecret}
                onSuccess={handleAddCardSuccess}
                onError={handleAddCardError}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            </Elements>
          ) : (
            <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600">
                {!setupIntentClientSecret
                  ? "Initializing payment form..."
                  : "Stripe is not configured. Please contact support."}
              </p>
            </div>
          )}
          <div className="flex items-center justify-end gap-3">
            <CustomButton
              text="Cancel"
              className="btn-secondary"
              onClick={() => {
                setShowAddCardModal(false);
                setErrorMessage(null);
              }}
              disabled={isProcessing}
            />
            <CustomButton
              text={isProcessing ? "Processing..." : "Add Card"}
              className="btn-primary"
              onClick={handleAddCard}
              loading={isProcessing}
              disabled={isProcessing || !setupIntentClientSecret || !stripePromise}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PaymentMethodsPage;
