import api from "@/common/utils/api";
import { getOnboardingEmail, getUser } from "@/common/utils/users.util";

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
    // Return a safe error response
    return {
      Succeeded: false,
      message: error.message || "Failed to update user",
      data: null,
    };
  }
};

const requestEmailChange = async (newEmail) => {
  const response = await api().post("/user/email-change", { new_email: newEmail });
  return response.data;
};

const verifyEmailChange = async (code) => {
  const response = await api().post("/user/email-change/verify", { code });
  const body = response.data;
  if (body.success && body.data) {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const updatedUser = { ...currentUser, ...body.data };
    localStorage.setItem("user", JSON.stringify(updatedUser));
  }
  return body;
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
  // Legacy per-platform OAuth flow removed. We now use Phyllo Connect.
  // The `platform` argument is intentionally ignored (Phyllo Connect supports multi-platform).
  // Recommended: create a microsite link which embeds Connect and guides the user.
  const user = getUser();
  const email = user?.email || getOnboardingEmail();
  if (!email) {
    throw new Error("User email not found for Phyllo connect link");
  }

  const response = await api().post(`/auth/public/phyllo/link?email=${encodeURIComponent(email)}`);
  return response.data;
};

const getSocialAccounts = async () => {
  const user = getUser();
  const email = user?.email || getOnboardingEmail();
  if (!email) {
    throw new Error("User email not found for social accounts");
  }

  const response = await api().get(
    `/auth/public/social-accounts?email=${encodeURIComponent(email)}`
  );
  return response.data;
};

const disconnectSocialAccount = async (platform) => {
  const response = await api().delete(`/auth/${platform}/disconnect`);
  return response.data;
};

const adminGetConnectedAccounts = async (params = {}) => {
  const query = {};
  if (params.search) query.search = params.search;
  if (params.platform) query.platform = params.platform;
  if (params.sortBy) query.sortBy = params.sortBy;
  if (params.sortOrder) query.sortOrder = params.sortOrder;
  const response = await api().get("/user/admin/connected-accounts", { params: query });
  return response.data;
};

const adminRemoveConnectedAccount = async (accountId) => {
  const response = await api().delete(`/user/admin/connected-accounts/${accountId}`);
  return response.data;
};

const adminDeleteUser = async (userId) => {
  const response = await api().delete(`/user/admin/users/${userId}`);
  return response.data;
};

const usersService = {
  getAllUsers,
  discoverCreators,
  updateUser,
  requestEmailChange,
  verifyEmailChange,
  getUserById,
  updateCreatorPreferences,
  updateCampaignDefaults,
  toggleBlockUser,
  adminToggleBlockUser,
  getBlockedUsers,
  isUserBlocked,
  addUserToWaitlist,
  getCurrentUser,
  connectSocialMedia,
  getSocialAccounts,
  disconnectSocialAccount,
  adminGetConnectedAccounts,
  adminRemoveConnectedAccount,
  adminDeleteUser,
};

export default usersService;
