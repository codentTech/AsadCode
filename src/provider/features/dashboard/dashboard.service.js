import api from '@/common/utils/api';

const getDashboardStats = async () => {
  const response = await api().get('/dashboard/get-stats');
  return response.data;
};

const dashboardService = {
  getDashboardStats
};

export default dashboardService;
