import api from '@/common/utils/api';

const createExpenditureCategory = async (userData) => {
  const response = await api().post('/expenditure-category', userData);
  return response.data;
};
const getAllExpenditureCategory = async (userData) => {
  const response = await api().post('/expenditure-category/get-all', userData);
  return response.data;
};

const deleteExpenditureCategory = async (id) => {
  const response = await api().delete(`/expenditure-category/${id}`);
  return response.data;
};
const updateExpenditureCategory = async (id, data) => {
  const response = await api().patch(`/expenditure-category/${id}`, data);
  return response.data;
};

const expenditureCategoryService = {
  createExpenditureCategory,
  getAllExpenditureCategory,
  deleteExpenditureCategory,
  updateExpenditureCategory
};
export default expenditureCategoryService;
