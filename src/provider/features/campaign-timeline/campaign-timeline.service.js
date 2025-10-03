import api from "@/common/utils/api";

// Get campaign timeline
const getTimeline = async (campaignId) => {
  const response = await api().get(`/campaigns/${campaignId}/timeline`);
  return response.data;
};

// Initialize timeline for a campaign
const initializeTimeline = async (campaignId) => {
  const response = await api().post(`/campaigns/${campaignId}/timeline/initialize`);
  return response.data;
};

// Update timeline step (mark complete, upload draft, submit URL)
const updateTimelineStep = async (campaignId, step, data) => {
  const response = await api().patch(`/campaigns/${campaignId}/timeline/${step}`, data);
  return response.data;
};

// Approve draft (Brand only)
const approveDraft = async (campaignId, step) => {
  const response = await api().post(`/campaigns/${campaignId}/timeline/${step}/approve`);
  return response.data;
};

// Request revision (Brand only)
const requestRevision = async (campaignId, step, revisionNotes) => {
  const response = await api().post(`/campaigns/${campaignId}/timeline/${step}/request-revision`, {
    revision_notes: revisionNotes,
  });
  return response.data;
};

// Mark final as complete (Brand only)
const markFinalComplete = async (campaignId, step) => {
  const response = await api().post(`/campaigns/${campaignId}/timeline/${step}/mark-complete`);
  return response.data;
};

const campaignTimelineService = {
  getTimeline,
  initializeTimeline,
  updateTimelineStep,
  approveDraft,
  requestRevision,
  markFinalComplete,
};

export default campaignTimelineService;
