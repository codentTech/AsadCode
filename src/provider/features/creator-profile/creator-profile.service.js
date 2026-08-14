import api from "@/common/utils/api";
import { requireOnboardingEmailQuery } from "@/common/utils/users.util";

const setupCreatorProfile = async (data, email) => {
  const response = await api().post(
    `/auth/onboarding/creator/profile-setup?email=${requireOnboardingEmailQuery(email)}`,
    data
  );
  return response.data;
};

const setupCreatorCampaignPreferences = async (data, email) => {
  const response = await api().post(
    `/auth/onboarding/creator/campaign-preferences?email=${requireOnboardingEmailQuery(email)}`,
    data
  );
  return response.data;
};

const completeCreatorConnectSocial = async (data, email) => {
  const response = await api().post(
    `/auth/onboarding/creator/connect-social?email=${requireOnboardingEmailQuery(email)}`,
    data
  );
  return response.data;
};

const getCreatorById = async (creatorId) => {
  const response = await api().get(`/user/${creatorId}`);
  return response.data;
};

const creatorProfileService = {
  setupCreatorProfile,
  setupCreatorCampaignPreferences,
  completeCreatorConnectSocial,
  getCreatorById,
};

export default creatorProfileService;
