import api from "@/common/utils/api";

const createCreatorOnboardingLink = async (params) => {
  const { returnUrl, refreshUrl } = params;
  const response = await api().post("/collaboration-payments/creator/connect/create", {
    returnUrl,
    refreshUrl,
  });
  return response.data;
};

const getCreatorAccountStatus = async () => {
  const response = await api().get("/collaboration-payments/creator/connect/status");
  return response.data;
};

const checkCreatorPayoutReady = async () => {
  const response = await api().get("/collaboration-payments/creator/connect/payout-ready");
  return response.data;
};

const collaborationPaymentService = {
  createCreatorOnboardingLink,
  getCreatorAccountStatus,
  checkCreatorPayoutReady,
};

export default collaborationPaymentService;
