import api from "@/common/utils/api";

const setupBrandProfile = async (data, email) => {
  const response = await api().post(
    `/auth/onboarding/brand/profile-setup?email=${encodeURIComponent(email)}`,
    data
  );
  return response?.data || { success: false, message: "No response from server" };
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

const getBrandProfile = async (email) => {
  const response = await api().get(
    `/auth/onboarding/brand/profile-setup?email=${encodeURIComponent(email)}`
  );
  return response.data;
};

const brandProfileService = {
  setupBrandProfile,
  setupBrandCampaignPreferences,
  setupBrandIdealCreator,
  getBrandProfile,
};

export default brandProfileService;
