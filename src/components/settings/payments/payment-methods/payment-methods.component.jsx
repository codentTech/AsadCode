"use client";

import { useEffect, useState } from "react";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import Modal from "@/common/components/modal/modal.component";
import DeleteConfirmationModal from "@/common/components/delete-confirmation-modal/delete-confirmation-modal.component";
import { CreditCard, Plus, Trash2, AlertCircle, CheckCircle2, AlertCircleIcon, XIcon, RefreshCw } from "lucide-react";
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
        // Provide user-friendly error messages for all error types
        let errorMessage = error.message || "An error occurred while processing your card.";
        
        // Handle specific error codes
        switch (error.code) {
          case "card_declined":
            errorMessage = "Your card was declined. Please check your card details or try a different payment method.";
            break;
          case "expired_card":
            errorMessage = "Your card has expired. Please use a valid card with a future expiration date.";
            break;
          case "incorrect_cvc":
            errorMessage = "The card's security code (CVC) is incorrect. Please check the 3-digit code on the back of your card and try again.";
            break;
          case "incorrect_number":
            errorMessage = "The card number is incorrect. Please check your card number and try again.";
            break;
          case "insufficient_funds":
            errorMessage = "Insufficient funds. Please ensure your card has sufficient balance or try a different payment method.";
            break;
          case "invalid_cvc":
            errorMessage = "The card's security code is invalid. Please enter a valid 3-digit CVC code.";
            break;
          case "invalid_expiry_month":
            errorMessage = "The card's expiration month is invalid. Please enter a valid month (01-12).";
            break;
          case "invalid_expiry_year":
            errorMessage = "The card's expiration year is invalid. Please enter a valid future year.";
            break;
          case "invalid_number":
            errorMessage = "The card number is invalid. Please check your card number and try again.";
            break;
          case "processing_error":
            errorMessage = "An error occurred while processing your payment. Please try again in a few moments.";
            break;
          case "generic_decline":
            errorMessage = "Your card was declined. Please contact your bank or try a different payment method.";
            break;
          case "lost_card":
            errorMessage = "Your card has been reported as lost. Please use a different payment method.";
            break;
          case "stolen_card":
            errorMessage = "Your card has been reported as stolen. Please use a different payment method.";
            break;
          case "pickup_card":
            errorMessage = "Your card has been flagged for pickup. Please contact your bank or use a different payment method.";
            break;
          case "restricted_card":
            errorMessage = "Your card has restrictions that prevent this transaction. Please contact your bank or use a different payment method.";
            break;
          case "card_not_supported":
            errorMessage = "This card type is not supported. Please use a different payment method.";
            break;
          default:
            // Handle by error type
            if (error.type === "card_error") {
              errorMessage = error.message || "Card validation failed. Please check your card details and try again.";
            } else if (error.type === "validation_error") {
              errorMessage = "Please check all card details and try again.";
            } else if (error.type === "api_error") {
              errorMessage = "A temporary error occurred. Please try again in a few moments.";
            } else if (error.type === "rate_limit_error") {
              errorMessage = "Too many requests. Please wait a moment and try again.";
            } else {
              errorMessage = error.message || "An unexpected error occurred. Please try again.";
            }
        }
        
        onError(errorMessage);
        setIsProcessing(false);
        return;
      }

      if (setupIntent && setupIntent.payment_method) {
        onSuccess(setupIntent.payment_method);
      }
    } catch (err) {
      // Handle unexpected errors
      let errorMessage = "An unexpected error occurred while processing your card.";
      
      if (err?.message) {
        errorMessage = err.message;
      } else if (err?.error?.message) {
        errorMessage = err.error.message;
      }
      
      onError(errorMessage);
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
    isCreatingSetupIntent,
    showAddCardModal,
    setShowAddCardModal,
    handleAddCardSuccess,
    handleAddCardError,
    handleRemoveCard,
    handleUpdateCard,
    handleRefreshPaymentMethods,
    stripePromise,
    setupIntentClientSecret,
    isProcessing,
    setIsProcessing,
    errorMessage,
    setErrorMessage,
    isUpdateMode,
    updatingPaymentMethodId,
    isRemoving,
  } = usePaymentMethods();

  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState({
    open: false,
    paymentMethodId: null,
    cardInfo: null,
    isDefault: false,
  });

  // Get the payment method being updated
  const updatingPaymentMethod = isUpdateMode
    ? paymentMethods.find((pm) => pm.id === updatingPaymentMethodId)
    : null;

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
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefreshPaymentMethods}
                disabled={isLoading || isChecking}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh payment methods"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading || isChecking ? "animate-spin" : ""}`} />
              </button>
              <CustomButton
                text="Add Card"
                className="btn-primary"
                onClick={() => setShowAddCardModal(true)}
                icon={<Plus className="w-4 h-4" />}
                disabled={isLoading || isChecking}
              />
            </div>
          </div>

          {isChecking || isLoading ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">Checking payment methods...</p>
            </div>
          ) : paymentMethods.length > 0 ? (
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
                          {(method.card?.brand || method.brand || "Card").toLowerCase()}
                        </span>
                        {method.isDefault && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        •••• •••• •••• {method.card?.last4 || method.last4 || "****"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Expires{" "}
                        {String(
                          method.card?.exp_month || method.expMonth || "MM"
                        ).padStart(2, "0")}
                        /{method.card?.exp_year || method.expYear || "YYYY"}
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
                    <button
                      onClick={() => {
                        const cardBrand = (method.card?.brand || method.brand || "Card").toLowerCase();
                        const cardLast4 = method.card?.last4 || method.last4 || "****";
                        setDeleteConfirmationModal({
                          open: true,
                          paymentMethodId: method.id,
                          cardInfo: `${cardBrand} ending in ${cardLast4}`,
                        });
                      }}
                      disabled={isProcessing || isRemoving}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Remove card"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
          {!hasPaymentMethod && (
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

          {/* Security Info */}
          {hasPaymentMethod && (
            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Security:</strong> Your payment information is securely stored by Stripe. CleerCut does not store your card details.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">How payments work</h2>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Add payment method</p>
                <p className="text-xs text-gray-600">
                  Save a card securely. Required before sending offers. Your card information is encrypted and stored by Stripe.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Send offer</p>
                <p className="text-xs text-gray-600">
                  No charge occurs when sending an offer. This is just a precondition to ensure you can pay when needed.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Creator accepts</p>
                <p className="text-xs text-gray-600">
                  When creator accepts your offer, your card is automatically charged. Funds are securely held in escrow until work is completed.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Release payment</p>
                <p className="text-xs text-gray-600">
                  After you mark work complete and submit a review, funds are automatically released to the creator's account.
                </p>
              </div>
            </li>
          </ul>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-800 mb-1">
                  Is my payment information secure?
                </h4>
                <p className="text-xs text-gray-600">
                  Yes! Stripe is a PCI-compliant payment processor trusted by millions of businesses. CleerCut never sees or stores your card details.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-800 mb-1">
                  When am I charged?
                </h4>
                <p className="text-xs text-gray-600">
                  You are only charged when a creator accepts your offer. Sending an offer does not charge your card. Funds are held in escrow until work is completed.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-800 mb-1">
                  What if I need to update my card?
                </h4>
                <p className="text-xs text-gray-600">
                  You can update your payment method at any time. Click "Update" on your saved card or add a new one. The new card will be used for future payments.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-800 mb-1">
                  Can I use multiple payment methods?
                </h4>
                <p className="text-xs text-gray-600">
                  Yes, you can add multiple cards. The first card you add becomes your default payment method, but you can manage which card to use for each collaboration.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-800 mb-1">
                  What happens if my payment fails?
                </h4>
                <p className="text-xs text-gray-600">
                  If a payment fails, you'll be notified immediately. You can update your payment method and retry. The creator will not receive payment until the charge succeeds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Update Card Modal */}
      <Modal
        show={showAddCardModal}
        onClose={() => {
          setShowAddCardModal(false);
          setErrorMessage(null);
        }}
        title={isUpdateMode ? "Update Payment Method" : "Add Payment Method"}
        size="md"
      >
        <div className="p-4">
          <div className="mb-4 space-y-3">
            <p className="text-sm text-gray-700 font-medium">
              {isUpdateMode
                ? "Replace your payment method with a new card"
                : "Add a payment method to fund creator collaborations"}
            </p>
            <p className="text-xs text-gray-600">
              Your card information is securely encrypted and stored by Stripe. CleerCut never sees your full card details.
            </p>
            {isUpdateMode && updatingPaymentMethod && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-700 mb-2">
                  <strong>Current card:</strong>
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <CreditCard className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-600 capitalize">
                    {(updatingPaymentMethod.card?.brand ||
                      updatingPaymentMethod.brand ||
                      "Card").toLowerCase()}{" "}
                    ending in{" "}
                    {updatingPaymentMethod.card?.last4 ||
                      updatingPaymentMethod.last4 ||
                      "****"}
                  </span>
                  {(updatingPaymentMethod.card?.exp_month ||
                    updatingPaymentMethod.card?.expYear ||
                    updatingPaymentMethod.expMonth ||
                    updatingPaymentMethod.expYear) && (
                    <span className="text-xs text-gray-500">
                      • Expires{" "}
                      {String(
                        updatingPaymentMethod.card?.exp_month ||
                          updatingPaymentMethod.expMonth ||
                          "MM"
                      ).padStart(2, "0")}
                      /
                      {updatingPaymentMethod.card?.exp_year ||
                        updatingPaymentMethod.expYear ||
                        "YYYY"}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Enter your new card details below to replace this card.
                </p>
              </div>
            )}
            {!isUpdateMode && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  <strong>Note:</strong> No charge occurs when adding a card. You'll only be charged when a creator accepts your offer.
                </p>
              </div>
            )}
          </div>
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 mt-0.5">
                <AlertCircleIcon className="w-4 h-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-red-700 whitespace-pre-wrap">{errorMessage}</p>
                </div>
               
                 <XIcon className="w-4 h-4 text-red-600"   onClick={() => setErrorMessage(null)} />
              </div>
            </div>
          )}
          {!stripePromise ? (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700">
                Stripe is not configured. Please contact support.
              </p>
            </div>
          ) : isCreatingSetupIntent ? (
            <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                <p className="text-sm text-gray-600">Initializing payment form...</p>
              </div>
            </div>
          ) : setupIntentClientSecret ? (
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
          ) : 
           null
          }
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
              text={isProcessing ? "Processing" : isUpdateMode ? "Update Card" : "Add Card"}
              className="btn-primary"
              onClick={handleAddCard}
              loading={isProcessing}
              disabled={isProcessing || !setupIntentClientSecret || !stripePromise}
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      {deleteConfirmationModal.paymentMethodId && (
        <DeleteConfirmationModal
          id={deleteConfirmationModal.paymentMethodId}
          confirmationRef={null}
          openConfirmationPopup={deleteConfirmationModal.open}
          setOpenConfirmationPopup={(open) => {
            if (!open) {
              setDeleteConfirmationModal({
                open: false,
                paymentMethodId: null,
                cardInfo: null,
                isDefault: false,
              });
            }
          }}
          mainText="Are you sure you want to remove this payment method?"
          mainStyling=""
          subText={
            deleteConfirmationModal.cardInfo
              ? deleteConfirmationModal.isDefault
                ? `This is your default payment method. Removing it may affect active payments. ${deleteConfirmationModal.cardInfo} will be permanently removed.`
                : `This will permanently remove the ${deleteConfirmationModal.cardInfo} card from your account.`
              : "This action cannot be undone."
          }
          subStyling=""
          confirmText="Remove"
          closeText="Cancel"
          action={async (id) => {
            // Prevent duplicate calls
            if (isProcessing || isRemoving) {
              return;
            }
            
            // Use the id parameter from the modal, or fallback to state
            const paymentMethodIdToRemove = id || deleteConfirmationModal.paymentMethodId;
            if (paymentMethodIdToRemove) {
              try {
                await handleRemoveCard(paymentMethodIdToRemove);
                setDeleteConfirmationModal({
                  open: false,
                  paymentMethodId: null,
                  cardInfo: null,
                  isDefault: false,
                });
                setErrorMessage(null);
              } catch (error) {
                // Extract and format error message
                let errorMsg = "Failed to remove payment method. Please try again.";
                
                if (error?.message) {
                  errorMsg = error.message;
                  
                  // Provide specific messages for common errors
                  if (error.message.includes("default") && (error.message.includes("pending") || error.message.includes("active"))) {
                    errorMsg = "Cannot remove default payment method while there are active payments or pending payouts. Please wait for all transactions to complete or set a different card as default first.";
                  } else if (error.message.includes("not found") || error.message.includes("does not belong")) {
                    errorMsg = "Payment method not found. It may have already been removed.";
                  } else if (error.message.includes("network") || error.message.includes("connection")) {
                    errorMsg = "Network error. Please check your internet connection and try again.";
                  } else if (error.message.includes("timeout")) {
                    errorMsg = "Request timed out. Please try again.";
                  }
                } else if (error?.response?.data?.message) {
                  errorMsg = error.response.data.message;
                } else if (error?.error?.message) {
                  errorMsg = error.error.message;
                }
                
                // Set error message in the add card modal area (will be visible)
                setErrorMessage(errorMsg);
                // Keep modal open so user can see the error, but close delete confirmation
                setDeleteConfirmationModal({
                  open: false,
                  paymentMethodId: null,
                  cardInfo: null,
                  isDefault: false,
                });
              }
            }
          }}
          type="delete"
        />
      )}
    </>
  );
};

export default PaymentMethodsPage;
