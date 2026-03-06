import api from "@/common/utils/api";

// Fetch creator stats (optional platform: instagram | tiktok | youtube for per-platform data)
export const fetchCreatorStats = async (creatorId, platform = null) => {
  const params = new URLSearchParams({ creatorId });
  if (platform) params.set("platform", platform);
  const response = await api().get(`/phyllo/creators/stats?${params.toString()}`);
  return response.data;
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

export const fetchCreatorAudience = async (creatorId, platform = null) => {
  const params = new URLSearchParams({ creatorId });
  if (platform) params.set("platform", platform);
  const response = await api().get(`/phyllo/creators/audience?${params.toString()}`);
  return response.data;
};

export const fetchCreatorSocialAccounts = async (creatorId, platform = null) => {
  const params = new URLSearchParams({ creatorId });
  if (platform) params.set("platform", platform);
  const response = await api().get(`/phyllo/creators/social-accounts?${params.toString()}`);
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

// Fetch creator metrics (optional platform for per-platform metrics)
export const fetchCreatorMetrics = async (creatorId, platform = null) => {
  const params = new URLSearchParams({ creatorId });
  if (platform) params.set("platform", platform);
  const response = await api().get(`/phyllo/creators/metrics?${params.toString()}`);
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
