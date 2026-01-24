import api from "@/common/utils/api";

// Get brand's payment methods
const getPaymentMethods = async () => {
  const response = await api().get("/collaboration-payments/payment-methods");
  return response.data;
};

// Check if brand has a valid payment method
const hasPaymentMethod = async () => {
  const response = await api().get("/collaboration-payments/payment-methods/check");
  return response.data;
};

// Create SetupIntent for saving payment method
const createSetupIntent = async () => {
  const response = await api().post("/collaboration-payments/payment-methods/setup-intent");
  return response.data;
};

// Attach payment method to brand
const attachPaymentMethod = async (paymentMethodId) => {
  const response = await api().post("/collaboration-payments/payment-methods/attach", {
    paymentMethodId,
  });
  return response.data;
};

// Remove payment method
const removePaymentMethod = async (paymentMethodId) => {
  const response = await api().delete(`/collaboration-payments/payment-methods/${paymentMethodId}`);
  return response.data;
};

// Fund a collaboration (charge brand)
const fundCollaboration = async (collaborationId) => {
  const response = await api().post("/collaboration-payments/fund", {
    collaborationId,
  });
  return response.data;
};

// Retry funding a failed collaboration
const retryFunding = async (collaborationId, paymentMethodId = null) => {
  const response = await api().post("/collaboration-payments/retry-funding", {
    collaborationId,
    paymentMethodId,
  });
  return response.data;
};

// Get payment details for a collaboration
const getPaymentByCollaboration = async (collaborationId) => {
  const response = await api().get(`/collaboration-payments/collaboration/${collaborationId}`);
  return response.data;
};

// Get all payments for current brand
const getBrandPayments = async () => {
  const response = await api().get("/collaboration-payments/brand/payments");
  return response.data;
};

const collaborationPaymentService = {
  getPaymentMethods,
  hasPaymentMethod,
  createSetupIntent,
  attachPaymentMethod,
  removePaymentMethod,
  fundCollaboration,
  retryFunding,
  getPaymentByCollaboration,
  getBrandPayments,
};

export default collaborationPaymentService;
