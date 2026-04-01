import api from "@/common/utils/api";

const getAdminDashboardSummary = async () => {
  const response = await api().get("/admin/dashboard/summary");
  return response.data;
};

const fetchAllUserWaitinglist = async () => {
  const response = await api().get("/user/waitlist");
  return response.data;
};

const dashboardService = {
  getAdminDashboardSummary,
  fetchAllUserWaitinglist,
};

export default dashboardService;
