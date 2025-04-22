import api from '@/common/utils/api';

const createProfileFinancialBusiness = async (userData) => {
  const response = await api().post('/profile-financial-business', userData);
  return response.data;
};

const updateProfileFinancialBusiness = async (payload, id) => {
  const response = await api().patch(`/profile-financial-business/${id}`, payload);
  return response.data;
};

const profileFinancialBusinessService = {
  createProfileFinancialBusiness,
  updateProfileFinancialBusiness
};

export default profileFinancialBusinessService;
