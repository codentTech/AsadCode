import api from '@/common/utils/api';

const createOrderDisclaimer = async (payload) => {
  const response = await api().post('/order-disclaimer', payload);
  return response.data;
};

const getAllOrderDisclaimer = async (payload) => {
  const response = await api().get('/order-disclaimer', payload);
  return response.data;
};

const deleteOrderDisclaimer = async (payload) => {
  const response = await api().delete(`/order-disclaimer/${payload}`);
  return response.data;
};

const updateOrderDisclaimer = async (payload, id) => {
  const response = await api().patch(`/order-disclaimer/${id}`, payload);
  return response.data;
};

const orderDisclaimerService = {
  createOrderDisclaimer,
  getAllOrderDisclaimer,
  deleteOrderDisclaimer,
  updateOrderDisclaimer
};

export default orderDisclaimerService;
