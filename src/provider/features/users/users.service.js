import api from "@/common/utils/api";

const getAllUsers = async () => {
  const response = await api().get("/user");
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

const usersService = {
  getAllUsers,
  toggleBlockUser,
  adminToggleBlockUser,
  getBlockedUsers,
  isUserBlocked,
};

export default usersService;
