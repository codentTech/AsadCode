import api from "@/common/utils/api";

const setupCreatorProfile = async (data, email) => {
  const response = await api().post(
    `/auth/onboarding/creator/profile-setup?email=${encodeURIComponent(email)}`,
    data
  );
  return response.data;
};

const setupCreatorCampaignPreferences = async (data, email) => {
  const response = await api().post(
    `/auth/onboarding/creator/campaign-preferences?email=${encodeURIComponent(email)}`,
    data
  );
  return response.data;
};

const creatorProfileService = {
  setupCreatorProfile,
  setupCreatorCampaignPreferences,
};

export default creatorProfileService;
