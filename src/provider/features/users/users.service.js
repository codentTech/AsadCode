import api from "@/common/utils/api";
import { getUser } from "@/common/utils/users.util";

const getAllUsers = async () => {
  const response = await api().get("/user");
  return response.data;
};

const updateUser = async (userData) => {
  const response = await api().put("/user/update", userData);
  if (response.data.Succeeded) {
    // Update user in localStorage with new data
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const updatedUser = { ...currentUser, ...response.data.data };
    localStorage.setItem("user", JSON.stringify(updatedUser));
  }
  return response.data;
};

const getUserById = async (userId) => {
  const response = await api().get(`/user/${userId}`);
  return response.data;
};

const updateCreatorPreferences = async (preferences) => {
  const user = getUser();
  const response = await api().post(
    `/auth/onboarding/creator/campaign-preferences?email=${encodeURIComponent(user.email)}`,
    preferences
  );
  if (response.data.success) {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const updatedUser = { ...currentUser, ...response.data.data };
    localStorage.setItem("user", JSON.stringify(updatedUser));
  }
  return response.data;
};

const updateCampaignDefaults = async (defaults) => {
  const user = getUser();
  const response = await api().post(
    `/auth/onboarding/creator/profile-setup?email=${encodeURIComponent(user.email)}`,
    defaults
  );
  if (response.data.success) {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const updatedUser = { ...currentUser, ...response.data.data };
    localStorage.setItem("user", JSON.stringify(updatedUser));
  }
  return response.data;
};

const toggleBlockUser = async (data) => {
  const response = await api().post("/user/toggle-block", data);
  return response.data;
};

const adminToggleBlockUser = async (data) => {
  const response = await api().post("/user/admin-toggle-block", data);
  return response.data;
};

const getBlockedUsers = async () => {
  const response = await api().get("/user/blocked");
  return response.data;
};

const isUserBlocked = async (userId) => {
  const response = await api().get(`/user/is-blocked?user_id=${userId}`);
  return response.data;
};

const addUserToWaitlist = async (email) => {
  const response = await api().post("/user/waitlist", email);
  return response.data;
};

const getCurrentUser = async () => {
  const response = await api().get("/user");
  if (response.data.Succeeded) {
    localStorage.setItem("user", JSON.stringify({ ...response.data.data }));
  }
  return response.data;
};

const usersService = {
  getAllUsers,
  updateUser,
  getUserById,
  updateCreatorPreferences,
  updateCampaignDefaults,
  toggleBlockUser,
  adminToggleBlockUser,
  getBlockedUsers,
  isUserBlocked,
  addUserToWaitlist,
};

export default usersService;
