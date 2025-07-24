import api from "@/common/utils/api";

const setupBrandProfile = async (data, email) => {
  const response = await api().post(
    `/auth/onboarding/brand/profile-setup?email=${encodeURIComponent(email)}`,
    data
  );
  return response.data;
};

const setupBrandCampaignPreferences = async (data, email) => {
  const response = await api().post(
    `/auth/onboarding/brand/campaign-preferences?email=${encodeURIComponent(email)}`,
    data
  );
  return response.data;
};

const setupBrandIdealCreator = async (data, email) => {
  const response = await api().post(
    `/auth/onboarding/brand/ideal-creator?email=${encodeURIComponent(email)}`,
    data
  );
  return response.data;
};

const brandProfileService = {
  setupBrandProfile,
  setupBrandCampaignPreferences,
  setupBrandIdealCreator,
};

export default brandProfileService;
