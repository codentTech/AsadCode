import api from "@/common/utils/api";
import { requireOnboardingEmailQuery } from "@/common/utils/users.util";

const getOnboardingStatus = async (email) => {
  const response = await api().get(
    `/auth/onboarding/status?email=${requireOnboardingEmailQuery(email)}`
  );
  return response.data;
};

const onboardingService = {
  getOnboardingStatus,
};

export default onboardingService;
