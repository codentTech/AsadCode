import api from "@/common/utils/api";
import { getUser } from "@/common/utils/users.util";

const getAllUsers = async (payload) => {
  const response = await api().get("/user", { params: payload });
  return response.data;
};

const discoverCreators = async (payload) => {
  const response = await api().get("/user", { params: payload });
  return response.data;
};

const updateUser = async (userData) => {
  try {
    const response = await api().put("/user/update", userData);

    // Check if response and response.data exist
    if (response && response.data) {
      if (response.data.Succeeded && response.data.data) {
        // Update user in localStorage with new data
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser = { ...currentUser, ...response.data.data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      return response.data;
    } else {
      // Return a safe default response if response structure is unexpected
      return {
        Succeeded: false,
        message: "Invalid response structure from server",
        data: null,
      };
    }
  } catch (error) {
    console.error("Error in updateUser:", error);
    // Return a safe error response
    return {
      Succeeded: false,
      message: error.message || "Failed to update user",
      data: null,
    };
  }
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
  try {
    const user = getUser();
    const response = await api().post(
      `/auth/onboarding/creator/profile-setup?email=${encodeURIComponent(user.email)}`,
      defaults
    );

    // Check if response and response.data exist
    if (response && response.data) {
      if (response.data.success && response.data.data) {
        // Update user in localStorage with new data
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser = { ...currentUser, ...response.data.data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      return response.data;
    } else {
      // Return a safe default response if response structure is unexpected
      return {
        success: false,
        message: "Invalid response structure from server",
        data: null,
      };
    }
  } catch (error) {
    console.error("Error in updateCampaignDefaults:", error);
    // Return a safe error response
    return {
      success: false,
      message: error.message || "Failed to update campaign defaults",
      data: null,
    };
  }
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

const connectSocialMedia = async (platform) => {
  try {
    const user = getUser();
    if (!user || !user.email) {
      throw new Error("User not found");
    }

    // Get OAuth URL from backend
    const response = await api().post(`/auth/${platform}/connect`);

    if (response.data.success) {
      // Redirect to OAuth URL
      window.location.href = response.data.data.oauth_url;
    } else {
      throw new Error(response.data.message || "Failed to get OAuth URL");
    }
  } catch (error) {
    console.error(`Error connecting to ${platform}:`, error);
    throw error;
  }
};

const getSocialAccounts = async () => {
  try {
    const response = await api().get("/auth/social-accounts");
    return response.data;
  } catch (error) {
    console.error("Error getting social accounts:", error);
    throw error;
  }
};

const disconnectSocialAccount = async (platform) => {
  try {
    const response = await api().delete(`/auth/${platform}/disconnect`);
    return response.data;
  } catch (error) {
    console.error(`Error disconnecting from ${platform}:`, error);
    throw error;
  }
};

const usersService = {
  getAllUsers,
  discoverCreators,
  updateUser,
  getUserById,
  updateCreatorPreferences,
  updateCampaignDefaults,
  toggleBlockUser,
  adminToggleBlockUser,
  getBlockedUsers,
  isUserBlocked,
  addUserToWaitlist,
  connectSocialMedia,
  getSocialAccounts,
  disconnectSocialAccount,
};

export default usersService;
