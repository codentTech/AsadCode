import api from '@/common/utils/api';

const createDiscountGroup = async (userData) => {
  const response = await api().post('/discount-group', userData);
  return response.data;
};

const getSingleDiscountGroup = async (id) => {
  const response = await api().get(`/discount-group/${id}`);
  return response.data;
};

const getAllDiscountGroup = async () => {
  const response = await api().get('/discount-group');
  return response.data;
};

const updateDiscountGroup = async (id, data) => {
  const response = await api().patch(`/discount-group/${id}`, data);
  return response.data;
};

const deleteDiscountGroup = async (id) => {
  const response = await api().delete(`/discount-group/${id}`);
  return response.data;
};

const discountGroupService = {
  createDiscountGroup,
  deleteDiscountGroup,
  updateDiscountGroup,
  getAllDiscountGroup,
  getSingleDiscountGroup
};

export default discountGroupService;
