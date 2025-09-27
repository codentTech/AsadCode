import api from "@/common/utils/api";

const getDashboardStats = async () => {
  const response = await api().get("/dashboard/get-stats");
  return response.data;
};

const fetchAllUserWaitinglist = async () => {
  const response = await api().get("/user/waitlist");
  return response.data;
};

const dashboardService = {
  getDashboardStats,
  fetchAllUserWaitinglist,
};

export default dashboardService;
