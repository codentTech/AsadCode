import api from '@/common/utils/api';

const createOrderBody = async (payload) => {
  const response = await api().post('/order-body', payload);
  return response.data;
};

const getAllOrderBody = async (payload) => {
  const response = await api().get('/order-body', payload);
  return response.data;
};

const deleteOrderBody = async (payload) => {
  const response = await api().delete(`/order-body/${payload}`);
  return response.data;
};

const updateOrderBody = async (payload, id) => {
  const response = await api().patch(`/order-body/${id}`, payload);
  return response.data;
};

const orderBodyService = {
  createOrderBody,
  getAllOrderBody,
  deleteOrderBody,
  updateOrderBody
};

export default orderBodyService;
