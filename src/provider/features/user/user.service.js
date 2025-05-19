import api from "@/common/utils/api";

const addUserToWaitlist = async (email) => {
  const response = await api().post("/user/waitlist", email);
  return response.data;
};

const addPhoneAndGenerateOtp = async (phone) => {
  const response = await api().post("/user/add-phone-and-generate-otp", phone);
  return response.data;
};

const generateOtp = async () => {
  const response = await api().get("/user/generate-otp");
  return response.data;
};

const verifyOtp = async (otp) => {
  const response = await api().post("/user/verify-otp", otp);
  if (response.data.Succeeded) {
    localStorage.setItem("isOtpVerify", true);
  }
  return response.data;
};

const getCurrentUser = async () => {
  const response = await api().get("/user");
  if (response.data.Succeeded) {
    localStorage.setItem("user", JSON.stringify({ ...response.data.data }));
  }
  return response.data;
};

const generateForgetPasswordLink = async (email) => {
  const response = await api().post(
    "/user/generate-forget-password-link",
    email
  );
  return response.data;
};

const regenerateEmailLink = async (email) => {
  const response = await api().post("/user/regenerate-email-link", email);
  return response.data;
};

const changePasswordFromLink = async (data) => {
  const response = await api().post("/user/change-password-from-link", data);
  return response.data;
};

const changePassword = async (data) => {
  const response = await api().post("/user/change-password", data);
  return response.data;
};

const verifyEmail = async (data) => {
  const response = await api().post("/user/verify-email", data);
  if (response.data.Succeeded) {
    localStorage.setItem("user", JSON.stringify({ ...response.data.data }));
  }
  return response.data;
};

const getAllBusinessOwner = async (payload) => {
  const response = await api().post("/user/get-all", payload);
  return response.data;
};

const createBusinessOwner = async (payload) => {
  const response = await api().post("/user/create-business-owner", payload);
  return response.data;
};

const getSingleBusinessOwner = async (id) => {
  const response = await api().get(`/user/${id}`);
  return response.data;
};

const updateBusinessOwner = async (payload, id) => {
  const response = await api().patch(
    `/user/update-business-owner/${id}`,
    payload
  );
  return response.data;
};
const blockOrUnBlockBusinessOwner = async (payload, id) => {
  const response = await api().patch(`/user/block-or-unblock/${id}`, payload);
  return response.data;
};

const deleteBusinessOwner = async (id) => {
  const response = await api().delete(`/user/${id}`);
  return response.data;
};

const checkEmailExists = async (username) => {
  const response = await api().get(`/user/is-email-exists/${username}`);
  return response.data;
};

const checkUsernameExists = async (username) => {
  const response = await api().get(`/user/is-username-exists/${username}`);
  return response.data;
};

const twoFactorAuth = async (data) => {
  const response = await api().patch("/user/two-factor", data);
  return response.data;
};

const updateEmail = async (payload) => {
  const response = await api().patch("/user/update-email", payload);
  return response.data;
};

const userService = {
  addUserToWaitlist,
  addPhoneAndGenerateOtp,
  generateOtp,
  verifyOtp,
  generateForgetPasswordLink,
  regenerateEmailLink,
  changePasswordFromLink,
  changePassword,
  verifyEmail,
  getCurrentUser,
  checkUsernameExists,
  getAllBusinessOwner,
  createBusinessOwner,
  getSingleBusinessOwner,
  updateBusinessOwner,
  deleteBusinessOwner,
  checkEmailExists,
  blockOrUnBlockBusinessOwner,
  twoFactorAuth,
  updateEmail,
};

export default userService;
