import api from "@/common/utils/api";

// Brand payment methods
const getPaymentMethods = async () => {
  const response = await api().get("/collaboration-payments/payment-methods");
  return response.data;
};

const hasPaymentMethod = async () => {
  const response = await api().get("/collaboration-payments/payment-methods/check");
  return response.data;
};

const createSetupIntent = async () => {
  const response = await api({ "x-skip-toast": "true" }).post(
    "/collaboration-payments/payment-methods/setup-intent"
  );
  return response.data;
};

const attachPaymentMethod = async (paymentMethodId) => {
  const response = await api({ "x-skip-toast": "true" }).post(
    "/collaboration-payments/payment-methods/attach",
    { paymentMethodId }
  );
  return response.data;
};

const removePaymentMethod = async (paymentMethodId) => {
  const response = await api().delete(
    `/collaboration-payments/payment-methods/${paymentMethodId}`
  );
  return response.data;
};

// Brand funding / escrow flows
const fundCollaboration = async (collaborationId) => {
  const response = await api().post("/collaboration-payments/fund", {
    collaborationId,
  });
  return response.data;
};

const retryFunding = async ({ collaborationId, paymentMethodId = null }) => {
  const response = await api().post("/collaboration-payments/retry-funding", {
    collaborationId,
    paymentMethodId,
  });
  return response.data;
};

const getPaymentByCollaboration = async (collaborationId) => {
  const response = await api().get(
    `/collaboration-payments/collaboration/${collaborationId}`
  );
  return response.data;
};

// Payments history
const getBrandPayments = async () => {
  const response = await api().get("/collaboration-payments/brand/payments");
  return response.data;
};

const getCreatorPayments = async () => {
  const response = await api().get("/collaboration-payments/creator/payments");
  return response.data;
};

// Creator Stripe Connect (payout method)
const createCreatorOnboardingLink = async ({ returnUrl, refreshUrl }) => {
  const response = await api().post(
    "/collaboration-payments/creator/connect/create",
    { returnUrl, refreshUrl }
  );
  return response.data;
};

const getCreatorAccountStatus = async () => {
  const response = await api().get("/collaboration-payments/creator/connect/status");
  return response.data;
};

const checkCreatorPayoutReady = async () => {
  const response = await api().get(
    "/collaboration-payments/creator/connect/payout-ready"
  );
  return response.data;
};

// Platform Connect availability check (brand dashboard / env readiness)
const checkConnectStatus = async () => {
  const response = await api().get("/collaboration-payments/connect/status");
  return response.data;
};

const collaborationPaymentService = {
  // Brand payment methods
  getPaymentMethods,
  hasPaymentMethod,
  createSetupIntent,
  attachPaymentMethod,
  removePaymentMethod,

  // Escrow / funding
  fundCollaboration,
  retryFunding,
  getPaymentByCollaboration,

  // Payment history
  getBrandPayments,
  getCreatorPayments,

  // Creator payouts
  createCreatorOnboardingLink,
  getCreatorAccountStatus,
  checkCreatorPayoutReady,

  // Connect status
  checkConnectStatus,
};

export default collaborationPaymentService;
