import api from "@/common/utils/api";

const getOnboardingStatus = async (email) => {
  const response = await api().get(`/auth/onboarding/status?email=${encodeURIComponent(email)}`);
  return response.data;
};

const onboardingService = {
  getOnboardingStatus,
};

export default onboardingService;
