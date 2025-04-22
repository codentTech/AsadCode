import api from '@/common/utils/api';

const createPriceGroup = async (userData) => {
  const response = await api().post('/price-group', userData);
  return response.data;
};

const getSinglePriceGroup = async (id) => {
  const response = await api().get(`/price-group/${id}`);
  return response.data;
};

const getAllPriceGroup = async () => {
  const response = await api().get('/price-group');
  return response.data;
};

const updatePriceGroup = async (id, data) => {
  const response = await api().patch(`/price-group/${id}`, data);
  return response.data;
};

const deletePriceGroup = async (id) => {
  const response = await api().delete(`/price-group/${id}`);
  return response.data;
};

const priceGroupService = {
  createPriceGroup,
  deletePriceGroup,
  updatePriceGroup,
  getAllPriceGroup,
  getSinglePriceGroup
};

export default priceGroupService;
