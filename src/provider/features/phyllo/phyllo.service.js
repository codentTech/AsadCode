import api from "@/common/utils/api";

// Fetch creator stats
export const fetchCreatorStats = async (creatorId) => {
  const response = await api().get(`/phyllo/creators/stats?creatorId=${creatorId}`);
  return response.data; // Return full response, including success, message, data
};

// Fetch other endpoints
export const fetchCreatorPreview = async (creatorId) => {
  const response = await api().get(`/phyllo/creators/preview?creatorId=${creatorId}`);
  return response.data;
};

export const fetchCreatorProfile = async (creatorId) => {
  const response = await api().get(`/phyllo/creators/profile?creatorId=${creatorId}`);
  return response.data;
};

export const fetchCreatorAudience = async (creatorId) => {
  const response = await api().get(`/phyllo/creators/audience?creatorId=${creatorId}`);
  return response.data;
};

export const fetchCreatorSocialAccounts = async (creatorId) => {
  const response = await api().get(`/phyllo/creators/social-accounts?creatorId=${creatorId}`);
  return response.data;
};

// Fetch campaign combined demographics
export const fetchCampaignCombinedDemographics = async (campaignId) => {
  const response = await api().get(`/phyllo/campaigns/${campaignId}/combined-demographics`);
  return response.data;
};

// Fetch campaign performance metrics
export const fetchCampaignPerformanceMetrics = async (campaignId) => {
  const response = await api().get(`/phyllo/campaigns/${campaignId}/performance-metrics`);
  return response.data;
};

// Fetch creator metrics
export const fetchCreatorMetrics = async (creatorId) => {
  const response = await api().get(`/phyllo/creators/metrics?creatorId=${creatorId}`);
  return response.data;
};

const phylloService = {
  fetchCreatorStats,
  fetchCreatorPreview,
  fetchCreatorProfile,
  fetchCreatorAudience,
  fetchCreatorSocialAccounts,
  fetchCampaignCombinedDemographics,
  fetchCampaignPerformanceMetrics,
  fetchCreatorMetrics,
};

export default phylloService;
