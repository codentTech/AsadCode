import api from "@/common/utils/api";

// Create campaign
const createCampaign = async (campaignData) => {
  const response = await api().post("/campaigns", campaignData);
  return response.data;
};

// Get all campaigns
const getAllCampaigns = async (params) => {
  const response = await api().get("/campaigns", { params });
  return response.data;
};

// Get campaign by ID
const getCampaignById = async (campaignId) => {
  const response = await api().get(`/campaigns/${campaignId}`);
  return response.data;
};

// Update campaign
const updateCampaign = async (campaignId, campaignData) => {
  const response = await api().patch(`/campaigns/${campaignId}`, campaignData);
  return response.data;
};

// Delete campaign
const deleteCampaign = async (campaignId) => {
  const response = await api().delete(`/campaigns/${campaignId}`);
  return response.data;
};

// Publish campaign
const publishCampaign = async (campaignId) => {
  const response = await api().post(`/campaigns/${campaignId}/publish`);
  return response.data;
};

// Filter campaigns
const filterCampaigns = async (filters) => {
  const response = await api().get("/campaigns/filter", { params: filters });
  return response.data;
};

// Get campaign stats
const getCampaignStats = async () => {
  const response = await api().get("/campaigns/stats");
  return response.data;
};

const campaignsService = {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  publishCampaign,
  filterCampaigns,
  getCampaignStats,
};

export default campaignsService;
