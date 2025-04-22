import api from '@/common/utils/api';

const createTaxRate = async (payload) => {
  const response = await api().post('/tax-rate', payload);
  return response.data;
};

const getAllTaxRate = async (payload) => {
  const response = await api().post('/tax-rate/get-all', payload);
  return response.data;
};

const getSingleTaxRate = async ({ id }) => {
  const response = await api().get(`/tax-rate/${id}`);
  return response.data;
};

const deleteTaxRate = async (id) => {
  const response = await api().delete(`/tax-rate/${id}`);
  return response.data;
};

const updateTaxRate = async (payload) => {
  const { taxRate, id, isDefault } = payload;
  const response = await api().patch(`/tax-rate/${id}`, { taxRate, isDefault });
  return response.data;
};

const taxRateService = {
  createTaxRate,
  getAllTaxRate,
  getSingleTaxRate,
  deleteTaxRate,
  updateTaxRate
};

export default taxRateService;
