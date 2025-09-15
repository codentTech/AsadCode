import api from "@/common/utils/api";

// Create campaign note
const createCampaignNote = async (campaignId, noteData) => {
  const response = await api().post(`/campaign-notes/campaign/${campaignId}`, noteData);
  return response.data;
};

// Get all notes for a campaign
const getCampaignNotes = async (campaignId) => {
  const response = await api().get(`/campaign-notes/campaign/${campaignId}`);
  return response.data;
};

// Get notes for a specific creator profile in a campaign
const getCampaignNotesByCreatorProfile = async (campaignId, creatorProfileId) => {
  const response = await api().get(
    `/campaign-notes/campaign/${campaignId}/creator-profile/${creatorProfileId}`
  );
  return response.data;
};

// Get specific note by ID
const getCampaignNoteById = async (noteId) => {
  const response = await api().get(`/campaign-notes/${noteId}`);
  return response.data;
};

// Update campaign note
const updateCampaignNote = async (noteId, noteData) => {
  const response = await api().put(`/campaign-notes/${noteId}`, noteData);
  return response.data;
};

// Delete campaign note
const deleteCampaignNote = async (noteId) => {
  const response = await api().delete(`/campaign-notes/${noteId}`);
  return response.data;
};

const campaignNotesService = {
  createCampaignNote,
  getCampaignNotes,
  getCampaignNotesByCreatorProfile,
  getCampaignNoteById,
  updateCampaignNote,
  deleteCampaignNote,
};

export default campaignNotesService;
