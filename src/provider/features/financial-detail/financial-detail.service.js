import api from '@/common/utils/api';

const createFinancialDetail = async (userData) => {
  const response = await api().post('/financial-detail', userData);
  return response.data;
};

const getSingleFinancialDetail = async (id) => {
  const response = await api().get(`/financial-detail/${id}`);
  return response.data;
};

const getAllFinancialDetail = async () => {
  const response = await api().get('/financial-detail');
  return response.data;
};

const updateFinancialDetail = async (id, data) => {
  const response = await api().patch(`/financial-detail/${id}`, data);
  return response.data;
};

const deleteFinancialDetail = async (id) => {
  const response = await api().delete(`/financial-detail/${id}`);
  return response.data;
};

const financialDetailService = {
  createFinancialDetail,
  deleteFinancialDetail,
  updateFinancialDetail,
  getAllFinancialDetail,
  getSingleFinancialDetail
};

export default financialDetailService;
