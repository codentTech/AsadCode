import api from "@/common/utils/api";

// Create a new shortlist
const createShortlist = async (shortlistData) => {
  const response = await api().post("/shortlist", shortlistData);
  return response.data;
};

// Get all shortlists
const getAllShortlists = async () => {
  const response = await api().get("/shortlist");
  return response.data;
};

// Get a specific shortlist by ID
const getShortlistById = async (shortlistId) => {
  const response = await api().get(`/shortlist/${shortlistId}`);
  return response.data;
};

// Update a shortlist
const updateShortlist = async (shortlistId, updateData) => {
  const response = await api().put(`/shortlist/${shortlistId}`, updateData);
  return response.data;
};

// Delete a shortlist
const deleteShortlist = async (shortlistId) => {
  const response = await api().delete(`/shortlist/${shortlistId}`);
  return response.data;
};

// Add a user to a shortlist
const addUserToShortlist = async (shortlistId, userId, { skipToast = false } = {}) => {
  const response = await api().post(
    `/shortlist/${shortlistId}/users`,
    { user_id: userId },
    skipToast ? { headers: { "x-skip-toast": "true" } } : undefined
  );
  return response.data;
};

const addUsersToShortlistBulk = async (shortlistId, userIds, { skipToast = false } = {}) => {
  const response = await api().post(
    `/shortlist/${shortlistId}/users/bulk`,
    { user_ids: userIds },
    skipToast ? { headers: { "x-skip-toast": "true" } } : undefined
  );
  return response.data;
};

// Remove a user from a shortlist
const removeUserFromShortlist = async (shortlistId, userId) => {
  const response = await api().delete(`/shortlist/${shortlistId}/users/${userId}`);
  return response.data;
};

const removeUsersFromShortlistBulk = async (
  shortlistId,
  userIds,
  { skipToast = false } = {}
) => {
  const response = await api().delete(`/shortlist/${shortlistId}/users/bulk`, {
    data: { user_ids: userIds },
    ...(skipToast ? { headers: { "x-skip-toast": "true" } } : {}),
  });
  return response.data;
};

const shortlistService = {
  createShortlist,
  getAllShortlists,
  getShortlistById,
  updateShortlist,
  deleteShortlist,
  addUserToShortlist,
  addUsersToShortlistBulk,
  removeUserFromShortlist,
  removeUsersFromShortlistBulk,
};

export default shortlistService;
