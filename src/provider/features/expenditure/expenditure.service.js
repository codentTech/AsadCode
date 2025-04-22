import api from '@/common/utils/api';

const createExpenditure = async (userData) => {
  const response = await api().post('/expenditure', userData);
  return response.data;
};
const getAllExpenditure = async (userData) => {
  const response = await api().post('/expenditure/get-all', userData);
  return response.data;
};
const deleteExpenditure = async (id) => {
  const response = await api().delete(`/expenditure/${id}`);
  return response.data;
};
const getSingleExpenditure = async (id) => {
  const response = await api().get(`/expenditure/${id}`);
  return response.data;
};
const updateExpenditure = async (id, data) => {
  const response = await api().patch(`/expenditure/${id}`, data);
  return response.data;
};
const payExpenditure = async (data) => {
  const response = await api().post('/expenditure/payment', data);
  return response.data;
};

const getExpenditureHistory = async (id) => {
  const response = await api().get(`/expenditure/get-history/${id}`);
  return response.data;
};

const expenditureService = {
  createExpenditure,
  getAllExpenditure,
  deleteExpenditure,
  getSingleExpenditure,
  updateExpenditure,
  payExpenditure,
  getExpenditureHistory
};
export default expenditureService;
