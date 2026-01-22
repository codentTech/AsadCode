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

// Mark a specific creator as complete in a campaign
const markCreatorComplete = async (campaignId, creatorId) => {
  const response = await api().post(`/campaigns/${campaignId}/creators/${creatorId}/complete`);
  return response.data;
};

// Mark campaign as complete
const markCampaignComplete = async (campaignId) => {
  const response = await api().post(`/campaigns/${campaignId}/complete`);
  return response.data;
};

// Get creator collaboration history
const getCreatorCollaborationHistory = async (creatorProfileId) => {
  const response = await api().get(`/campaigns/creator/history`, {
    params: { creatorProfileId },
  });
  return response.data;
};

// Filter campaigns (now consolidated with getAllCampaigns)
const filterCampaigns = async (filters) => {
  const response = await api().get("/campaigns", { params: filters });
  return response.data;
};

// Get campaign stats
const getCampaignStats = async () => {
  const response = await api().get("/campaigns/stats");
  return response.data;
};

// Apply to campaign
const applyToCampaign = async (campaignId, pitch) => {
  const response = await api().post(`/campaigns/${campaignId}/apply`, { pitch });
  return response.data;
};

// Withdraw application from campaign
const withdrawApplication = async (campaignId) => {
  const response = await api().post(`/campaigns/${campaignId}/withdraw`);
  return response.data;
};

// Get applied creators for a campaign
const getAppliedCreators = async (campaignId, filters = {}) => {
  const response = await api().get(`/campaigns/${campaignId}/applied-creators`, {
    params: filters,
  });
  return response.data;
};

// Get all brand campaigns (unified endpoint for Applications, Active, and Completed tabs)
const getAllBrandCampaigns = async () => {
  const response = await api().get("/campaigns/brand");
  return response.data;
};

// Get creator applications
const getCreatorApplications = async (status) => {
  const response = await api().get("/campaigns/creator/applications", {
    params: status ? { status } : {},
  });
  return response.data;
};

// Reject creator application
const rejectCreator = async (campaignId, creatorId) => {
  const response = await api().post(`/campaigns/${campaignId}/reject/${creatorId}`);
  return response.data;
};

// Reinstate creator application
const reinstateCreator = async (campaignId, creatorId) => {
  const response = await api().post(`/campaigns/${campaignId}/reinstate/${creatorId}`);
  return response.data;
};

// Create contract
const createContract = async (contractData) => {
  const response = await api().post("/contracts", contractData);
  return response.data;
};

// Send contract
const sendContract = async (contractId) => {
  const response = await api().post(`/contracts/${contractId}/send`);
  return response.data;
};

// Hire creator (simple hire without contract)
const hireCreator = async (campaignId, creatorId) => {
  const response = await api().post(`/campaigns/${campaignId}/hire/${creatorId}`);
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
  applyToCampaign,
  withdrawApplication,
  getAllBrandCampaigns,
  getAppliedCreators,
  getCreatorApplications,
  rejectCreator,
  reinstateCreator,
  createContract,
  sendContract,
  hireCreator,
  markCreatorComplete,
  markCampaignComplete,
  getCreatorCollaborationHistory,
};

export default campaignsService;
