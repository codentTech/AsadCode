import api from "@/common/utils/api";

// Get campaign timeline
const getTimeline = async (campaignId, creatorId) => {
  const url = creatorId 
    ? `/campaigns/${campaignId}/timeline?creatorId=${creatorId}`
    : `/campaigns/${campaignId}/timeline`;
  const response = await api().get(url);
  return response.data;
};

// Initialize timeline for a campaign
const initializeTimeline = async (campaignId) => {
  const response = await api().post(`/campaigns/${campaignId}/timeline/initialize`);
  return response.data;
};

// Update timeline step (mark complete, upload draft, submit URL)
const updateTimelineStep = async (campaignId, step, data) => {
  const response = await api().patch(
    `/campaigns/${campaignId}/timeline/${step.toLowerCase()}`,
    data
  );
  return response.data;
};

// Approve draft (Brand only)
const approveDraft = async (campaignId, step, creatorId) => {
  const url = `/campaigns/${campaignId}/timeline/${step.toLowerCase()}/approve${creatorId ? `?creatorId=${creatorId}` : ''}`;
  const response = await api().post(url);
  return response.data;
};

// Request revision (Brand only)
const requestRevision = async (campaignId, step, revisionNotes, creatorId) => {
  const url = `/campaigns/${campaignId}/timeline/${step.toLowerCase()}/request-revision${creatorId ? `?creatorId=${creatorId}` : ''}`;
  const response = await api().post(url, {
    revision_notes: revisionNotes,
  });
  return response.data;
};

// Mark final as complete (Brand only)
const markFinalComplete = async (campaignId, step, creatorId) => {
  const url = `/campaigns/${campaignId}/timeline/${step.toLowerCase()}/mark-complete${creatorId ? `?creatorId=${creatorId}` : ''}`;
  const response = await api().post(url);
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
